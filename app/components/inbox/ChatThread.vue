<script setup lang="ts">
import type { Conversation } from '~/composables/useConversations'

const props = defineProps<{ conversation: Conversation, sending?: boolean }>()
const emit = defineEmits<{ back: [], send: [text: string], createOrder: [] }>()

const draft = ref('')
const messagesEl = ref<HTMLElement | null>(null)

function submit() {
  const text = draft.value.trim()
  if (!text) return
  emit('send', text)
  draft.value = ''
}

/** Puts a failed message back in the composer. */
function restoreDraft(text: string) {
  draft.value = text
}
defineExpose({ restoreDraft })

function scrollToBottom(behavior: ScrollBehavior) {
  nextTick(() => {
    const el = messagesEl.value
    if (el) el.scrollTo({ top: el.scrollHeight, behavior })
  })
}

// Jump on thread switch, glide on new bubbles.
watch(() => props.conversation.id, () => scrollToBottom('auto'), { immediate: true })
watch(() => props.conversation.messages.length, (len, prev) => {
  if (prev !== undefined && len > prev) scrollToBottom('smooth')
})
</script>

<template>
  <div class="flex flex-col h-full min-w-0">
    <!-- Header -->
    <div class="p-3 sm:p-4 border-b border-default flex items-center justify-between gap-2 bg-elevated/10">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="sm" class="md:hidden shrink-0" aria-label="Back to conversations" @click="emit('back')" />
        <CustomerUser :name="conversation.name" :handle="conversation.handle" :avatar="conversation.avatar" size="md" class="min-w-0" />
      </div>

      <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <UTooltip text="Open this thread in Instagram">
          <UButton
            :to="instagramDmUrl(conversation.handle)"
            target="_blank"
            icon="i-simple-icons-instagram"
            color="neutral"
            variant="outline"
            size="sm"
            aria-label="Message on Instagram"
          >
            <span class="hidden sm:inline">Message on IG</span>
          </UButton>
        </UTooltip>
        <UButton label="+ Order" color="primary" size="sm" @click="emit('createOrder')" />
      </div>
    </div>

    <!-- Messages -->
    <div ref="messagesEl" class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-4">
      <UAlert
        v-if="conversation.orderIds.length"
        icon="i-lucide-map-pin"
        color="success"
        variant="soft"
        :title="`${conversation.orderIds[0]} linked`"
        description="Delivery details are captured on the order link."
        :ui="{ title: 'text-xs font-bold', description: 'text-xs' }"
      />

      <UEmpty
        v-if="conversation.loaded && conversation.messages.length === 0"
        icon="i-lucide-message-square-dashed"
        title="No messages yet"
        description="Say hi, or create an order link for this buyer."
        variant="naked"
        size="sm"
      />

      <TransitionGroup name="msg" tag="div" class="space-y-4">
        <InboxMessageBubble v-for="msg in conversation.messages" :key="msg.id" :message="msg" />
      </TransitionGroup>
    </div>

    <!-- Composer -->
    <div class="p-3 border-t border-default bg-background">
      <UChatPrompt
        v-model="draft"
        placeholder="Type a reply… (Enter to send, Shift+Enter for a new line)"
        :rows="1"
        :maxrows="5"
        autoresize
        :disabled="sending"
        @submit="submit"
      >
        <UChatPromptSubmit :disabled="!draft.trim()" size="sm" />
      </UChatPrompt>
    </div>
  </div>
</template>

<style scoped>
.msg-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.msg-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.msg-leave-active {
  transition: opacity 0.15s ease;
}
.msg-leave-to {
  opacity: 0;
}
</style>
