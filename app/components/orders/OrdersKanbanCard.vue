<script setup lang="ts">
import type { OrderViewModel } from '~/composables/useOrders'

defineProps<{ order: OrderViewModel }>()
</script>

<template>
  <UPageCard
    variant="outline"
    draggable="true"
    class="cursor-grab active:cursor-grabbing hover:ring-primary/50 transition-colors"
    :ui="{ container: 'p-3 sm:p-3 gap-2' }"
  >
    <div class="flex items-center justify-between">
      <span class="font-mono text-xs font-bold text-primary">{{ order.orderCode }}</span>
      <span class="font-bold text-xs text-highlighted">{{ formatMoney(order.price, order.currency) }}</span>
    </div>
    <p class="text-xs font-semibold text-highlighted leading-snug line-clamp-2">
      {{ order.item }}<template v-if="order.variant"> ({{ order.variant }})</template>
    </p>
    <USeparator />
    <CustomerUser :name="order.customer.name" :handle="order.customer.handle" :avatar="order.customer.avatar" size="xs" />
  </UPageCard>
</template>
