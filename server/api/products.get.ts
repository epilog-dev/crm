import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

/** Paginated products. `q` matches title or description. */
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const params = parsePagination(event)

  let query = client
    .from('products')
    .select('*, product_variants(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(params.from, params.to)

  const pattern = params.q ? likePattern(params.q) : null
  if (pattern) {
    query = query.or(`title.ilike.${pattern},description.ilike.${pattern}`)
  }

  const { data, count, error } = await query

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return pageResponse(data, count, params)
})
