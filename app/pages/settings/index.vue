<script setup lang="ts">
useSeoMeta({
  title: 'Instagram Account Connection - Sales Inbox',
  description: 'Connect your Instagram Professional account via Meta API'
})

const isConnected = ref(true)
const accountInfo = ref({
  username: '@thrift_store_india',
  name: 'Retro Thrift Store',
  followers: '14.2K',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  connectedAt: '2026-08-15',
  webhookStatus: 'Active'
})

const isConnecting = ref(false)

function handleConnect() {
  isConnecting.value = true
  setTimeout(() => {
    isConnected.value = true
    isConnecting.value = false
  }, 1200)
}

function handleDisconnect() {
  isConnected.value = false
}
</script>

<template>
  <div class="p-6 max-w-4xl space-y-6">
    <div>
      <h2 class="text-xl font-bold text-highlighted">Instagram Professional Account Integration</h2>
      <p class="text-sm text-dimmed">Connect your Instagram account through Meta's Official Instagram API to receive DMs and send order links.</p>
    </div>

    <!-- Connected State -->
    <UCard v-if="isConnected" class="divide-y divide-default">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-simple-icons-instagram" class="size-5 text-pink-500" />
            <h3 class="font-semibold text-highlighted">Connected Instagram Business Profile</h3>
          </div>
          <UBadge color="success" variant="subtle" class="flex items-center gap-1">
            <span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Meta API Connected
          </UBadge>
        </div>
      </template>

      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <UAvatar :src="accountInfo.avatar" :alt="accountInfo.name" size="lg" />
          <div>
            <h4 class="font-bold text-highlighted text-base">{{ accountInfo.name }}</h4>
            <p class="text-sm text-dimmed">{{ accountInfo.username }} • {{ accountInfo.followers }} followers</p>
            <p class="text-xs text-muted mt-1">Webhook sync active • Connected on {{ accountInfo.connectedAt }}</p>
          </div>
        </div>

        <UButton
          label="Disconnect Account"
          color="error"
          variant="outline"
          size="sm"
          @click="handleDisconnect"
        />
      </div>

      <div class="p-4 bg-elevated/30 rounded-b-xl space-y-2">
        <h5 class="text-xs font-semibold text-highlighted uppercase tracking-wider">Meta API Webhook Status</h5>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div class="p-2.5 bg-background rounded-lg border border-default">
            <span class="text-muted">DM Webhook:</span>
            <p class="font-medium text-emerald-500 flex items-center gap-1 mt-0.5">
              <UIcon name="i-lucide-check-circle-2" class="size-3.5" />
              Receiving Messages
            </p>
          </div>
          <div class="p-2.5 bg-background rounded-lg border border-default">
            <span class="text-muted">Direct Reply API:</span>
            <p class="font-medium text-emerald-500 flex items-center gap-1 mt-0.5">
              <UIcon name="i-lucide-check-circle-2" class="size-3.5" />
              Ready
            </p>
          </div>
          <div class="p-2.5 bg-background rounded-lg border border-default">
            <span class="text-muted">Order Link Sender:</span>
            <p class="font-medium text-emerald-500 flex items-center gap-1 mt-0.5">
              <UIcon name="i-lucide-check-circle-2" class="size-3.5" />
              Active
            </p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Disconnected State -->
    <UCard v-else class="text-center p-8 space-y-4">
      <div class="size-16 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center mx-auto">
        <UIcon name="i-simple-icons-instagram" class="size-8" />
      </div>
      <div>
        <h3 class="text-lg font-bold text-highlighted">Connect your Instagram Account</h3>
        <p class="text-sm text-dimmed max-w-md mx-auto mt-1">
          Link your Instagram Professional or Creator account to manage sales DMs directly from our simple workspace.
        </p>
      </div>
      <UButton
        label="Connect via Facebook / Meta API"
        icon="i-simple-icons-meta"
        color="primary"
        size="lg"
        :loading="isConnecting"
        @click="handleConnect"
      />
    </UCard>

    <!-- Scope Explainer -->
    <div class="p-4 rounded-xl border border-default bg-elevated/20 space-y-2 text-xs">
      <h4 class="font-bold text-highlighted">What we access:</h4>
      <ul class="list-disc list-inside text-dimmed space-y-1">
        <li>Direct Messages (DMs) to let you reply to potential buyers.</li>
        <li>Basic profile info to link buyer handles (@maria) to your orders.</li>
        <li>We <strong>do NOT</strong> delete posts, manage comments/stories, or touch Instagram catalog settings.</li>
      </ul>
    </div>
  </div>
</template>