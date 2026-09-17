import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export interface OrderStats {
  total: number
  active: number
  awaiting_payment: number
  paid: number
  shipped: number
  total_sales: number
  pending_amount: number
  pending_count: number
}

/** Aggregate counts/sums across all of the caller's orders (RLS-scoped in SQL). */
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const { data, error } = await client.rpc('orders_stats')

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data as OrderStats
})
