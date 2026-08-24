<script setup lang="ts">
definePageMeta({
  title: 'Dashboard'
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard>
        <template #header>
          <div class="font-medium text-muted text-sm">Active Orders</div>
        </template>
        <div class="text-3xl font-bold tracking-tight">12</div>
      </UCard>
      
      <UCard>
        <template #header>
          <div class="font-medium text-muted text-sm">Products Listed</div>
        </template>
        <div class="text-3xl font-bold tracking-tight">48</div>
      </UCard>
      
      <UCard>
        <template #header>
          <div class="font-medium text-muted text-sm">Total Customers</div>
        </template>
        <div class="text-3xl font-bold tracking-tight">156</div>
      </UCard>
    </div>
  </div>
</template>
