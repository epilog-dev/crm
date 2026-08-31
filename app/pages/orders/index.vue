<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  title: 'Order Management Dashboard'
})

useSeoMeta({
  title: 'Orders Dashboard - Instagram DM Sales'
})

export interface Order {
  id: string
  customer: {
    name: string
    handle: string
    phone?: string
    address?: string
    pincode?: string
    avatar?: string
  }
  item: string
  variant: string
  price: number
  currency: string
  status: 'Confirmed' | 'Awaiting Payment' | 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled'
  paymentStatus: 'Pending' | 'Paid'
  time: string
  orderLink: string
}

const orders = ref<Order[]>([
  {
    id: 'ORD-1082',
    customer: {
      name: 'Maria Santos',
      handle: '@maria',
      phone: '9876543210',
      address: '12 Green Park, Bandra West, Mumbai',
      pincode: '400050',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    item: 'Nike Vintage Windbreaker Jacket',
    variant: 'M',
    price: 1500,
    currency: '₹',
    status: 'Confirmed',
    paymentStatus: 'Pending',
    time: '10 mins ago',
    orderLink: '/order/ORD-1082'
  },
  {
    id: 'ORD-1079',
    customer: {
      name: 'Priya Sharma',
      handle: '@priya_s',
      phone: '9876543211',
      address: 'Flat 402, Sunshine Apartments, MG Road, Bengaluru',
      pincode: '560001',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
    },
    item: 'Silk Slip Dress (Emerald)',
    variant: 'S',
    price: 2400,
    currency: '₹',
    status: 'Awaiting Payment',
    paymentStatus: 'Pending',
    time: '1 hour ago',
    orderLink: '/order/ORD-1079'
  },
  {
    id: 'ORD-1076',
    customer: {
      name: 'Marcus Chen',
      handle: '@marcus_c',
      phone: '9876543212',
      address: '77 Park Street, Kolkata',
      pincode: '700016',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
    },
    item: 'Raw Denim Jacket',
    variant: 'L',
    price: 3200,
    currency: '₹',
    status: 'Paid',
    paymentStatus: 'Paid',
    time: '3 hours ago',
    orderLink: '/order/ORD-1076'
  },
  {
    id: 'ORD-1071',
    customer: {
      name: 'Chloe Bennett',
      handle: '@chloeb',
      phone: '9876543213',
      address: '45 Jubilee Hills, Hyderabad',
      pincode: '500033',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100'
    },
    item: 'Chunky Knit Sweater',
    variant: 'Free Size',
    price: 1800,
    currency: '₹',
    status: 'Shipped',
    paymentStatus: 'Paid',
    time: 'Yesterday',
    orderLink: '/order/ORD-1071'
  },
  {
    id: 'ORD-1065',
    customer: {
      name: 'Ananya Roy',
      handle: '@ananya_r',
      phone: '9876543214',
      address: '14 Salt Lake, Kolkata',
      pincode: '700091',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100'
    },
    item: 'Vintage Leather Belt',
    variant: 'Brown',
    price: 950,
    currency: '₹',
    status: 'Delivered',
    paymentStatus: 'Paid',
    time: '3 days ago',
    orderLink: '/order/ORD-1065'
  }
])

const viewMode = ref<'table' | 'kanban'>('table')
const search = ref('')
const selectedStatusFilter = ref('All')
const selectedOrder = ref<Order | null>(null)
const isSlideoverOpen = ref(false)

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
      o.id.toLowerCase().includes(q) ||
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

function onDrop(targetStatus: Order['status']) {
  if (!draggedOrderId.value) return
  const order = orders.value.find(o => o.id === draggedOrderId.value)
  if (order) {
    order.status = targetStatus
    if (targetStatus === 'Paid' || targetStatus === 'Shipped' || targetStatus === 'Delivered') {
      order.paymentStatus = 'Paid'
    }
  }
  draggedOrderId.value = null
}

function openOrderDetails(order: Order) {
  selectedOrder.value = order
  isSlideoverOpen.value = true
}

function updateOrderStatus(newStatus: Order['status']) {
  if (selectedOrder.value) {
    selectedOrder.value.status = newStatus
  }
}

function togglePaymentStatus() {
  if (selectedOrder.value) {
    if (selectedOrder.value.paymentStatus === 'Pending') {
      selectedOrder.value.paymentStatus = 'Paid'
      if (selectedOrder.value.status === 'Awaiting Payment' || selectedOrder.value.status === 'Confirmed') {
        selectedOrder.value.status = 'Paid'
      }
    } else {
      selectedOrder.value.paymentStatus = 'Pending'
      selectedOrder.value.status = 'Awaiting Payment'
    }
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

    <!-- VIEW 1: Table View -->
    <div v-if="viewMode === 'table'" class="border border-default rounded-xl overflow-hidden bg-background">
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
              {{ order.id }}
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
    </div>

    <!-- VIEW 2: Kanban Board View (Horizontal Scrollable Container for High Volume) -->
    <div v-else class="space-y-2">
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
                <span class="font-mono text-xs font-bold text-primary">{{ ord.id }}</span>
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
      :title="selectedOrder ? `${selectedOrder.id} - ${selectedOrder.customer.handle}` : 'Order details'"
      description="Manage order lifecycle & payment status"
    >
      <template #body>
        <div v-if="selectedOrder" class="space-y-6">
          <!-- Buyer Info -->
          <div class="p-4 rounded-xl bg-elevated/40 border border-default space-y-2">
            <div class="flex items-center gap-3">
              <UAvatar :src="selectedOrder.customer.avatar" :alt="selectedOrder.customer.name" size="lg" />
              <div>
                <h4 class="font-bold text-highlighted text-base">{{ selectedOrder.customer.name }}</h4>
                <p class="text-xs text-dimmed">{{ selectedOrder.customer.handle }}</p>
              </div>
            </div>
            <div v-if="selectedOrder.customer.phone" class="pt-2 border-t border-default/60 text-xs space-y-1">
              <p><span class="text-muted">Phone:</span> <span class="text-highlighted font-medium">{{ selectedOrder.customer.phone }}</span></p>
              <p><span class="text-muted">Delivery Address:</span> <span class="text-highlighted">{{ selectedOrder.customer.address }}, {{ selectedOrder.customer.pincode }}</span></p>
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
  </div>
</template>
