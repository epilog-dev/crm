<script setup lang="ts">
import { LazyOrdersOrderDetailsSlideover } from '#components'
import type { OrderStatus, OrderViewModel } from '~/composables/useOrders'

definePageMeta({
  title: 'Order Management Dashboard'
})

useSeoMeta({
  title: 'Orders Dashboard - Instagram DM Sales'
})

const { cache, stats, fetchStats, fetchOrdersPage, updateOrderStatus, updatePaymentStatus } = useOrders()
const toast = useToast()
const overlay = useOverlay()

const viewMode = ref<'table' | 'kanban'>('table')
const viewItems = [
  { label: 'Table', icon: 'i-lucide-table', value: 'table' },
  { label: 'Kanban', icon: 'i-lucide-columns-3', value: 'kanban' }
]

const search = ref('')
const statusFilter = ref<'All' | OrderStatus>('All')
const statusFilterItems = ['All', ...ORDER_STATUSES].map(s => ({ label: `Status: ${s}`, value: s }))

// Table: one server-paged list driven by search + status.
const filters = computed(() => ({ q: search.value.trim(), status: statusFilter.value }))
const { items, total, page, pageSize, pending, refresh } = usePagedList(fetchOrdersPage, filters, { pageSize: 20 })

// Rows read through the cache so edits in the slideover show up immediately.
const rows = computed(() => items.value.map(o => cache.value[o.id] ?? o))

onMounted(() => {
  refresh()
  fetchStats()
})

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
      <StatCard label="Awaiting Payment" :value="stats.awaiting_payment" color="warning" />
      <StatCard label="Paid Orders" :value="stats.paid" color="success" />
      <StatCard label="Shipped" :value="stats.shipped" color="info" />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Search order ID, buyer (@maria), or item…"
        class="w-full max-w-md"
      />

      <div class="flex items-center gap-2 flex-wrap">
        <UTabs v-model="viewMode" :items="viewItems" :content="false" size="xs" color="neutral" />
        <USelect v-if="viewMode === 'table'" v-model="statusFilter" :items="statusFilterItems" size="sm" class="min-w-44" />
        <UButton to="/inbox" label="Create order from DM" icon="i-lucide-message-square" color="primary" />
      </div>
    </div>

    <template v-if="viewMode === 'table'">
      <OrdersTable :orders="rows" :loading="pending" @select="openOrder" />
      <TablePagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
    </template>
    <OrdersKanban
      v-else
      :search="filters.q"
      :move-order="moveOrder"
      @select="openOrder"
    />
  </div>
</template>
