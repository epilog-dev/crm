<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Database } from '~/types/database.types'

type ProductRow = Database['public']['Tables']['products']['Row']

useSeoMeta({
  title: 'Products'
})

const { data: products, status } = await useLazyFetch<ProductRow[]>('/api/products', { server: false })

const search = ref('')

const filteredProducts = computed(() => {
  const list = products.value ?? []
  const q = search.value.trim().toLowerCase()
  if (!q) return list
  return list.filter(p =>
    p.title.toLowerCase().includes(q)
    || (p.description ?? '').toLowerCase().includes(q)
    || p.status.toLowerCase().includes(q)
  )
})

const columns: TableColumn<ProductRow>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'base_price', header: 'Price' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'created_at', header: 'Created' }
]
</script>

<template>
  <div class="p-4 md:p-6 space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <UInput v-model="search" class="w-full max-w-sm" icon="i-lucide-search" placeholder="Filter products…" />
      <UButton label="Add product" icon="i-lucide-plus" color="primary" />
    </div>

    <UTable :data="filteredProducts" :columns="columns" :loading="status === 'pending'" :ui="dashboardTableUi">
      <template #title-cell="{ row }">
        <span class="font-medium text-highlighted">{{ row.original.title }}</span>
      </template>
      <template #base_price-cell="{ row }">
        <span class="font-bold text-highlighted">{{ row.original.base_price != null ? formatMoney(row.original.base_price, row.original.currency) : '—' }}</span>
      </template>
      <template #status-cell="{ row }">
        <UBadge :color="row.original.status === 'active' ? 'success' : 'neutral'" variant="subtle" size="xs">{{ row.original.status }}</UBadge>
      </template>
      <template #created_at-cell="{ row }">
        <span class="text-dimmed">{{ formatDate(row.original.created_at) }}</span>
      </template>
      <template #empty>
        <UEmpty icon="i-lucide-package" title="No products yet" description="Products are optional — orders can be created straight from a DM." variant="naked" size="sm" />
      </template>
    </UTable>
  </div>
</template>
