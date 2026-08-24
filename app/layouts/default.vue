<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[]>([
  {
    label: "Orders",
    icon: "i-lucide-kanban",
    to: "/dashboard/orders",
    children: [
      {
        label: "Kanban Board",
        icon: "i-lucide-columns-3",
        description: "Live pipeline for 15-min holds, paid items, and courier slips.",
        to: "/dashboard/orders"
      },
      {
        label: "Packing Slips",
        icon: "i-lucide-printer",
        description: "1-tap printable delivery slips with buyer landmark details.",
        to: "/dashboard/orders/slips"
      }
    ]
  },
  {
    label: "Products",
    icon: "i-lucide-tag",
    to: "/dashboard/products",
    description: "Link Instagram posts to inventory items and set prices."
  },
  {
    label: "Customers",
    icon: "i-lucide-users",
    to: "/dashboard/customers",
    description: "View buyer handles, saved local landmarks, and purchase histories."
  },
  {
    label: "Settings",
    icon: "i-lucide-settings",
    to: "/dashboard/settings",
    description: "Manage Meta Webhook connection and 15-minute hold timer rules."
  }
])
</script>
<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible>
      <template #header="{ collapsed }">
        <h1 class="font-semibold">nudge</h1>
      </template>
      <template #default>
        <UNavigationMenu
          popover
          tooltip
          :items="items"
          class="w-full justify-center"
          orientation="vertical"
        />
      </template>
    </UDashboardSidebar>
    <UDashboardPanel>
      <UDashboardNavbar>
        <template #left>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <h1>logo</h1>
        </template>
      </UDashboardNavbar>
      <slot />
    </UDashboardPanel>
  </UDashboardGroup>
</template>
