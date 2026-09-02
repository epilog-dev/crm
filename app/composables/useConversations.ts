/* eslint-disable @typescript-eslint/no-explicit-any -- mapping raw Supabase rows */
export interface ChatMessage {
  id: string
  text: string
  sender: 'them' | 'me'
  time: string
}

export interface Conversation {
  id: string
  name: string
  handle: string
  avatar: string
  platform: string
  lastMessage: string
  time: string
  unreadCount: number
  orderIds: string[]
  messages: ChatMessage[]
}

function formatTime(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function mapConversation(row: any): Conversation {
  return {
    id: row.id,
    name: row.instagram_name || row.instagram_handle,
    handle: `@${row.instagram_handle}`,
    avatar: row.avatar_url || '',
    platform: row.platform || 'instagram',
    lastMessage: row.last_message_preview || '',
    time: formatTime(row.last_message_at),
    unreadCount: row.unread_count || 0,
    orderIds: (row.orders || []).map((o: any) => o.order_code),
    messages: []
  }
}

function mapMessage(row: any): ChatMessage {
  return {
    id: row.id,
    text: row.body,
    sender: row.sender === 'seller' ? 'me' : 'them',
    time: formatTime(row.created_at)
  }
}

export function useConversations() {
  const conversations = useState<Conversation[]>('conversations', () => [])
  const pending = useState<boolean>('conversationsPending', () => false)

  async function fetchConversations() {
    pending.value = true
    try {
      const data = await $fetch<any[]>('/api/conversations')
      const existingMessages = new Map(conversations.value.map(c => [c.id, c.messages]))
      conversations.value = data.map((row) => {
        const mapped = mapConversation(row)
        mapped.messages = existingMessages.get(mapped.id) || []
        return mapped
      })
      return conversations.value
    } finally {
      pending.value = false
    }
  }

  async function loadMessages(conversationId: string) {
    const data = await $fetch<any[]>(`/api/conversations/${conversationId}/messages`)
    const mapped = data.map(mapMessage)
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (conversation) conversation.messages = mapped
    return mapped
  }

  async function sendMessage(conversationId: string, text: string) {
    const created = await $fetch<any>(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: { body: text }
    })
    const mapped = mapMessage(created)
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (conversation) {
      conversation.messages.push(mapped)
      conversation.lastMessage = text
      conversation.time = mapped.time
    }
    return mapped
  }

  async function markRead(conversationId: string) {
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (conversation && conversation.unreadCount > 0) {
      conversation.unreadCount = 0
      await $fetch(`/api/conversations/${conversationId}`, { method: 'PATCH', body: { unread_count: 0 } })
    }
  }

  async function startConversation(payload: { handle: string, name?: string, message?: string }) {
    await $fetch<any>('/api/conversations', { method: 'POST', body: payload })
    return fetchConversations()
  }

  return {
    conversations,
    pending,
    fetchConversations,
    loadMessages,
    sendMessage,
    markRead,
    startConversation
  }
}
