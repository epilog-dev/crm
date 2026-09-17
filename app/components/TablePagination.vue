<script setup lang="ts">
/** "Showing 21–40 of 134" + page-size picker + page controls, for server-paged tables. */
const props = withDefaults(defineProps<{
  total: number
  pageSizeOptions?: number[]
}>(), { pageSizeOptions: () => [10, 20, 50] })

const page = defineModel<number>('page', { required: true })
const pageSize = defineModel<number>('pageSize', { required: true })

const from = computed(() => props.total === 0 ? 0 : (page.value - 1) * pageSize.value + 1)
const to = computed(() => Math.min(props.total, page.value * pageSize.value))
const sizeItems = computed(() => props.pageSizeOptions.map(n => ({ label: `${n} per page`, value: n })))
</script>

<template>
  <div v-if="total > 0" class="flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
    <span>Showing <span class="font-medium text-highlighted">{{ from }}–{{ to }}</span> of {{ total }}</span>
    <div class="flex items-center gap-2">
      <USelect v-model="pageSize" :items="sizeItems" size="xs" class="w-32" />
      <UPagination
        v-model:page="page"
        :total="total"
        :items-per-page="pageSize"
        :sibling-count="1"
        show-edges
        size="xs"
        color="neutral"
        variant="outline"
        active-color="primary"
        active-variant="solid"
      />
    </div>
  </div>
</template>
