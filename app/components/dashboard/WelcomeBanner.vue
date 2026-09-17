<script setup lang="ts">
/** Hero strip at the top of the dashboard with the focus-mode switch and primary CTAs. */
const focusMode = defineModel<boolean>('focusMode', { default: false })
</script>

<template>
  <UPageCard
    variant="soft"
    orientation="horizontal"
    class="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10"
    :ui="{ container: 'p-5 sm:p-6 gap-y-4', title: 'text-xl font-bold', description: 'text-sm' }"
  >
    <template #title>
      <span class="flex items-center gap-2">
        <UIcon name="i-simple-icons-instagram" class="size-6 text-pink-500" />
        Instagram Sales Overview
      </span>
    </template>
    <template #description>
      Turn Instagram DMs into organized orders. <strong>No storefront or catalog needed.</strong>
    </template>

    <div class="flex items-center gap-3 flex-wrap lg:justify-end">
      <USwitch v-model="focusMode" size="sm" label="Focus Mode" :ui="{ label: 'text-xs font-bold' }" />
      <UButton to="/inbox" label="Open Sales DM Inbox" icon="i-lucide-message-square" color="primary" />
      <UButton to="/orders" label="View Orders" icon="i-lucide-shopping-bag" color="neutral" variant="outline" />
    </div>
  </UPageCard>
</template>
