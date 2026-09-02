export default defineEventHandler(async (event) => {
  const { client } = await requireStore(event)

  const id = getRouterParam(event, 'id')
  const { error } = await client.from('notifications').delete().eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
