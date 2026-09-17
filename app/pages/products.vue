<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Database } from '~/types/database.types'

type ProductRow = Database['public']['Tables']['products']['Row']

useSeoMeta({
  title: 'Products'
})

const search = ref('')
const filters = computed(() => ({ q: search.value.trim() }))

async function fetchProductsPage(params: { page: number, pageSize: number, q: string }) {
  const result = await $fetch<{ items: ProductRow[], total: number }>('/api/products', {
    query: { page: params.page, pageSize: params.pageSize, q: params.q || undefined }
  })
  return { items: result.items, total: result.total }
}

const { items: products, total, page, pageSize, pending, refresh } = usePagedList(fetchProductsPage, filters, { pageSize: 20 })

onMounted(refresh)

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
      <UInput v-model="search" class="w-full max-w-sm" icon="i-lucide-search" placeholder="Search products…" />
      <UButton label="Add product" icon="i-lucide-plus" color="primary" />
    </div>

    <UTable :data="products" :columns="columns" :loading="pending" :ui="dashboardTableUi">
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
        <UEmpty icon="i-lucide-package" :title="filters.q ? 'No matches' : 'No products yet'" description="Products are optional — orders can be created straight from a DM." variant="naked" size="sm" />
      </template>
    </UTable>

    <TablePagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
  </div>
</template>
