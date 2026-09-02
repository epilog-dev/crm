export default defineEventHandler(async (event) => {
  const { client, store } = await requireStore(event)

  const { data, error } = await client
    .from('notifications')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
