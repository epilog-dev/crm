import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const conversationId = getRouterParam(event, 'id')
  const body = await readBody(event)
  if (!body?.body) {
    throw createError({ statusCode: 400, message: 'body is required' })
  }

  // RLS scopes this to the caller's stores, so a hit here proves membership.
  const { data: conversation, error: convErr } = await client
    .from('conversations')
    .select('store_id, instagram_thread_id')
    .eq('id', conversationId!)
    .single()

  if (convErr) {
    throw createError({ statusCode: 404, message: 'Conversation not found' })
  }

  // Threads that came in over the Meta webhook have an IGSID -- deliver the
  // reply for real. Manually-created threads stay local-only, as before.
  let instagramMessageId: string | null = null
  if (conversation.instagram_thread_id) {
    const admin = serverSupabaseServiceRole<Database>(event)
    const account = await getInstagramAccountForStore(admin, conversation.store_id)
    if (!account) {
      throw createError({ statusCode: 409, message: 'Instagram is not connected. Reconnect it in Settings to reply.' })
    }
    try {
      instagramMessageId = await sendInstagramText(account, conversation.instagram_thread_id, body.body)
    } catch (err) {
      const e = err as InstagramApiError
      throw createError({ statusCode: 502, message: `Instagram rejected the message: ${e.message}` })
    }
  }

  const { data: message, error } = await client
    .from('messages')
    .insert({
      conversation_id: conversationId!,
      store_id: conversation.store_id,
      sender: 'seller',
      body: body.body,
      instagram_message_id: instagramMessageId
    })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  await client
    .from('conversations')
    .update({
      last_message_preview: body.body,
      last_message_at: new Date().toISOString()
    })
    .eq('id', conversationId!)

  return message
})
