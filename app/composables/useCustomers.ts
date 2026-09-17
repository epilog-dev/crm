/* eslint-disable @typescript-eslint/no-explicit-any -- mapping raw Supabase rows */
export interface CustomerViewModel {
  id: string
  name: string
  handle: string
  phone: string
  address: string
  pincode: string
  avatar?: string
  totalOrders: number
  totalSpent: number
  lastOrder: string
}

function mapCustomer(row: any): CustomerViewModel {
  const orders = row.orders || []
  const totalSpent = orders.reduce((sum: number, order: any) => {
    const items = order.order_items || []
    return sum + items.reduce((s: number, it: any) => s + (it.unit_price || 0) * (it.quantity || 1), 0)
  }, 0)
  const [lastOrderRow] = [...orders].sort(
    (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return {
    id: row.id,
    name: row.name || row.instagram_handle,
    handle: `@${row.instagram_handle}`,
    phone: row.phone || '',
    address: row.address || '',
    pincode: row.pincode || '',
    avatar: row.avatar_url || undefined,
    totalOrders: orders.length,
    totalSpent,
    lastOrder: lastOrderRow ? lastOrderRow.order_code : ''
  }
}

export function useCustomers() {
  async function fetchCustomersPage(params: { page?: number, pageSize?: number, q?: string }) {
    const result = await $fetch<{ items: any[], total: number }>('/api/customers', {
      query: { page: params.page ?? 1, pageSize: params.pageSize ?? 20, q: params.q || undefined }
    })
    return { items: result.items.map(mapCustomer), total: result.total }
  }

  return { fetchCustomersPage }
}
