<script setup lang="ts">
useSeoMeta({
  title: 'Store & Payment Settings - DM Sales Workspace',
  description: 'Manage store UPI ID, enable/disable COD for order links, and Meta API integration.'
})

const { sellerSettings } = useSellerSettings()
const { store, fetchStore } = useStore()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const isConnected = computed(() => !!store.value?.instagram_connected)
const isOwner = computed(() => (store.value?.role ?? 'owner') === 'owner')

const accountInfo = computed(() => ({
  username: store.value?.instagram_username ? `@${store.value.instagram_username}` : '',
  name: store.value?.name ?? '',
  followers: formatFollowers(store.value?.instagram_followers_count),
  avatar: store.value?.instagram_avatar_url ?? undefined,
  connectedAt: store.value?.instagram_connected_at
    ? new Date(store.value.instagram_connected_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '',
  webhookActive: store.value?.webhook_status === 'active'
}))

function formatFollowers(n: number | null | undefined) {
  if (n == null) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

function errorMessage(err: unknown) {
  const e = err as { data?: { message?: string }, message?: string }
  return e?.data?.message || e?.message || 'Something went wrong'
}

const isConnecting = ref(false)
const isDisconnecting = ref(false)

function handleConnect() {
  isConnecting.value = true
  // Full-page redirect: the server builds the Meta consent URL and Meta sends
  // the seller back to /api/instagram/callback → /settings?ig=...
  window.location.href = '/api/instagram/connect'
}

async function handleDisconnect() {
  isDisconnecting.value = true
  try {
    const updated = await $fetch<typeof store.value>('/api/instagram/disconnect', { method: 'POST' })
    store.value = updated
    toast.add({ title: 'Instagram disconnected', icon: 'i-lucide-unplug', color: 'neutral' })
  } catch (err) {
    toast.add({ title: 'Could not disconnect', description: errorMessage(err), color: 'error' })
  } finally {
    isDisconnecting.value = false
  }
}

// Result of the OAuth round-trip lands here as ?ig=connected|cancelled|error.
onMounted(async () => {
  const status = route.query.ig as string | undefined
  if (!status) return
  await fetchStore()
  if (status === 'connected') {
    toast.add({
      title: 'Instagram connected',
      description: accountInfo.value.webhookActive
        ? `DMs to ${accountInfo.value.username} will now show up in your inbox.`
        : 'Connected, but webhook subscription failed — try disconnecting and reconnecting.',
      icon: 'i-simple-icons-instagram',
      color: accountInfo.value.webhookActive ? 'success' : 'warning'
    })
  } else if (status === 'cancelled') {
    toast.add({ title: 'Connection cancelled', description: 'You closed the Meta permissions screen.', color: 'neutral' })
  } else {
    toast.add({ title: 'Instagram connection failed', description: (route.query.reason as string) || 'Unknown error', color: 'error' })
  }
  router.replace({ query: {} })
})
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto w-full space-y-6">
    <div class="text-center sm:text-left">
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
            <p class="text-xs text-muted mt-1">
              {{ accountInfo.webhookActive ? 'Webhook sync active' : 'Webhook not subscribed' }} • Connected on {{ accountInfo.connectedAt }}
            </p>
          </div>
        </div>

        <UButton
          label="Disconnect Account"
          color="error"
          variant="outline"
          size="sm"
          :loading="isDisconnecting"
          :disabled="!isOwner"
          @click="handleDisconnect"
        />
      </div>

      <div class="p-4 bg-elevated/30 rounded-b-xl space-y-2">
        <h5 class="text-xs font-semibold text-highlighted uppercase tracking-wider">Meta API Webhook Status</h5>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div class="p-2.5 bg-background rounded-lg border border-default">
            <span class="text-muted">DM Webhook:</span>
            <p v-if="accountInfo.webhookActive" class="font-medium text-emerald-500 flex items-center gap-1 mt-0.5">
              <UIcon name="i-lucide-check-circle-2" class="size-3.5" />
              Receiving Messages
            </p>
            <p v-else class="font-medium text-amber-500 flex items-center gap-1 mt-0.5">
              <UIcon name="i-lucide-alert-triangle" class="size-3.5" />
              Not subscribed — reconnect
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
        label="Connect Instagram"
        icon="i-simple-icons-instagram"
        color="primary"
        size="lg"
        :loading="isConnecting"
        :disabled="!isOwner"
        @click="handleConnect"
      />
      <p v-if="!isOwner" class="text-xs text-dimmed">Only the store owner can connect Instagram.</p>
    </UCard>

    <!-- Seller Payment UPI & Order Form Preferences Card -->
    <UCard class="divide-y divide-default">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-qr-code" class="size-5 text-primary" />
            <h3 class="font-semibold text-highlighted">Customer Order Form & Payment Settings</h3>
          </div>
          <UBadge color="primary" variant="subtle" size="xs">Live Form Sync</UBadge>
        </div>
      </template>

      <div class="p-5 space-y-5 text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block font-semibold text-highlighted mb-1">Store UPI ID / VPA</label>
            <UInput v-model="sellerSettings.upiId" placeholder="e.g. storename@upi" size="md" class="w-full" />
            <p class="text-[11px] text-dimmed mt-1">Displayed on customer QR payment screen.</p>
          </div>

          <!-- Interactive COD Toggle -->
          <div class="p-3 bg-elevated/30 rounded-xl border border-default space-y-2">
            <div class="flex items-center justify-between">
              <div>
                <span class="font-bold text-highlighted block">Cash on Delivery (COD)</span>
                <p class="text-[11px] text-dimmed">Allow buyers to pick COD on order link.</p>
              </div>
              <USwitch v-model="sellerSettings.codEnabled" />
            </div>
            <div class="pt-1 flex items-center gap-1.5 text-[11px]">
              <UBadge :color="sellerSettings.codEnabled ? 'success' : 'warning'" variant="subtle" size="xs">
                {{ sellerSettings.codEnabled ? 'COD Active' : 'COD Disabled (UPI Only)' }}
              </UBadge>
              <span class="text-dimmed">
                {{ sellerSettings.codEnabled ? 'Customers can choose COD or Pay Now' : 'Forces customer to Pay Now via UPI QR' }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-default/60">
          <!-- Require payment proof (UTR or screenshot) -->
          <div class="flex items-center justify-between p-3 bg-elevated/20 rounded-xl border border-default">
            <div>
              <span class="font-semibold text-highlighted block">Require payment proof</span>
              <p class="text-[11px] text-dimmed">Buyer must add a UPI reference number (or a screenshot) before placing a prepaid order.</p>
            </div>
            <USwitch v-model="sellerSettings.requireReceiptUpload" class="shrink-0" />
          </div>

          <!-- Auto Link DMs -->
          <div class="flex items-center justify-between p-3 bg-elevated/20 rounded-xl border border-default">
            <div>
              <span class="font-semibold text-highlighted block">Auto-Link DM Messages</span>
              <p class="text-[11px] text-dimmed">Auto-send order link directly inside Instagram chat.</p>
            </div>
            <USwitch v-model="sellerSettings.autoLinkDms" class="shrink-0" />
          </div>
        </div>
      </div>
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