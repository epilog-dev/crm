<script setup lang="ts">
definePageMeta({
  title: 'Packing Slips'
})
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <p class="text-muted text-sm">1-tap printable delivery slips with buyer landmark details.</p>
      <UButton icon="i-lucide-printer" variant="outline">Print All Slips</UButton>
    </div>

    <UCard>
      <div class="space-y-4">
        <!-- Placeholder for packing slip list -->
        <div class="flex items-center justify-between p-4 border border-default rounded-lg">
          <div>
            <div class="font-semibold text-sm">#1001 - @other_buyer</div>
            <div class="text-xs text-muted mt-1">Landmark: Opposite City Park, Gate 3</div>
          </div>
          <UButton size="sm" icon="i-lucide-printer">Print</UButton>
        </div>

        <div class="flex items-center justify-between p-4 border border-default rounded-lg">
          <div>
            <div class="font-semibold text-sm">#1000 - @insta_shopper</div>
            <div class="text-xs text-muted mt-1">Landmark: Beside Central Library</div>
          </div>
          <UButton size="sm" icon="i-lucide-printer">Print</UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
