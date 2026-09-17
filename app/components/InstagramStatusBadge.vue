<script setup lang="ts">
/** Navbar pill linking to Settings: green when an Instagram account is connected. */
const { store } = useStore()
const connected = computed(() => !!store.value?.instagram_connected)
const label = computed(() =>
  connected.value
    ? `Instagram connected${store.value?.instagram_username ? ` (@${store.value.instagram_username})` : ''}`
    : 'Instagram not connected'
)
</script>

<template>
  <UButton
    to="/settings"
    :label="label"
    :color="connected ? 'success' : 'warning'"
    variant="subtle"
    size="xs"
    class="hidden sm:inline-flex rounded-full font-semibold"
  >
    <template #leading>
      <span :class="['size-2 rounded-full', connected ? 'bg-success animate-pulse' : 'bg-warning']" />
    </template>
  </UButton>
</template>
