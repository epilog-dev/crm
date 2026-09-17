/* eslint-disable @typescript-eslint/no-explicit-any -- mapping raw Supabase rows */
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface ChatMessage {
  id: string
  text: string
  sender: 'them' | 'me'
  time: string
  createdAt: string
  /** Optimistic message that hasn't been confirmed by the server yet. */
  pending?: boolean
}

export interface Conversation {
  id: string
  name: string
  handle: string
  avatar: string
  platform: string
  lastMessage: string
  time: string
  lastMessageAt: string | null
  unreadCount: number
  orderIds: string[]
  messages: ChatMessage[]
  /** Messages have been fetched at least once for this thread. */
  loaded: boolean
}

// Polling fallback in case the realtime socket drops or isn't available.
const LIST_POLL_MS = 20000

function mapConversation(row: any): Conversation {
  return {
    id: row.id,
    name: row.instagram_name || row.instagram_handle,
    handle: `@${row.instagram_handle}`,
    avatar: row.avatar_url || '',
    platform: row.platform || 'instagram',
    lastMessage: row.last_message_preview || '',
    time: formatTime(row.last_message_at),
    lastMessageAt: row.last_message_at ?? null,
    unreadCount: row.unread_count || 0,
    orderIds: (row.orders || []).map((o: any) => o.order_code),
    messages: [],
    loaded: false
  }
}

function mapMessage(row: any): ChatMessage {
  return {
    id: row.id,
    text: row.body,
    sender: row.sender === 'seller' ? 'me' : 'them',
    time: formatTime(row.created_at),
    createdAt: row.created_at
  }
}

function sortByRecency(list: Conversation[]) {
  list.sort((a, b) => (b.lastMessageAt ?? '').localeCompare(a.lastMessageAt ?? ''))
}

