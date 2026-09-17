import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database.types'

/**
 * OAuth redirect target. Exchanges the code for a long-lived token, pulls the
 * account profile, subscribes the account to DM webhooks, and persists
 * everything. Always ends in a redirect back to /settings with a status flag
 * so the seller sees what happened instead of a raw error page.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const back = (status: string, reason?: string) => {
    const url = new URL('/settings', appUrl(event))
    url.searchParams.set('ig', status)
    if (reason) url.searchParams.set('reason', reason.slice(0, 200))
    return sendRedirect(event, url.toString(), 302)
  }

  // Seller hit "Cancel" on Meta's consent screen.
  if (query.error) {
    return back('cancelled', String(query.error_description || query.error_reason || query.error))
  }

  const storeId = verifyState(typeof query.state === 'string' ? query.state : undefined)
  if (!storeId) return back('error', 'Invalid or expired state. Please try connecting again.')

  const code = typeof query.code === 'string' ? query.code : null
  if (!code) return back('error', 'Missing authorization code')

  const admin = serverSupabaseServiceRole<Database>(event)

  try {
    const shortLived = await exchangeCodeForToken(event, code)
    const longLived = await exchangeForLongLivedToken(shortLived.accessToken)
    const profile = await fetchOwnProfile(longLived.accessToken)

    // The messaging API wants the app-scoped `user_id`; `id` is the IG account
    // id. They differ on Instagram Login apps, so prefer user_id when present.
    const igUserId = profile.user_id || shortLived.userId || profile.id

    let webhookStatus = 'active'
    let subscribedFields: string[] = []
    try {
      subscribedFields = await subscribeToWebhooks(longLived.accessToken, igUserId)
    } catch (err) {
      console.error('Instagram webhook subscribe failed:', (err as Error).message)
      webhookStatus = 'subscribe_failed'
    }

    const now = new Date().toISOString()
    const { error: acctErr } = await admin.from('instagram_accounts').upsert({
      store_id: storeId,
      ig_user_id: igUserId,
      username: profile.username,
      access_token: longLived.accessToken,
      token_expires_at: longLived.expiresAt.toISOString(),
      permissions: shortLived.permissions,
      subscribed_fields: subscribedFields,
      updated_at: now
    }, { onConflict: 'store_id' })
    if (acctErr) throw new Error(acctErr.message)

    const { error: storeErr } = await admin.from('stores').update({
      instagram_connected: true,
      instagram_connected_at: now,
      instagram_business_id: igUserId,
      instagram_username: profile.username,
      instagram_handle: profile.username,
      instagram_avatar_url: profile.profile_picture_url ?? null,
      instagram_followers_count: profile.followers_count ?? null,
      webhook_status: webhookStatus
    }).eq('id', storeId)
    if (storeErr) throw new Error(storeErr.message)

    return back('connected')
  } catch (err) {
    console.error('Instagram connect failed:', err)
    return back('error', (err as Error).message)
  }
})
