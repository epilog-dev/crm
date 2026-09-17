<script setup lang="ts">
/** Distraction-free view: just the two things a seller does all day. */
defineProps<{ activeDms: number, pendingPaymentCount: number }>()
</script>

<template>
  <UPageCard
    variant="soft"
    highlight
    :ui="{ container: 'p-6 sm:p-8 items-center text-center gap-6', wrapper: 'items-center', body: 'w-full' }"
    class="max-w-2xl mx-auto"
  >
    <template #leading>
      <div class="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        <UIcon name="i-lucide-sparkles" class="size-8" />
      </div>
    </template>
    <template #title>
      Focus Mode Active
    </template>
    <template #description>
      Distraction-free workspace. Zero analytics noise, metrics, or cluttered charts.
    </template>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left w-full">
      <UPageCard
        to="/inbox"
        variant="outline"
        icon="i-simple-icons-instagram"
        title="1. Reply & Create Orders"
        description="Chat with buyers in DM & generate 1-click order links."
        :ui="{ leadingIcon: 'text-pink-500' }"
      >
        <template #header>
          <UBadge color="primary" variant="subtle" size="xs">{{ activeDms }} Active DMs</UBadge>
        </template>
      </UPageCard>

      <UPageCard
        to="/orders"
        variant="outline"
        icon="i-lucide-shopping-bag"
        title="2. Fulfill Orders & Print Slips"
        description="Verify UPI payments & print 4x6 courier labels."
        :ui="{ leadingIcon: 'text-emerald-500' }"
      >
        <template #header>
          <UBadge color="warning" variant="subtle" size="xs">{{ pendingPaymentCount }} Pending Payment</UBadge>
        </template>
      </UPageCard>
    </div>
  </UPageCard>
</template>
