<script setup lang="ts">
import type { ChatMessage } from '~/composables/useConversations'

/**
 * One DM bubble. Kept custom rather than on UChatMessage: that component is
 * built around AI streaming (user/assistant roles, streaming status) and its
 * auto-scroll only fires while "streaming", which doesn't fit a human thread.
 */
const props = defineProps<{ message: ChatMessage }>()

const mine = computed(() => props.message.sender === 'me')

const orderLink = computed(() => {
  const match = props.message.text.match(/\/order\/([A-Za-z0-9-]+)/)
  if (!match) return null
  return import.meta.client ? `${window.location.origin}/order/${match[1]}` : `/order/${match[1]}`
})
</script>

<template>
  <div
    :class="[
      'flex flex-col max-w-[88%] sm:max-w-[75%] transition-opacity duration-300',
      mine ? 'ml-auto items-end' : 'mr-auto items-start',
      message.pending ? 'opacity-60' : 'opacity-100'
    ]"
  >
    <div
      :class="[
        'rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line break-words [overflow-wrap:anywhere]',
        mine ? 'bg-primary text-inverted rounded-tr-none' : 'bg-elevated text-highlighted rounded-tl-none'
      ]"
    >
      {{ message.text }}
      <div v-if="orderLink" class="mt-2">
        <CopyButton
          :text="orderLink"
          label="Copy order link"
          success-message="Order link copied"
          :color="mine ? 'neutral' : 'primary'"
          :variant="mine ? 'solid' : 'subtle'"
        />
      </div>
    </div>
    <span class="text-[10px] text-dimmed mt-1 px-1 flex items-center gap-1">
      <UIcon v-if="message.pending" name="i-lucide-clock" class="size-2.5" />
      {{ message.pending ? 'Sending…' : message.time }}
    </span>
  </div>
</template>
