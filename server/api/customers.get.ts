import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

/** Paginated customers. `q` matches name, handle, phone or address. */
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const params = parsePagination(event)

  let query = client
    .from('customers')
    .select('*, orders(id, order_code, status, payment_status, created_at, order_items(unit_price, quantity))', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(params.from, params.to)

  const pattern = params.q ? likePattern(params.q) : null
  if (pattern) {
    query = query.or(`name.ilike.${pattern},instagram_handle.ilike.${pattern},phone.ilike.${pattern},address.ilike.${pattern}`)
  }

  const { data, count, error } = await query

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return pageResponse(data, count, params)
})
