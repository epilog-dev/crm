<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import type { AppNotification } from '~/composables/useNotifications'

const { user, navItems, userMenuItems } = useNavigation();

useSeoMeta({
  title: "Instagram DM Sales Workspace",
  description: "Turn your Instagram DMs into organized orders.",
});

const { notifications, unreadCount, fetchNotifications, markRead, markAllRead, dismiss } = useNotifications()

const POLL_INTERVAL_MS = 20000
let pollTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  fetchNotifications()
  pollTimer = setInterval(fetchNotifications, POLL_INTERVAL_MS)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

function markAllAsRead() {
  markAllRead()
}

function clearNotification(id: string) {
  dismiss(id)
}

const isNotificationsOpen = ref(false)

function handleNotificationClick(item: AppNotification) {
  markRead(item.id)
  isNotificationsOpen.value = false
}

function formatNotificationTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
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
      root: 'bg-neutral-100/70 dark:bg-neutral-900/90 border-r border-default',
      content: 'bg-neutral-100/70 dark:bg-neutral-900/90 border-r border-default'
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
          <!-- Meta API Live Connection Health Badge -->
          <NuxtLink to="/settings" class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all">
            <span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Meta API Live (@thrift_store_india)</span>
          </NuxtLink>

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
                        <span class="text-[10px] text-dimmed">{{ formatNotificationTime(item.createdAt) }}</span>
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
