<script setup lang="ts">
import type { AppNotification } from '~/composables/useNotifications'

/** Bell button + slideover listing the seller's notifications. Polls while mounted. */
const POLL_INTERVAL_MS = 20000

const { notifications, unreadCount, fetchNotifications, markRead, markAllRead, dismiss } = useNotifications()
const open = ref(false)
let pollTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  fetchNotifications()
  pollTimer = setInterval(fetchNotifications, POLL_INTERVAL_MS)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

function openNotification(item: AppNotification) {
  markRead(item.id)
  open.value = false
}
</script>

<template>
  <USlideover
    v-model:open="open"
    title="Sales Notifications"
    description="Live updates on Instagram DMs, orders, and payments."
  >
    <UChip :show="unreadCount > 0" color="error" inset>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-bell"
        aria-label="Open notifications"
      />
    </UChip>

    <template #body>
      <div class="space-y-4">
        <div class="flex items-center justify-between text-xs">
          <span class="text-dimmed font-medium">{{ unreadCount }} unread</span>
          <UButton
            v-if="unreadCount > 0"
            label="Mark all as read"
            color="primary"
            variant="link"
            size="xs"
            class="px-0"
            @click="markAllRead"
          />
        </div>

        <div v-if="notifications.length" class="space-y-3">
          <NotificationsItem
            v-for="item in notifications"
            :key="item.id"
            :notification="item"
            @dismiss="dismiss(item.id)"
            @open="openNotification(item)"
          />
        </div>

        <UEmpty
          v-else
          icon="i-lucide-bell-off"
          title="All caught up!"
          description="No new sales or DM notifications."
          variant="naked"
        />
      </div>
    </template>
  </USlideover>
</template>
