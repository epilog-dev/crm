<script setup lang="ts">
import type { BadgeProps } from '@nuxt/ui'
import type { OrderStatus, OrderViewModel } from '~/composables/useOrders'

const props = defineProps<{ orders: OrderViewModel[] }>()
const emit = defineEmits<{ select: [order: OrderViewModel], move: [orderId: string, status: OrderStatus] }>()

// Cancelled orders are deliberately not a column: they're filtered in the table view instead.
const COLUMNS: { status: OrderStatus, color: BadgeProps['color'] }[] = [
  { status: 'Confirmed', color: 'neutral' },
  { status: 'Awaiting Payment', color: 'warning' },
  { status: 'Paid', color: 'success' },
  { status: 'Shipped', color: 'info' },
  { status: 'Delivered', color: 'success' }
]

const columns = computed(() => COLUMNS.map(col => ({
  ...col,
  orders: props.orders.filter(o => o.status === col.status)
})))

const draggedOrderId = ref<string | null>(null)

function onDrop(status: OrderStatus) {
  if (!draggedOrderId.value) return
  const id = draggedOrderId.value
  draggedOrderId.value = null
  emit('move', id, status)
}
</script>

<template>
  <div class="space-y-3">
    <UAlert
      icon="i-lucide-lightbulb"
      color="neutral"
      variant="soft"
      description="Drag cards between columns to update status. For large volumes, search or filter above, or switch to the table view."
      :ui="{ description: 'text-xs' }"
    />

    <div class="flex gap-4 overflow-x-auto pb-4 items-start min-h-[520px]">
      <div
        v-for="col in columns"
        :key="col.status"
        class="w-72 shrink-0 bg-elevated/30 border border-default rounded-xl p-3 flex flex-col max-h-[70vh]"
        @dragover.prevent
        @drop="onDrop(col.status)"
      >
        <div class="flex items-center gap-2 pb-3 mb-2 border-b border-default shrink-0">
          <span class="font-bold text-xs text-highlighted">{{ col.status }}</span>
          <UBadge :color="col.color" variant="subtle" size="xs">{{ col.orders.length }}</UBadge>
        </div>

        <div class="space-y-2.5 flex-1 overflow-y-auto pr-1">
          <OrdersKanbanCard
            v-for="order in col.orders"
            :key="order.id"
            :order="order"
            @dragstart="draggedOrderId = order.id"
            @click="emit('select', order)"
          />

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
</template>
