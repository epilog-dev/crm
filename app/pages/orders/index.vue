<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { OrderViewModel as Order } from '~/composables/useOrders'

definePageMeta({
  title: 'Order Management Dashboard'
})

useSeoMeta({
  title: 'Orders Dashboard - Instagram DM Sales'
})

const {
  orders,
  pending,
  fetchOrders,
  updateOrderStatus: updateOrderStatusApi,
  updatePaymentStatus: updatePaymentStatusApi
} = useOrders()

onMounted(() => {
  fetchOrders()
})

const viewMode = ref<'table' | 'kanban'>('table')
const search = ref('')
const selectedStatusFilter = ref('All')
const selectedOrder = ref<Order | null>(null)
const isSlideoverOpen = ref(false)
const isPrintModalOpen = ref(false)

function triggerSlipPrint() {
  window.print()
}

const statusOptions = ['All', 'Confirmed', 'Awaiting Payment', 'Paid', 'Shipped', 'Delivered', 'Cancelled']

// Kanban Columns mapping
const kanbanColumns = computed(() => {
  const cols = [
    { id: 'Confirmed', title: 'Confirmed', badgeColor: 'neutral' as const },
    { id: 'Awaiting Payment', title: 'Awaiting Payment', badgeColor: 'warning' as const },
    { id: 'Paid', title: 'Paid', badgeColor: 'success' as const },
    { id: 'Shipped', title: 'Shipped', badgeColor: 'info' as const },
    { id: 'Delivered', title: 'Delivered', badgeColor: 'success' as const }
  ]

  return cols.map(col => ({
    ...col,
    orders: filteredOrders.value.filter(o => o.status === col.id)
  }))
})

const filteredOrders = computed(() => {
  return orders.value.filter(o => {
    const matchesStatus = selectedStatusFilter.value === 'All' || o.status === selectedStatusFilter.value
    const q = search.value.toLowerCase()
    const matchesSearch = !q ||
      o.orderCode.toLowerCase().includes(q) ||
      o.item.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.handle.toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  })
})

// Drag & Drop for Kanban
const draggedOrderId = ref<string | null>(null)

function onDragStart(orderId: string) {
  draggedOrderId.value = orderId
}

async function onDrop(targetStatus: Order['status']) {
  if (!draggedOrderId.value) return
  const id = draggedOrderId.value
  draggedOrderId.value = null

  await updateOrderStatusApi(id, targetStatus)
  if (targetStatus === 'Paid' || targetStatus === 'Shipped' || targetStatus === 'Delivered') {
    await updatePaymentStatusApi(id, 'Paid')
  }
}

function openOrderDetails(order: Order) {
  selectedOrder.value = order
  isSlideoverOpen.value = true
}

async function updateOrderStatus(newStatus: Order['status']) {
  if (!selectedOrder.value) return
  const updated = await updateOrderStatusApi(selectedOrder.value.id, newStatus)
  selectedOrder.value = updated
}

async function togglePaymentStatus() {
  if (!selectedOrder.value) return
  if (selectedOrder.value.paymentStatus === 'Pending') {
    const updated = await updatePaymentStatusApi(selectedOrder.value.id, 'Paid')
    selectedOrder.value = updated
    if (updated.status === 'Confirmed' || updated.status === 'Awaiting Payment') {
      selectedOrder.value = await updateOrderStatusApi(updated.id, 'Paid')
    }
  } else {
    const updated = await updatePaymentStatusApi(selectedOrder.value.id, 'Pending')
    selectedOrder.value = await updateOrderStatusApi(updated.id, 'Awaiting Payment')
  }
}

function getBadgeColor(status: Order['status']) {
  switch (status) {
    case 'Confirmed': return 'neutral'
    case 'Awaiting Payment': return 'warning'
    case 'Paid': return 'success'
    case 'Shipped': return 'info'
    case 'Delivered': return 'success'
    case 'Cancelled': return 'error'
    default: return 'neutral'
  }
}
</script>

