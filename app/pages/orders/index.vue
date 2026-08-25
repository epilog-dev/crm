<script setup lang="ts">
definePageMeta({
  title: 'Orders Kanban Board'
})

useSeoMeta({
  title: 'Orders Kanban - Nudge CRM'
})

interface OrderItem {
  id: string
  customer: {
    name: string
    handle: string
    avatar?: string
  }
  product: string
  price: number
  platform: 'Instagram' | 'WhatsApp' | 'Direct'
  tag?: {
    label: string
    color: 'warning' | 'info' | 'success' | 'neutral' | 'error'
  }
  time: string
  notes?: string
}

interface Column {
  id: string
  title: string
  badgeColor: 'warning' | 'neutral' | 'success' | 'info'
  items: OrderItem[]
}

const columns = ref<Column[]>([
  {
    id: 'hold',
    title: '15-Min Hold',
    badgeColor: 'warning',
    items: [
      {
        id: 'ORD-1082',
        customer: {
          name: 'Sarah Jenkins',
          handle: '@sarah.j',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
        },
        product: 'Vintage Oversized Blazer',
        price: 68.00,
        platform: 'Instagram',
        tag: { label: 'Expires in 6m', color: 'warning' },
        time: '9 mins ago'
      },
      {
        id: 'ORD-1083',
        customer: {
          name: 'Liam Vance',
          handle: '@liam_v',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
        },
        product: 'Y2K Cargo Pants (M)',
        price: 52.00,
        platform: 'Instagram',
        tag: { label: 'Hold confirmed', color: 'info' },
        time: '12 mins ago'
      }
    ]
  },
  {
    id: 'pending_payment',
    title: 'Pending Payment',
    badgeColor: 'info',
    items: [
      {
        id: 'ORD-1079',
        customer: {
          name: 'Elena Rostova',
          handle: '@elena_r',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
        },
        product: 'Silk Slip Dress (Emerald)',
        price: 84.00,
        platform: 'WhatsApp',
        tag: { label: 'Sent invoice', color: 'neutral' },
        time: '24 mins ago'
      }
    ]
  },
  {
    id: 'paid_processing',
    title: 'Paid & Packing',
    badgeColor: 'success',
    items: [
      {
        id: 'ORD-1076',
        customer: {
          name: 'Marcus Chen',
          handle: '@marcus_c',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
        },
        product: 'Raw Denim Jacket',
        price: 110.00,
        platform: 'Instagram',
        tag: { label: 'Packing slip ready', color: 'success' },
        time: '1 hour ago'
      },
      {
        id: 'ORD-1074',
        customer: {
          name: 'Amara Diallo',
          handle: '@amara_d',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100'
        },
        product: 'Handmade Leather Belt',
        price: 38.00,
        platform: 'Direct',
        tag: { label: 'Paid via Revolut', color: 'success' },
        time: '2 hours ago'
      }
    ]
  },
  {
    id: 'dispatched',
    title: 'Dispatched / Courier',
    badgeColor: 'neutral',
    items: [
      {
        id: 'ORD-1071',
        customer: {
          name: 'Chloe Bennett',
          handle: '@chloeb',
          avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100'
        },
        product: 'Chunky Knit Sweater',
        price: 65.00,
        platform: 'Instagram',
        tag: { label: 'Tracking sent', color: 'neutral' },
        time: 'Yesterday'
      }
    ]
  }
])

const search = ref('')
const draggedItemId = ref<string | null>(null)
const draggedFromColId = ref<string | null>(null)
const selectedOrder = ref<OrderItem | null>(null)
const isSlideoverOpen = ref(false)

// Drag & Drop handlers
function onDragStart(itemId: string, colId: string) {
  draggedItemId.value = itemId
  draggedFromColId.value = colId
}

function onDrop(targetColId: string) {
  if (!draggedItemId.value || !draggedFromColId.value) return
  if (draggedFromColId.value === targetColId) return

  const sourceCol = columns.value.find(c => c.id === draggedFromColId.value)
  const targetCol = columns.value.find(c => c.id === targetColId)

  if (!sourceCol || !targetCol) return

  const itemIndex = sourceCol.items.findIndex(i => i.id === draggedItemId.value)
  if (itemIndex > -1) {
    const [movedItem] = sourceCol.items.splice(itemIndex, 1)
    targetCol.items.unshift(movedItem)
  }

  draggedItemId.value = null
  draggedFromColId.value = null
}

function openOrderDetails(order: OrderItem) {
  selectedOrder.value = order
  isSlideoverOpen.value = true
}

function filterItems(items: OrderItem[]) {
  if (!search.value) return items
  const q = search.value.toLowerCase()
  return items.filter(
    item =>
      item.id.toLowerCase().includes(q) ||
      item.product.toLowerCase().includes(q) ||
      item.customer.name.toLowerCase().includes(q) ||
      item.customer.handle.toLowerCase().includes(q)
  )
}

function totalOrdersCount() {
  return columns.value.reduce((acc, col) => acc + col.items.length, 0)
}
</script>

