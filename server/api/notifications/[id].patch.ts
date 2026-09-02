export default defineEventHandler(async (event) => {
  const { client } = await requireStore(event)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const read = typeof body?.read === 'boolean' ? body.read : true

  const { data, error } = await client
    .from('notifications')
    .update({ read })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
