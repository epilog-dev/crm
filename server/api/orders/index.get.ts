import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

/**
 * Paginated orders list. `q` searches order code, customer name/handle and
 * item names (via the orders_search RPC, which runs under the caller's RLS);
 * `status` filters one lifecycle status. Newest first.
 */
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const params = parsePagination(event)
  const status = getQuery(event).status
  const statusFilter = typeof status === 'string' && status && status !== 'All' ? status : null

  const { data, count, error } = await client
    .rpc('orders_search', { q: params.q, status_filter: statusFilter }, { count: 'exact' })
    .select('*, customer:customers(*), order_items(*)')
    .order('created_at', { ascending: false })
    .range(params.from, params.to)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return pageResponse(data, count, params)
})
