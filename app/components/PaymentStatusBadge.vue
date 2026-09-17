<script setup lang="ts">
import type { BadgeProps } from '@nuxt/ui'
import type { PaymentStatus } from '~/composables/useOrders'

withDefaults(defineProps<{ status: PaymentStatus, size?: BadgeProps['size'] }>(), { size: 'xs' })
</script>

<template>
  <UBadge :color="paymentStatusColor(status)" variant="subtle" :size="size">{{ status }}</UBadge>
</template>
