<script setup lang="ts">
import { ref, computed } from 'vue'

useSeoMeta({
  title: 'Sales Dashboard - Instagram DM Sales Workspace',
  description: 'Overview of Instagram DM sales, conversion rate, pending payments, and recent orders.'
})

// Focus Mode (Minimalist ADHD-friendly mode vs Full Analytics)
const isFocusMode = ref(false)

// Interactive Onboarding Checklist Steps
const setupSteps = ref([
  {
    id: 1,
    title: 'Connect Instagram Business Account',
    description: 'Meta API linked for webhooks and DM sales workspace.',
    completed: true,
    link: '/settings',
    linkText: 'Connected'
  },
  {
    id: 2,
    title: 'Receive Instagram DMs',
    description: 'Incoming customer messages auto-synced to sales inbox.',
    completed: true,
    link: '/inbox',
    linkText: 'View Inbox'
  },
  {
    id: 3,
    title: 'Create Order from Conversation',
    description: 'Generate unique order link directly inside DM chat.',
    completed: true,
    link: '/inbox',
    linkText: 'Create Order'
  },
  {
    id: 4,
    title: 'Verify Payment & Print Courier Label',
    description: 'Check UPI screenshot / COD status and print shipping slip.',
    completed: false,
    link: '/orders',
    linkText: 'Go to Orders'
  }
])

const completedStepsCount = computed(() => setupSteps.value.filter(s => s.completed).length)
const progressPercentage = computed(() => Math.round((completedStepsCount.value / setupSteps.value.length) * 100))

// Seller Tiers (Based on completed order count)
const sellerTiers = [
  { name: 'Emerging Seller', minOrders: 0, badge: '🌱 Tier 1', color: 'neutral' },
  { name: 'DM Pro', minOrders: 10, badge: '🥈 Tier 2', color: 'info' },
  { name: 'Power Store', minOrders: 30, badge: '🥇 Tier 3', color: 'warning' },
  { name: 'Instagram Elite', minOrders: 100, badge: '👑 Tier 4', color: 'success' }
]

const currentOrderCount = ref(32) // Mock completed orders
const currentTier = computed(() => {
  return [...sellerTiers].reverse().find(t => currentOrderCount.value >= t.minOrders) || sellerTiers[0]
})

// Unlockable Achievement Badges
const achievements = ref([
  {
    id: 'first_order',
    title: 'First DM Order',
    description: 'Created & sent your first DM order link',
    icon: 'i-lucide-party-popper',
    unlocked: true,
    unlockedAt: 'Aug 16'
  },
  {
    id: 'dm_converter',
    title: 'Fast Converter',
    description: 'Achieved 40%+ DM to Order conversion',
    icon: 'i-lucide-zap',
    unlocked: true,
    unlockedAt: 'Aug 24'
  },
  {
    id: 'power_store',
    title: 'Power Store',
    description: 'Crossed 30+ confirmed sales',
    icon: 'i-lucide-award',
    unlocked: true,
    unlockedAt: 'Aug 29'
  },
  {
    id: 'century_club',
    title: '100 DM Club',
    description: 'Fulfill 100 Instagram DM orders',
    icon: 'i-lucide-crown',
    unlocked: false,
    unlockedAt: 'Locked'
  }
])

const isStoryModalOpen = ref(false)
const selectedShareBadge = ref<any>(null)

