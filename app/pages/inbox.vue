<script lang="ts" setup>
import { ref, computed } from "vue";
import type { TabsItem } from "@nuxt/ui";

useSeoMeta({
  title: "Inbox - Plum CRM",
  description: "Unified Inbox for WhatsApp and Instagram.",
});

// Tab definition
const tabs = ref<TabsItem[]>([
  {
    label: "All",
    value: "all",
    icon: "i-lucide-layout-grid",
  },
  {
    label: "WhatsApp",
    value: "whatsapp",
    icon: "i-simple-icons-whatsapp",
  },
  {
    label: "Instagram",
    value: "instagram",
    icon: "i-simple-icons-instagram",
  },
]);

const activeTab = ref("all");
const searchQuery = ref("");
const replyText = ref("");

// Mock conversations data
const conversations = ref([
  {
    id: 1,
    name: "Sarah Jenkins",
    handle: "@sarah_j",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    platform: "instagram",
    lastMessage: "Is this item still available in medium?",
    time: "10:24 AM",
    unreadCount: 2,
    messages: [
      { id: 1, text: "Hi there! I saw your post about the new linen shirts.", sender: "them", time: "10:20 AM" },
      { id: 2, text: "Hello! Yes, they are currently in stock.", sender: "me", time: "10:22 AM" },
      { id: 3, text: "Is this item still available in medium?", sender: "them", time: "10:24 AM" },
    ]
  },
  {
    id: 2,
    name: "Alex Rivera",
    handle: "+1 (555) 019-2834",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    platform: "whatsapp",
    lastMessage: "Perfect, sending the payment details now.",
    time: "Yesterday",
    unreadCount: 0,
    messages: [
      { id: 1, text: "Hey, do you support local pickup?", sender: "them", time: "Yesterday, 3:15 PM" },
      { id: 2, text: "Yes we do! Pickup is available daily from 9 AM to 6 PM.", sender: "me", time: "Yesterday, 3:18 PM" },
      { id: 3, text: "Perfect, sending the payment details now.", sender: "them", time: "Yesterday, 3:20 PM" },
    ]
  },
  {
    id: 3,
    name: "Emily Watson",
    handle: "@emily_wats",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    platform: "instagram",
    lastMessage: "Thanks for the quick response! Can't wait to get it.",
    time: "2 days ago",
    unreadCount: 0,
    messages: [
      { id: 1, text: "Hey! When will my order ship?", sender: "them", time: "Aug 23, 11:00 AM" },
      { id: 2, text: "Hi Emily! It has been dispatched and should arrive tomorrow. Tracking ID: PLM88941", sender: "me", time: "Aug 23, 11:05 AM" },
      { id: 3, text: "Thanks for the quick response! Can't wait to get it.", sender: "them", time: "Aug 23, 11:07 AM" },
    ]
  },
  {
    id: 4,
    name: "Michael Chen",
    handle: "+65 9123 4567",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    platform: "whatsapp",
    lastMessage: "Can I customize the order with my logo?",
    time: "3 days ago",
    unreadCount: 1,
    messages: [
      { id: 1, text: "Hi, I would like to make a bulk order of 50 mugs.", sender: "them", time: "Aug 22, 2:30 PM" },
      { id: 2, text: "Can I customize the order with my logo?", sender: "them", time: "Aug 22, 2:32 PM" },
    ]
  }
]);

const activeChatId = ref<number | null>(null);

// Computed selected chat
const activeChat = computed(() => {
  return conversations.value.find(c => c.id === activeChatId.value);
});

// Filtered conversations
const filteredConversations = computed(() => {
  return conversations.value.filter(c => {
    const matchesTab = activeTab.value === "all" || c.platform === activeTab.value;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          c.lastMessage.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesTab && matchesSearch;
  });
});

// Select chat and clear its unread count
const selectChat = (id: number) => {
  activeChatId.value = id;
  const chat = conversations.value.find(c => c.id === id);
  if (chat) {
    chat.unreadCount = 0;
  }
};

