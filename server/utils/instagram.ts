import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

/**
 * Thin client for the "Instagram API with Instagram Login" (no Facebook Page
 * required). All calls go to graph.instagram.com with the seller's long-lived
 * user token, which lives in `instagram_accounts` (service-role only).
 *
 * Docs: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login
 */

const GRAPH = 'https://graph.instagram.com/v24.0'
const OAUTH_AUTHORIZE = 'https://www.instagram.com/oauth/authorize'
const OAUTH_TOKEN = 'https://api.instagram.com/oauth/access_token'

// Only what Plum needs: profile + DMs. Keep this minimal -- every extra scope
// is another thing App Review asks about.
export const INSTAGRAM_SCOPES = ['instagram_business_basic', 'instagram_business_manage_messages']

// Refresh a long-lived token (60d lifetime) once it's within this window.
const REFRESH_WINDOW_MS = 10 * 24 * 60 * 60 * 1000
const STATE_TTL_MS = 10 * 60 * 1000

export type InstagramAccount = Database['public']['Tables']['instagram_accounts']['Row']
type Admin = SupabaseClient<Database>

export class InstagramApiError extends Error {
  constructor(message: string, public status: number, public code?: number, public subcode?: number) {
    super(message)
    this.name = 'InstagramApiError'
  }
}

function config() {
  const { instagramAppId, instagramAppSecret } = useRuntimeConfig()
  if (!instagramAppId || !instagramAppSecret) {
    throw createError({ statusCode: 500, message: 'Instagram app credentials are not configured' })
  }
  return { appId: instagramAppId as string, appSecret: instagramAppSecret as string }
}

export function appUrl(event: H3Event) {
  const configured = useRuntimeConfig().public.appUrl as string
  return (configured || getRequestURL(event).origin).replace(/\/$/, '')
}

export function instagramRedirectUri(event: H3Event) {
  return `${appUrl(event)}/api/instagram/callback`
}

async function graph<T>(path: string, init: RequestInit & { token?: string, query?: Record<string, string> } = {}): Promise<T> {
  const url = new URL(path.startsWith('http') ? path : `${GRAPH}${path}`)
  for (const [k, v] of Object.entries(init.query ?? {})) url.searchParams.set(k, v)
  if (init.token) url.searchParams.set('access_token', init.token)

  const res = await fetch(url, init)
  const json = await res.json().catch(() => ({})) as { error?: { message?: string, code?: number, error_subcode?: number } }
  if (!res.ok || json.error) {
    const err = json.error ?? {}
    throw new InstagramApiError(
      err.message || `Instagram API request failed (${res.status})`,
      res.status,
      err.code,
      err.error_subcode
    )
  }
  return json as T
}

// ---------------------------------------------------------------------------
// OAuth state: HMAC-signed `<storeId>.<issuedAt>` so the callback can trust
// which store started the flow without a server-side session store.
// ---------------------------------------------------------------------------

export function signState(storeId: string) {
  const payload = `${storeId}.${Date.now()}`
  const sig = createHmac('sha256', config().appSecret).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifyState(state: string | undefined): string | null {
  if (!state) return null
  const [storeId, issuedAt, sig] = state.split('.')
  if (!storeId || !issuedAt || !sig) return null
  const expected = createHmac('sha256', config().appSecret).update(`${storeId}.${issuedAt}`).digest('base64url')
  if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null
  if (Date.now() - Number(issuedAt) > STATE_TTL_MS) return null
  return storeId
}

export function buildAuthorizeUrl(event: H3Event, storeId: string) {
  const url = new URL(OAUTH_AUTHORIZE)
  url.searchParams.set('client_id', config().appId)
  url.searchParams.set('redirect_uri', instagramRedirectUri(event))
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', INSTAGRAM_SCOPES.join(','))
  url.searchParams.set('state', signState(storeId))
  // Sellers here are IG-first; hide the "log in with Facebook" option.
  url.searchParams.set('enable_fb_login', '0')
  url.searchParams.set('force_authentication', '1')
  return url.toString()
}

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

interface TokenResponse { access_token: string, user_id: string | number, permissions?: string }

export async function exchangeCodeForToken(event: H3Event, code: string) {
  const { appId, appSecret } = config()
  const form = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    grant_type: 'authorization_code',
    redirect_uri: instagramRedirectUri(event),
    // Meta appends "#_" to the redirect; it's not part of the code.
    code: code.replace(/#_$/, '')
  })
  const res = await fetch(OAUTH_TOKEN, { method: 'POST', body: form })
  const json = await res.json().catch(() => ({})) as { error_type?: string, error_message?: string, error?: { message?: string }, data?: TokenResponse[] } & Partial<TokenResponse>
  if (!res.ok || json.error_type || json.error) {
    throw new InstagramApiError(json.error_message || json.error?.message || 'Code exchange failed', res.status)
  }
  // Response is either `{ data: [ {...} ] }` or a flat object depending on the
  // API version; normalise.
  const data = (Array.isArray(json.data) ? json.data[0] : json) as TokenResponse
  return {
    accessToken: data.access_token,
    userId: String(data.user_id),
    permissions: String(data.permissions ?? '').split(',').filter(Boolean)
  }
}

