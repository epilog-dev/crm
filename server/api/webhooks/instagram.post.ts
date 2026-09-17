import { serverSupabaseServiceRole } from '#supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'
import type { InstagramAccount, InstagramSenderProfile } from '~~/server/utils/instagram'

/**
 * Receives Instagram messaging webhooks. Meta retries on non-2xx, so this
 * always answers 200 once the signature checks out and logs per-event
 * failures instead of throwing. Duplicate deliveries are deduped by the
 * unique index on messages.instagram_message_id.
 *
 * Payload shape (object = "instagram"):
 *   entry[].id            -- the seller's IG user id
 *   entry[].messaging[]   -- { sender, recipient, timestamp, message?, read?, reaction? }
 */

interface MessagingEvent {
  sender: { id: string }
  recipient: { id: string }
  timestamp: number
  message?: {
    mid: string
    text?: string
    is_echo?: boolean
    is_deleted?: boolean
    is_unsupported?: boolean
    attachments?: { type: string, payload?: { url?: string } }[]
  }
}

type Admin = SupabaseClient<Database>

export default defineEventHandler(async (event) => {
  const rawBody = (await readRawBody(event, 'utf8')) ?? ''
  if (!verifyWebhookSignature(rawBody, getHeader(event, 'x-hub-signature-256'))) {
    console.error('Instagram webhook: bad signature')
    throw createError({ statusCode: 401, message: 'Invalid signature' })
  }

  const payload = JSON.parse(rawBody) as { object?: string, entry?: { id: string, messaging?: MessagingEvent[] }[] }
  if (payload.object !== 'instagram') return { received: true }

  const admin = serverSupabaseServiceRole<Database>(event)

  for (const entry of payload.entry ?? []) {
    for (const evt of entry.messaging ?? []) {
      try {
        await handleMessagingEvent(admin, entry.id, evt)
      } catch (err) {
        console.error('Instagram webhook: failed to process event', evt.message?.mid, (err as Error).message)
      }
    }
  }

  return { received: true }
})

async function handleMessagingEvent(admin: Admin, igUserId: string, evt: MessagingEvent) {
  const msg = evt.message
  // Read receipts, reactions, postbacks etc. -- nothing to store yet.
  if (!msg || msg.is_deleted) return

  const account = await getInstagramAccountByIgUserId(admin, igUserId)
  if (!account) {
    console.warn('Instagram webhook: no connected store for IG user', igUserId)
    return
  }

  // Echoes are messages the seller sent -- either from the Instagram app, or
  // by us via the API (those already exist with the same mid and are skipped
  // by the unique index).
  const fromSeller = !!msg.is_echo
  const customerIgsid = fromSeller ? evt.recipient.id : evt.sender.id

  const body = renderBody(msg)
  if (!body) return

  const conversation = await resolveConversation(admin, account, customerIgsid)
  const sentAt = new Date(evt.timestamp || Date.now()).toISOString()

  const { error, data: inserted } = await admin
    .from('messages')
    .insert({
      conversation_id: conversation.id,
      store_id: account.store_id,
      sender: fromSeller ? 'seller' : 'customer',
      body,
      instagram_message_id: msg.mid,
      created_at: sentAt
    })
    .select('id')
    .maybeSingle()

  if (error) {
    // 23505 = unique violation → Meta redelivered, or it's the echo of a DM we
    // sent ourselves. Either way it's already recorded.
    if (error.code === '23505') return
    throw new Error(error.message)
  }
  if (!inserted) return

  await admin.from('conversations').update({
    last_message_preview: body.slice(0, 140),
    last_message_at: sentAt,
    ...(fromSeller ? {} : { unread_count: conversation.unread_count + 1 })
  }).eq('id', conversation.id)

  if (!fromSeller) {
    await notify(admin, {
      storeId: account.store_id,
      type: 'dm',
      title: 'New Instagram DM',
      message: `@${conversation.instagram_handle}: "${body.slice(0, 80)}"`,
      link: '/inbox',
      icon: 'i-simple-icons-instagram',
      badgeColor: 'info',
      conversationId: conversation.id
    })
  }
}

function renderBody(msg: NonNullable<MessagingEvent['message']>) {
  if (msg.text) return msg.text
  if (msg.attachments?.length) {
    const kinds = msg.attachments.map(a => a.type).join(', ')
    return `[Sent ${kinds}]`
  }
  if (msg.is_unsupported) return '[Unsupported message type]'
  return null
}

/**
 * Finds the thread for this customer, matching by IGSID first and falling back
 * to a handle match (the seller may have created the conversation manually
 * before connecting Instagram). Creates one if neither exists.
 */
async function resolveConversation(admin: Admin, account: InstagramAccount, customerIgsid: string) {
  const { data: byThread } = await admin
    .from('conversations')
    .select('id, instagram_handle, unread_count')
    .eq('store_id', account.store_id)
    .eq('instagram_thread_id', customerIgsid)
    .maybeSingle()
  if (byThread) return byThread

  let profile: InstagramSenderProfile = {}
  try {
    profile = await fetchSenderProfile(account.access_token, customerIgsid)
  } catch (err) {
    console.warn('Instagram webhook: could not fetch sender profile', customerIgsid, (err as Error).message)
  }
  const handle = profile.username || `ig_${customerIgsid}`

  const { data: byHandle } = await admin
    .from('conversations')
    .select('id, instagram_handle, unread_count')
    .eq('store_id', account.store_id)
    .eq('instagram_handle', handle)
    .maybeSingle()

  if (byHandle) {
    await admin.from('conversations').update({
      instagram_thread_id: customerIgsid,
      instagram_name: profile.name ?? null,
      avatar_url: profile.profile_pic ?? null
    }).eq('id', byHandle.id)
    return byHandle
  }

  const { data: created, error } = await admin
    .from('conversations')
    .insert({
      store_id: account.store_id,
      instagram_handle: handle,
      instagram_name: profile.name ?? null,
      avatar_url: profile.profile_pic ?? null,
      instagram_thread_id: customerIgsid,
      platform: 'instagram',
      unread_count: 0
    })
    .select('id, instagram_handle, unread_count')
    .single()
  if (error) throw new Error(error.message)
  return created
}
