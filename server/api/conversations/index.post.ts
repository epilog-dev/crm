export default defineEventHandler(async (event) => {
  const { client, store } = await requireStore(event)

  const body = await readBody(event)
  const handle = (body?.handle as string | undefined)?.replace(/^@/, '')
  if (!handle) {
    throw createError({ statusCode: 400, message: 'handle is required' })
  }

  const { data: conversation, error } = await client
    .from('conversations')
    .upsert({
      store_id: store.id,
      instagram_handle: handle,
      instagram_name: body.name ?? null,
      avatar_url: body.avatar_url ?? null,
      last_message_preview: body.message ?? null,
      last_message_at: new Date().toISOString(),
      unread_count: body.message ? 1 : 0
    }, { onConflict: 'store_id,instagram_handle' })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  if (body.message) {
    await client.from('messages').insert({
      conversation_id: conversation.id,
      store_id: store.id,
      sender: 'customer',
      body: body.message
    })
  }

  return conversation
})
