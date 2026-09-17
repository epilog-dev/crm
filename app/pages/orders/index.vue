<script setup lang="ts">
import { LazyOrdersOrderDetailsSlideover } from '#components'
import type { OrderStatus, OrderViewModel } from '~/composables/useOrders'

definePageMeta({
  title: 'Order Management Dashboard'
})

useSeoMeta({
  title: 'Orders Dashboard - Instagram DM Sales'
})

const { orders, pending, fetchOrders, updateOrderStatus, updatePaymentStatus } = useOrders()
const toast = useToast()
const overlay = useOverlay()

onMounted(() => {
  fetchOrders()
})

const viewMode = ref<'table' | 'kanban'>('table')
const viewItems = [
  { label: 'Table', icon: 'i-lucide-table', value: 'table' },
  { label: 'Kanban', icon: 'i-lucide-columns-3', value: 'kanban' }
]

const search = ref('')
const statusFilter = ref<'All' | OrderStatus>('All')
const statusFilterItems = ['All', ...ORDER_STATUSES].map(s => ({ label: `Status: ${s}`, value: s }))

const filteredOrders = computed(() => {
  const q = search.value.trim().toLowerCase()
  return orders.value.filter((o) => {
    const matchesStatus = statusFilter.value === 'All' || o.status === statusFilter.value
    const matchesSearch = !q
      || o.orderCode.toLowerCase().includes(q)
      || o.item.toLowerCase().includes(q)
      || o.customer.name.toLowerCase().includes(q)
      || o.customer.handle.toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })
})

const stats = computed(() => ({
  total: orders.value.length,
  awaiting: orders.value.filter(o => o.status === 'Awaiting Payment').length,
  paid: orders.value.filter(o => o.paymentStatus === 'Paid').length,
  shipped: orders.value.filter(o => o.status === 'Shipped').length
}))

const detailsSlideover = overlay.create(LazyOrdersOrderDetailsSlideover)

function openOrder(order: OrderViewModel) {
  detailsSlideover.open({ orderId: order.id })
}

// Kanban drop: moving into a paid-or-later column implies the money arrived.
// Rethrows so the board can roll the card back.
async function moveOrder(id: string, status: OrderStatus) {
  try {
    await updateOrderStatus(id, status)
    if (status === 'Paid' || status === 'Shipped' || status === 'Delivered') {
      await updatePaymentStatus(id, 'Paid')
    }
  } catch (err) {
    toast.add({ title: 'Could not move order', description: (err as Error).message, color: 'error' })
    throw err
  }
}
</script>

<template>
  <div class="p-4 md:p-6 space-y-4">
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard label="Total Orders" :value="stats.total" />
      <StatCard label="Awaiting Payment" :value="stats.awaiting" color="warning" />
      <StatCard label="Paid Orders" :value="stats.paid" color="success" />
      <StatCard label="Shipped" :value="stats.shipped" color="info" />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Filter by order ID, buyer (@maria), or item…"
        class="w-full max-w-md"
      />

      <div class="flex items-center gap-2 flex-wrap">
        <UTabs v-model="viewMode" :items="viewItems" :content="false" size="xs" color="neutral" />
        <USelect v-model="statusFilter" :items="statusFilterItems" size="sm" class="min-w-44" />
        <UButton to="/inbox" label="Create order from DM" icon="i-lucide-message-square" color="primary" />
      </div>
    </div>

    <OrdersTable
      v-if="viewMode === 'table'"
      :orders="filteredOrders"
      :loading="pending"
      @select="openOrder"
    />
    <OrdersKanban
      v-else
      :orders="filteredOrders"
      :move-order="moveOrder"
      @select="openOrder"
    />
  </div>
</template>
