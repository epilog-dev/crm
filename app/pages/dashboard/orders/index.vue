<script setup lang="ts">
definePageMeta({
  title: 'Orders Kanban Board'
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <p class="text-muted text-sm">Live pipeline for 15-min holds, paid items, and courier slips.</p>
      <UButton icon="i-lucide-plus">New Order</UButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 15-Min Hold Column -->
      <UCard>
        <template #header>
          <div class="font-semibold text-sm">15-Min Hold</div>
        </template>
        <div class="space-y-3 min-h-[300px]">
          <div class="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm border border-default">
            <div class="font-medium">#1002 - @buyer_handle</div>
            <div class="text-xs text-muted mt-1">Holds expires in 12m</div>
          </div>
        </div>
      </UCard>

      <!-- Paid Column -->
      <UCard>
        <template #header>
          <div class="font-semibold text-sm">Paid</div>
        </template>
        <div class="space-y-3 min-h-[300px]">
          <div class="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm border border-default">
            <div class="font-medium">#1001 - @other_buyer</div>
            <div class="text-xs text-muted mt-1">Paid via bank transfer</div>
          </div>
        </div>
      </UCard>

      <!-- Courier Slips Column -->
      <UCard>
        <template #header>
          <div class="font-semibold text-sm">Courier Slips</div>
        </template>
        <div class="space-y-3 min-h-[300px]">
          <!-- Empty state placeholder -->
          <div class="flex items-center justify-center h-[200px] border border-dashed border-default rounded-lg text-muted text-sm">
            No orders ready
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
