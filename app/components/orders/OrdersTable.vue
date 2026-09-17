<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { OrderViewModel } from '~/composables/useOrders'

defineProps<{ orders: OrderViewModel[], loading?: boolean }>()
const emit = defineEmits<{ select: [order: OrderViewModel] }>()

const columns: TableColumn<OrderViewModel>[] = [
  { accessorKey: 'orderCode', header: 'Order ID' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'item', header: 'Item & Variant' },
  { accessorKey: 'price', header: 'Price' },
  { accessorKey: 'paymentStatus', header: 'Payment' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

function onRowSelect(e: unknown) {
  const record = (e as { original?: OrderViewModel })?.original ?? (e as OrderViewModel)
  if (record?.id) emit('select', record)
}
</script>

<template>
  <UTable
    :data="orders"
    :columns="columns"
    :loading="loading"
    :ui="{ ...dashboardTableUi, tr: 'cursor-pointer hover:bg-elevated/20' }"
    @select="onRowSelect"
  >
    <template #orderCode-cell="{ row }">
      <span class="font-mono font-bold text-highlighted">{{ row.original.orderCode }}</span>
    </template>
    <template #customer-cell="{ row }">
      <CustomerUser :name="row.original.customer.name" :handle="row.original.customer.handle" :avatar="row.original.customer.avatar" size="xs" />
    </template>
    <template #item-cell="{ row }">
      <p class="font-medium text-highlighted">{{ row.original.item }}</p>
      <span v-if="row.original.variant" class="text-[11px] text-muted">Variant: {{ row.original.variant }}</span>
    </template>
    <template #price-cell="{ row }">
      <span class="font-bold text-highlighted">{{ formatMoney(row.original.price, row.original.currency) }}</span>
    </template>
    <template #paymentStatus-cell="{ row }">
      <PaymentStatusBadge :status="row.original.paymentStatus" />
    </template>
    <template #status-cell="{ row }">
      <OrderStatusBadge :status="row.original.status" />
    </template>
    <template #actions-cell="{ row }">
      <div class="text-right">
        <UButton label="Manage" size="xs" color="neutral" variant="outline" @click.stop="emit('select', row.original)" />
      </div>
    </template>
    <template #empty>
      <UEmpty
        icon="i-lucide-shopping-bag"
        title="No matching orders"
        description="Adjust your search or status filter, or create a new order directly from a DM."
        variant="naked"
        :actions="[{ label: 'Create order from DM', icon: 'i-lucide-message-square', to: '/inbox', color: 'primary' }]"
      />
    </template>
  </UTable>
</template>
