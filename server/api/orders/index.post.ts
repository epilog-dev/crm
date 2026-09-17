import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database.types'

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

  // "Auto-Link DM Messages" setting: only drop the order link straight into the
  // DM thread when the seller has opted into that. When off, the order is still
  // created and linked to the conversation -- the seller shares the link manually
  // (e.g. via the inbox's "Copy Order Link" quick reply).
  let autoLinked = false
  let dmError: string | null = null
  if (conversation_id && store.auto_link_dms) {
    const orderUrl = `${appUrl(event)}/order/${order.order_code}`
    const messageBody = `Order created (#${order.order_code})\nItem: ${item_name}${variant_label ? ` (${variant_label})` : ''}\nPrice: ${currency || 'INR'} ${price}\n\nOrder link: ${orderUrl}`

    // Real Instagram threads get the link delivered as an actual DM. If Meta
    // rejects it (most often: outside the 24h reply window), the order still
    // exists -- the seller just has to share the link manually.
    let instagramMessageId: string | null = null
    const { data: conversation } = await client
      .from('conversations')
      .select('instagram_thread_id')
      .eq('id', conversation_id)
      .maybeSingle()

    if (conversation?.instagram_thread_id) {
      const admin = serverSupabaseServiceRole<Database>(event)
      const account = await getInstagramAccountForStore(admin, storeId)
      if (!account) {
        dmError = 'Instagram is not connected'
      } else {
        try {
          instagramMessageId = await sendInstagramText(account, conversation.instagram_thread_id, messageBody)
        } catch (err) {
          dmError = (err as Error).message
        }
      }
    }

    if (!dmError) {
      autoLinked = true
      await client.from('conversations').update({
        last_message_preview: `Order Link Sent (#${order.order_code})`,
        last_message_at: new Date().toISOString()
      }).eq('id', conversation_id)

      await client.from('messages').insert({
        conversation_id,
        store_id: storeId,
        order_id: order.id,
        sender: 'seller',
        body: messageBody,
        instagram_message_id: instagramMessageId
      })
    }
  }

  return { ...order, customer: customerRow, order_items: [orderItem], autoLinked, dmError }
})
