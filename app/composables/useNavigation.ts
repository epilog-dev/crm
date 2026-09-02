import { computed } from 'vue'
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'
import { useStore } from './useStore'
import { useConversations } from './useConversations'
import { useOrders } from './useOrders'

export function useNavigation() {
  const { store, fetchStore } = useStore()
  const { conversations, fetchConversations } = useConversations()
  const { orders, fetchOrders } = useOrders()
  const supabase = useSupabaseClient()
  const router = useRouter()

  if (import.meta.client) {
    if (!store.value) fetchStore()
    if (!conversations.value.length) fetchConversations()
    if (!orders.value.length) fetchOrders()
  }

  const unreadDmCount = computed(() => conversations.value.reduce((sum, c) => sum + c.unreadCount, 0))
  const awaitingPaymentCount = computed(() => orders.value.filter(o => o.status === 'Awaiting Payment').length)
  const storeName = computed(() => store.value?.name || 'My Store')

  const user = computed(() => ({
    name: storeName.value,
    avatar: { alt: storeName.value }
  }))

  const navItems = computed<NavigationMenuItem[]>(() => [
    {
      label: 'Dashboard',
      icon: 'i-lucide-layout-dashboard',
      to: '/app',
      description: 'Overview of sales metrics, active DMs, and recent orders'
    },
    {
      label: 'Inbox',
      icon: 'i-lucide-inbox',
      to: '/inbox',
      ...(unreadDmCount.value > 0 ? { badge: { label: String(unreadDmCount.value), color: 'primary' as const } } : {}),
      description: 'Instagram DM Sales Inbox & Order creation'
    },
    {
      label: 'Orders',
      icon: 'i-lucide-shopping-bag',
      to: '/orders',
      ...(awaitingPaymentCount.value > 0 ? { badge: { label: String(awaitingPaymentCount.value), color: 'warning' as const } } : {}),
      description: 'Manage sales pipeline and track order fulfillments'
    },
    {
      label: 'Customers',
      icon: 'i-lucide-users',
      to: '/customers',
      description: 'View buyer handles, shipping details, and order history'
    },
    {
      label: 'Connect Instagram',
      icon: 'i-simple-icons-instagram',
      to: '/settings',
      badge: store.value?.instagram_connected
        ? { label: '✓', color: 'success' as const }
        : { label: '!', color: 'neutral' as const },
      description: 'Connect your Instagram Professional Account'
    }
  ])

  const userMenuItems = computed<DropdownMenuItem[][]>(() => [
    [
      {
        label: storeName.value,
        avatar: { alt: storeName.value },
        type: 'label'
      }
    ],
    [
      {
        label: 'Instagram Account',
        icon: 'i-simple-icons-instagram',
        to: '/settings'
      },
      {
        label: 'Payment QR & UPI Settings',
        icon: 'i-lucide-qr-code',
        to: '/settings'
      },
      {
        label: 'Order Link Preferences',
        icon: 'i-lucide-link',
        to: '/settings'
      }
    ],
    [
      {
        label: 'Help & Seller Guide',
        icon: 'i-lucide-help-circle',
        to: '/app'
      }
    ],
    [
      {
        label: 'Logout',
        icon: 'i-lucide-log-out',
        color: 'error',
        onSelect: async () => {
          await supabase.auth.signOut()
          await router.push('/login')
        }
      }
    ]
  ])

  return {
    user,
    navItems,
    userMenuItems
  }
}
