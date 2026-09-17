<script setup lang="ts">
useSeoMeta({
  title: 'Customers CRM - Instagram DM Buyers',
  description: 'Buyer directory created automatically from Instagram DMs and confirmed order links.'
})

const { fetchCustomersPage } = useCustomers()

// 'auto' = cards on small screens, table on large.
const view = ref<'auto' | 'cards' | 'table'>('auto')
const viewItems = [
  { label: 'Auto', icon: 'i-lucide-monitor-smartphone', value: 'auto' },
  { label: 'Cards', icon: 'i-lucide-layout-grid', value: 'cards' },
  { label: 'Table', icon: 'i-lucide-table', value: 'table' }
]

const search = ref('')
const filters = computed(() => ({ q: search.value.trim() }))
const { items: customers, total, page, pageSize, pending, refresh } = usePagedList(fetchCustomersPage, filters, { pageSize: 20 })

onMounted(refresh)

const showCards = computed(() => view.value !== 'table')
const showTable = computed(() => view.value !== 'cards')
</script>

<template>
  <div class="p-4 md:p-6 space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-highlighted">Instagram DM Buyers</h2>
        <p class="text-xs text-dimmed">Customers are added automatically when they confirm their order link.</p>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <UTabs v-model="view" :items="viewItems" :content="false" size="xs" color="neutral" />
        <UInput v-model="search" icon="i-lucide-search" placeholder="Search by handle, name, phone…" class="w-64" />
      </div>
    </div>

    <div v-if="showCards" :class="['grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', view === 'auto' && 'lg:hidden']">
      <CustomersCard v-for="customer in customers" :key="customer.id" :customer="customer" />
      <UEmpty
        v-if="!pending && customers.length === 0"
        icon="i-lucide-users"
        :title="filters.q ? 'No matches' : 'No customers yet'"
        :description="filters.q ? 'Try a different name, handle or phone number.' : 'Buyers are added automatically when they confirm an order link.'"
        variant="naked"
        class="col-span-full"
      />
    </div>

    <div v-if="showTable" :class="view === 'auto' && 'hidden lg:block'">
      <CustomersTable :customers="customers" :loading="pending" />
    </div>

    <TablePagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
  </div>
</template>
