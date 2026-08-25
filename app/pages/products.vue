<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

useSeoMeta({
  title: 'Products'
})

const { data: products, status } = await useLazyFetch('/api/products', {server: false})

const search = ref('')

const filteredProducts = computed(() => {
  if (!products.value) return []
  if (!search.value) return products.value

  const query = search.value.toLowerCase()
  return products.value.filter((item: any) =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(query)
    )
  )
})

const columns: TableColumn<any>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'price',
    header: 'Price'
  },
  {
    accessorKey: 'created_at',
    header: 'Created At'
  }
]
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-1.5">
      <UInput
        v-model="search"
        class="max-w-sm"
        icon="i-lucide-search"
        placeholder="Filter products..."
      />

      <div class="flex items-center gap-2">
        <UButton
          label="Add Product"
          icon="i-lucide-plus"
          color="primary"
        />
      </div>
    </div>

    <UTable
      :data="filteredProducts"
      :columns="columns"
      :loading="status === 'pending'"
      class="shrink-0"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default',
        separator: 'h-0'
      }"
    />
  </div>
</template>