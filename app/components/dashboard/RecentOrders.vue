<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { OrderViewModel } from '~/composables/useOrders'

defineProps<{ orders: OrderViewModel[] }>()

const columns: TableColumn<OrderViewModel>[] = [
  { accessorKey: 'orderCode', header: 'Order ID' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'item', header: 'Item' },
  { accessorKey: 'price', header: 'Price' },
  { accessorKey: 'status', header: 'Status' }
]
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-bold text-base text-highlighted flex items-center gap-2">
        <UIcon name="i-lucide-shopping-bag" class="size-4 text-primary" />
        Recent DM Orders
      </h3>
      <UButton to="/orders" label="View all orders" trailing-icon="i-lucide-arrow-right" variant="link" size="xs" class="px-0" />
    </div>

    <UTable :data="orders" :columns="columns" :ui="{ ...dashboardTableUi, th: `${dashboardTableUi.th} text-[11px]`, tr: 'hover:bg-elevated/20' }">
      <template #orderCode-cell="{ row }">
        <ULink :to="row.original.orderLink" class="font-mono font-bold text-primary">{{ row.original.orderCode }}</ULink>
      </template>
      <template #customer-cell="{ row }">
        <span class="font-medium text-highlighted">{{ row.original.customer.handle }}</span>
      </template>
      <template #item-cell="{ row }">
        <span class="block max-w-[150px] truncate text-dimmed">{{ row.original.item }}</span>
      </template>
      <template #price-cell="{ row }">
        <span class="font-bold text-highlighted">{{ formatMoney(row.original.price, row.original.currency) }}</span>
      </template>
      <template #status-cell="{ row }">
        <OrderStatusBadge :status="row.original.status" />
      </template>
      <template #empty>
        <UEmpty
          icon="i-lucide-shopping-bag"
          title="No orders yet"
          description="Create one from a DM in the Inbox."
          variant="naked"
          size="sm"
        />
      </template>
    </UTable>
  </div>
</template>
