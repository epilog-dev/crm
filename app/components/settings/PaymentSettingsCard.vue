<script setup lang="ts">
/** UPI ID, COD, receipt and auto-link preferences. Saves on change (debounced in the composable). */
const { sellerSettings } = useSellerSettings()
</script>

<template>
  <UCard variant="outline">
    <template #header>
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-qr-code" class="size-5 text-primary" />
          <h3 class="font-semibold text-highlighted">Order form & payment settings</h3>
        </div>
        <UBadge color="primary" variant="subtle" size="xs">Saves automatically</UBadge>
      </div>
    </template>

    <div class="space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UFormField label="Store UPI ID / VPA" help="Shown on the buyer's payment screen." size="sm">
          <UInput v-model="sellerSettings.upiId" placeholder="e.g. storename@upi" class="w-full" />
        </UFormField>

        <UCard variant="soft" :ui="{ body: 'p-3 sm:p-3 space-y-2' }">
          <USwitch
            v-model="sellerSettings.codEnabled"
            label="Cash on Delivery (COD)"
            description="Let buyers pick COD on the order link."
          />
          <UBadge :color="sellerSettings.codEnabled ? 'success' : 'warning'" variant="subtle" size="xs">
            {{ sellerSettings.codEnabled ? 'Buyers can choose COD or Pay Now' : 'UPI only — forces Pay Now' }}
          </UBadge>
        </UCard>
      </div>

      <USeparator />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UCard variant="soft" :ui="{ body: 'p-3 sm:p-3' }">
          <USwitch
            v-model="sellerSettings.requireReceiptUpload"
            label="Require payment proof"
            description="Buyer must add a UPI reference (or a screenshot) before placing a prepaid order."
          />
        </UCard>
        <UCard variant="soft" :ui="{ body: 'p-3 sm:p-3' }">
          <USwitch
            v-model="sellerSettings.autoLinkDms"
            label="Auto-link DM messages"
            description="Send the order link straight into the Instagram chat when you create an order."
          />
        </UCard>
      </div>
    </div>
  </UCard>
</template>