export async function exchangeForLongLivedToken(shortLivedToken: string) {
  const json = await graph<{ access_token: string, expires_in: number }>('/access_token', {
    query: { grant_type: 'ig_exchange_token', client_secret: config().appSecret, access_token: shortLivedToken }
  })
  return { accessToken: json.access_token, expiresAt: new Date(Date.now() + json.expires_in * 1000) }
}

async function refreshLongLivedToken(token: string) {
  const json = await graph<{ access_token: string, expires_in: number }>('/refresh_access_token', {
    query: { grant_type: 'ig_refresh_token' },
    token
  })
  return { accessToken: json.access_token, expiresAt: new Date(Date.now() + json.expires_in * 1000) }
}

// ---------------------------------------------------------------------------
// Profile + webhooks
// ---------------------------------------------------------------------------

export interface InstagramProfile {
  id: string
  user_id?: string
  username: string
  name?: string
  profile_picture_url?: string
  followers_count?: number
  account_type?: string
}

export function fetchOwnProfile(token: string) {
  return graph<InstagramProfile>('/me', {
    token,
    query: { fields: 'id,user_id,username,name,profile_picture_url,followers_count,account_type' }
  })
}

export interface InstagramSenderProfile {
  name?: string
  username?: string
  profile_pic?: string
}

/** Profile of someone who DM'd the seller. Needs instagram_business_manage_messages. */
export function fetchSenderProfile(token: string, igsid: string) {
  return graph<InstagramSenderProfile>(`/${igsid}`, {
    token,
    query: { fields: 'name,username,profile_pic' }
  })
}

/** Webhooks are per-account: the app must subscribe each connected IG user. */
export async function subscribeToWebhooks(token: string, igUserId: string, fields = ['messages']) {
  await graph(`/${igUserId}/subscribed_apps`, {
    method: 'POST',
    token,
    query: { subscribed_fields: fields.join(',') }
  })
  return fields
}

export async function unsubscribeFromWebhooks(token: string, igUserId: string) {
  await graph(`/${igUserId}/subscribed_apps`, { method: 'DELETE', token })
}

// ---------------------------------------------------------------------------
// Account lookup (with lazy token refresh)
// ---------------------------------------------------------------------------

async function maybeRefresh(admin: Admin, account: InstagramAccount): Promise<InstagramAccount> {
  const expiresAt = account.token_expires_at ? new Date(account.token_expires_at).getTime() : 0
  if (expiresAt - Date.now() > REFRESH_WINDOW_MS) return account
  try {
    const refreshed = await refreshLongLivedToken(account.access_token)
    const { data } = await admin
      .from('instagram_accounts')
      .update({ access_token: refreshed.accessToken, token_expires_at: refreshed.expiresAt.toISOString(), updated_at: new Date().toISOString() })
      .eq('id', account.id)
      .select()
      .single()
    return data ?? account
  } catch (err) {
    // An expired token can't be refreshed; the seller has to reconnect. Keep
    // going with the old one so the caller surfaces Meta's actual error.
    console.error('Instagram token refresh failed:', (err as Error).message)
    return account
  }
}

export async function getInstagramAccountForStore(admin: Admin, storeId: string) {
  const { data } = await admin.from('instagram_accounts').select('*').eq('store_id', storeId).maybeSingle()
  return data ? maybeRefresh(admin, data) : null
}

export async function getInstagramAccountByIgUserId(admin: Admin, igUserId: string) {
  const { data } = await admin.from('instagram_accounts').select('*').eq('ig_user_id', igUserId).maybeSingle()
  return data ? maybeRefresh(admin, data) : null
}

// ---------------------------------------------------------------------------
// Sending
// ---------------------------------------------------------------------------

/**
 * Sends a text DM. Meta only allows this within 24h of the customer's last
 * message (the "standard messaging window"); outside it the API returns an
 * error which is surfaced as InstagramApiError.
 */
export async function sendInstagramText(account: InstagramAccount, recipientIgsid: string, text: string) {
  const json = await graph<{ recipient_id: string, message_id: string }>(`/${account.ig_user_id}/messages`, {
    method: 'POST',
    token: account.access_token,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ recipient: { id: recipientIgsid }, message: { text } })
  })
  return json.message_id
}

// ---------------------------------------------------------------------------
// Webhook signature
// ---------------------------------------------------------------------------

/** Validates `X-Hub-Signature-256` against the raw request body. */
export function verifyWebhookSignature(rawBody: string, signatureHeader: string | undefined) {
  if (!signatureHeader?.startsWith('sha256=')) return false
  const received = signatureHeader.slice('sha256='.length)
  const expected = createHmac('sha256', config().appSecret).update(rawBody).digest('hex')
  return expected.length === received.length && timingSafeEqual(Buffer.from(expected), Buffer.from(received))
}
