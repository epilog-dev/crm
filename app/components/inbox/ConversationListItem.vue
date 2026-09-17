<script setup lang="ts">
import type { Conversation } from '~/composables/useConversations'

defineProps<{ conversation: Conversation, active: boolean }>()
</script>

<template>
  <button
    type="button"
    :class="[
      'w-full text-left flex gap-3 p-4 transition-colors border-l-4',
      active
        ? 'bg-elevated border-primary'
        : 'border-transparent hover:bg-elevated/50'
    ]"
  >
    <UChip :show="conversation.unreadCount > 0" color="primary" inset>
      <UAvatar :src="conversation.avatar || undefined" :alt="conversation.name" size="md" />
    </UChip>
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-1 mb-0.5">
        <span class="font-semibold text-sm truncate text-highlighted">
          {{ conversation.name }} <span class="text-xs font-normal text-dimmed">{{ conversation.handle }}</span>
        </span>
        <span class="text-[11px] text-dimmed whitespace-nowrap">{{ conversation.time }}</span>
      </div>
      <div class="flex items-center justify-between gap-1">
        <p :class="['text-xs truncate flex-1', conversation.unreadCount > 0 ? 'text-highlighted font-medium' : 'text-dimmed']">
          {{ conversation.lastMessage }}
        </p>
        <div v-if="conversation.orderIds.length > 0" class="flex items-center gap-1 shrink-0">
          <UBadge color="success" variant="subtle" size="xs">{{ conversation.orderIds[0] }}</UBadge>
          <UTooltip v-if="conversation.orderIds.length > 1" text="Repeat customer">
            <UBadge color="neutral" variant="subtle" size="xs">+{{ conversation.orderIds.length - 1 }}</UBadge>
          </UTooltip>
        </div>
      </div>
    </div>
  </button>
</template>
