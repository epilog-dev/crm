<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { VueDraggable, type DraggableEvent } from 'vue-draggable-plus'
import type { BadgeProps } from '@nuxt/ui'
import type { OrderStatus, OrderViewModel } from '~/composables/useOrders'

/**
 * Drag-and-drop board on SortableJS. Each column pages its own orders from
 * the server (newest first, "Load more" appends). Sortable mutates the
 * column lists on drop so the card lands instantly; if persisting the move
 * fails the lists are rebalanced from the cache, which puts the card back.
 */
const COLUMN_PAGE_SIZE = 25

const props = defineProps<{
  /** Free-text search applied to every column. */
  search?: string
  /** Persists a status change. Reject to roll the card back. */
  moveOrder: (orderId: string, status: OrderStatus) => Promise<unknown>
}>()
const emit = defineEmits<{ select: [order: OrderViewModel] }>()

const { cache, fetchOrdersPage } = useOrders()

// Cancelled orders are deliberately not a column: they're filtered in the table view instead.
const COLUMNS: { status: OrderStatus, color: BadgeProps['color'] }[] = [
  { status: 'Confirmed', color: 'neutral' },
  { status: 'Awaiting Payment', color: 'warning' },
  { status: 'Paid', color: 'success' },
  { status: 'Shipped', color: 'info' },
  { status: 'Delivered', color: 'success' }
]

interface ColumnState {
  items: OrderViewModel[]
  total: number
  page: number
  loading: boolean
}

const columns = reactive<Record<OrderStatus, ColumnState>>(Object.fromEntries(
  [...COLUMNS.map(c => c.status), 'Cancelled'].map(status => [status, { items: [], total: 0, page: 0, loading: false }])
) as Record<OrderStatus, ColumnState>)

async function loadColumn(status: OrderStatus, page: number) {
  const col = columns[status]
  col.loading = true
  try {
    const result = await fetchOrdersPage({ page, pageSize: COLUMN_PAGE_SIZE, status, q: props.search })
    // Append, skipping anything already on the board (e.g. moved here by hand).
    const present = new Set(page === 1 ? [] : col.items.map(o => o.id))
    const fresh = result.items.filter(o => !present.has(o.id))
    col.items = page === 1 ? fresh : [...col.items, ...fresh]
    col.total = result.total
    col.page = page
  } finally {
    col.loading = false
  }
}

function loadAll() {
  return Promise.all(COLUMNS.map(c => loadColumn(c.status, 1)))
}

onMounted(loadAll)
watchDebounced(() => props.search, loadAll, { debounce: 250 })

/**
 * Re-place every card on the board according to its cached status. Cards that
 * are already in the right column keep their position; a card whose status
 * changed elsewhere (slideover, failed move) jumps to the matching column.
 * With `adjustTotals`, each such jump also moves one unit between the column
 * counts -- used for edits made outside the board. Drags adjust their own
 * counts on success, and a rolled-back drag must not touch them.
 */
function rebalance(adjustTotals: boolean) {
  const boarded = new Map<string, OrderViewModel>()
  const previousColumn = new Map<string, OrderStatus>()
  for (const col of COLUMNS) {
    for (const item of columns[col.status].items) {
      const latest = cache.value[item.id] ?? item
      boarded.set(latest.id, latest)
      previousColumn.set(latest.id, col.status)
    }
  }
  for (const col of COLUMNS) {
    const kept = columns[col.status].items
      .map(o => boarded.get(o.id))
      .filter((o): o is OrderViewModel => !!o && o.status === col.status)
    const keptIds = new Set(kept.map(o => o.id))
    const added = [...boarded.values()].filter(o => o.status === col.status && !keptIds.has(o.id))
    columns[col.status].items = [...kept, ...added]
  }
  if (adjustTotals) {
    for (const order of boarded.values()) {
      const from = previousColumn.get(order.id)
      if (from && from !== order.status && order.status in columns) {
        columns[from].total = Math.max(0, columns[from].total - 1)
        columns[order.status].total += 1
      }
    }
  }
}
watch(cache, () => rebalance(true), { deep: true })

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
  const from = order.status
  savingIds.add(order.id)
  try {
    await props.moveOrder(order.id, status)
    columns[from].total = Math.max(0, columns[from].total - 1)
    columns[status].total += 1
  } catch {
    // Parent surfaces the error; the cache still says the old status.
    rebalance(false)
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
          <UBadge :color="col.color" variant="subtle" size="xs">{{ columns[col.status].total }}</UBadge>
          <UIcon v-if="columns[col.status].loading" name="i-lucide-loader-2" class="size-3.5 animate-spin text-dimmed ml-auto" />
        </div>

        <div class="relative flex-1 min-h-0 flex flex-col">
          <VueDraggable
            v-model="columns[col.status].items"
            v-bind="sortableOptions"
            :data-status="col.status"
            class="space-y-2.5 flex-1 min-h-28 overflow-y-auto pr-1"
            @start="onStart"
            @end="onEnd"
            @move="onMove"
            @add="onAdd(col.status, $event)"
          >
            <OrdersKanbanCard
              v-for="order in columns[col.status].items"
              :key="order.id"
              :order="order"
              :saving="savingIds.has(order.id)"
              @click="emit('select', order)"
            />
          </VueDraggable>
          <UButton
            v-if="columns[col.status].items.length < columns[col.status].total"
            :label="`Load more (${columns[col.status].total - columns[col.status].items.length})`"
            color="neutral"
            variant="ghost"
            size="xs"
            block
            class="mt-2 shrink-0"
            :loading="columns[col.status].loading"
            @click="loadColumn(col.status, columns[col.status].page + 1)"
          />

          <div
            v-if="columns[col.status].items.length === 0 && !columns[col.status].loading"
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
