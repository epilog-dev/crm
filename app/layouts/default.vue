<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";

useSeoMeta({
  title: "Dashboard - Nudge CRM",
  description: "Manage your inventory and buyer pipeline.",
  ogTitle: "Dashboard - Nudge CRM",
  ogDescription: "Manage your inventory and buyer pipeline.",
  ogImage: "https://example.com/og-image.png",
  twitterCard: "summary_large_image",
});

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
    <UDashboardSidebar
      collapsible
      :default-size="12"
      :menu="{ ui: { content: 'max-w-xs' } }"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2.5 font-semibold text-lg">
          <div
            class="flex size-7 items-center justify-center rounded-lg bg-primary text-inverted font-bold text-sm shrink-0"
          >
            N
          </div>
          <!-- Brand Name (hidden when collapsed) -->
          <span
            v-if="!collapsed"
            class="tracking-tight text-highlighted text-sm"
            >Nudge</span
          >
        </div>
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
          <NotificationButton />
          <UColorModeButton class="cursor-pointer" />
        </template>
      </UDashboardNavbar>
      <slot />
    </UDashboardPanel>
  </UDashboardGroup>
</template>
