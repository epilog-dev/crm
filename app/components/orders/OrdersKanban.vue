<script setup lang="ts">
import { VueDraggable, type DraggableEvent } from 'vue-draggable-plus'
import type { BadgeProps } from '@nuxt/ui'
import type { OrderStatus, OrderViewModel } from '~/composables/useOrders'

/**
 * Drag-and-drop board on SortableJS. Each column owns a local list that
 * Sortable mutates on drop (so the card lands instantly); the lists are
 * re-derived from `orders` whenever the source changes, and rebuilt from it
 * if persisting a move fails -- which puts the card back where it was.
 */
const props = defineProps<{
  orders: OrderViewModel[]
  /** Persists a status change. Reject to roll the card back. */
  moveOrder: (orderId: string, status: OrderStatus) => Promise<unknown>
}>()
const emit = defineEmits<{ select: [order: OrderViewModel] }>()

// Cancelled orders are deliberately not a column: they're filtered in the table view instead.
const COLUMNS: { status: OrderStatus, color: BadgeProps['color'] }[] = [
  { status: 'Confirmed', color: 'neutral' },
  { status: 'Awaiting Payment', color: 'warning' },
  { status: 'Paid', color: 'success' },
  { status: 'Shipped', color: 'info' },
  { status: 'Delivered', color: 'success' }
]

const lists = reactive<Record<OrderStatus, OrderViewModel[]>>({
  'Confirmed': [],
  'Awaiting Payment': [],
  'Paid': [],
  'Shipped': [],
  'Delivered': [],
  'Cancelled': []
})

/**
 * Merge source data into the local lists without disturbing the order the
 * user arranged: cards that are still in a column keep their position, cards
 * whose status changed elsewhere move out, new ones append.
 */
function syncFromProps() {
  const byId = new Map(props.orders.map(o => [o.id, o]))
  for (const col of COLUMNS) {
    const kept = lists[col.status]
      .map(o => byId.get(o.id))
      .filter((o): o is OrderViewModel => !!o && o.status === col.status)
    const keptIds = new Set(kept.map(o => o.id))
    const added = props.orders.filter(o => o.status === col.status && !keptIds.has(o.id))
    lists[col.status] = [...kept, ...added]
  }
}
watch(() => props.orders, syncFromProps, { immediate: true, deep: true })

const dragging = ref(false)
const overStatus = ref<OrderStatus | null>(null)
const savingIds = reactive(new Set<string>())

const sortableOptions = {
  group: 'orders',
  animation: 220,
  easing: 'cubic-bezier(0.2, 0, 0, 1)',
  // Fallback (pointer-driven) dragging gives the same lift-and-carry feel in
  // every browser and on touch, instead of the OS's native drag image.
  forceFallback: true,
  fallbackOnBody: true,
  fallbackTolerance: 4,
  // Small hold on touch so the board can still be scrolled with a finger.
  delay: 120,
  delayOnTouchOnly: true,
  emptyInsertThreshold: 32,
  ghostClass: 'kanban-ghost',
  chosenClass: 'kanban-chosen',
  dragClass: 'kanban-drag',
  scroll: true,
  scrollSensitivity: 60,
  bubbleScroll: true
} as const

function onStart() {
  dragging.value = true
}

function onEnd() {
  dragging.value = false
  overStatus.value = null
}

// Sortable's `move` callback: track which column the card is hovering.
function onMove(evt: { to: HTMLElement }) {
  overStatus.value = (evt.to.dataset.status as OrderStatus) ?? null
  return true
}

// Fires on the target list when a card is dropped in from another column.
async function onAdd(status: OrderStatus, event: DraggableEvent<OrderViewModel>) {
  const order = event.data
  if (!order || order.status === status) return
  savingIds.add(order.id)
  try {
    await props.moveOrder(order.id, status)
  } catch {
    // Parent surfaces the error; put the card back where the data says it is.
    syncFromProps()
  } finally {
    savingIds.delete(order.id)
  }
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
        v-for="col in COLUMNS"
        :key="col.status"
        :class="[
          'w-72 shrink-0 bg-elevated/30 border rounded-xl p-3 flex flex-col max-h-[70vh] transition-colors duration-150',
          overStatus === col.status
            ? 'border-primary/60 bg-primary/5'
            : dragging ? 'border-dashed border-accented' : 'border-default'
        ]"
      >
        <div class="flex items-center gap-2 pb-3 mb-2 border-b border-default shrink-0">
          <span class="font-bold text-xs text-highlighted">{{ col.status }}</span>
          <UBadge :color="col.color" variant="subtle" size="xs">{{ lists[col.status].length }}</UBadge>
        </div>

        <div class="relative flex-1 min-h-0">
          <VueDraggable
            v-model="lists[col.status]"
            v-bind="sortableOptions"
            :data-status="col.status"
            class="space-y-2.5 h-full min-h-28 overflow-y-auto pr-1"
            @start="onStart"
            @end="onEnd"
            @move="onMove"
            @add="onAdd(col.status, $event)"
          >
            <OrdersKanbanCard
              v-for="order in lists[col.status]"
              :key="order.id"
              :order="order"
              :saving="savingIds.has(order.id)"
              @click="emit('select', order)"
            />
          </VueDraggable>

          <div
            v-if="lists[col.status].length === 0"
            :class="[
              'pointer-events-none absolute inset-0 border-2 border-dashed rounded-lg flex items-center justify-center text-xs transition-colors',
              overStatus === col.status ? 'border-primary/60 text-primary' : 'border-default/60 text-muted'
            ]"
          >
            Drop orders here
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Unscoped on purpose: SortableJS appends the dragged clone to <body>. */
/* The in-list placeholder: a dashed slot where the card will land. */
.kanban-ghost {
  opacity: 0.6;
  border: 2px dashed var(--ui-primary);
  border-radius: 0.5rem;
  background: color-mix(in oklab, var(--ui-primary) 8%, transparent);
}
.kanban-ghost > * {
  visibility: hidden;
}
.kanban-chosen {
  cursor: grabbing;
}
.kanban-drag {
  transform: rotate(1.5deg) scale(1.03);
  box-shadow: 0 16px 40px -12px rgb(0 0 0 / 0.45);
  cursor: grabbing;
  opacity: 0.98;
}
</style>
