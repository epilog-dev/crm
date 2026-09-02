export type NotificationType = 'order' | 'payment' | 'dm' | 'system'
export type NotificationBadgeColor = 'primary' | 'success' | 'warning' | 'info' | 'error' | 'neutral'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  icon: string
  badgeColor: NotificationBadgeColor
  read: boolean
  createdAt: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mapping raw Supabase rows
function mapNotification(row: any): AppNotification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    link: row.link,
    icon: row.icon,
    badgeColor: row.badge_color,
    read: row.read,
    createdAt: row.created_at
  }
}

export function useNotifications() {
  const notifications = useState<AppNotification[]>('notifications', () => [])
  const pending = useState<boolean>('notificationsPending', () => false)

  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

  async function fetchNotifications() {
    pending.value = true
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await $fetch<any[]>('/api/notifications')
      notifications.value = data.map(mapNotification)
      return notifications.value
    } finally {
      pending.value = false
    }
  }

  async function markRead(id: string) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) notification.read = true
    await $fetch(`/api/notifications/${id}`, { method: 'PATCH', body: { read: true } })
  }

  async function markAllRead() {
    notifications.value.forEach((n) => { n.read = true })
    await $fetch('/api/notifications', { method: 'PATCH' })
  }

  async function dismiss(id: string) {
    notifications.value = notifications.value.filter(n => n.id !== id)
    await $fetch(`/api/notifications/${id}`, { method: 'DELETE' })
  }

  return {
    notifications,
    pending,
    unreadCount,
    fetchNotifications,
    markRead,
    markAllRead,
    dismiss
  }
}
