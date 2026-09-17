<script setup lang="ts">
import type { UserProps } from '@nuxt/ui'

/** Buyer identity block (avatar + name + @handle) with consistent sizing everywhere. */
withDefaults(defineProps<{
  name: string
  handle?: string
  avatar?: string
  size?: UserProps['size']
  /** Link the block to the buyer's Instagram DM thread. */
  linkToInstagram?: boolean
}>(), { handle: undefined, avatar: undefined, size: 'md', linkToInstagram: false })
</script>

<template>
  <UUser
    :name="name"
    :description="handle"
    :avatar="{ src: avatar || undefined, alt: name }"
    :size="size"
    :to="linkToInstagram && handle ? instagramDmUrl(handle) : undefined"
    :target="linkToInstagram ? '_blank' : undefined"
    :ui="{ wrapper: 'min-w-0', name: 'truncate', description: 'truncate' }"
  />
</template>
