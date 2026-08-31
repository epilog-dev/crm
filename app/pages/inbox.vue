<script lang="ts" setup>
import { ref, computed } from "vue";

useSeoMeta({
  title: "Instagram DM Inbox - Sales Workspace",
  description: "Unified Instagram DM sales inbox. Turn DMs into orders in 1 click.",
});

interface ChatMessage {
  id: number
  text: string
  sender: 'them' | 'me'
  time: string
}

interface Conversation {
  id: number
  name: string
  handle: string
  avatar: string
  platform: string
  lastMessage: string
  time: string
  unreadCount: number
  orderIds: string[] // Array of orders linked to this conversation
  messages: ChatMessage[]
}

// Mock conversations data with multiple order support
const conversations = ref<Conversation[]>([
  {
    id: 1,
    name: "Maria Santos",
    handle: "@maria",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    platform: "instagram",
    lastMessage: "I'll take it.",
    time: "10:24 AM",
    unreadCount: 1,
    orderIds: ["ORD-1082"],
    messages: [
      { id: 1, text: "Hi! How much for the Nike Vintage Windbreaker Jacket?", sender: "them", time: "10:20 AM" },
      { id: 2, text: "Hey @maria! It's ₹1,500 for size M. Excellent condition!", sender: "me", time: "10:22 AM" },
      { id: 3, text: "I'll take it.", sender: "them", time: "10:24 AM" },
    ]
  },
  {
    id: 2,
    name: "Rohan Gupta",
    handle: "@rohan_g",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    platform: "instagram",
    lastMessage: "Is the leather jacket still available?",
    time: "Yesterday",
    unreadCount: 0,
    orderIds: [],
    messages: [
      { id: 1, text: "Is the leather jacket still available?", sender: "them", time: "Yesterday, 3:15 PM" },
    ]
  },
  {
    id: 3,
    name: "Emily Watson",
    handle: "@emily_wats",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    platform: "instagram",
    lastMessage: "Order link confirmed! Sent shipping address.",
    time: "2 days ago",
    unreadCount: 0,
    orderIds: ["ORD-1079", "ORD-1042"],
    messages: [
      { id: 1, text: "I'll take the Silk Slip Dress (Emerald) in S!", sender: "them", time: "Aug 23, 11:00 AM" },
      { id: 2, text: "Awesome! Here is your order link: https://crm.app/order/ORD-1079", sender: "me", time: "Aug 23, 11:05 AM" },
      { id: 3, text: "Order link confirmed! Sent shipping address.", sender: "them", time: "Aug 23, 11:07 AM" },
    ]
  }
]);

const activeChatId = ref<number | null>(1);
const searchQuery = ref("");
const replyText = ref("");

// Create Order Modal state
const isOrderModalOpen = ref(false);
const orderForm = ref({
  item: "Nike Vintage Windbreaker Jacket",
  variant: "M",
  price: 1500,
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

// Select chat and clear unread
const selectChat = (id: number) => {
  activeChatId.value = id;
  const chat = conversations.value.find(c => c.id === id);
  if (chat) {
    chat.unreadCount = 0;
  }
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
const handleCreateOrder = () => {
  if (!activeChat.value) return;

  const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  activeChat.value.orderIds.unshift(newOrderId); // Add to customer's order history array

  const link = `${window.location.origin}/order/${newOrderId}`;
  const orderMessageText = `📦 Order created (#${newOrderId})!\nItem: ${orderForm.value.item}\nVariant: ${orderForm.value.variant}\nPrice: ₹${orderForm.value.price.toLocaleString('en-IN')}\n\nPlease click your unique order link to enter your shipping details and confirm:\n${link}`;

  activeChat.value.messages.push({
    id: activeChat.value.messages.length + 1,
    text: orderMessageText,
    sender: "me",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  activeChat.value.lastMessage = `Order Link Sent (#${newOrderId})`;
  activeChat.value.time = "Just now";

  isOrderModalOpen.value = false;
};

// Send standard message handler
const sendMessage = () => {
  if (!replyText.value.trim() || !activeChat.value) return;

  const text = replyText.value;
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  activeChat.value.messages.push({
    id: activeChat.value.messages.length + 1,
    text: text,
    sender: "me",
    time: timeString
  });

  activeChat.value.lastMessage = text;
  activeChat.value.time = timeString;
  replyText.value = "";
};
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
            <span class="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold">
              Meta API Live
            </span>
          </div>
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search DMs or buyer handle..."
            size="sm"
            class="w-full"
          />
        </div>

        <!-- Conversations list -->
        <div class="flex-1 overflow-y-auto divide-y divide-default/50">
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

            <div class="flex items-center gap-2">
              <!-- Linked Orders Badge list for repeat buyer -->
              <div v-if="activeChat.orderIds.length > 0" class="hidden sm:flex items-center gap-1">
                <UBadge v-for="id in activeChat.orderIds" :key="id" color="primary" variant="subtle">
                  {{ id }}
                </UBadge>
              </div>

              <!-- Open in Instagram App/Web direct action -->
              <UButton
                :to="`https://instagram.com/direct/t/${activeChat.handle.replace('@', '')}`"
                target="_blank"
                label="Message on Instagram"
                icon="i-simple-icons-instagram"
                color="neutral"
                variant="outline"
                size="sm"
                class="font-medium cursor-pointer"
              />

              <UButton
                label="+ Create Order"
                color="primary"
                size="sm"
                class="font-bold cursor-pointer shadow-xs"
                @click="openCreateOrderModal"
              />
            </div>
          </div>

          <!-- Messages Stream -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            <div
              v-for="msg in activeChat.messages"
              :key="msg.id"
              :class="[
                'flex flex-col max-w-[75%]',
                msg.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'
              ]"
            >
              <div
                :class="[
                  'rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line',
                  msg.sender === 'me'
                    ? 'bg-primary text-inverted rounded-tr-none'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-highlighted rounded-tl-none'
                ]"
              >
                {{ msg.text }}
              </div>
              <span class="text-[10px] text-dimmed mt-1 px-1">{{ msg.time }}</span>
            </div>
          </div>

          <!-- DM Input Form -->
          <div class="p-4 border-t border-default bg-background">
            <form @submit.prevent="sendMessage" class="flex gap-2 items-center">
              <UInput
                v-model="replyText"
                placeholder="Reply to Instagram DM..."
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
            <UButton type="submit" label="Generate & Send New Order Link" color="primary" class="font-bold cursor-pointer" />
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>
