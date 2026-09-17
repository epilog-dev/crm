<script setup lang="ts">
import type { BadgeProps } from '@nuxt/ui'
import type { OrderStatus } from '~/composables/useOrders'

withDefaults(defineProps<{ status: OrderStatus, size?: BadgeProps['size'] }>(), { size: 'xs' })
</script>

<template>
  <UBadge :color="orderStatusColor(status)" variant="subtle" :size="size">{{ status }}</UBadge>
</template>
