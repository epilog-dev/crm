<script setup lang="ts">
import type { AppNotification } from '~/composables/useNotifications'

defineProps<{ notification: AppNotification }>()
const emit = defineEmits<{ dismiss: [], open: [] }>()
</script>

<template>
  <UCard
    variant="outline"
    :class="notification.read ? 'opacity-75' : 'ring-primary/40'"
    :ui="{ body: 'p-3.5 sm:p-3.5 space-y-1.5' }"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <UIcon :name="notification.icon" class="size-4 text-primary shrink-0" />
        <h4 class="font-bold text-xs text-highlighted truncate">{{ notification.title }}</h4>
      </div>
      <div class="flex items-center gap-1 shrink-0">
        <span class="text-[10px] text-dimmed">{{ formatRelativeTime(notification.createdAt) }}</span>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Dismiss notification"
          @click="emit('dismiss')"
        />
      </div>
    </div>

    <p class="text-xs text-dimmed leading-relaxed">{{ notification.message }}</p>

    <div v-if="notification.link" class="flex justify-end">
      <UButton
        :to="notification.link"
        label="View details"
        trailing-icon="i-lucide-arrow-right"
        color="primary"
        variant="link"
        size="xs"
        class="px-0"
        @click="emit('open')"
      />
    </div>
  </UCard>
</template>
