const ALLOWED_FIELDS = [
  'name',
  'instagram_handle',
  'upi_vpa',
  'cod_enabled',
  'require_receipt_upload',
  'auto_link_dms'
] as const

export default defineEventHandler(async (event) => {
  const { client, store } = await requireStore(event)

  const body = await readBody(event)
  const patch: Record<string, unknown> = {}
  for (const key of ALLOWED_FIELDS) {
    if (key in body) patch[key] = body[key]
  }

  if (!Object.keys(patch).length) {
    throw createError({ statusCode: 400, message: 'No valid fields to update' })
  }

  const { data, error } = await client
    .from('stores')
    .update(patch)
    .eq('id', store.id)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
