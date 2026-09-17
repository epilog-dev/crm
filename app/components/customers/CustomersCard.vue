<script setup lang="ts">
import type { CustomerViewModel } from '~/composables/useCustomers'

defineProps<{ customer: CustomerViewModel }>()
</script>

<template>
  <UPageCard variant="outline" :ui="{ container: 'p-4 sm:p-4 gap-3' }">
    <CustomerUser :name="customer.name" :handle="customer.handle" :avatar="customer.avatar" link-to-instagram />

    <dl class="p-2.5 bg-elevated/30 rounded-lg text-xs space-y-1.5 border border-default">
      <div class="flex justify-between gap-2">
        <dt class="text-muted">Total orders</dt>
        <dd class="font-bold text-highlighted">{{ customer.totalOrders }}</dd>
      </div>
      <div class="flex justify-between gap-2">
        <dt class="text-muted">Total value</dt>
        <dd class="font-bold text-success">{{ formatMoney(customer.totalSpent) }}</dd>
      </div>
      <div class="flex justify-between gap-2">
        <dt class="text-muted">Phone</dt>
        <dd class="font-mono text-highlighted">{{ customer.phone || '—' }}</dd>
      </div>
    </dl>

    <div class="text-[11px] text-dimmed space-y-1">
      <p class="truncate"><span class="text-muted">Last order:</span> {{ customer.lastOrder || '—' }}</p>
      <p class="truncate"><span class="text-muted">Address:</span> {{ customer.address ? `${customer.address}, ${customer.pincode}` : '—' }}</p>
    </div>

    <UButton
      :to="instagramDmUrl(customer.handle)"
      target="_blank"
      label="DM buyer"
      icon="i-simple-icons-instagram"
      size="xs"
      color="neutral"
      variant="outline"
      block
    />
  </UPageCard>
</template>