<template>
  <div class="p-4 md:p-6 space-y-4">
    <!-- Header Summary Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="p-4 bg-background border border-default rounded-xl">
        <span class="text-xs text-dimmed">Total Orders</span>
        <p class="text-xl font-bold text-highlighted mt-0.5">{{ orders.length }}</p>
      </div>
      <div class="p-4 bg-background border border-default rounded-xl">
        <span class="text-xs text-amber-500 font-medium">Awaiting Payment</span>
        <p class="text-xl font-bold text-amber-500 mt-0.5">
          {{ orders.filter(o => o.status === 'Awaiting Payment').length }}
        </p>
      </div>
      <div class="p-4 bg-background border border-default rounded-xl">
        <span class="text-xs text-emerald-500 font-medium">Paid Orders</span>
        <p class="text-xl font-bold text-emerald-500 mt-0.5">
          {{ orders.filter(o => o.paymentStatus === 'Paid').length }}
        </p>
      </div>
      <div class="p-4 bg-background border border-default rounded-xl">
        <span class="text-xs text-blue-500 font-medium">Shipped</span>
        <p class="text-xl font-bold text-blue-500 mt-0.5">
          {{ orders.filter(o => o.status === 'Shipped').length }}
        </p>
      </div>
    </div>

    <!-- Filters & Action Bar with Table / Kanban View Toggle -->
    <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
      <div class="flex items-center gap-2 flex-1 max-w-md">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Filter by Order ID, Buyer (@maria), or Item..."
          class="w-full"
        />
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <!-- View Toggle (Table vs Kanban) -->
        <div class="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-default">
          <button
            @click="viewMode = 'table'"
            :class="[
              'flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer',
              viewMode === 'table' ? 'bg-background shadow-xs text-highlighted' : 'text-dimmed hover:text-highlighted'
            ]"
          >
            <UIcon name="i-lucide-table" class="size-3.5" />
            <span>Table View</span>
          </button>
          <button
            @click="viewMode = 'kanban'"
            :class="[
              'flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer',
              viewMode === 'kanban' ? 'bg-background shadow-xs text-highlighted' : 'text-dimmed hover:text-highlighted'
            ]"
          >
            <UIcon name="i-lucide-columns-3" class="size-3.5" />
            <span>Kanban Board</span>
          </button>
        </div>

        <select
          v-model="selectedStatusFilter"
          class="text-xs px-3 py-1.5 rounded-lg border border-default bg-background text-highlighted font-medium cursor-pointer"
        >
          <option v-for="opt in statusOptions" :key="opt" :value="opt">
            Status: {{ opt }}
          </option>
        </select>

        <UButton
          to="/inbox"
          label="+ Create Order from DM"
          icon="i-lucide-message-square"
          color="primary"
          class="font-semibold cursor-pointer"
        />
      </div>
    </div>

    <div v-if="pending" class="flex items-center justify-center py-12 text-dimmed text-xs gap-2">
      <UIcon name="i-lucide-loader-2" class="size-4 animate-spin" />
      Loading orders...
    </div>

    <!-- VIEW 1: Table View -->
    <div v-if="!pending && viewMode === 'table'" class="border border-default rounded-xl overflow-hidden bg-background">
      <table class="w-full text-left text-xs">
        <thead class="bg-elevated/50 border-b border-default text-muted uppercase font-semibold">
          <tr>
            <th class="p-3">Order ID</th>
            <th class="p-3">Customer</th>
            <th class="p-3">Item & Variant</th>
            <th class="p-3">Price</th>
            <th class="p-3">Payment</th>
            <th class="p-3">Order Lifecycle Status</th>
            <th class="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-default">
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            class="hover:bg-elevated/20 transition-colors cursor-pointer"
            @click="openOrderDetails(order)"
          >
            <td class="p-3 font-mono font-bold text-highlighted">
              {{ order.orderCode }}
            </td>
            <td class="p-3">
              <div class="flex items-center gap-2">
                <UAvatar :src="order.customer.avatar" :alt="order.customer.name" size="xs" />
                <div>
                  <p class="font-bold text-highlighted">{{ order.customer.name }}</p>
                  <p class="text-dimmed text-[11px]">{{ order.customer.handle }}</p>
                </div>
              </div>
            </td>
            <td class="p-3">
              <p class="font-medium text-highlighted">{{ order.item }}</p>
              <span class="text-muted text-[11px]">Variant: {{ order.variant }}</span>
            </td>
            <td class="p-3 font-bold text-highlighted">
              {{ order.currency }}{{ order.price.toLocaleString('en-IN') }}
            </td>
            <td class="p-3">
              <UBadge
                :color="order.paymentStatus === 'Paid' ? 'success' : 'warning'"
                variant="subtle"
                size="xs"
              >
                {{ order.paymentStatus === 'Paid' ? 'Paid' : 'Pending' }}
              </UBadge>
            </td>
            <td class="p-3">
              <UBadge :color="getBadgeColor(order.status)" variant="subtle" size="xs">
                {{ order.status }}
              </UBadge>
            </td>
            <td class="p-3 text-right">
              <UButton
                label="View / Manage"
                size="xs"
                color="neutral"
                variant="outline"
                @click.stop="openOrderDetails(order)"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Illustrated Empty State for Orders -->
      <div v-if="filteredOrders.length === 0" class="py-12 px-4 text-center space-y-3">
        <div class="size-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto">
          <UIcon name="i-lucide-shopping-bag" class="size-7 text-dimmed" />
        </div>
        <div>
          <h4 class="text-sm font-bold text-highlighted">No matching orders found</h4>
          <p class="text-xs text-dimmed max-w-sm mx-auto mt-0.5">
            Try adjusting your search query or status filter above, or create a new order directly from a DM.
          </p>
        </div>
        <UButton
          to="/inbox"
          label="+ Create Order from DM"
          icon="i-lucide-message-square"
          color="primary"
          size="sm"
          class="font-bold cursor-pointer"
        />
      </div>
    </div>

    <!-- VIEW 2: Kanban Board View (Horizontal Scrollable Container for High Volume) -->
    <div v-else-if="!pending" class="space-y-2">
      <!-- Kanban Hint -->
      <p class="text-xs text-dimmed">
        💡 Drag cards between columns to update status. For large volumes, search/filter above or switch to Table View.
      </p>

      <div class="flex gap-4 overflow-x-auto pb-4 items-start min-h-[520px] scrollbar-thin">
        <div
          v-for="col in kanbanColumns"
          :key="col.id"
          class="w-72 shrink-0 bg-elevated/30 border border-default rounded-xl p-3 flex flex-col max-h-[70vh]"
          @dragover.prevent
          @drop="onDrop(col.id as Order['status'])"
        >
          <!-- Column Header -->
          <div class="flex items-center justify-between pb-3 mb-2 border-b border-default shrink-0">
            <div class="flex items-center gap-2">
              <span class="font-bold text-xs text-highlighted">{{ col.title }}</span>
              <UBadge :color="col.badgeColor" variant="subtle" size="xs">
                {{ col.orders.length }}
              </UBadge>
            </div>
          </div>

          <!-- Cards List with Scrollbar for High Volume -->
          <div class="space-y-2.5 flex-1 overflow-y-auto pr-1">
            <div
              v-for="ord in col.orders"
              :key="ord.id"
              draggable="true"
              @dragstart="onDragStart(ord.id)"
              @click="openOrderDetails(ord)"
              class="bg-background border border-default hover:border-primary/50 rounded-lg p-3 shadow-xs cursor-grab active:cursor-grabbing transition-all space-y-2"
            >
              <div class="flex items-center justify-between">
                <span class="font-mono text-xs font-bold text-primary">{{ ord.orderCode }}</span>
                <span class="font-bold text-xs text-highlighted">{{ ord.currency }}{{ ord.price.toLocaleString('en-IN') }}</span>
              </div>

              <p class="text-xs font-semibold text-highlighted leading-snug line-clamp-2">
                {{ ord.item }} ({{ ord.variant }})
              </p>

              <div class="flex items-center gap-2 pt-1 border-t border-default/50">
                <UAvatar :src="ord.customer.avatar" :alt="ord.customer.name" size="xs" />
                <div class="text-[11px] min-w-0 flex-1">
                  <p class="font-medium text-highlighted truncate">{{ ord.customer.name }}</p>
                  <p class="text-dimmed truncate">{{ ord.customer.handle }}</p>
                </div>
              </div>
            </div>

            <!-- Empty Dropzone -->
            <div
              v-if="col.orders.length === 0"
              class="h-28 border-2 border-dashed border-default/60 rounded-lg flex items-center justify-center text-xs text-muted"
            >
              Drop orders here
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Management Slideover -->
    <USlideover
      v-model:open="isSlideoverOpen"
      :title="selectedOrder ? `${selectedOrder.orderCode} - ${selectedOrder.customer.handle}` : 'Order details'"
      description="Manage order lifecycle & payment status"
    >
      <template #body>
        <div v-if="selectedOrder" class="space-y-6">
          <!-- Buyer Info -->
          <div class="p-4 rounded-xl bg-elevated/40 border border-default space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <UAvatar :src="selectedOrder.customer.avatar" :alt="selectedOrder.customer.name" size="lg" />
                <div>
                  <h4 class="font-bold text-highlighted text-base">{{ selectedOrder.customer.name }}</h4>
                  <p class="text-xs text-dimmed">{{ selectedOrder.customer.handle }}</p>
                </div>
              </div>
              
              <UButton
                :to="`https://instagram.com/direct/t/${selectedOrder.customer.handle.replace('@', '')}`"
                target="_blank"
                label="DM on Instagram"
                icon="i-simple-icons-instagram"
                color="neutral"
                variant="outline"
                size="xs"
                class="font-medium cursor-pointer shrink-0"
              />
            </div>
            <div v-if="selectedOrder.customer.phone" class="pt-2 border-t border-default/60 text-xs space-y-2">
              <p><span class="text-muted">Phone:</span> <span class="text-highlighted font-medium">{{ selectedOrder.customer.phone }}</span></p>
              <p><span class="text-muted">Delivery Address:</span> <span class="text-highlighted">{{ selectedOrder.customer.address }}, {{ selectedOrder.customer.pincode }}</span></p>

              <!-- Address Actions: 1-Click Copy & Google Maps Search -->
              <div class="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  @click="navigator.clipboard.writeText(`${selectedOrder.customer.name}\n${selectedOrder.customer.phone}\n${selectedOrder.customer.address}\nPincode: ${selectedOrder.customer.pincode}`)"
                  class="px-2.5 py-1 rounded bg-background border border-default hover:border-primary/50 text-[11px] font-semibold text-highlighted flex items-center gap-1 cursor-pointer transition-all"
                >
                  <UIcon name="i-lucide-copy" class="size-3 text-primary" />
                  <span>Copy Address</span>
                </button>

                <a
                  :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedOrder.customer.address + ' ' + selectedOrder.customer.pincode)}`"
                  target="_blank"
                  class="px-2.5 py-1 rounded bg-background border border-default hover:border-primary/50 text-[11px] font-semibold text-highlighted flex items-center gap-1 transition-all"
                >
                  <UIcon name="i-lucide-map-pin" class="size-3 text-emerald-500" />
                  <span>Maps Search</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Item Details -->
          <div class="space-y-2">
            <h5 class="text-xs font-semibold uppercase tracking-wider text-muted">Item & Pricing</h5>
            <div class="flex justify-between items-center py-2 border-b border-default text-sm">
              <div>
                <p class="font-semibold text-highlighted">{{ selectedOrder.item }}</p>
                <p class="text-xs text-dimmed">Variant: {{ selectedOrder.variant }}</p>
              </div>
              <span class="font-bold text-lg text-highlighted">{{ selectedOrder.currency }}{{ selectedOrder.price.toLocaleString('en-IN') }}</span>
            </div>
          </div>

          <!-- Manual Payment Status Toggle (Feature #7) -->
          <div class="p-4 rounded-xl border border-default space-y-3">
            <div class="flex justify-between items-center">
              <div>
                <h5 class="text-xs font-bold text-highlighted">Manual Payment Status</h5>
                <p class="text-[11px] text-dimmed">Mark when customer pays via UPI/Bank/COD</p>
              </div>
              <UBadge :color="selectedOrder.paymentStatus === 'Paid' ? 'success' : 'warning'" variant="subtle">
                {{ selectedOrder.paymentStatus }}
              </UBadge>
            </div>
            <UButton
              :label="selectedOrder.paymentStatus === 'Paid' ? 'Mark as Pending' : 'Mark as Paid'"
              :color="selectedOrder.paymentStatus === 'Paid' ? 'warning' : 'success'"
              size="sm"
              block
              class="font-bold cursor-pointer"
              @click="togglePaymentStatus"
            />
          </div>

          <!-- Order Status Lifecycle Selector (Feature #6) -->
          <div class="space-y-3">
            <h5 class="text-xs font-semibold uppercase tracking-wider text-muted">Update Order Status Flow</h5>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="st in ['Confirmed', 'Awaiting Payment', 'Paid', 'Shipped', 'Delivered', 'Cancelled'] as const"
                :key="st"
                @click="updateOrderStatus(st)"
                :class="[
                  'py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left border',
                  selectedOrder.status === st
                    ? 'bg-primary text-inverted border-primary shadow-xs'
                    : 'bg-background border-default text-dimmed hover:text-highlighted'
                ]"
              >
                {{ st }}
              </button>
            </div>
          </div>

          <!-- Print Shipping Slip Action -->
          <div class="pt-2">
            <UButton
              label="Print / Download Shipping Slip"
              icon="i-lucide-printer"
              color="neutral"
              variant="outline"
              block
              class="font-bold cursor-pointer"
              @click="isPrintModalOpen = true"
            />
          </div>

          <!-- Customer Order Link -->
          <div class="p-3 bg-elevated/30 rounded-lg border border-default text-xs space-y-1">
            <span class="text-muted">Unique Customer Order Link:</span>
            <div class="flex items-center justify-between gap-2 bg-background p-2 rounded border border-default font-mono">
              <span class="truncate text-highlighted">{{ selectedOrder.orderLink }}</span>
              <NuxtLink :to="selectedOrder.orderLink" target="_blank" class="text-primary font-bold hover:underline shrink-0">
                Open Link ↗
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>
    </USlideover>

    <!-- Modal for 1-Tap Printing Shipping Slip -->
    <UModal v-model:open="isPrintModalOpen" title="Print Shipping Slip" description="Standard 4x6 inch shipping label for courier polybag">
      <template #body>
        <div v-if="selectedOrder" class="space-y-4">
          <div class="bg-white text-black p-5 rounded-xl border-2 border-dashed border-black shadow-xs space-y-4 font-sans print-area">
            <!-- Header -->
            <div class="flex justify-between items-start border-b-2 border-black pb-3">
              <div>
                <h3 class="font-extrabold text-base tracking-tight">RETRO THRIFT STORE</h3>
                <p class="text-[11px] text-zinc-600">Instagram Sales DM Order</p>
              </div>
              <div class="text-right">
                <span class="font-mono font-extrabold text-sm border-2 border-black px-2 py-0.5 rounded">
                  {{ selectedOrder.orderCode }}
                </span>
              </div>
            </div>

            <!-- Deliver To -->
            <div class="space-y-1 text-left">
              <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">DELIVER TO:</span>
              <p class="font-extrabold text-base leading-snug">{{ selectedOrder.customer.name }}</p>
              <p class="text-xs font-semibold text-pink-600">{{ selectedOrder.customer.handle }} • {{ selectedOrder.customer.phone || 'Phone pending' }}</p>
              <p class="text-xs leading-normal font-medium mt-1">
                {{ selectedOrder.customer.address || 'Address pending customer confirmation' }}<br />
                Pincode: <strong class="text-sm font-extrabold text-black">{{ selectedOrder.customer.pincode || '-----' }}</strong>
              </p>
            </div>

            <!-- Summary -->
            <div class="border-t-2 border-black pt-3 space-y-2 text-left">
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold truncate max-w-[200px]">{{ selectedOrder.item }} ({{ selectedOrder.variant }})</span>
                <span class="font-mono font-bold">{{ selectedOrder.currency }}{{ selectedOrder.price.toLocaleString('en-IN') }}</span>
              </div>
              <div class="flex justify-between items-center text-[11px] pt-1">
                <span class="px-2 py-0.5 rounded bg-zinc-100 font-bold border border-zinc-300">
                  Payment: {{ selectedOrder.paymentStatus === 'Paid' ? 'Prepaid (UPI)' : 'COD / Pending' }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <UButton label="Close" color="neutral" variant="ghost" @click="isPrintModalOpen = false" />
            <UButton label="Print Label" icon="i-lucide-printer" color="primary" class="font-bold cursor-pointer" @click="triggerSlipPrint" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
