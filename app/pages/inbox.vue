<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";

useSeoMeta({
  title: "Instagram DM Inbox - Sales Workspace",
  description: "Unified Instagram DM sales inbox. Turn DMs into orders in 1 click.",
});

const {
  conversations,
  fetchConversations,
  loadMessages,
  sendMessage: sendMessageApi,
  markRead,
  startConversation,
} = useConversations();
const { createOrder } = useOrders();

const activeChatId = ref<string | null>(null);
const searchQuery = ref("");
const replyText = ref("");
const isSendingOrder = ref(false);

// Create Order Modal state
const isOrderModalOpen = ref(false);
const orderForm = ref({
  item: "",
  variant: "",
  price: 0,
});

// New Conversation Modal state (simulates an incoming DM until the Meta webhook is wired up)
const isNewConversationModalOpen = ref(false);
const isStartingConversation = ref(false);
const newConversationForm = ref({
  handle: "",
  name: "",
  message: "",
});

const handleStartConversation = async () => {
  if (!newConversationForm.value.handle.trim()) return;
  isStartingConversation.value = true;
  try {
    await startConversation({
      handle: newConversationForm.value.handle,
      name: newConversationForm.value.name || undefined,
      message: newConversationForm.value.message || undefined,
    });
    const created = conversations.value.find(
      c => c.handle.replace('@', '') === newConversationForm.value.handle.replace('@', '')
    );
    if (created) await selectChat(created.id);
    newConversationForm.value = { handle: "", name: "", message: "" };
    isNewConversationModalOpen.value = false;
  } finally {
    isStartingConversation.value = false;
  }
};

onMounted(async () => {
  await fetchConversations();
  if (!activeChatId.value && conversations.value.length) {
    selectChat(conversations.value[0].id);
  }
});

// Computed selected chat
const activeChat = computed(() => {
  return conversations.value.find(c => c.id === activeChatId.value);
});

