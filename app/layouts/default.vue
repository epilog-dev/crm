<script lang="ts" setup>
const { user, navItems, userMenuItems } = useNavigation();

useSeoMeta({
  title: "Dashboard - Plum CRM",
  description: "Manage your inventory and buyer pipeline.",
  ogTitle: "Dashboard - Plum CRM",
  ogDescription: "Manage your inventory and buyer pipeline.",
  ogImage: "https://example.com/og-image.png",
  twitterCard: "summary_large_image",
});

const customSearchGroups = [
  {
    id: "actions",
    label: "Quick Actions",
    items: [
      {
        id: "create-user",
        label: "Create new user",
        icon: "i-heroicons-user-plus",
        to: "/users/new", // Can be a route link
        shortcuts: ["G", "U"],
      },
      {
        id: "download-report",
        label: "Download Monthly Report",
        icon: "i-heroicons-arrow-down-tray",
        click: () => handleDownload(), // Or a custom callback
      },
    ],
  },
  {
    id: "docs",
    label: "Documentation",
    items: [
      {
        id: "api-docs",
        label: "API Reference",
        icon: "i-heroicons-book-open",
        to: "/docs/api",
        target: "_blank",
      },
    ],
  },
];

function handleDownload() {
  // Your custom function logic
}
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible :menu="{ ui: { content: 'max-w-xs' } }" :ui="{
      root: 'bg-muted/50 dark:bg-elevated/30',
      content: 'bg-muted/50 dark:bg-elevated/30'
    }" resizable>
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2.5 font-semibold text-lg">
          <div
            class="flex size-7 items-center justify-center rounded-lg bg-pink-500 text-white font-bold text-sm shrink-0">
            S
          </div>
          <span v-if="!collapsed" class="tracking-tight text-highlighted text-sm font-bold">DM Sales</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" :groups="customSearchGroups"
          class="bg-transparent ring-default" />
        <UNavigationMenu popover tooltip :items="navItems" class="w-full justify-center" orientation="vertical"
          :collapsed="collapsed" />
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu :items="userMenuItems">
          <UButton v-bind="{
            ...user,
            label: collapsed ? undefined : user?.name,
            trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
          }" color="neutral" variant="ghost" block :square="collapsed" class="data-[state=open]:bg-elevated"
            :ui="{ trailingIcon: 'text-dimmed' }" />
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header
        ><UDashboardNavbar>
          <template #left>
            <UDashboardSidebarCollapse class="cursor-pointer" />
            <h1 class="font-semibold">
              {{ $route.meta.title || "Dashboard" }}
            </h1>
          </template>
          <template #right>
            <USlideover title="Notifications">
              <div class="relative inline-flex">
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-bell"
                  aria-label="Open notifications"
                  class="cursor-pointer"
                />
                <UBadge
                  color="error"
                  variant="solid"
                  size="xs"
                  class="absolute top-0 -right-1 rounded-full p-0 h-2 w-2 min-w-0"
                />
              </div>
              <template #body>
                <div class="h-full flex items-center justify-center text-muted">
                  No new notifications
                </div>
              </template>
            </USlideover>
            <UColorModeButton class="cursor-pointer" />
          </template> </UDashboardNavbar
      ></template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
    <UDashboardSearch :groups="customSearchGroups" />
  </UDashboardGroup>
</template>
