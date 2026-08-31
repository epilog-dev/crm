import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui'

export function useNavigation() {
  const user = ref({
    name: 'Benjamin Canac',
    avatar: {
      src: 'https://github.com/benjamincanac.png',
      alt: 'Benjamin Canac'
    }
  })

  const navItems = ref<NavigationMenuItem[]>([
    {
      label: 'Dashboard',
      icon: 'i-lucide-layout-dashboard',
      to: '/',
      description: 'Overview of sales metrics, active DMs, and recent orders'
    },
    {
      label: 'Inbox',
      icon: 'i-lucide-inbox',
      to: '/inbox',
      description: 'Instagram DM Sales Inbox & Order creation'
    },
    {
      label: 'Orders',
      icon: 'i-lucide-shopping-bag',
      to: '/orders',
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
      description: 'Connect your Instagram Professional Account'
    }
  ])

  const userMenuItems = ref<DropdownMenuItem[][]>([
    [
      {
        label: 'Retro Thrift Store',
        avatar: {
          src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          loading: 'lazy'
        },
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
        to: '/'
      }
    ],
    [
      {
        label: 'Logout',
        icon: 'i-lucide-log-out',
        color: 'error'
      }
    ]
  ])

  return {
    user,
    navItems,
    userMenuItems
  }
}
