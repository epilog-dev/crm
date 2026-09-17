<script lang="ts" setup>
const { user, navItems, userMenuItems } = useNavigation()
const { store } = useStore()
const { subscribe } = useConversations()
const { onNewMessage } = useDmAlerts()

// One realtime channel for the whole dashboard: keeps the inbox list, sidebar
// unread badge and DM pop/chime live on every page, not just /inbox.
let stopRealtime: (() => void) | null = null
onMounted(() => {
  watch(() => store.value?.id, (storeId) => {
    stopRealtime?.()
    stopRealtime = storeId ? subscribe(storeId, { onNewMessage }) : null
  }, { immediate: true })
})
onUnmounted(() => {
  stopRealtime?.()
  stopRealtime = null
})

useSeoMeta({
  title: 'Instagram DM Sales Workspace',
  description: 'Turn your Instagram DMs into organized orders.'
})

const searchGroups = [
  {
    id: 'actions',
    label: 'Quick Actions',
    items: [
      { id: 'inbox', label: 'Open Sales DM Inbox', icon: 'i-lucide-inbox', to: '/inbox' },
      { id: 'orders', label: 'View Orders Workspace', icon: 'i-lucide-shopping-bag', to: '/orders' },
      { id: 'settings', label: 'Instagram Integration', icon: 'i-simple-icons-instagram', to: '/settings' }
    ]
  }
]
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
collapsible :menu="{ ui: { content: 'max-w-xs' } }" :ui="{
      root: 'bg-neutral-100/70 dark:bg-neutral-900/90 border-r border-default',
      content: 'bg-neutral-100/70 dark:bg-neutral-900/90 border-r border-default'
    }" resizable>
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2.5 font-semibold text-lg">
          <LogoMark :size="28" class="shrink-0" />
          <span v-if="!collapsed" class="tracking-tight text-highlighted text-sm font-bold">DMSell</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton
:collapsed="collapsed" :groups="searchGroups"
          class="bg-transparent ring-default" />
        <UNavigationMenu
popover tooltip :items="navItems" class="w-full justify-center" orientation="vertical"
          :collapsed="collapsed" />
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu :items="userMenuItems">
          <UButton
v-bind="{
            ...user,
            label: collapsed ? undefined : user?.name,
            trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
          }" color="neutral" variant="ghost" block :square="collapsed" class="data-[state=open]:bg-elevated"
            :ui="{ trailingIcon: 'text-dimmed' }" />
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <UDashboardNavbar>
        <template #left>
          <UDashboardSidebarCollapse />
          <h1 class="font-semibold text-sm md:text-base text-highlighted">{{ $route.meta.title || "Sales Workspace" }}</h1>
        </template>

        <template #right>
          <InstagramStatusBadge />
          <NotificationsSlideover />
          <UColorModeButton />
        </template>
      </UDashboardNavbar>

      <div class="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <slot />
      </div>
    </UDashboardPanel>
    <UDashboardSearch :groups="searchGroups" />
  </UDashboardGroup>
</template>
