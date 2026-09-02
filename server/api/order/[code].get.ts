import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')
  if (!code) {
    throw createError({ statusCode: 400, message: 'Order code is required' })
  }

  const client = serverSupabaseServiceRole(event)

  const { data: order, error } = await client
    .from('orders')
    .select(PUBLIC_ORDER_SELECT)
    .eq('order_code', code)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }
  if (!order) {
    throw createError({ statusCode: 404, message: 'Order not found' })
  }

  return order
})
