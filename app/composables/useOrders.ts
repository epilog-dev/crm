/* eslint-disable @typescript-eslint/no-explicit-any -- mapping raw Supabase rows */
import type { OrderStats } from '~~/server/api/orders/stats.get'
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
  paymentRef: string | null
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
    paymentRef: row.payment_ref ?? null,
    createdAt: row.created_at,
    orderLink: `/order/${row.order_code}`
  }
}

export interface OrdersPageFilters {
  q?: string
  status?: OrderStatus | 'All'
  [key: string]: unknown
}

export type { OrderStats }

const EMPTY_STATS: OrderStats = {
  total: 0, active: 0, awaiting_payment: 0, paid: 0, shipped: 0, total_sales: 0, pending_amount: 0, pending_count: 0
}

/**
 * Orders are server-paginated, so there is no "all orders" array on the
 * client. Instead every fetched order lands in a normalized cache keyed by
 * id; lists hold ids and read rows through the cache, which is what keeps the
 * table, the board and the details slideover consistent after an update.
 * Aggregates (tiles, nav badge) come from `/api/orders/stats`.
 */
export function useOrders() {
  const cache = useState<Record<string, OrderViewModel>>('orderCache', () => ({}))
  const stats = useState<OrderStats>('orderStats', () => ({ ...EMPTY_STATS }))
  const statsLoaded = useState<boolean>('orderStatsLoaded', () => false)

  function remember(order: OrderViewModel) {
    cache.value[order.id] = order
    return order
  }

  function getOrder(id: string) {
    return cache.value[id]
  }

  async function fetchOrdersPage(params: { page?: number, pageSize?: number } & OrdersPageFilters) {
    const result = await $fetch<{ items: any[], total: number }>('/api/orders', {
      query: {
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 20,
        q: params.q || undefined,
        status: params.status && params.status !== 'All' ? params.status : undefined
      }
    })
    return { items: result.items.map(row => remember(mapOrder(row))), total: result.total }
  }

  async function fetchStats() {
    stats.value = await $fetch<OrderStats>('/api/orders/stats')
    statsLoaded.value = true
    return stats.value
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
    const mapped = remember(mapOrder(created))
    fetchStats().catch(() => {})
    return { ...mapped, autoLinked: !!created.autoLinked, dmError: (created.dmError as string | null) ?? null }
  }

  async function updateOrderStatus(id: string, status: OrderStatus) {
    const updated = await $fetch<any>(`/api/orders/${id}`, { method: 'PATCH', body: { status } })
    const mapped = remember(mapOrder(updated))
    fetchStats().catch(() => {})
    return mapped
  }

  async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    const updated = await $fetch<any>(`/api/orders/${id}`, { method: 'PATCH', body: { payment_status: paymentStatus } })
    const mapped = remember(mapOrder(updated))
    fetchStats().catch(() => {})
    return mapped
  }

  async function fetchReceiptUrl(id: string) {
    const { url } = await $fetch<{ url: string }>(`/api/orders/${id}/receipt`)
    return url
  }

  return {
    cache,
    stats,
    statsLoaded,
    getOrder,
    fetchOrdersPage,
    fetchStats,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    fetchReceiptUrl
  }
}
