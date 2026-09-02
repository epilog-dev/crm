import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

const ALLOWED_FIELDS = ['status', 'payment_status'] as const

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const patch: Record<string, unknown> = {}
  for (const key of ALLOWED_FIELDS) {
    if (key in body) patch[key] = body[key]
  }

  if (!Object.keys(patch).length) {
    throw createError({ statusCode: 400, message: 'Nothing to update' })
  }

  const { data, error } = await client
    .from('orders')
    .update(patch)
    .eq('id', id)
    .select('*, customer:customers(*), order_items(*)')
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
