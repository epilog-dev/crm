import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const conversationId = getRouterParam(event, 'id')
  const body = await readBody(event)
  if (!body?.body) {
    throw createError({ statusCode: 400, message: 'body is required' })
  }

  const { data: conversation, error: convErr } = await client
    .from('conversations')
    .select('store_id')
    .eq('id', conversationId)
    .single()

  if (convErr) {
    throw createError({ statusCode: 404, message: 'Conversation not found' })
  }

  const { data: message, error } = await client
    .from('messages')
    .insert({
      conversation_id: conversationId,
      store_id: conversation.store_id,
      sender: 'seller',
      body: body.body
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
    .eq('id', conversationId)

  return message
})
