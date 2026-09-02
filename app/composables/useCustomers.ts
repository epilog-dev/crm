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
  const customers = useState<CustomerViewModel[]>('customers', () => [])
  const pending = useState<boolean>('customersPending', () => false)

  async function fetchCustomers() {
    pending.value = true
    try {
      const data = await $fetch<any[]>('/api/customers')
      customers.value = data.map(mapCustomer)
      return customers.value
    } finally {
      pending.value = false
    }
  }

  return {
    customers,
    pending,
    fetchCustomers
  }
}
