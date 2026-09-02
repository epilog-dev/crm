/* eslint-disable @typescript-eslint/no-explicit-any -- mapping raw Supabase rows */
export type OrderStatus = 'Confirmed' | 'Awaiting Payment' | 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled'
export type PaymentStatus = 'Pending' | 'Paid'

export interface OrderCustomer {
  id: string | null
  name: string
  handle: string
  phone?: string
  address?: string
  pincode?: string
  avatar?: string
}

export interface OrderViewModel {
  id: string
  orderCode: string
  customer: OrderCustomer
  item: string
  variant: string
  price: number
  currency: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: 'pay_now' | 'cod' | null
  receiptUploaded: boolean
  createdAt: string
  orderLink: string
}

function mapOrder(row: any): OrderViewModel {
  const item = row.order_items?.[0]
  return {
    id: row.id,
    orderCode: row.order_code,
    customer: {
      id: row.customer?.id ?? row.customer_id ?? null,
      name: row.customer?.name || row.customer_name || 'Unknown',
      handle: row.customer?.instagram_handle ? `@${row.customer.instagram_handle}` : '',
      phone: row.customer?.phone || row.customer_phone || undefined,
      address: row.customer?.address || row.customer_address || undefined,
      pincode: row.customer?.pincode || row.customer_pincode || undefined,
      avatar: row.customer?.avatar_url || undefined
    },
    item: item?.item_name || '',
    variant: item?.variant_label || '',
    price: item?.unit_price ?? 0,
    currency: item?.currency || row.currency || 'INR',
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method ?? null,
    receiptUploaded: !!row.receipt_uploaded,
    createdAt: row.created_at,
    orderLink: `/order/${row.order_code}`
  }
}

export function useOrders() {
  const orders = useState<OrderViewModel[]>('orders', () => [])
  const pending = useState<boolean>('ordersPending', () => false)

  async function fetchOrders() {
    pending.value = true
    try {
      const data = await $fetch<any[]>('/api/orders')
      orders.value = data.map(mapOrder)
      return orders.value
    } finally {
      pending.value = false
    }
  }

  async function createOrder(payload: {
    conversationId?: string
    customer: { handle: string, name?: string, avatarUrl?: string }
    itemName: string
    variantLabel?: string
    price: number
    currency?: string
  }) {
    const created = await $fetch<any>('/api/orders', {
      method: 'POST',
      body: {
        conversation_id: payload.conversationId,
        customer: {
          handle: payload.customer.handle,
          name: payload.customer.name,
          avatar_url: payload.customer.avatarUrl
        },
        item_name: payload.itemName,
        variant_label: payload.variantLabel,
        price: payload.price,
        currency: payload.currency
      }
    })
    const mapped = mapOrder(created)
    orders.value = [mapped, ...orders.value]
    return mapped
  }

  async function updateOrderStatus(id: string, status: OrderStatus) {
    const updated = await $fetch<any>(`/api/orders/${id}`, { method: 'PATCH', body: { status } })
    const mapped = mapOrder(updated)
    const idx = orders.value.findIndex(o => o.id === id)
    if (idx !== -1) orders.value[idx] = mapped
    return mapped
  }

  async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    const updated = await $fetch<any>(`/api/orders/${id}`, { method: 'PATCH', body: { payment_status: paymentStatus } })
    const mapped = mapOrder(updated)
    const idx = orders.value.findIndex(o => o.id === id)
    if (idx !== -1) orders.value[idx] = mapped
    return mapped
  }

  async function fetchReceiptUrl(id: string) {
    const { url } = await $fetch<{ url: string }>(`/api/orders/${id}/receipt`)
    return url
  }

  return {
    orders,
    pending,
    fetchOrders,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    fetchReceiptUrl
  }
}
