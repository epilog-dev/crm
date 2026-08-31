<script setup lang="ts">
import { ref, computed } from 'vue'

useSeoMeta({
  title: 'Customers CRM - Instagram DM Buyers',
  description: 'Buyer directory created automatically from Instagram DMs and confirmed order links.'
})

const customers = ref([
  {
    id: 'CUST-01',
    name: 'Maria Santos',
    handle: '@maria',
    phone: '9876543210',
    address: '12 Green Park, Bandra West',
    pincode: '400050',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    totalOrders: 2,
    totalSpent: 3100,
    lastOrder: 'Nike Vintage Windbreaker',
    platform: 'Instagram DM'
  },
  {
    id: 'CUST-02',
    name: 'Priya Sharma',
    handle: '@priya_s',
    phone: '9876543211',
    address: 'Flat 402, Sunshine Apartments, MG Road, Bengaluru',
    pincode: '560001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    totalOrders: 1,
    totalSpent: 2400,
    lastOrder: 'Silk Slip Dress (Emerald)',
    platform: 'Instagram DM'
  },
  {
    id: 'CUST-03',
    name: 'Marcus Chen',
    handle: '@marcus_c',
    phone: '9876543212',
    address: '77 Park Street, Kolkata',
    pincode: '700016',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    totalOrders: 3,
    totalSpent: 8500,
    lastOrder: 'Raw Denim Jacket',
    platform: 'Instagram DM'
  },
  {
    id: 'CUST-04',
    name: 'Chloe Bennett',
    handle: '@chloeb',
    phone: '9876543213',
    address: '45 Jubilee Hills, Hyderabad',
    pincode: '500033',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100',
    totalOrders: 1,
    totalSpent: 1800,
    lastOrder: 'Chunky Knit Sweater',
    platform: 'Instagram DM'
  }
])

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
  <div class="p-6 space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-highlighted">Instagram DM Buyers Directory</h2>
        <p class="text-xs text-dimmed">Customers are automatically added when they confirm their unique order link.</p>
      </div>

      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Search by buyer handle, name, phone..."
        class="w-72"
      />
    </div>

    <!-- Customers Grid Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div
        v-for="cust in filteredCustomers"
        :key="cust.id"
        class="p-4 bg-background border border-default rounded-xl space-y-3 shadow-xs hover:border-highlighted/30 transition-all"
      >
        <div class="flex items-center gap-3">
          <UAvatar :src="cust.avatar" :alt="cust.name" size="md" />
          <div class="min-w-0 flex-1">
            <h3 class="font-bold text-sm text-highlighted truncate">{{ cust.name }}</h3>
            <p class="text-xs text-primary font-medium truncate">{{ cust.handle }}</p>
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
  </div>
</template>