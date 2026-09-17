<script setup lang="ts">
import type { Conversation } from '~/composables/useConversations'

const props = defineProps<{
  conversations: Conversation[]
  activeId: string | null
  /** Instagram account linked → DMs arrive by themselves. */
  connected: boolean
  /** Realtime socket is up (vs. polling fallback). */
  live: boolean
}>()
const emit = defineEmits<{ select: [id: string], create: [] }>()

const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.conversations
  return props.conversations.filter(c =>
    c.name.toLowerCase().includes(q)
    || c.handle.toLowerCase().includes(q)
    || c.lastMessage.toLowerCase().includes(q)
  )
})
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="p-4 space-y-3 border-b border-default bg-background">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <UIcon name="i-simple-icons-instagram" class="size-5 text-pink-500 shrink-0" />
          <h2 class="text-base font-bold text-highlighted truncate">Instagram Sales DM</h2>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <UTooltip v-if="connected" :text="live ? 'Receiving DMs in real time' : 'Reconnecting… (polling)'">
            <UBadge :color="live ? 'success' : 'warning'" variant="subtle" size="xs" class="rounded-full">
              <span :class="['size-1.5 rounded-full mr-1', live ? 'bg-success animate-pulse' : 'bg-warning']" />
              Live
            </UBadge>
          </UTooltip>
          <UTooltip text="Simulate an incoming DM">
            <UButton icon="i-lucide-plus" size="xs" color="neutral" variant="outline" aria-label="New conversation" @click="emit('create')" />
          </UTooltip>
        </div>
      </div>
      <UInput v-model="search" icon="i-lucide-search" placeholder="Search DMs or buyer handle…" size="sm" class="w-full" />
    </div>

    <UEmpty
      v-if="conversations.length === 0"
      icon="i-lucide-inbox"
      title="No conversations yet"
      :description="connected ? 'DMs to your Instagram account will show up here automatically.' : 'Connect Instagram to sync DMs, or add one manually to try the workflow.'"
      variant="naked"
      class="flex-1"
      :actions="[{ label: 'New conversation', icon: 'i-lucide-plus', color: 'primary', onClick: () => emit('create') }]"
    />

    <UEmpty
      v-else-if="filtered.length === 0"
      icon="i-lucide-search-x"
      title="No matches"
      description="Try a different name or handle."
      variant="naked"
      size="sm"
      class="flex-1"
    />

    <div v-else class="flex-1 overflow-y-auto divide-y divide-default/50">
      <InboxConversationListItem
        v-for="chat in filtered"
        :key="chat.id"
        :conversation="chat"
        :active="chat.id === activeId"
        @click="emit('select', chat.id)"
      />
    </div>
  </div>
</template>
