import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export interface NotifyParams {
  storeId: string
  type: 'order' | 'payment' | 'dm' | 'system'
  title: string
  message: string
  link?: string
  icon?: string
  badgeColor?: 'primary' | 'success' | 'warning' | 'info' | 'error' | 'neutral'
  orderId?: string
  conversationId?: string
}

/**
 * Inserts a notification for the seller. Never throws — a failed notification
 * shouldn't fail the customer-facing action that triggered it, so errors are
 * only logged.
 */
export async function notify(client: SupabaseClient<Database>, params: NotifyParams) {
  const { error } = await client.from('notifications').insert({
    store_id: params.storeId,
    type: params.type,
    title: params.title,
    message: params.message,
    link: params.link ?? null,
    icon: params.icon ?? 'i-lucide-bell',
    badge_color: params.badgeColor ?? 'primary',
    order_id: params.orderId ?? null,
    conversation_id: params.conversationId ?? null
  })

  if (error) {
    console.error('Failed to create notification:', error.message)
  }
}