function openShareBadgeModal(badge: any) {
  selectedShareBadge.value = badge
  isStoryModalOpen.value = true
}

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

      <div class="flex items-center gap-3 shrink-0 flex-wrap">
        <!-- Focus Mode Toggle Switch -->
        <div class="flex items-center gap-2 p-1.5 rounded-xl border border-default bg-background">
          <button
            type="button"
            @click="isFocusMode = !isFocusMode"
            :class="[
              'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              isFocusMode ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-700'
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                isFocusMode ? 'translate-x-4' : 'translate-x-0'
              ]"
            />
          </button>
          <span class="text-xs font-bold text-highlighted flex items-center gap-1">
            <UIcon name="i-lucide-sparkles" class="size-3.5 text-amber-500" />
            Focus Mode
          </span>
        </div>

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

    <!-- MINIMALIST FOCUS MODE VIEW (Clean, distraction-free view with zero noise) -->
    <div v-if="isFocusMode" class="p-8 rounded-2xl border border-primary/30 bg-primary/5 text-center space-y-6 max-w-2xl mx-auto my-6 shadow-sm">
      <div class="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
        <UIcon name="i-lucide-sparkles" class="size-8" />
      </div>

      <div class="space-y-1">
        <h3 class="text-xl font-extrabold text-highlighted">Focus Mode Active</h3>
        <p class="text-xs text-dimmed">Distraction-free workspace. Zero analytics noise, metrics, or cluttered charts.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        <!-- Action 1: Inbox -->
        <NuxtLink to="/inbox" class="p-5 rounded-xl border border-default bg-background hover:border-primary transition-all space-y-2 group">
          <div class="flex items-center justify-between">
            <UIcon name="i-simple-icons-instagram" class="size-6 text-pink-500" />
            <UBadge color="primary" variant="subtle" size="xs">8 Active DMs</UBadge>
          </div>
          <h4 class="font-bold text-sm text-highlighted group-hover:text-primary">1. Reply & Create Orders</h4>
          <p class="text-xs text-dimmed">Chat with buyers in DM & generate 1-click order links.</p>
        </NuxtLink>

        <!-- Action 2: Orders -->
        <NuxtLink to="/orders" class="p-5 rounded-xl border border-default bg-background hover:border-primary transition-all space-y-2 group">
          <div class="flex items-center justify-between">
            <UIcon name="i-lucide-shopping-bag" class="size-6 text-emerald-500" />
            <UBadge color="warning" variant="subtle" size="xs">3 Pending Payment</UBadge>
          </div>
          <h4 class="font-bold text-sm text-highlighted group-hover:text-primary">2. Fulfill Orders & Print Slips</h4>
          <p class="text-xs text-dimmed">Verify UPI payments & print 4x6 courier labels.</p>
        </NuxtLink>
      </div>
    </div>

    <!-- STANDARD FULL DASHBOARD VIEW (Checklists + Metrics + Tables) -->
    <template v-else>
      <!-- Seller Onboarding & Flow Progress Checklist -->
      <div class="p-5 rounded-2xl border border-default bg-background space-y-4 shadow-xs">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="font-bold text-base text-highlighted flex items-center gap-2">
            <UIcon name="i-lucide-list-checks" class="size-5 text-primary" />
            Seller Setup & Sales Flow Progress
          </h3>
          <p class="text-xs text-dimmed mt-0.5">Complete these core steps to start turning Instagram DMs into fulfilled sales.</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <span class="text-xs font-bold text-highlighted">{{ completedStepsCount }} of {{ setupSteps.length }} Completed</span>
            <p class="text-[10px] text-dimmed">{{ progressPercentage }}% Setup Progress</p>
          </div>
          <UBadge color="primary" variant="subtle" size="md" class="font-bold">
            {{ progressPercentage }}%
          </UBadge>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
        <div
          class="bg-primary h-full transition-all duration-500 rounded-full"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>

      <!-- Checklist Items Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        <div
          v-for="step in setupSteps"
          :key="step.id"
          :class="[
            'p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2',
            step.completed
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-primary/40 bg-primary/5 ring-1 ring-primary/20'
          ]"
        >
          <div class="flex items-start gap-2.5">
            <button
              type="button"
              @click="step.completed = !step.completed"
              :class="[
                'size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer text-xs font-bold',
                step.completed ? 'bg-emerald-500 text-white' : 'border-2 border-primary text-transparent hover:border-primary/80'
              ]"
            >
              ✓
            </button>
            <div class="space-y-0.5">
              <h4 :class="['text-xs font-bold leading-tight', step.completed ? 'line-through text-dimmed' : 'text-highlighted']">
                {{ step.id }}. {{ step.title }}
              </h4>
              <p class="text-[11px] text-dimmed leading-snug">{{ step.description }}</p>
            </div>
          </div>

          <div class="pt-2 flex justify-between items-center border-t border-default/50 text-[11px]">
            <span :class="step.completed ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-amber-500 font-medium'">
              {{ step.completed ? 'Step Completed' : 'Action Required' }}
            </span>
            <NuxtLink
              :to="step.link"
              class="text-primary font-bold hover:underline flex items-center gap-0.5"
            >
              {{ step.linkText }} →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- SELLER TIER RANK & UNLOCKABLE ACHIEVEMENT BADGES -->
      <div class="p-5 rounded-2xl border border-default bg-background space-y-4 shadow-xs">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-extrabold text-xl shrink-0">
              🏆
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-base text-highlighted">Seller Rank: {{ currentTier.name }}</h3>
                <UBadge :color="currentTier.color" variant="subtle" size="xs" class="font-bold">
                  {{ currentTier.badge }}
                </UBadge>
              </div>
              <p class="text-xs text-dimmed mt-0.5">
                Processed <strong>{{ currentOrderCount }} DM Orders</strong> • Next Rank: <strong>Instagram Elite</strong> at 100 Orders
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <span class="text-dimmed">Level Progress:</span>
            <div class="w-32 bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
              <div class="bg-amber-500 h-full rounded-full" style="width: 32%"></div>
            </div>
            <span class="font-bold text-highlighted">32%</span>
          </div>
        </div>

        <!-- Unlockable Badges Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-default/60">
          <div
            v-for="badge in achievements"
            :key="badge.id"
            :class="[
              'p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2 relative',
              badge.unlocked
                ? 'border-amber-500/40 bg-amber-500/5'
                : 'border-default bg-elevated/10 opacity-60'
            ]"
          >
            <div class="flex items-start gap-2.5">
              <div
                :class="[
                  'size-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold',
                  badge.unlocked ? 'bg-amber-500 text-white shadow-xs' : 'bg-neutral-200 dark:bg-neutral-800 text-dimmed'
                ]"
              >
                <UIcon :name="badge.icon" class="size-4" />
              </div>
              <div class="min-w-0">
                <h4 class="text-xs font-bold text-highlighted leading-tight truncate flex items-center gap-1">
                  {{ badge.title }}
                  <span v-if="badge.unlocked" class="text-[10px] text-amber-500">✓</span>
                </h4>
                <p class="text-[11px] text-dimmed leading-snug mt-0.5">{{ badge.description }}</p>
              </div>
            </div>

            <div class="pt-2 flex justify-between items-center border-t border-default/50 text-[10px]">
              <span :class="badge.unlocked ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-dimmed'">
                {{ badge.unlocked ? `Unlocked ${badge.unlockedAt}` : '🔒 Locked' }}
              </span>

              <button
                v-if="badge.unlocked"
                type="button"
                @click="openShareBadgeModal(badge)"
                class="text-primary font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Share to IG Story 📲
              </button>
            </div>
          </div>
        </div>
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
  </template>

    <!-- SHAREABLE INSTAGRAM STORY BADGE MODAL -->
    <UModal v-model:open="isStoryModalOpen" title="Share Milestone to Instagram Story">
      <template #body>
        <div v-if="selectedShareBadge" class="space-y-4 text-center p-2">
          <!-- Graphic Preview Card designed for Instagram Story Screenshotting -->
          <div class="p-6 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 text-white shadow-xl space-y-4 max-w-xs mx-auto border border-white/20">
            <div class="size-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-2xl">
              🏆
            </div>

            <div class="space-y-1">
              <span class="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Verified Seller Milestone
              </span>
              <h3 class="text-xl font-extrabold tracking-tight mt-1">{{ selectedShareBadge.title }}</h3>
              <p class="text-xs text-white/80">{{ selectedShareBadge.description }}</p>
            </div>

            <div class="pt-3 border-t border-white/20 flex items-center justify-between text-[11px] font-semibold text-white/90">
              <span>@thrift_store_india</span>
              <span class="bg-black/30 px-2 py-0.5 rounded">Plum Verified</span>
            </div>
          </div>

          <p class="text-xs text-dimmed">
            Screenshot or copy this graphic card to post on your store's Instagram Story to build trust with buyers!
          </p>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton label="Close" color="neutral" variant="outline" @click="isStoryModalOpen = false" />
          <UButton
            label="Copy Story Graphic"
            icon="i-lucide-copy"
            color="primary"
            class="font-bold cursor-pointer"
            @click="isStoryModalOpen = false"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