// Filtered conversations
const filteredConversations = computed(() => {
  return conversations.value.filter(c => {
    return c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           c.handle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           c.lastMessage.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// Select chat, lazy-load its messages, and clear unread
const selectChat = async (id: string) => {
  activeChatId.value = id;
  await Promise.all([loadMessages(id), markRead(id)]);
};

// Open Create Order Modal
const openCreateOrderModal = () => {
  orderForm.value = {
    item: '',
    variant: '',
    price: 0
  };
  isOrderModalOpen.value = true;
};

// Create Order Handler (Supports repeat orders for the same customer)
const toast = useToast();

const handleCreateOrder = async () => {
  if (!activeChat.value) return;

  isSendingOrder.value = true;
  try {
    const { autoLinked } = await createOrder({
      conversationId: activeChat.value.id,
      customer: { handle: activeChat.value.handle, name: activeChat.value.name, avatarUrl: activeChat.value.avatar },
      itemName: orderForm.value.item,
      variantLabel: orderForm.value.variant,
      price: orderForm.value.price,
    });

    await Promise.all([loadMessages(activeChat.value.id), fetchConversations()]);
    activeChatId.value = activeChat.value?.id ?? activeChatId.value;
    isOrderModalOpen.value = false;

    if (!autoLinked) {
      toast.add({
        title: 'Order created',
        description: 'Auto-Link DMs is off, so the link wasn\'t sent automatically. Use "Copy Order Link" to share it.',
        icon: 'i-lucide-link',
        color: 'neutral'
      });
    }
  } finally {
    isSendingOrder.value = false;
  }
};

// Send standard message handler
const sendMessage = async () => {
  if (!replyText.value.trim() || !activeChat.value) return;

  const text = replyText.value;
  replyText.value = "";
  await sendMessageApi(activeChat.value.id, text);
};

function copyOrderLink(text: string) {
  const match = text.match(/\/order\/(\S+)/);
  const code = match ? match[1] : '';
  navigator.clipboard.writeText(`${window.location.origin}/order/${code}`);
}
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0">
    <div class="flex flex-1 min-h-0 bg-background">
      <!-- Chat List Sidebar -->
      <div
        :class="[
          'w-full md:w-80 lg:w-96 border-r border-default flex flex-col bg-elevated/20 shrink-0',
          activeChatId !== null ? 'hidden md:flex' : 'flex'
        ]"
      >
        <div class="p-4 space-y-3 border-b border-default bg-background">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-simple-icons-instagram" class="size-5 text-pink-500" />
              <h2 class="text-base font-bold text-highlighted">Instagram Sales DM</h2>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold">
                Meta API Live
              </span>
              <UButton
                icon="i-lucide-plus"
                size="xs"
                color="neutral"
                variant="outline"
                class="cursor-pointer"
                title="Simulate an incoming DM"
                @click="isNewConversationModalOpen = true"
              />
            </div>
          </div>
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search DMs or buyer handle..."
            size="sm"
            class="w-full"
          />
        </div>

        <!-- Empty state: no conversations yet -->
        <div v-if="conversations.length === 0" class="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
          <div class="size-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <UIcon name="i-lucide-inbox" class="size-7 text-dimmed" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-highlighted">No conversations yet</h4>
            <p class="text-xs text-dimmed max-w-xs mx-auto mt-0.5">
              DMs will sync here automatically once Instagram is connected. For now, add one to try the workflow.
            </p>
          </div>
          <UButton
            label="+ New Conversation"
            size="sm"
            color="primary"
            class="font-bold cursor-pointer"
            @click="isNewConversationModalOpen = true"
          />
        </div>

        <!-- Conversations list -->
        <div v-else class="flex-1 overflow-y-auto divide-y divide-default/50">
          <div
            v-for="chat in filteredConversations"
            :key="chat.id"
            @click="selectChat(chat.id)"
            :class="[
              'flex gap-3 p-4 cursor-pointer transition-colors relative',
              activeChatId === chat.id
                ? 'bg-neutral-100 dark:bg-neutral-900 border-l-4 border-primary pl-3'
                : 'hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30'
            ]"
          >
            <UAvatar :src="chat.avatar" :alt="chat.name" size="md" class="mt-0.5" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1 mb-0.5">
                <span class="font-semibold text-sm truncate text-highlighted">
                  {{ chat.name }} <span class="text-xs font-normal text-dimmed">{{ chat.handle }}</span>
                </span>
                <span class="text-[11px] text-dimmed whitespace-nowrap">{{ chat.time }}</span>
              </div>
              <div class="flex items-center justify-between gap-1">
                <p class="text-xs text-dimmed truncate flex-1">{{ chat.lastMessage }}</p>

                <!-- Order Badges: Displays active order badge or count of repeat orders -->
                <div v-if="chat.orderIds.length > 0" class="flex items-center gap-1">
                  <UBadge color="success" variant="subtle" size="xs">
                    {{ chat.orderIds[0] }}
                  </UBadge>
                  <UBadge v-if="chat.orderIds.length > 1" color="neutral" variant="subtle" size="xs" title="Repeat Customer">
                    +{{ chat.orderIds.length - 1 }}
                  </UBadge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Chat Main View -->
      <div
        :class="[
          'flex-1 flex flex-col bg-background relative',
          activeChatId === null ? 'hidden md:flex' : 'flex'
        ]"
      >
        <template v-if="activeChat">
          <!-- Active Chat Topbar with [+ Create Order] -->
          <div class="p-4 border-b border-default flex items-center justify-between bg-elevated/10">
            <div class="flex items-center gap-3">
              <UButton
                icon="i-lucide-arrow-left"
                color="neutral"
                variant="ghost"
                size="sm"
                class="md:hidden cursor-pointer"
                @click="activeChatId = null"
              />
              <UAvatar :src="activeChat.avatar" :alt="activeChat.name" size="md" />
              <div>
                <h3 class="font-bold text-sm text-highlighted leading-tight flex items-center gap-1.5">
                  {{ activeChat.name }}
                  <span class="text-xs font-normal text-dimmed">{{ activeChat.handle }}</span>
                </h3>
                <span class="text-[11px] text-emerald-500 font-medium">Customer via Instagram DM</span>
              </div>
            </div>

            <div class="flex items-center gap-1.5 sm:gap-2">
              <!-- Linked Orders Badge list for repeat buyer -->
              <div v-if="activeChat.orderIds.length > 0" class="hidden md:flex items-center gap-1">
                <UBadge v-for="id in activeChat.orderIds" :key="id" color="primary" variant="subtle">
                  {{ id }}
                </UBadge>
              </div>

              <!-- Open in Instagram App/Web direct action -->
              <UButton
                :to="`https://instagram.com/direct/t/${activeChat.handle.replace('@', '')}`"
                target="_blank"
                icon="i-simple-icons-instagram"
                color="neutral"
                variant="outline"
                size="sm"
                class="font-medium cursor-pointer"
                title="Message on Instagram"
              >
                <span class="hidden sm:inline">Message on IG</span>
              </UButton>

              <UButton
                label="+ Order"
                color="primary"
                size="sm"
                class="font-bold cursor-pointer shadow-xs"
                @click="openCreateOrderModal"
              />
            </div>
          </div>

         <!-- Messages Stream with Customer Delivery Summary Banner -->
          <div class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4"> <!-- Customer Delivery Summary Banner (if active chat has order) -->
            <div v-if="activeChat.orderIds.length > 0" class="p-3 rounded-xl bg-elevated/40 border border-default text-xs flex items-center justify-between gap-3 shadow-xs">
              <div class="flex items-center gap-2 min-w-0">
                <UIcon name="i-lucide-map-pin" class="size-4 text-emerald-500 shrink-0" />
                <div class="min-w-0 truncate">
                  <span class="font-bold text-highlighted">Delivery Summary:</span>
                  <span class="text-dimmed ml-1">
                    Address details confirmed on order link
                  </span>
                </div>
              </div>
              <UBadge color="success" variant="subtle" size="xs" class="shrink-0 font-bold">
                {{ activeChat.orderIds[0] }} Linked
              </UBadge>
            </div>

            <div
              v-for="msg in activeChat.messages"
              :key="msg.id"
              :class="[
                'flex flex-col max-w-[88%] sm:max-w-[75%]',
                msg.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'
              ]"
            >
              <div
                :class="[
                  'rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line relative group',
                  msg.sender === 'me'
                    ? 'bg-primary text-inverted rounded-tr-none'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-highlighted rounded-tl-none'
                ]"
              >
                {{ msg.text }}

                <!-- 1-Click Copy Link Floating Button for Order Messages -->
                <button
                  v-if="msg.text.includes('/order/')"
                  type="button"
                  @click="copyOrderLink(msg.text)"
                  class="mt-2 text-[10px] px-2 py-0.5 rounded bg-background/20 hover:bg-background/40 font-bold flex items-center gap-1 cursor-pointer transition-all border border-white/20"
                >
                  <UIcon name="i-lucide-copy" class="size-3" />
                  <span>Copy Order Link</span>
                </button>
              </div>
              <span class="text-[10px] text-dimmed mt-1 px-1">{{ msg.time }}</span>
            </div>
          </div>

          <!-- DM Input Form with Quick Snippets Bar -->
          <div class="p-3 border-t border-default bg-background space-y-2">
            <!-- Quick Canned Snippets Chips -->
            <!-- <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span class="text-[11px] font-semibold text-muted shrink-0 mr-1">Quick Reply:</span>
              <button
                type="button"
                @click="replyText = 'Hi there! Yes, this item is currently in stock. Would you like me to reserve it for you?'"
                class="px-2.5 py-1 rounded-full bg-elevated/40 border border-default hover:border-primary/50 text-dimmed hover:text-highlighted whitespace-nowrap transition-all cursor-pointer"
              >
                📦 In Stock?
              </button>
              <button
                type="button"
                @click="replyText = 'Standard delivery takes 3-5 business days via express courier across India.'"
                class="px-2.5 py-1 rounded-full bg-elevated/40 border border-default hover:border-primary/50 text-dimmed hover:text-highlighted whitespace-nowrap transition-all cursor-pointer"
              >
                🚚 Delivery Time
              </button>
              <button
                type="button"
                @click="replyText = 'You can pay via UPI QR code or Cash on Delivery (COD) when confirming your order link.'"
                class="px-2.5 py-1 rounded-full bg-elevated/40 border border-default hover:border-primary/50 text-dimmed hover:text-highlighted whitespace-nowrap transition-all cursor-pointer"
              >
                💳 Payment Info
              </button>
              <button
                type="button"
                @click="openCreateOrderModal()"
                class="px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-600 dark:text-pink-400 font-semibold whitespace-nowrap transition-all cursor-pointer hover:bg-pink-500/20"
              >
                ⚡ Create Order Link
              </button>
            </div> -->

            <form @submit.prevent="sendMessage" class="flex gap-2 items-center">
              <UInput
                v-model="replyText"
                placeholder="Type reply or pick a quick snippet above..."
                size="md"
                class="flex-1"
              />
              <UButton
                type="submit"
                icon="i-lucide-send"
                color="primary"
                size="md"
                class="cursor-pointer"
                :disabled="!replyText.trim()"
              />
            </form>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal 6-8: [+ Create Order from Conversation] -->
    <UModal v-model:open="isOrderModalOpen" title="Create Order from DM" description="Turn confirmed customer DM into a tracked order link.">
      <template #body>
        <form @submit.prevent="handleCreateOrder" class="space-y-4">
          <div class="p-3 bg-elevated/40 rounded-lg border border-default space-y-1">
            <div class="flex justify-between items-center">
              <span class="text-xs text-muted">Customer (Auto-attached)</span>
              <span v-if="activeChat && activeChat.orderIds.length > 0" class="text-[11px] font-bold text-emerald-500">
                Repeat Buyer ({{ activeChat.orderIds.length }} previous orders)
              </span>
            </div>
            <p class="text-sm font-bold text-highlighted">{{ activeChat?.name }} ({{ activeChat?.handle }})</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-highlighted mb-1">Item Name</label>
            <UInput v-model="orderForm.item" placeholder="e.g. Vintage Denim Shirt" required class="w-full" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-highlighted mb-1">Variant (Size/Color)</label>
              <UInput v-model="orderForm.variant" placeholder="e.g. L / Blue" required class="w-full" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-highlighted mb-1">Price (₹)</label>
              <UInput v-model.number="orderForm.price" type="number" placeholder="1800" required class="w-full" />
            </div>
          </div>

          <div class="pt-2 flex justify-end gap-2">
            <UButton label="Cancel" color="neutral" variant="ghost" @click="isOrderModalOpen = false" />
            <UButton type="submit" label="Generate & Send New Order Link" color="primary" class="font-bold cursor-pointer" :loading="isSendingOrder" />
          </div>
        </form>
      </template>
    </UModal>

    <!-- Simulate Incoming DM Modal (stand-in until the Meta webhook is wired up) -->
    <UModal v-model:open="isNewConversationModalOpen" title="Simulate an Incoming DM" description="Add a conversation manually to try the workflow before Instagram is connected.">
      <template #body>
        <form @submit.prevent="handleStartConversation" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-highlighted mb-1">Instagram Handle</label>
            <UInput v-model="newConversationForm.handle" placeholder="e.g. @maria" required class="w-full" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-highlighted mb-1">Display Name (optional)</label>
            <UInput v-model="newConversationForm.name" placeholder="e.g. Maria Santos" class="w-full" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-highlighted mb-1">First Message (optional)</label>
            <UTextarea v-model="newConversationForm.message" placeholder="e.g. How much for the jacket?" class="w-full" :rows="3" />
          </div>
          <div class="pt-2 flex justify-end gap-2">
            <UButton label="Cancel" color="neutral" variant="ghost" @click="isNewConversationModalOpen = false" />
            <UButton type="submit" label="Start Conversation" color="primary" class="font-bold cursor-pointer" :loading="isStartingConversation" />
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>
