<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";
import type { DropdownMenuItem } from '@nuxt/ui'

useSeoMeta({
  title: "Dashboard - Nudge CRM",
  description: "Manage your inventory and buyer pipeline.",
  ogTitle: "Dashboard - Nudge CRM",
  ogDescription: "Manage your inventory and buyer pipeline.",
  ogImage: "https://example.com/og-image.png",
  twitterCard: "summary_large_image",
});

const user = ref({
  name: 'Benjamin Canac',
  avatar: {
    src: 'https://github.com/benjamincanac.png',
    alt: 'Benjamin Canac'
  }
})

const dropdownItems = ref<DropdownMenuItem[][]>(
  [
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
    [
      {
        label: 'Team',
        icon: 'i-lucide-users',
        filter: {
          placeholder: 'Search members...'
        },
        children: [
          [
            {
              label: 'benjamincanac',
              avatar: {
                src: 'https://github.com/benjamincanac.png',
                loading: 'lazy'
              }
            },
            {
              label: 'HugoRCD',
              avatar: {
                src: 'https://github.com/HugoRCD.png',
                loading: 'lazy'
              }
            },
            {
              label: 'romhml',
              avatar: {
                src: 'https://github.com/romhml.png',
                loading: 'lazy'
              }
            },
            {
              label: 'sandros94',
              avatar: {
                src: 'https://github.com/sandros94.png',
                loading: 'lazy'
              }
            },
            {
              label: 'hywax',
              avatar: {
                src: 'https://github.com/hywax.png',
                loading: 'lazy'
              }
            },
            {
              label: 'J-Michalek',
              avatar: {
                src: 'https://github.com/J-Michalek.png',
                loading: 'lazy'
              }
            },
            {
              label: 'genu',
              avatar: {
                src: 'https://github.com/genu.png',
                loading: 'lazy'
              }
            }
          ]
        ]
      },
      {
        label: 'Invite users',
        icon: 'i-lucide-user-plus',
        children: [
          [
            {
              label: 'Email',
              icon: 'i-lucide-mail'
            },
            {
              label: 'Message',
              icon: 'i-lucide-message-square'
            }
          ],
          [
            {
              label: 'More',
              icon: 'i-lucide-circle-plus',
              children: [
                {
                  label: 'Import from Slack',
                  icon: 'i-simple-icons-slack',
                  to: 'https://slack.com',
                  target: '_blank'
                },
                {
                  label: 'Import from Trello',
                  icon: 'i-simple-icons-trello'
                },
                {
                  label: 'Import from Asana',
                  icon: 'i-simple-icons-asana'
                }
              ]
            }
          ]
        ]
      },
      {
        label: 'New team',
        icon: 'i-lucide-plus',
        kbds: ['meta', 'n']
      }
    ],
    [
      {
        label: 'GitHub',
        icon: 'i-simple-icons-github',
        to: 'https://github.com/nuxt/ui',
        target: '_blank'
      },
      {
        label: 'Support',
        icon: 'i-lucide-life-buoy',
        to: '/docs/components/dropdown-menu'
      },
      {
        label: 'API',
        icon: 'i-lucide-cloud',
        disabled: true
      }
    ],
    [
      {
        label: 'Logout',
        icon: 'i-lucide-log-out',
        color: 'error',
        kbds: ['shift', 'meta', 'q']
      }
    ]
  ]
)

const items = ref<NavigationMenuItem[]>([
  {
    label: "Dashboard",
    icon: "i-lucide-layout-dashboard",
    to: "/",
  },
  {
    label: "Orders",
    icon: "i-lucide-kanban",
    children: [
      {
        label: "Kanban Board",
        icon: "i-lucide-columns-3",
        description:
          "Live pipeline for 15-min holds, paid items, and courier slips.",
        to: "/orders",
      },
      {
        label: "Packing Slips",
        icon: "i-lucide-printer",
        description:
          "1-tap printable delivery slips with buyer landmark details.",
        to: "/orders/slips",
      },
    ],
  },
  {
    label: "Products",
    icon: "i-lucide-tag",
    to: "/products",
    description: "Link Instagram posts to inventory items and set prices.",
  },
  {
    label: "Customers",
    icon: "i-lucide-users",
    to: "/customers",
    description:
      "View buyer handles, saved local landmarks, and purchase histories.",
  },
  {
    label: "Settings",
    icon: "i-lucide-settings",
    to: "/settings",
    description:
      "Manage Meta Webhook connection and 15-minute hold timer rules.",
  },
]);


</script>
<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible :menu="{ ui: { content: 'max-w-xs' } }">
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2.5 font-semibold text-lg">
          <div
            class="flex size-7 items-center justify-center rounded-lg bg-primary text-inverted font-bold text-sm shrink-0">
            N
          </div>
          <span v-if="!collapsed" class="tracking-tight text-highlighted text-sm">Nudge</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu popover tooltip :items="items" class="w-full justify-center" orientation="vertical"
          :collapsed="collapsed" />
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu :items="dropdownItems">
          <UButton v-bind="{
            ...user,
            label: collapsed ? undefined : user?.name,
            trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
          }" color="neutral" variant="ghost" block :square="collapsed" class="data-[state=open]:bg-elevated"
            :ui="{ trailingIcon: 'text-dimmed' }" />
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <UDashboardNavbar>
        <template #left>
          <UDashboardSidebarCollapse class="cursor-pointer" />
          <h1 class="font-semibold">{{ $route.meta.title || 'Dashboard' }}</h1>
        </template>
        <template #right>
          <UColorModeButton class="cursor-pointer" />
        </template>
      </UDashboardNavbar>

      <slot />
    </UDashboardPanel>
  </UDashboardGroup>
</template>
