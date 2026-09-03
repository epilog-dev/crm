import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')
  if (!code) {
    throw createError({ statusCode: 400, message: 'Order code is required' })
  }

  const body = await readBody(event)
  const { name, phone, address, pincode, payment_method } = body
  const paymentRef = typeof body.payment_ref === 'string' ? body.payment_ref.trim() : ''

  if (!name || !phone || !address || !pincode) {
    throw createError({ statusCode: 400, message: 'name, phone, address and pincode are required' })
  }
  if (!['pay_now', 'cod'].includes(payment_method)) {
    throw createError({ statusCode: 400, message: 'payment_method must be pay_now or cod' })
  }

  const client = serverSupabaseServiceRole(event)

  const { data: order, error: findErr } = await client
    .from('orders')
    .select('id, store_id, conversation_id, customer_id, receipt_uploaded')
    .eq('order_code', code)
    .maybeSingle()

  if (findErr) {
    throw createError({ statusCode: 500, message: findErr.message })
  }
  if (!order) {
    throw createError({ statusCode: 404, message: 'Order not found' })
  }

  const { data: store, error: storeErr } = await client
    .from('stores')
    .select('cod_enabled, require_receipt_upload')
    .eq('id', order.store_id)
    .single()

  if (storeErr || !store) {
    throw createError({ statusCode: 500, message: storeErr?.message || 'Store not found' })
  }

  if (payment_method === 'cod' && !store.cod_enabled) {
    throw createError({ statusCode: 400, message: 'Cash on Delivery is not enabled for this store' })
  }
  if (payment_method === 'pay_now' && store.require_receipt_upload && !order.receipt_uploaded && !paymentRef) {
    throw createError({ statusCode: 400, message: 'Add your UPI reference number or a payment screenshot before confirming your order' })
  }

  // Resolve (or create) the customer record this order's shipping details belong to.
  let customerId = order.customer_id as string | null
  if (!customerId && order.conversation_id) {
    const { data: conversation } = await client
      .from('conversations')
      .select('instagram_handle')
      .eq('id', order.conversation_id)
      .single()

    if (conversation) {
      const { data: customer, error: custErr } = await client
        .from('customers')
        .upsert({
          store_id: order.store_id,
          instagram_handle: conversation.instagram_handle,
          name,
          phone,
          address,
          pincode
        }, { onConflict: 'store_id,instagram_handle' })
        .select('id')
        .single()

      if (custErr) {
        throw createError({ statusCode: 500, message: custErr.message })
      }
      customerId = customer.id
    }
  } else if (customerId) {
    await client.from('customers').update({ name, phone, address, pincode }).eq('id', customerId)
  }

  const { data: updated, error } = await client
    .from('orders')
    .update({
      customer_id: customerId,
      customer_name: name,
      customer_phone: phone,
      customer_address: address,
      customer_pincode: pincode,
      payment_method,
      payment_ref: payment_method === 'pay_now' && paymentRef ? paymentRef : null,
      confirmed_by_customer: true,
      status: 'Awaiting Payment'
    })
    .eq('id', order.id)
    .select(PUBLIC_ORDER_SELECT)
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  await notify(client, {
    storeId: order.store_id,
    type: 'order',
    title: 'New Order Confirmed',
    message: `${name} confirmed delivery details for #${code} (${payment_method === 'cod' ? 'Cash on Delivery' : 'Prepaid'}).`,
    link: '/orders',
    icon: 'i-lucide-shopping-bag',
    badgeColor: 'primary',
    orderId: order.id,
    conversationId: order.conversation_id ?? undefined
  })

  return updated
})