// Send Message handler
const sendMessage = () => {
  if (!replyText.value.trim() || !activeChat.value) return;

  const text = replyText.value;
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add outgoing message
  activeChat.value.messages.push({
    id: activeChat.value.messages.length + 1,
    text: text,
    sender: "me",
    time: timeString
  });

  // Update conversation info
  activeChat.value.lastMessage = text;
  activeChat.value.time = timeString;

  const currentChatId = activeChat.value.id;
  replyText.value = "";

  // Simulate receiving a reply in 2 seconds
  setTimeout(() => {
    const targetChat = conversations.value.find(c => c.id === currentChatId);
    if (targetChat) {
      const incomingText = `Thank you for your response! (Simulated response to: "${text.substring(0, 15)}...")`;
      targetChat.messages.push({
        id: targetChat.messages.length + 1,
        text: incomingText,
        sender: "them",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      targetChat.lastMessage = incomingText;
      targetChat.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (activeChatId.value !== currentChatId) {
        targetChat.unreadCount++;
      }
    }
  }, 2000);
};
</script>

<template>
  <div class="flex h-[calc(100vh-4rem)] border border-default rounded-lg overflow-hidden bg-background">
    <!-- Sidebar / Chat List -->
    <div
      :class="[
        'w-full md:w-80 lg:w-96 border-r border-default flex flex-col bg-elevated/20 shrink-0',
        activeChatId !== null ? 'hidden md:flex' : 'flex'
      ]"
    >
      <!-- Search and Tabs Header -->
      <div class="p-4 space-y-3 border-b border-default bg-background">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-highlighted">Messages</h2>
          <span class="text-xs px-2 py-0.5 rounded-full bg-neutral/10 dark:bg-neutral/85 text-muted font-medium">
            {{ conversations.reduce((acc, c) => acc + c.unreadCount, 0) }} unread
          </span>
        </div>
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search chats or messages..."
          size="sm"
          class="w-full"
        />
        <div class="flex gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer',
              activeTab === tab.value
                ? 'bg-background shadow-xs text-highlighted'
                : 'text-dimmed hover:text-highlighted'
            ]"
          >
            <UIcon :name="tab.icon" class="size-3.5" />
            <span>{{ tab.label }}</span>
          </button>
        </div>
      </div>

      <!-- Conversations List -->
      <div class="flex-1 overflow-y-auto divide-y divide-default/50">
        <div
          v-for="chat in filteredConversations"
          :key="chat.id"
          @click="selectChat(chat.id)"
          :class="[
            'flex gap-3 p-4 cursor-pointer transition-colors relative',
            activeChatId === chat.id
              ? 'bg-neutral-50 dark:bg-neutral-900 border-l-4 border-primary pl-3'
              : 'hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30'
          ]"
        >
          <UAvatar :src="chat.avatar" :alt="chat.name" size="md" class="mt-0.5" />
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1 mb-0.5">
              <span class="font-semibold text-sm truncate text-highlighted">
                {{ chat.name }}
              </span>
              <span class="text-xs text-dimmed whitespace-nowrap">
                {{ chat.time }}
              </span>
            </div>
            
            <div class="flex items-center justify-between gap-1">
              <p class="text-xs text-dimmed truncate flex-1">
                {{ chat.lastMessage }}
              </p>
              
              <div class="flex items-center gap-1.5 shrink-0">
                <UIcon
                  :name="chat.platform === 'whatsapp' ? 'i-simple-icons-whatsapp' : 'i-simple-icons-instagram'"
                  :class="[
                    'size-3.5',
                    chat.platform === 'whatsapp' ? 'text-green-500' : 'text-pink-500'
                  ]"
                />
                <span
                  v-if="chat.unreadCount > 0"
                  class="size-4 flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-inverted"
                >
                  {{ chat.unreadCount }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredConversations.length === 0" class="p-8 text-center text-muted text-sm">
          No conversations found.
        </div>
      </div>
    </div>

    <!-- Active Chat Window -->
    <div
      :class="[
        'flex-1 flex flex-col bg-background relative',
        activeChatId === null ? 'hidden md:flex' : 'flex'
      ]"
    >
      <template v-if="activeChat">
        <!-- Chat Header -->
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
              <h3 class="font-bold text-sm text-highlighted leading-tight">{{ activeChat.name }}</h3>
              <div class="flex items-center gap-1 mt-0.5">
                <UIcon
                  :name="activeChat.platform === 'whatsapp' ? 'i-simple-icons-whatsapp' : 'i-simple-icons-instagram'"
                  :class="[
                    'size-3',
                    activeChat.platform === 'whatsapp' ? 'text-green-500' : 'text-pink-500'
                  ]"
                />
                <span class="text-xs text-dimmed">{{ activeChat.handle }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-1">
            <UButton icon="i-lucide-phone" color="neutral" variant="ghost" size="sm" class="cursor-pointer" />
            <UButton icon="i-lucide-video" color="neutral" variant="ghost" size="sm" class="cursor-pointer" />
            <UButton icon="i-lucide-more-vertical" color="neutral" variant="ghost" size="sm" class="cursor-pointer" />
          </div>
        </div>

        <!-- Message Logs -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-doodle">
          <div
            v-for="msg in activeChat.messages"
            :key="msg.id"
            :class="[
              'flex flex-col max-w-[70%]',
              msg.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'
            ]"
          >
            <div
              :class="[
                'rounded-2xl px-4 py-2.5 text-sm',
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

        <!-- Input Box -->
        <div class="p-4 border-t border-default bg-background">
          <form @submit.prevent="sendMessage" class="flex gap-2 items-center">
            <UButton icon="i-lucide-paperclip" color="neutral" variant="ghost" size="md" class="cursor-pointer shrink-0" />
            <UButton icon="i-lucide-smile" color="neutral" variant="ghost" size="md" class="cursor-pointer shrink-0" />
            <UInput
              v-model="replyText"
              placeholder="Type your message here..."
              size="md"
              class="flex-1"
              autofocus
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

      <!-- Empty State -->
      <template v-else>
        <div class="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div class="size-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <UIcon name="i-lucide-message-square" class="size-8 text-dimmed" />
          </div>
          <h3 class="text-lg font-bold text-highlighted">No active conversation</h3>
          <p class="text-sm text-dimmed max-w-sm mt-1">
            Select a contact from the list on the left to start viewing messages and replying.
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.bg-doodle {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%23737373' stroke-width='0.8' stroke-opacity='0.08'%3E%3Cpath d='M10 15a3 3 0 0 1 6 0c0 3-6 6-6 6s-6-3-6-6a3 3 0 0 1 6 0z'/%3E%3Cpath d='M40 30h8v6l-3-3h-5z'/%3E%3Cpath d='M80 20l3 3 6-6'/%3E%3Ccircle cx='85' cy='65' r='3'/%3E%3Cpath d='M20 70l4-4'/%3E%3Cpath d='M50 75a4 4 0 0 0 8 0'/%3E%3Cpath d='M15 45c3 0 3 3 6 3s3-3 6-3'/%3E%3C/g%3E%3C/svg%3E");
  background-size: 120px 120px;
}

.dark .bg-doodle {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.8' stroke-opacity='0.04'%3E%3Cpath d='M10 15a3 3 0 0 1 6 0c0 3-6 6-6 6s-6-3-6-6a3 3 0 0 1 6 0z'/%3E%3Cpath d='M40 30h8v6l-3-3h-5z'/%3E%3Cpath d='M80 20l3 3 6-6'/%3E%3Ccircle cx='85' cy='65' r='3'/%3E%3Cpath d='M20 70l4-4'/%3E%3Cpath d='M50 75a4 4 0 0 0 8 0'/%3E%3Cpath d='M15 45c3 0 3 3 6 3s3-3 6-3'/%3E%3C/g%3E%3C/svg%3E");
}
</style>
