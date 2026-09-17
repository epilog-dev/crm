<script setup lang="ts">
useSeoMeta({
  title: 'Store & Payment Settings - DM Sales Workspace',
  description: 'Manage store UPI ID, enable/disable COD for order links, and Meta API integration.'
})
</script>

<template>
  <div class="p-4 md:p-6 max-w-4xl mx-auto w-full space-y-6">
    <div>
      <h2 class="text-xl font-bold text-highlighted">Instagram integration</h2>
      <p class="text-sm text-dimmed">Connect your Instagram professional account through Meta's official Instagram API to receive DMs and send order links.</p>
    </div>

    <SettingsInstagramConnectionCard />

    <SettingsPaymentSettingsCard />

    <UAlert
      icon="i-lucide-shield-check"
      color="neutral"
      variant="soft"
      title="What we access"
      :ui="{ title: 'text-xs font-bold', description: 'text-xs' }"
    >
      <template #description>
        <ul class="list-disc list-inside space-y-1 mt-1">
          <li>Direct messages, so you can reply to buyers from here.</li>
          <li>Basic profile info, to link buyer handles to orders.</li>
          <li>We <strong>do not</strong> post, delete, manage comments or touch your catalog.</li>
        </ul>
      </template>
    </UAlert>
  </div>
</template>