<template>
  <div class="p-6 space-y-4">
    <!-- Top Filter & Action Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Filter orders, buyers, products..."
          class="w-72"
        />
        <UBadge variant="subtle" color="neutral">
          {{ totalOrdersCount() }} Orders
        </UBadge>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          to="/orders/slips"
          label="Print Slips"
          icon="i-lucide-printer"
          variant="outline"
          color="neutral"
        />
        <UButton
          label="New Order"
          icon="i-lucide-plus"
          color="primary"
        />
      </div>
    </div>

    <!-- Kanban Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
      <div
        v-for="column in columns"
        :key="column.id"
        class="bg-elevated/40 border border-default rounded-xl p-3 flex flex-col min-h-[500px]"
        @dragover.prevent
        @drop="onDrop(column.id)"
      >
        <!-- Column Header -->
        <div class="flex items-center justify-between pb-3 mb-2 border-b border-default">
          <div class="flex items-center gap-2">
            <span class="font-medium text-sm text-highlighted">{{ column.title }}</span>
            <UBadge
              :color="column.badgeColor"
              variant="subtle"
              size="xs"
              class="rounded-full px-2"
            >
              {{ filterItems(column.items).length }}
            </UBadge>
          </div>
          <UButton
            icon="i-lucide-plus"
            variant="ghost"
            color="neutral"
            size="xs"
            aria-label="Add item"
          />
        </div>

        <!-- Cards List -->
        <div class="space-y-2.5 flex-1 overflow-y-auto">
          <div
            v-for="item in filterItems(column.items)"
            :key="item.id"
            draggable="true"
            class="group bg-default border border-default hover:border-highlighted/30 rounded-lg p-3 shadow-xs cursor-grab active:cursor-grabbing transition-all hover:shadow-sm space-y-2.5"
            @dragstart="onDragStart(item.id, column.id)"
            @click="openOrderDetails(item)"
          >
            <!-- Card Header: ID & Price -->
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-muted font-mono tracking-tight">{{ item.id }}</span>
              <span class="text-xs font-bold text-highlighted">${{ item.price.toFixed(2) }}</span>
            </div>

            <!-- Product title -->
            <p class="text-sm font-medium text-highlighted leading-snug line-clamp-2">
              {{ item.product }}
            </p>

            <!-- Customer info -->
            <div class="flex items-center gap-2 pt-1 border-t border-default/50">
              <UAvatar
                :src="item.customer.avatar"
                :alt="item.customer.name"
                size="xs"
              />
              <div class="text-xs min-w-0 flex-1">
                <p class="text-highlighted font-medium truncate">{{ item.customer.name }}</p>
                <p class="text-muted text-[11px] truncate">{{ item.customer.handle }}</p>
              </div>
            </div>

            <!-- Card Footer: Tag & Platform / Time -->
            <div class="flex items-center justify-between pt-1 text-[11px] text-muted">
              <UBadge
                v-if="item.tag"
                :color="item.tag.color"
                variant="subtle"
                size="xs"
              >
                {{ item.tag.label }}
              </UBadge>
              <div class="flex items-center gap-1 ml-auto">
                <UIcon name="i-lucide-clock" class="size-3" />
                <span>{{ item.time }}</span>
              </div>
            </div>
          </div>

          <!-- Empty dropzone state -->
          <div
            v-if="filterItems(column.items).length === 0"
            class="h-32 border-2 border-dashed border-default/70 rounded-lg flex flex-col items-center justify-center text-xs text-muted"
          >
            <UIcon name="i-lucide-inbox" class="size-5 mb-1 text-dimmed" />
            <span>Drop orders here</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Slideover -->
    <USlideover
      v-model:open="isSlideoverOpen"
      :title="selectedOrder ? `${selectedOrder.id} - ${selectedOrder.product}` : 'Order Details'"
      description="Order status and customer information"
    >
      <template #body>
        <div v-if="selectedOrder" class="space-y-6">
          <!-- Buyer Summary -->
          <div class="p-4 rounded-lg bg-elevated/50 border border-default space-y-3">
            <div class="flex items-center gap-3">
              <UAvatar
                :src="selectedOrder.customer.avatar"
                :alt="selectedOrder.customer.name"
                size="lg"
              />
              <div>
                <h4 class="font-semibold text-highlighted">{{ selectedOrder.customer.name }}</h4>
                <p class="text-xs text-muted">{{ selectedOrder.customer.handle }} • {{ selectedOrder.platform }}</p>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="space-y-3">
            <h5 class="text-xs font-semibold uppercase tracking-wider text-muted">Item Details</h5>
            <div class="flex justify-between items-center py-2 border-b border-default">
              <span class="text-sm text-highlighted">{{ selectedOrder.product }}</span>
              <span class="text-sm font-bold text-highlighted">${{ selectedOrder.price.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-default text-xs">
              <span class="text-muted">Status</span>
              <UBadge v-if="selectedOrder.tag" :color="selectedOrder.tag.color" variant="subtle" size="xs">
                {{ selectedOrder.tag.label }}
              </UBadge>
            </div>
            <div class="flex justify-between items-center py-2 text-xs">
              <span class="text-muted">Activity</span>
              <span class="text-muted">{{ selectedOrder.time }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex items-center justify-between w-full gap-2">
          <UButton
            label="Print Slip"
            icon="i-lucide-printer"
            variant="outline"
            color="neutral"
          />
          <UButton
            label="Mark as Paid"
            color="primary"
            @click="isSlideoverOpen = false"
          />
        </div>
      </template>
    </USlideover>
  </div>
</template>
