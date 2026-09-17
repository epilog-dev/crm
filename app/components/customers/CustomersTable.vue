<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { CustomerViewModel } from '~/composables/useCustomers'

defineProps<{ customers: CustomerViewModel[], loading?: boolean }>()

const columns: TableColumn<CustomerViewModel>[] = [
  { accessorKey: 'name', header: 'Customer' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'totalOrders', header: 'Orders' },
  { accessorKey: 'totalSpent', header: 'Total value' },
  { accessorKey: 'address', header: 'Shipping address' },
  { id: 'actions', header: '' }
]
</script>

<template>
  <UTable :data="customers" :columns="columns" :loading="loading" :ui="dashboardTableUi">
    <template #name-cell="{ row }">
      <CustomerUser :name="row.original.name" :handle="row.original.handle" :avatar="row.original.avatar" size="xs" link-to-instagram />
    </template>
    <template #phone-cell="{ row }">
      <span class="font-mono text-highlighted">{{ row.original.phone || '—' }}</span>
    </template>
    <template #totalOrders-cell="{ row }">
      <span class="font-bold text-highlighted">{{ row.original.totalOrders }}</span>
    </template>
    <template #totalSpent-cell="{ row }">
      <span class="font-bold text-success">{{ formatMoney(row.original.totalSpent) }}</span>
    </template>
    <template #address-cell="{ row }">
      <span class="block max-w-[220px] truncate text-dimmed">
        {{ row.original.address ? `${row.original.address}, ${row.original.pincode}` : '—' }}
      </span>
    </template>
    <template #actions-cell="{ row }">
      <div class="text-right">
        <UButton
          :to="instagramDmUrl(row.original.handle)"
          target="_blank"
          label="DM buyer"
          icon="i-simple-icons-instagram"
          size="xs"
          color="neutral"
          variant="outline"
        />
      </div>
    </template>
    <template #empty>
      <UEmpty
        icon="i-lucide-users"
        title="No customers found"
        description="Buyers are added automatically when they confirm an order link."
        variant="naked"
        size="sm"
      />
    </template>
  </UTable>
</template>
