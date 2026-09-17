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

  // Onboarding checklist state is stamped here, never with a client-supplied
  // time. Completion is recorded once; dismissal can be re-sent harmlessly.
  const now = new Date().toISOString()
  if (body.setup_completed === true && !store.setup_completed_at) patch.setup_completed_at = now
  if (body.setup_dismissed === true) patch.setup_dismissed_at = now

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
