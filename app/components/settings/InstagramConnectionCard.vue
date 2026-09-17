<script setup lang="ts">
/**
 * Connect / disconnect the seller's Instagram professional account and show
 * the webhook health. Handles the `?ig=` result of the OAuth round-trip.
 */
const { store, fetchStore } = useStore()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const connected = computed(() => !!store.value?.instagram_connected)
const isOwner = computed(() => (store.value?.role ?? 'owner') === 'owner')
const webhookActive = computed(() => store.value?.webhook_status === 'active')
const username = computed(() => store.value?.instagram_username ? `@${store.value.instagram_username}` : '')

const connecting = ref(false)
const disconnecting = ref(false)

function connect() {
  connecting.value = true
  // Full-page redirect: the server builds the Meta consent URL and Meta sends
  // the seller back to /api/instagram/callback → /settings?ig=...
  window.location.href = '/api/instagram/connect'
}

async function disconnect() {
  disconnecting.value = true
  try {
    store.value = await $fetch<typeof store.value>('/api/instagram/disconnect', { method: 'POST' })
    toast.add({ title: 'Instagram disconnected', icon: 'i-lucide-unplug', color: 'neutral' })
  } catch (err) {
    toast.add({ title: 'Could not disconnect', description: errorMessage(err), color: 'error' })
  } finally {
    disconnecting.value = false
  }
}

function errorMessage(err: unknown) {
  const e = err as { data?: { message?: string }, message?: string }
  return e?.data?.message || e?.message || 'Something went wrong'
}

// Result of the OAuth round-trip lands here as ?ig=connected|cancelled|error.
onMounted(async () => {
  const status = route.query.ig as string | undefined
  if (!status) return
  await fetchStore()
  if (status === 'connected') {
    toast.add({
      title: 'Instagram connected',
      description: webhookActive.value
        ? `DMs to ${username.value} will now show up in your inbox.`
        : 'Connected, but webhook subscription failed — try disconnecting and reconnecting.',
      icon: 'i-simple-icons-instagram',
      color: webhookActive.value ? 'success' : 'warning'
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
  <UCard v-if="connected" variant="outline">
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <UIcon name="i-simple-icons-instagram" class="size-5 text-pink-500" />
          <h3 class="font-semibold text-highlighted">Connected Instagram account</h3>
        </div>
        <UBadge color="success" variant="subtle" class="gap-1">
          <span class="size-2 rounded-full bg-success animate-pulse" />
          Meta API connected
        </UBadge>
      </div>
    </template>

    <div class="flex flex-wrap items-center justify-between gap-4">
      <UUser
        :name="store?.name"
        :description="`${username} · ${formatCompactNumber(store?.instagram_followers_count)} followers · connected ${formatDate(store?.instagram_connected_at)}`"
        :avatar="{ src: store?.instagram_avatar_url || undefined, alt: store?.name }"
        size="xl"
      />
      <UTooltip :text="isOwner ? '' : 'Only the store owner can disconnect Instagram'" :disabled="isOwner">
        <UButton
          label="Disconnect account"
          icon="i-lucide-unplug"
          color="error"
          variant="outline"
          size="sm"
          :loading="disconnecting"
          :disabled="!isOwner"
          @click="disconnect"
        />
      </UTooltip>
    </div>

    <template #footer>
      <div class="space-y-2">
        <h5 class="text-xs font-semibold text-highlighted uppercase tracking-wider">Webhook status</h5>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <UAlert
            :icon="webhookActive ? 'i-lucide-circle-check' : 'i-lucide-alert-triangle'"
            :color="webhookActive ? 'success' : 'warning'"
            variant="soft"
            title="DM webhook"
            :description="webhookActive ? 'Receiving messages' : 'Not subscribed — reconnect'"
            :ui="{ title: 'text-xs', description: 'text-xs' }"
          />
          <UAlert icon="i-lucide-circle-check" color="success" variant="soft" title="Direct reply API" description="Ready" :ui="{ title: 'text-xs', description: 'text-xs' }" />
          <UAlert icon="i-lucide-circle-check" color="success" variant="soft" title="Order link sender" description="Active" :ui="{ title: 'text-xs', description: 'text-xs' }" />
        </div>
      </div>
    </template>
  </UCard>

  <UPageCard
    v-else
    variant="outline"
    icon="i-simple-icons-instagram"
    title="Connect your Instagram account"
    description="Link your Instagram Professional or Creator account to manage sales DMs directly from this workspace."
    :ui="{ container: 'items-center text-center p-8 sm:p-8', wrapper: 'items-center', leadingIcon: 'size-8 text-pink-500' }"
  >
    <template #footer>
      <div class="flex flex-col items-center gap-2">
        <UButton
          label="Connect Instagram"
          icon="i-simple-icons-instagram"
          color="primary"
          size="lg"
          :loading="connecting"
          :disabled="!isOwner"
          @click="connect"
        />
        <p v-if="!isOwner" class="text-xs text-dimmed">Only the store owner can connect Instagram.</p>
      </div>
    </template>
  </UPageCard>
</template>
