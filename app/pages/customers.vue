<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { TableColumn } from '@nuxt/ui'

useSeoMeta({
  title: 'Customers CRM - Instagram DM Buyers',
  description: 'Buyer directory created automatically from Instagram DMs and confirmed order links.'
})

const { customers, fetchCustomers } = useCustomers()

onMounted(() => {
  fetchCustomers()
})

function igLink(handle: string) {
  return `https://instagram.com/direct/t/${handle.replace('@', '')}`
}

const customerColumns: TableColumn<Record<string, unknown>>[] = [
  { accessorKey: 'name', header: 'Customer' },
  { accessorKey: 'handle', header: 'Instagram Handle' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'totalOrders', header: 'Total Orders' },
  { accessorKey: 'totalSpent', header: 'Total Value' },
  { accessorKey: 'address', header: 'Shipping Address' },
  { id: 'actions', header: '' }
]

const tableUi = {
  base: 'table-fixed border-separate border-spacing-0',
  thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
  tbody: '[&>tr]:last:[&>td]:border-b-0',
  th: 'py-2 text-xs uppercase first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
  td: 'border-b border-default text-xs',
  separator: 'h-0'
}

// View mode state: 'auto' (Card on small screens, Table on large), 'cards', or 'table'
const activeView = ref<'auto' | 'cards' | 'table'>('auto')
const search = ref('')

const filteredCustomers = computed(() => {
  if (!search.value) return customers.value
  const q = search.value.toLowerCase()
  return customers.value.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.handle.toLowerCase().includes(q) ||
    c.phone.includes(q) ||
    c.address.toLowerCase().includes(q)
  )
})
</script>

<template>
  <div class="p-4 md:p-6 space-y-4">
    <!-- Top Action Bar with Responsive View Toggle -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-highlighted">Instagram DM Buyers Directory</h2>
        <p class="text-xs text-dimmed">Customers are automatically added when they confirm their unique order link.</p>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <!-- View Mode Switcher -->
        <div class="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-default text-xs">
          <button
            type="button"
            @click="activeView = 'auto'"
            :class="[
              'px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer',
              activeView === 'auto' ? 'bg-background shadow-xs text-highlighted' : 'text-dimmed hover:text-highlighted'
            ]"
            title="Card on small screens, Table on large"
          >
            Auto Responsive
          </button>
          <button
            type="button"
            @click="activeView = 'cards'"
            :class="[
              'px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1',
              activeView === 'cards' ? 'bg-background shadow-xs text-highlighted' : 'text-dimmed hover:text-highlighted'
            ]"
          >
            <UIcon name="i-lucide-layout-grid" class="size-3.5" />
            Cards
          </button>
          <button
            type="button"
            @click="activeView = 'table'"
            :class="[
              'px-2.5 py-1 font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1',
              activeView === 'table' ? 'bg-background shadow-xs text-highlighted' : 'text-dimmed hover:text-highlighted'
            ]"
          >
            <UIcon name="i-lucide-table" class="size-3.5" />
            Table
          </button>
        </div>

        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Search by buyer handle, name, phone..."
          class="w-64"
        />
      </div>
    </div>

    <!-- CARDS VIEW (Responsive: Default on small screen under 'auto', or forced 'cards') -->
    <div
      v-if="activeView === 'cards' || activeView === 'auto'"
      :class="[
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
        activeView === 'auto' ? 'lg:hidden' : 'block'
      ]"
    >
      <div
        v-for="cust in filteredCustomers"
        :key="cust.id"
        class="p-4 bg-background border border-default rounded-xl space-y-3 shadow-xs hover:border-highlighted/30 transition-all"
      >
        <div class="flex items-center gap-3">
          <UAvatar :src="cust.avatar" :alt="cust.name" size="md" />
          <div class="min-w-0 flex-1">
            <h3 class="font-bold text-sm text-highlighted truncate">{{ cust.name }}</h3>
            <a
              :href="`https://instagram.com/direct/t/${cust.handle.replace('@', '')}`"
              target="_blank"
              class="text-xs text-primary font-medium truncate hover:underline flex items-center gap-1"
            >
              <UIcon name="i-simple-icons-instagram" class="size-3" />
              {{ cust.handle }}
            </a>
          </div>
        </div>

        <div class="p-2.5 bg-elevated/30 rounded-lg text-xs space-y-1.5 border border-default">
          <div class="flex justify-between">
            <span class="text-muted">Total Orders:</span>
            <span class="font-bold text-highlighted">{{ cust.totalOrders }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted">Total Value:</span>
            <span class="font-bold text-emerald-500">₹{{ cust.totalSpent.toLocaleString('en-IN') }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted">Phone:</span>
            <span class="font-mono text-highlighted">{{ cust.phone }}</span>
          </div>
        </div>

        <div class="text-[11px] text-dimmed space-y-1 pt-1 border-t border-default/50">
          <p class="truncate"><span class="text-muted">Last Item:</span> {{ cust.lastOrder }}</p>
          <p class="truncate"><span class="text-muted">Address:</span> {{ cust.address }}, {{ cust.pincode }}</p>
        </div>
      </div>
    </div>

    <!-- TABLE VIEW (Responsive: Default on large screen `lg:block` under 'auto', or forced 'table') -->
    <div :class="activeView === 'auto' ? 'hidden lg:block' : (activeView === 'table' ? 'block' : 'hidden')">
      <UTable :data="filteredCustomers" :columns="customerColumns" :ui="tableUi">
        <template #name-cell="{ row }">
          <div class="flex items-center gap-2">
            <UAvatar :src="row.original.avatar" :alt="row.original.name" size="xs" />
            <span class="font-bold text-highlighted">{{ row.original.name }}</span>
          </div>
        </template>
        <template #handle-cell="{ row }">
          <a
            :href="igLink(row.original.handle)"
            target="_blank"
            class="flex items-center gap-1 font-medium text-primary hover:underline"
          >
            <UIcon name="i-simple-icons-instagram" class="size-3" />
            {{ row.original.handle }}
          </a>
        </template>
        <template #phone-cell="{ row }">
          <span class="font-mono text-highlighted">{{ row.original.phone }}</span>
        </template>
        <template #totalOrders-cell="{ row }">
          <span class="font-bold text-highlighted">{{ row.original.totalOrders }}</span>
        </template>
        <template #totalSpent-cell="{ row }">
          <span class="font-bold text-emerald-500">₹{{ Number(row.original.totalSpent).toLocaleString('en-IN') }}</span>
        </template>
        <template #address-cell="{ row }">
          <span class="block max-w-[220px] truncate text-dimmed">{{ row.original.address }}, {{ row.original.pincode }}</span>
        </template>
        <template #actions-cell="{ row }">
          <div class="text-right">
            <UButton
              :to="igLink(row.original.handle)"
              target="_blank"
              label="DM Buyer"
              icon="i-simple-icons-instagram"
              size="xs"
              color="neutral"
              variant="outline"
            />
          </div>
        </template>
        <template #empty>
          <div class="space-y-2 py-8 text-center text-xs text-dimmed">
            <UIcon name="i-lucide-users" class="mx-auto size-8 text-muted" />
            <p class="font-semibold">No matching customers found</p>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>