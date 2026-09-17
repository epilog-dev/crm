<script setup lang="ts">
import type { SetupStep } from '~/components/dashboard/SetupChecklist.vue'

useSeoMeta({
  title: 'Sales Dashboard - Instagram DM Sales Workspace',
  description: 'Overview of Instagram DM sales, conversion rate, pending payments, and recent orders.'
})

const { store, fetchStore } = useStore()
const { orders, fetchOrders } = useOrders()
const { conversations, fetchConversations } = useConversations()

// After hydration on first load, immediately on client-side navigation.
onNuxtReady(() => {
  if (!store.value) fetchStore()
  fetchOrders()
  fetchConversations()
})

// Focus Mode: minimal, distraction-free view vs the full analytics dashboard.
const isFocusMode = ref(false)

const activeOrders = computed(() => orders.value.filter(o => o.status !== 'Cancelled'))
const pendingPaymentOrders = computed(() => activeOrders.value.filter(o => o.paymentStatus === 'Pending'))
const activeDmConversations = computed(() => conversations.value.filter(c => c.unreadCount > 0))

// Onboarding checklist derived from real account state.
const setupSteps = computed<SetupStep[]>(() => [
  {
    id: 1,
    title: 'Connect Instagram Business Account',
    description: 'Meta API linked for webhooks and DM sales workspace.',
    completed: !!store.value?.instagram_connected,
    link: '/settings',
    linkText: store.value?.instagram_connected ? 'Connected' : 'Connect now'
  },
  {
    id: 2,
    title: 'Receive Instagram DMs',
    description: 'Incoming customer messages auto-synced to sales inbox.',
    completed: conversations.value.length > 0,
    link: '/inbox',
    linkText: 'View inbox'
  },
  {
    id: 3,
    title: 'Create Order from Conversation',
    description: 'Generate unique order link directly inside DM chat.',
    completed: orders.value.length > 0,
    link: '/inbox',
    linkText: 'Create order'
  },
  {
    id: 4,
    title: 'Verify Payment & Print Courier Label',
    description: 'Check UPI screenshot / COD status and print shipping slip.',
    completed: orders.value.some(o => o.paymentStatus === 'Paid'),
    link: '/orders',
    linkText: 'Go to orders'
  }
])

const metrics = computed(() => ({
  totalSales: activeOrders.value.reduce((sum, o) => sum + o.price, 0),
  ordersCount: activeOrders.value.length,
  conversionRate: conversations.value.length
    ? `${Math.round((conversations.value.filter(c => c.orderIds.length > 0).length / conversations.value.length) * 100)}%`
    : '—',
  pendingPaymentAmount: pendingPaymentOrders.value.reduce((sum, o) => sum + o.price, 0),
  pendingPaymentCount: pendingPaymentOrders.value.length,
  activeDms: activeDmConversations.value.length
}))

const recentOrders = computed(() => orders.value.slice(0, 4))
const recentConversations = computed(() => conversations.value.slice(0, 4))
</script>

<template>
  <div class="p-4 md:p-6 space-y-6">
    <DashboardWelcomeBanner v-model:focus-mode="isFocusMode" />

    <DashboardFocusMode
      v-if="isFocusMode"
      :active-dms="metrics.activeDms"
      :pending-payment-count="metrics.pendingPaymentCount"
    />

    <template v-else>
      <DashboardSetupChecklist :steps="setupSteps" />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total DM Sales"
          :value="formatMoney(metrics.totalSales)"
          icon="i-lucide-indian-rupee"
          :hint="`${metrics.ordersCount} confirmed DM orders`"
        />
        <StatCard
          label="Awaiting Payment"
          :value="formatMoney(metrics.pendingPaymentAmount)"
          icon="i-lucide-clock"
          color="warning"
          hint="Buyers created link, payment pending"
        >
          <template #trailing>
            <span class="text-xs text-dimmed">({{ metrics.pendingPaymentCount }} orders)</span>
          </template>
        </StatCard>
        <StatCard
          label="DM → Order Conversion"
          :value="metrics.conversionRate"
          icon="i-lucide-trending-up"
          hint="DMs converted into order links"
        />
        <StatCard
          label="Active Sales DMs"
          :value="metrics.activeDms"
          icon="i-simple-icons-instagram"
          :hint="store?.instagram_connected ? 'Meta webhook live' : 'Instagram not connected yet'"
        >
          <template #trailing>
            <span class="text-xs text-pink-500 font-semibold">Unreplied</span>
          </template>
        </StatCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardRecentOrders :orders="recentOrders" class="lg:col-span-2" />
        <DashboardRecentConversations :conversations="recentConversations" />
      </div>
    </template>
  </div>
</template>
