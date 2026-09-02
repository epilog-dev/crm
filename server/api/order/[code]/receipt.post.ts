import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')
  if (!code) {
    throw createError({ statusCode: 400, message: 'Order code is required' })
  }

  const form = await readMultipartFormData(event)
  const file = form?.find(f => f.name === 'file')
  if (!file || !file.data) {
    throw createError({ statusCode: 400, message: 'file is required' })
  }

  const client = serverSupabaseServiceRole(event)

  const { data: order, error: findErr } = await client
    .from('orders')
    .select('id, store_id')
    .eq('order_code', code)
    .maybeSingle()

  if (findErr) {
    throw createError({ statusCode: 500, message: findErr.message })
  }
  if (!order) {
    throw createError({ statusCode: 404, message: 'Order not found' })
  }

  const ext = (file.filename?.split('.').pop() || 'jpg').toLowerCase()
  const path = `${order.store_id}/${order.id}.${ext}`

  const { error: uploadErr } = await client.storage
    .from('payment-receipts')
    .upload(path, file.data, { contentType: file.type, upsert: true })

  if (uploadErr) {
    throw createError({ statusCode: 500, message: uploadErr.message })
  }

  const { error: updateErr } = await client
    .from('orders')
    .update({ receipt_url: path, receipt_uploaded: true })
    .eq('id', order.id)

  if (updateErr) {
    throw createError({ statusCode: 500, message: updateErr.message })
  }

  await notify(client, {
    storeId: order.store_id,
    type: 'payment',
    title: 'Payment Screenshot Uploaded!',
    message: `Customer uploaded a payment receipt for #${code}. Please verify.`,
    link: '/orders',
    icon: 'i-lucide-receipt',
    badgeColor: 'success',
    orderId: order.id
  })

  return { success: true }
})
