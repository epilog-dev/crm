export default defineEventHandler(async (event) => {
  const { client, store } = await requireStore(event)
  const storeId = store.id

  const body = await readBody(event)
  const { conversation_id, customer, item_name, variant_label, price, currency, product_id, variant_id } = body

  if (!customer?.handle || !item_name || price == null) {
    throw createError({ statusCode: 400, message: 'customer.handle, item_name and price are required' })
  }

  const handle = String(customer.handle).replace(/^@/, '')

  const { data: existingCustomer, error: findCustomerError } = await client
    .from('customers')
    .select('*')
    .eq('store_id', storeId)
    .eq('instagram_handle', handle)
    .maybeSingle()

  if (findCustomerError) {
    throw createError({ statusCode: 500, message: findCustomerError.message })
  }

  let customerRow = existingCustomer
  if (!customerRow) {
    const { data: created, error: custErr } = await client
      .from('customers')
      .insert({
        store_id: storeId,
        instagram_handle: handle,
        name: customer.name ?? null,
        avatar_url: customer.avatar_url ?? null
      })
      .select()
      .single()

    if (custErr) throw createError({ statusCode: 500, message: custErr.message })
    customerRow = created
  } else if (customer.name && customer.name !== customerRow.name) {
    await client.from('customers').update({ name: customer.name }).eq('id', customerRow.id)
    customerRow.name = customer.name
  }

  const { data: order, error: orderErr } = await client
    .from('orders')
    .insert({
      store_id: storeId,
      conversation_id: conversation_id ?? null,
      customer_id: customerRow.id,
      currency: currency || 'INR',
      customer_name: customerRow.name
    })
    .select()
    .single()

  if (orderErr) {
    throw createError({ statusCode: 500, message: orderErr.message })
  }

  const { data: orderItem, error: itemErr } = await client
    .from('order_items')
    .insert({
      order_id: order.id,
      store_id: storeId,
      product_id: product_id ?? null,
      variant_id: variant_id ?? null,
      item_name,
      variant_label: variant_label ?? null,
      unit_price: price,
      currency: currency || 'INR'
    })
    .select()
    .single()

  if (itemErr) {
    throw createError({ statusCode: 500, message: itemErr.message })
  }

  if (conversation_id) {
    const messageBody = `Order created (#${order.order_code})\nItem: ${item_name}${variant_label ? ` (${variant_label})` : ''}\nPrice: ${currency || 'INR'} ${price}\n\nOrder link: /order/${order.order_code}`

    await client.from('conversations').update({
      last_message_preview: `Order Link Sent (#${order.order_code})`,
      last_message_at: new Date().toISOString()
    }).eq('id', conversation_id)

    await client.from('messages').insert({
      conversation_id,
      store_id: storeId,
      order_id: order.id,
      sender: 'seller',
      body: messageBody
    })
  }

  return { ...order, customer: customerRow, order_items: [orderItem] }
})
