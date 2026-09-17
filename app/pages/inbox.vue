<script lang="ts" setup>
import { LazyInboxCreateOrderModal, LazyInboxNewConversationModal } from '#components'
import type InboxChatThread from '~/components/inbox/ChatThread.vue'

useSeoMeta({
  title: 'Instagram DM Inbox - Sales Workspace',
  description: 'Unified Instagram DM sales inbox. Turn DMs into orders in 1 click.'
})

const {
  conversations,
  realtimeConnected,
  activeId: activeChatId,
  fetchConversations,
  loadMessages,
  sendMessage,
  markRead
} = useConversations()
const { store, fetchStore } = useStore()
const toast = useToast()
const overlay = useOverlay()
const route = useRoute()

const activeChat = computed(() => conversations.value.find(c => c.id === activeChatId.value))
const thread = ref<InstanceType<typeof InboxChatThread> | null>(null)
const sending = ref(false)

// `?c=<id>` opens a specific thread -- the DM pop-up's "Open" action uses it.
const requestedChatId = computed(() => (typeof route.query.c === 'string' ? route.query.c : null))

onMounted(async () => {
  activeChatId.value = null
  await Promise.all([fetchConversations(), store.value ? Promise.resolve() : fetchStore()])
  if (requestedChatId.value && conversations.value.some(c => c.id === requestedChatId.value)) {
    selectChat(requestedChatId.value)
    return
  }
  // Desktop shows list + thread side by side, so open the newest thread. On
  // phones the thread replaces the list, so land on the list instead.
  const sideBySide = window.matchMedia('(min-width: 768px)').matches
  if (sideBySide && !activeChatId.value && conversations.value[0]) selectChat(conversations.value[0].id)
})

watch(requestedChatId, (id) => {
  if (id && id !== activeChatId.value && conversations.value.some(c => c.id === id)) selectChat(id)
})

// The realtime channel lives in the layout; just make sure global DM alerts
// don't treat a thread as "being viewed" once we leave the page.
onUnmounted(() => {
  activeChatId.value = null
})

async function selectChat(id: string) {
  activeChatId.value = id
  await Promise.all([loadMessages(id), markRead(id)])
}

// The thread on screen is by definition read. Inbound DMs bump unread_count
// server-side and that update streams back over realtime, so react to the
// count rather than to the message event itself.
watch(() => activeChat.value?.unreadCount, (count) => {
  if (count && activeChatId.value) markRead(activeChatId.value)
})

async function send(text: string) {
  if (!activeChat.value) return
  sending.value = true
  try {
    await sendMessage(activeChat.value.id, text)
  } catch (err) {
    thread.value?.restoreDraft(text)
    toast.add({
      title: 'Message not sent',
      description: errorMessage(err),
      icon: 'i-lucide-alert-triangle',
      color: 'error'
    })
  } finally {
    sending.value = false
  }
}

const createOrderModal = overlay.create(LazyInboxCreateOrderModal)
const newConversationModal = overlay.create(LazyInboxNewConversationModal)

async function openCreateOrder() {
  if (!activeChat.value) return
  const result = await createOrderModal.open({ conversation: activeChat.value }).result
  if (!result) return

  await Promise.all([loadMessages(activeChat.value.id), fetchConversations()])

  if (result.dmError) {
    toast.add({
      title: `Order ${result.orderCode} created, but the DM failed`,
      description: `Instagram didn't accept the message (${result.dmError}). Use "Copy order link" to share it manually.`,
      icon: 'i-lucide-alert-triangle',
      color: 'warning'
    })
  } else if (!result.autoLinked) {
    toast.add({
      title: `Order ${result.orderCode} created`,
      description: 'Auto-Link DMs is off, so the link wasn\'t sent automatically. Use "Copy order link" to share it.',
      icon: 'i-lucide-link',
      color: 'neutral'
    })
  } else {
    toast.add({ title: `Order ${result.orderCode} sent`, icon: 'i-lucide-check', color: 'success' })
  }
}

async function openNewConversation() {
  const handle = await newConversationModal.open().result
  if (!handle) return
  const created = conversations.value.find(c => c.handle.replace(/^@/, '') === handle)
  if (created) await selectChat(created.id)
}

function errorMessage(err: unknown) {
  const e = err as { data?: { message?: string }, message?: string }
  return e?.data?.message || e?.message || 'Something went wrong'
}
</script>

<template>
  <div class="flex flex-1 min-h-0 bg-background">
    <aside
      :class="[
        'w-full md:w-80 lg:w-96 border-r border-default shrink-0 bg-elevated/20',
        activeChatId !== null ? 'hidden md:block' : 'block'
      ]"
    >
      <InboxConversationList
        :conversations="conversations"
        :active-id="activeChatId"
        :connected="!!store?.instagram_connected"
        :live="realtimeConnected"
        @select="selectChat"
        @create="openNewConversation"
      />
    </aside>

    <main :class="['flex-1 min-w-0', activeChatId === null ? 'hidden md:block' : 'block']">
      <InboxChatThread
        v-if="activeChat"
        ref="thread"
        :conversation="activeChat"
        :sending="sending"
        @back="activeChatId = null"
        @send="send"
        @create-order="openCreateOrder"
      />
      <UEmpty
        v-else
        icon="i-lucide-messages-square"
        title="Pick a conversation"
        description="Select a DM thread on the left to read and reply."
        variant="naked"
        class="h-full"
      />
    </main>
  </div>
</template>
