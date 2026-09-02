export default defineEventHandler(async (event) => {
  const { client, store } = await requireStore(event)

  const { error } = await client
    .from('notifications')
    .update({ read: true })
    .eq('store_id', store.id)
    .eq('read', false)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