export function useConversations() {
  const conversations = useState<Conversation[]>('conversations', () => [])
  const pending = useState<boolean>('conversationsPending', () => false)
  const realtimeConnected = useState<boolean>('conversationsRealtime', () => false)

  function find(id: string) {
    return conversations.value.find(c => c.id === id)
  }

  async function fetchConversations() {
    pending.value = true
    try {
      const data = await $fetch<any[]>('/api/conversations')
      const existing = new Map(conversations.value.map(c => [c.id, c]))
      conversations.value = data.map((row) => {
        const mapped = mapConversation(row)
        const prev = existing.get(mapped.id)
        if (prev) {
          mapped.messages = prev.messages
          mapped.loaded = prev.loaded
        }
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
    const conversation = find(conversationId)
    if (conversation) {
      // Keep any optimistic bubbles that are still in flight.
      const inflight = conversation.messages.filter(m => m.pending)
      conversation.messages = [...mapped, ...inflight]
      conversation.loaded = true
    }
    return mapped
  }

  /**
   * Optimistic send: the bubble shows up instantly and is swapped for the
   * server's copy once Instagram accepts it. On failure it's removed and the
   * error propagates so the UI can restore the draft.
   */
  async function sendMessage(conversationId: string, text: string) {
    const conversation = find(conversationId)
    const tempId = `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const now = new Date().toISOString()
    const optimistic: ChatMessage = { id: tempId, text, sender: 'me', time: formatTime(now), createdAt: now, pending: true }

    if (conversation) {
      conversation.messages.push(optimistic)
      conversation.lastMessage = text
      conversation.time = optimistic.time
      conversation.lastMessageAt = now
      sortByRecency(conversations.value)
    }

    try {
      const created = await $fetch<any>(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: { body: text }
      })
      const mapped = mapMessage(created)
      if (conversation) {
        const idx = conversation.messages.findIndex(m => m.id === tempId)
        // Realtime may have delivered the real row before this response.
        if (conversation.messages.some(m => m.id === mapped.id)) {
          if (idx !== -1) conversation.messages.splice(idx, 1)
        } else if (idx !== -1) {
          conversation.messages.splice(idx, 1, mapped)
        } else {
          conversation.messages.push(mapped)
        }
      }
      return mapped
    } catch (err) {
      if (conversation) {
        const idx = conversation.messages.findIndex(m => m.id === tempId)
        if (idx !== -1) conversation.messages.splice(idx, 1)
      }
      throw err
    }
  }

  async function markRead(conversationId: string) {
    const conversation = find(conversationId)
    if (conversation && conversation.unreadCount > 0) {
      conversation.unreadCount = 0
      await $fetch(`/api/conversations/${conversationId}`, { method: 'PATCH', body: { unread_count: 0 } })
    }
  }

  async function startConversation(payload: { handle: string, name?: string, message?: string }) {
    await $fetch<any>('/api/conversations', { method: 'POST', body: payload })
    return fetchConversations()
  }

  // ---------------------------------------------------------------------------
  // Live updates
  // ---------------------------------------------------------------------------

  function applyIncomingMessage(row: any) {
    const conversation = find(row.conversation_id)
    if (!conversation) {
      // Thread we haven't seen yet (first DM from a new buyer) -- pull the list.
      fetchConversations()
      return
    }
    if (!conversation.loaded) return // will be fetched when opened
    if (conversation.messages.some(m => m.id === row.id)) return

    const mapped = mapMessage(row)
    if (mapped.sender === 'me') {
      // Our own send echoed back: replace the optimistic bubble if it's still there.
      const idx = conversation.messages.findIndex(m => m.pending && m.text === mapped.text)
      if (idx !== -1) {
        conversation.messages.splice(idx, 1, mapped)
        return
      }
    }
    conversation.messages.push(mapped)
  }

  function applyConversationChange(row: any) {
    const conversation = find(row.id)
    if (!conversation) {
      fetchConversations()
      return
    }
    conversation.name = row.instagram_name || row.instagram_handle
    conversation.handle = `@${row.instagram_handle}`
    conversation.avatar = row.avatar_url || conversation.avatar
    conversation.lastMessage = row.last_message_preview || ''
    conversation.time = formatTime(row.last_message_at)
    conversation.lastMessageAt = row.last_message_at ?? null
    conversation.unreadCount = row.unread_count || 0
    sortByRecency(conversations.value)
  }

  /**
   * Subscribes to inserts/updates for this store. Returns a stop function.
   * Falls back to polling the list if the socket never connects.
   */
  function subscribe(storeId: string, opts: { onNewMessage?: (row: any) => void } = {}) {
    const supabase = useSupabaseClient()
    let channel: RealtimeChannel | null = null
    let pollTimer: ReturnType<typeof setInterval> | null = null

    const startPolling = () => {
      if (pollTimer) return
      pollTimer = setInterval(() => { fetchConversations().catch(() => {}) }, LIST_POLL_MS)
    }
    const stopPolling = () => {
      if (pollTimer) clearInterval(pollTimer)
      pollTimer = null
    }

    channel = supabase
      .channel(`inbox:${storeId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `store_id=eq.${storeId}` }, (payload) => {
        applyIncomingMessage(payload.new)
        opts.onNewMessage?.(payload.new)
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations', filter: `store_id=eq.${storeId}` }, (payload) => {
        if (payload.eventType === 'DELETE') {
          conversations.value = conversations.value.filter(c => c.id !== (payload.old as any).id)
          return
        }
        applyConversationChange(payload.new)
      })
      .subscribe((status) => {
        const ok = status === 'SUBSCRIBED'
        realtimeConnected.value = ok
        if (ok) {
          stopPolling()
          // Catch anything that landed while we were disconnected.
          fetchConversations().catch(() => {})
        } else {
          startPolling()
        }
      })

    return () => {
      stopPolling()
      realtimeConnected.value = false
      if (channel) supabase.removeChannel(channel)
      channel = null
    }
  }

  return {
    conversations,
    pending,
    realtimeConnected,
    fetchConversations,
    loadMessages,
    sendMessage,
    markRead,
    startConversation,
    subscribe
  }
}
