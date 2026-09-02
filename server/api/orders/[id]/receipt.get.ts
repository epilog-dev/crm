import { serverSupabaseClient, serverSupabaseUser, serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const id = getRouterParam(event, 'id')

  // RLS on `orders` confirms the caller is a member of this order's store.
  const { data: order, error } = await client
    .from('orders')
    .select('receipt_url')
    .eq('id', id)
    .single()

  if (error) {
    throw createError({ statusCode: 404, message: 'Order not found' })
  }
  if (!order.receipt_url) {
    throw createError({ statusCode: 404, message: 'No receipt uploaded for this order' })
  }

  // The bucket is private; only the service role can sign a URL for it.
  const serviceClient = serverSupabaseServiceRole(event)
  const { data: signed, error: signError } = await serviceClient.storage
    .from('payment-receipts')
    .createSignedUrl(order.receipt_url, 60 * 10)

  if (signError) {
    throw createError({ statusCode: 500, message: signError.message })
  }

  return { url: signed.signedUrl }
})
