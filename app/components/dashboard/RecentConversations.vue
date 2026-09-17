<script setup lang="ts">
import type { Conversation } from '~/composables/useConversations'

defineProps<{ conversations: Conversation[] }>()
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-bold text-base text-highlighted flex items-center gap-2">
        <UIcon name="i-lucide-message-square" class="size-4 text-pink-500" />
        Live Instagram DMs
      </h3>
      <UButton to="/inbox" label="Open inbox" trailing-icon="i-lucide-arrow-right" variant="link" size="xs" class="px-0" />
    </div>

    <UCard variant="outline" :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">
      <div
        v-for="dm in conversations"
        :key="dm.id"
        class="p-3 flex items-center justify-between gap-2 hover:bg-elevated/20 transition-colors"
      >
        <div class="min-w-0 flex-1">
          <CustomerUser :name="dm.name" :handle="dm.handle" :avatar="dm.avatar" size="sm" />
          <p class="text-xs text-dimmed truncate mt-1 pl-9">{{ dm.lastMessage }}</p>
        </div>
        <UButton
          v-if="dm.orderIds.length === 0"
          to="/inbox"
          label="+ Order"
          size="xs"
          color="primary"
          variant="subtle"
          class="shrink-0"
        />
        <UBadge v-else color="success" variant="subtle" size="xs" class="shrink-0">Linked</UBadge>
      </div>

      <UEmpty
        v-if="conversations.length === 0"
        icon="i-lucide-inbox"
        title="No conversations yet"
        description="DMs land here once Instagram is connected."
        variant="naked"
        size="sm"
      />
    </UCard>

    <UAlert
      icon="i-lucide-sparkles"
      color="neutral"
      variant="soft"
      title="Core flow"
      description="DM → buyer says “I'll take it” → you click + Order → buyer fills delivery info → you mark the payment Paid."
      :ui="{ title: 'text-xs font-bold', description: 'text-xs' }"
    />
  </div>
</template>
