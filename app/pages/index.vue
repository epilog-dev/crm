<script setup lang="ts">
import { ref } from 'vue'

useSeoMeta({
  title: 'Sales Dashboard - Instagram DM Sales Workspace',
  description: 'Overview of Instagram DM sales, conversion rate, pending payments, and recent orders.'
})

// Metrics & Analytics
const metrics = ref({
  totalSales: 48500,
  ordersCount: 32,
  conversionRate: '42%',
  pendingPaymentAmount: 3900,
  pendingPaymentCount: 3,
  activeDms: 8
})

// Quick Recent Activity / Orders
const recentOrders = ref([
  {
    id: 'ORD-1082',
    handle: '@maria',
    item: 'Nike Vintage Windbreaker Jacket',
    price: 1500,
    status: 'Confirmed',
    paymentStatus: 'Pending',
    time: '10 mins ago',
    link: '/order/ORD-1082'
  },
  {
    id: 'ORD-1079',
    handle: '@priya_s',
    item: 'Silk Slip Dress (Emerald)',
    price: 2400,
    status: 'Awaiting Payment',
    paymentStatus: 'Pending',
    time: '1 hour ago',
    link: '/order/ORD-1079'
  },
  {
    id: 'ORD-1076',
    handle: '@marcus_c',
    item: 'Raw Denim Jacket',
    price: 3200,
    status: 'Paid',
    paymentStatus: 'Paid',
    time: '3 hours ago',
    link: '/order/ORD-1076'
  },
  {
    id: 'ORD-1071',
    handle: '@chloeb',
    item: 'Chunky Knit Sweater',
    price: 1800,
    status: 'Shipped',
    paymentStatus: 'Paid',
    time: 'Yesterday',
    link: '/order/ORD-1071'
  }
])

// Recent DM Activity
const activeDmsList = ref([
  {
    id: 1,
    name: 'Maria Santos',
    handle: '@maria',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    lastMessage: 'I\'ll take it.',
    time: '10:24 AM',
    hasOrder: true,
    orderId: 'ORD-1082'
  },
  {
    id: 2,
    name: 'Rohan Gupta',
    handle: '@rohan_g',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    lastMessage: 'Is the leather jacket still available?',
    time: 'Yesterday',
    hasOrder: false
  },
  {
    id: 4,
    name: 'Aisha Khan',
    handle: '@aisha_k',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
    lastMessage: 'Can you send the order link for the boots?',
    time: '2 hours ago',
    hasOrder: false
  }
])
</script>

