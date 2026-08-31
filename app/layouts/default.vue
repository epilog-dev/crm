<script lang="ts" setup>
import { ref, computed } from 'vue'

const { user, navItems, userMenuItems } = useNavigation();

useSeoMeta({
  title: "Instagram DM Sales Workspace",
  description: "Turn your Instagram DMs into organized orders.",
});

// Notifications Store for Instagram DM Sales activity
interface Notification {
  id: number
  type: 'order' | 'payment' | 'dm' | 'system'
  title: string
  message: string
  time: string
  read: boolean
  link?: string
  badgeColor: 'primary' | 'success' | 'warning' | 'info'
  icon: string
}

const notifications = ref<Notification[]>([
  {
    id: 1,
    type: 'payment',
    title: 'Payment Screenshot Uploaded!',
    message: '@maria uploaded UPI payment receipt for order #ORD-1082 (₹1,500). Please verify.',
    time: '5 mins ago',
    read: false,
    link: '/orders',
    badgeColor: 'success',
    icon: 'i-lucide-receipt'
  },
  {
    id: 2,
    type: 'order',
    title: 'New Order Confirmed',
    message: '@priya_s confirmed delivery address for #ORD-1079 (Silk Slip Dress).',
    time: '25 mins ago',
    read: false,
    link: '/orders',
    badgeColor: 'primary',
    icon: 'i-lucide-shopping-bag'
  },
  {
    id: 3,
    type: 'dm',
    title: 'New High-Intent DM',
    message: '@rohan_g sent a message: "Is the leather jacket still available?"',
    time: '1 hour ago',
    read: false,
    link: '/inbox',
    badgeColor: 'info',
    icon: 'i-simple-icons-instagram'
  },
  {
    id: 4,
    type: 'system',
    title: 'Meta API Webhook Active',
    message: 'Instagram Professional account @thrift_store_india is receiving DMs live.',
    time: '3 hours ago',
    read: true,
    link: '/settings',
    badgeColor: 'info',
    icon: 'i-lucide-check-circle-2'
  }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function markAllAsRead() {
  notifications.value.forEach(n => n.read = true)
}

const isNotificationsOpen = ref(false)

function handleNotificationClick(item: Notification) {
  item.read = true
  isNotificationsOpen.value = false
}

const customSearchGroups = [
  {
    id: "actions",
    label: "Quick Actions",
    items: [
      {
        id: "inbox",
        label: "Open Sales DM Inbox",
        icon: "i-lucide-inbox",
        to: "/inbox",
      },
      {
        id: "orders",
        label: "View Orders Workspace",
        icon: "i-lucide-shopping-bag",
        to: "/orders",
      },
      {
        id: "settings",
        label: "Instagram Integration",
        icon: "i-simple-icons-instagram",
        to: "/settings",
      }
    ],
  }
];
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible :menu="{ ui: { content: 'max-w-xs' } }" :ui="{
      root: 'bg-background border-r border-default',
      content: 'bg-background dark:bg-neutral-900 border-r border-default'
    }" resizable>
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2.5 font-semibold text-lg">
          <div
            class="flex size-7 items-center justify-center rounded-lg bg-primary text-inverted font-bold text-sm shrink-0">
            P
          </div>
          <span v-if="!collapsed" class="tracking-tight text-highlighted text-sm font-bold">Plum</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" :groups="customSearchGroups"
          class="bg-transparent ring-default" />
        <UNavigationMenu popover tooltip :items="navItems" class="w-full justify-center" orientation="vertical"
          :collapsed="collapsed" />
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu :items="userMenuItems">
          <UButton v-bind="{
            ...user,
            label: collapsed ? undefined : user?.name,
            trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
          }" color="neutral" variant="ghost" block :square="collapsed" class="data-[state=open]:bg-elevated"
            :ui="{ trailingIcon: 'text-dimmed' }" />
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <UDashboardNavbar>
        <template #left>
          <UDashboardSidebarCollapse class="cursor-pointer" />
          <h1 class="font-semibold text-sm md:text-base text-highlighted">{{ $route.meta.title || "Sales Workspace" }}</h1>
        </template>

        <template #right>
          <!-- NOTIFICATIONS SLIDEOVER -->
          <USlideover v-model:open="isNotificationsOpen" title="Sales Notifications" description="Live updates on Instagram DMs, orders, and payments.">
            <div class="relative inline-flex">
              <UButton color="neutral" variant="ghost" icon="i-lucide-bell" aria-label="Open notifications"
                class="cursor-pointer" />
              <UBadge
                v-if="unreadCount > 0"
                color="error"
                variant="solid"
                size="xs"
                class="absolute top-0 -right-1 rounded-full p-0 h-2 w-2 min-w-0"
              />
            </div>

            <template #body>
              <div class="space-y-4">
                <!-- Action Header inside Slideover -->
                <div class="flex items-center justify-between pb-3 border-b border-default text-xs">
                  <span class="text-dimmed font-medium">{{ unreadCount }} unread notifications</span>
                  <button
                    v-if="unreadCount > 0"
                    @click="markAllAsRead"
                    class="text-primary font-bold hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>

                <!-- Notifications List -->
                <div v-if="notifications.length > 0" class="space-y-3">
                  <div
                    v-for="item in notifications"
                    :key="item.id"
                    :class="[
                      'p-3.5 rounded-xl border transition-all relative space-y-1.5',
                      item.read
                        ? 'bg-background border-default opacity-75'
                        : 'bg-elevated/40 border-primary/40 ring-1 ring-primary/20'
                    ]"
                  >
                    <div class="flex items-start justify-between gap-2">
                      <div class="flex items-center gap-2 min-w-0">
                        <UIcon :name="item.icon" class="size-4 text-primary shrink-0" />
                        <h4 class="font-bold text-xs text-highlighted truncate">{{ item.title }}</h4>
                      </div>
                      <div class="flex items-center gap-1.5 shrink-0">
                        <span class="text-[10px] text-dimmed">{{ item.time }}</span>
                        <button
                          @click="clearNotification(item.id)"
                          class="text-dimmed hover:text-highlighted p-0.5 cursor-pointer"
                          title="Dismiss"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <p class="text-xs text-dimmed leading-relaxed">{{ item.message }}</p>

                    <div v-if="item.link" class="pt-1.5 border-t border-default/50 flex justify-end">
                      <NuxtLink
                        :to="item.link"
                        @click="handleNotificationClick(item)"
                        class="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        View Details →
                      </NuxtLink>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="py-12 text-center space-y-2">
                  <UIcon name="i-lucide-bell-off" class="size-8 text-dimmed mx-auto" />
                  <p class="text-sm font-semibold text-highlighted">All caught up!</p>
                  <p class="text-xs text-dimmed">No new sales or DM notifications.</p>
                </div>
              </div>
            </template>
          </USlideover>

          <UColorModeButton class="cursor-pointer" />
        </template>
      </UDashboardNavbar>

      <div class="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <slot />
      </div>
    </UDashboardPanel>
    <UDashboardSearch :groups="customSearchGroups" />
  </UDashboardGroup>
</template>
