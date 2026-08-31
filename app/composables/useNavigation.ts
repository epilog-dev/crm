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
        label: 'Benjamin',
        avatar: {
          src: 'https://github.com/benjamincanac.png',
          loading: 'lazy'
        },
        type: 'label'
      }
    ],
    [
      {
        label: 'Profile',
        icon: 'i-lucide-user'
      },
      {
        label: 'Billing',
        icon: 'i-lucide-credit-card'
      },
      {
        label: 'Settings',
        icon: 'i-lucide-cog',
        kbds: [',']
      },
      {
        label: 'Keyboard shortcuts',
        icon: 'i-lucide-monitor'
      }
    ],
    // [
    //   {
    //     label: 'Team',
    //     icon: 'i-lucide-users',
    //     filter: {
    //       placeholder: 'Search members...'
    //     },
    //     children: [
    //       [
    //         {
    //           label: 'benjamincanac',
    //           avatar: {
    //             src: 'https://github.com/benjamincanac.png',
    //             loading: 'lazy'
    //           }
    //         },
    //         {
    //           label: 'HugoRCD',
    //           avatar: {
    //             src: 'https://github.com/HugoRCD.png',
    //             loading: 'lazy'
    //           }
    //         },
    //         {
    //           label: 'romhml',
    //           avatar: {
    //             src: 'https://github.com/romhml.png',
    //             loading: 'lazy'
    //           }
    //         },
    //         {
    //           label: 'sandros94',
    //           avatar: {
    //             src: 'https://github.com/sandros94.png',
    //             loading: 'lazy'
    //           }
    //         },
    //         {
    //           label: 'hywax',
    //           avatar: {
    //             src: 'https://github.com/hywax.png',
    //             loading: 'lazy'
    //           }
    //         },
    //         {
    //           label: 'J-Michalek',
    //           avatar: {
    //             src: 'https://github.com/J-Michalek.png',
    //             loading: 'lazy'
    //           }
    //         },
    //         {
    //           label: 'genu',
    //           avatar: {
    //             src: 'https://github.com/genu.png',
    //             loading: 'lazy'
    //           }
    //         }
    //       ]
    //     ]
    //   },
    //   {
    //     label: 'Invite users',
    //     icon: 'i-lucide-user-plus',
    //     children: [
    //       [
    //         {
    //           label: 'Email',
    //           icon: 'i-lucide-mail'
    //         },
    //         {
    //           label: 'Message',
    //           icon: 'i-lucide-message-square'
    //         }
    //       ],
    //       [
    //         {
    //           label: 'More',
    //           icon: 'i-lucide-circle-plus',
    //           children: [
    //             {
    //               label: 'Import from Slack',
    //               icon: 'i-simple-icons-slack',
    //               to: 'https://slack.com',
    //               target: '_blank'
    //             },
    //             {
    //               label: 'Import from Trello',
    //               icon: 'i-simple-icons-trello'
    //             },
    //             {
    //               label: 'Import from Asana',
    //               icon: 'i-simple-icons-asana'
    //             }
    //           ]
    //         }
    //       ]
    //     ]
    //   },
    //   {
    //     label: 'New team',
    //     icon: 'i-lucide-plus',
    //     kbds: ['meta', 'n']
    //   }
    // ],
    [
      // {
      //   label: 'GitHub',
      //   icon: 'i-simple-icons-github',
      //   to: 'https://github.com/nuxt/ui',
      //   target: '_blank'
      // },
      {
        label: 'Support',
        icon: 'i-lucide-life-buoy',
        to: '/docs/components/dropdown-menu'
      },
      // {
      //   label: 'API',
      //   icon: 'i-lucide-cloud',
      //   disabled: true
      // }
    ],
    [
      {
        label: 'Logout',
        icon: 'i-lucide-log-out',
        color: 'error',
        kbds: ['shift', 'meta', 'q']
      }
    ]
  ])

  return {
    user,
    navItems,
    userMenuItems
  }
}
