<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[]>([
  {
    label: "Dashboard",
    icon: "i-lucide-layout-dashboard",
    to: "/dashboard",
  },
  {
    label: "Orders",
    icon: "i-lucide-kanban",
    to: "/dashboard/orders",
    children: [
      {
        label: "Kanban Board",
        icon: "i-lucide-columns-3",
        description:
          "Live pipeline for 15-min holds, paid items, and courier slips.",
        to: "/dashboard/orders",
      },
      {
        label: "Packing Slips",
        icon: "i-lucide-printer",
        description:
          "1-tap printable delivery slips with buyer landmark details.",
        to: "/dashboard/orders/slips",
      },
    ],
  },
  {
    label: "Products",
    icon: "i-lucide-tag",
    to: "/dashboard/products",
    description: "Link Instagram posts to inventory items and set prices.",
  },
  {
    label: "Customers",
    icon: "i-lucide-users",
    to: "/dashboard/customers",
    description:
      "View buyer handles, saved local landmarks, and purchase histories.",
  },
  {
    label: "Settings",
    icon: "i-lucide-settings",
    to: "/dashboard/settings",
    description:
      "Manage Meta Webhook connection and 15-minute hold timer rules.",
  },
]);
</script>
<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible>
      <template #header="{ collapsed }">
        <h1 class="font-semibold" v-if="!collapsed">nudge</h1>
      </template>
      <template #default="{ collapsed }">
        <UNavigationMenu
          popover
          tooltip
          :items="items"
          class="w-full justify-center"
          orientation="vertical"
          :collapsed="collapsed"
        />
      </template>
    </UDashboardSidebar>
    <UDashboardPanel>
      <UDashboardNavbar>
        <template #left>
          <UDashboardSidebarCollapse class="cursor-pointer" />
        </template>
        <template #right class="cursor-pointer">
          <UColorModeButton class="cursor-pointer" />
        </template>
      </UDashboardNavbar>
      <slot />
    </UDashboardPanel>
  </UDashboardGroup>
</template>