<template>
  <div class="p-4 md:p-6 space-y-6">
    <!-- Top Welcome Banner -->
    <div class="p-6 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-default flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <UIcon name="i-simple-icons-instagram" class="size-6 text-pink-500" />
          <h2 class="text-xl font-bold text-highlighted">Instagram Sales Overview</h2>
        </div>
        <p class="text-sm text-dimmed mt-1">
          Turn Instagram DMs into organized orders. <strong>No storefront or catalog needed.</strong>
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <UButton
          to="/inbox"
          label="Open Sales DM Inbox"
          icon="i-lucide-message-square"
          color="primary"
          size="md"
          class="font-bold cursor-pointer shadow-xs"
        />
        <UButton
          to="/orders"
          label="View Orders"
          icon="i-lucide-shopping-bag"
          color="neutral"
          variant="outline"
          size="md"
          class="cursor-pointer"
        />
      </div>
    </div>

    <!-- 4 KPI Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Sales -->
      <div class="p-5 bg-background border border-default rounded-xl space-y-2">
        <div class="flex items-center justify-between text-muted">
          <span class="text-xs font-medium">Total DM Sales</span>
          <UIcon name="i-lucide-indian-rupee" class="size-4 text-emerald-500" />
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-extrabold text-highlighted">₹{{ metrics.totalSales.toLocaleString('en-IN') }}</span>
          <span class="text-xs font-semibold text-emerald-500">+18% this week</span>
        </div>
        <p class="text-[11px] text-dimmed">{{ metrics.ordersCount }} confirmed DM orders</p>
      </div>

      <!-- Pending Payment -->
      <div class="p-5 bg-background border border-default rounded-xl space-y-2">
        <div class="flex items-center justify-between text-muted">
          <span class="text-xs font-medium text-amber-500">Awaiting Payment</span>
          <UIcon name="i-lucide-clock" class="size-4 text-amber-500" />
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-extrabold text-amber-500">₹{{ metrics.pendingPaymentAmount.toLocaleString('en-IN') }}</span>
          <span class="text-xs text-dimmed">({{ metrics.pendingPaymentCount }} orders)</span>
        </div>
        <p class="text-[11px] text-dimmed">Buyers created link, payment pending</p>
      </div>

      <!-- DM Conversion Rate -->
      <div class="p-5 bg-background border border-default rounded-xl space-y-2">
        <div class="flex items-center justify-between text-muted">
          <span class="text-xs font-medium">DM → Order Conversion</span>
          <UIcon name="i-lucide-trending-up" class="size-4 text-indigo-500" />
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-extrabold text-highlighted">{{ metrics.conversionRate }}</span>
          <span class="text-xs text-emerald-500 font-semibold">High intent</span>
        </div>
        <p class="text-[11px] text-dimmed">DMs converted into order links</p>
      </div>

      <!-- Active Instagram DMs -->
      <div class="p-5 bg-background border border-default rounded-xl space-y-2">
        <div class="flex items-center justify-between text-muted">
          <span class="text-xs font-medium">Active Sales DMs</span>
          <UIcon name="i-simple-icons-instagram" class="size-4 text-pink-500" />
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-extrabold text-highlighted">{{ metrics.activeDms }}</span>
          <span class="text-xs text-pink-500 font-semibold">Unreplied / In progress</span>
        </div>
        <p class="text-[11px] text-dimmed">Meta Webhook live connected</p>
      </div>
    </div>

    <!-- Main Content Grid (Recent Orders & Active Sales DMs) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Recent DM Orders Table (2 Cols) -->
      <div class="lg:col-span-2 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-base text-highlighted flex items-center gap-2">
            <UIcon name="i-lucide-shopping-bag" class="size-4 text-primary" />
            Recent DM Orders
          </h3>
          <NuxtLink to="/orders" class="text-xs text-primary font-semibold hover:underline">
            View All Orders →
          </NuxtLink>
        </div>

        <div class="border border-default rounded-xl overflow-hidden bg-background">
          <table class="w-full text-left text-xs">
            <thead class="bg-elevated/50 border-b border-default text-muted uppercase font-semibold">
              <tr>
                <th class="p-3">Order ID</th>
                <th class="p-3">Customer</th>
                <th class="p-3">Item</th>
                <th class="p-3">Price</th>
                <th class="p-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-default">
              <tr
                v-for="ord in recentOrders"
                :key="ord.id"
                class="hover:bg-elevated/20 transition-colors"
              >
                <td class="p-3 font-mono font-bold text-highlighted">
                  <NuxtLink :to="ord.link" class="hover:underline text-primary">
                    {{ ord.id }}
                  </NuxtLink>
                </td>
                <td class="p-3 font-medium text-highlighted">
                  {{ ord.handle }}
                </td>
                <td class="p-3 text-dimmed truncate max-w-[150px]">
                  {{ ord.item }}
                </td>
                <td class="p-3 font-bold text-highlighted">
                  ₹{{ ord.price.toLocaleString('en-IN') }}
                </td>
                <td class="p-3">
                  <UBadge
                    :color="ord.status === 'Paid' ? 'success' : ord.status === 'Awaiting Payment' ? 'warning' : 'neutral'"
                    variant="subtle"
                    size="xs"
                  >
                    {{ ord.status }}
                  </UBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Sales Inbox Sidebar (1 Col) -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-base text-highlighted flex items-center gap-2">
            <UIcon name="i-lucide-message-square" class="size-4 text-pink-500" />
            Live Instagram DMs
          </h3>
          <NuxtLink to="/inbox" class="text-xs text-primary font-semibold hover:underline">
            Open Inbox →
          </NuxtLink>
        </div>

        <div class="border border-default rounded-xl bg-background divide-y divide-default">
          <div
            v-for="dm in activeDmsList"
            :key="dm.id"
            class="p-3 flex items-center justify-between gap-2 hover:bg-elevated/20 transition-colors"
          >
            <div class="flex items-center gap-3 min-w-0">
              <UAvatar :src="dm.avatar" :alt="dm.name" size="sm" />
              <div class="min-w-0">
                <div class="flex items-center gap-1">
                  <span class="font-bold text-xs text-highlighted truncate">{{ dm.name }}</span>
                  <span class="text-[10px] text-dimmed">{{ dm.handle }}</span>
                </div>
                <p class="text-xs text-dimmed truncate">{{ dm.lastMessage }}</p>
              </div>
            </div>

            <div class="shrink-0 text-right">
              <UButton
                v-if="!dm.hasOrder"
                to="/inbox"
                label="+ Order"
                size="xs"
                color="primary"
                variant="subtle"
                class="font-semibold cursor-pointer"
              />
              <UBadge v-else color="success" variant="subtle" size="xs">
                Linked
              </UBadge>
            </div>
          </div>
        </div>

        <!-- Core Philosophy Reminder Card -->
        <div class="p-4 rounded-xl border border-default bg-elevated/30 space-y-2 text-xs">
          <h4 class="font-bold text-highlighted flex items-center gap-1.5">
            <UIcon name="i-lucide-sparkles" class="size-4 text-amber-500" />
            Core Flow Philosophy
          </h4>
          <p class="text-dimmed leading-relaxed">
            DM → Customer says <em>"I'll take it"</em> → Seller clicks <strong>+ Create Order</strong> → Customer enters delivery info → Seller updates payment manually (`Pending` → `Paid`).
          </p>
        </div>
      </div>

    </div>
  </div>
</template>
