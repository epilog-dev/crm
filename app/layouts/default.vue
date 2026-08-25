<script lang="ts" setup>
const { user, navItems, userMenuItems } = useNavigation()

useSeoMeta({
  title: "Dashboard - Nudge CRM",
  description: "Manage your inventory and buyer pipeline.",
  ogTitle: "Dashboard - Nudge CRM",
  ogDescription: "Manage your inventory and buyer pipeline.",
  ogImage: "https://example.com/og-image.png",
  twitterCard: "summary_large_image",
});
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
        <UNavigationMenu popover tooltip :items="navItems" class="w-full justify-center" orientation="vertical"
          :collapsed="collapsed" />
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu :items="userMenuItems">
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
      <div class="p-6 space-y-6">
        <slot />
      </div>

    </UDashboardPanel>
  </UDashboardGroup>
</template>
