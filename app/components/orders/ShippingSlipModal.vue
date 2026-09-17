<script setup lang="ts">
import type { OrderViewModel } from '~/composables/useOrders'

/**
 * 4x6 courier label. The slip itself is intentionally plain black-on-white
 * markup rather than themed components: it has to print identically in light
 * and dark mode and on thermal printers (see the print rules in main.css).
 */
defineProps<{ order: OrderViewModel, storeName: string }>()
const emit = defineEmits<{ close: [] }>()

function print() {
  window.print()
}
</script>

<template>
  <UModal
    title="Print Shipping Slip"
    description="Standard 4x6 inch shipping label for courier polybag"
    @update:open="(open: boolean) => !open && emit('close')"
  >
    <template #body>
      <div class="print-area bg-white text-black p-5 rounded-xl border-2 border-dashed border-black space-y-4 font-sans">
        <div class="flex justify-between items-start border-b-2 border-black pb-3">
          <div>
            <h3 class="font-extrabold text-base tracking-tight uppercase">{{ storeName }}</h3>
            <p class="text-[11px] text-zinc-600">Instagram DM order</p>
          </div>
          <span class="font-mono font-extrabold text-sm border-2 border-black px-2 py-0.5 rounded">{{ order.orderCode }}</span>
        </div>

        <div class="space-y-1">
          <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Deliver to</span>
          <p class="font-extrabold text-base leading-snug">{{ order.customer.name }}</p>
          <p class="text-xs font-semibold text-pink-600">{{ order.customer.handle }} • {{ order.customer.phone || 'Phone pending' }}</p>
          <p class="text-xs leading-normal font-medium mt-1">
            {{ order.customer.address || 'Address pending customer confirmation' }}<br>
            Pincode: <strong class="text-sm font-extrabold">{{ order.customer.pincode || '-----' }}</strong>
          </p>
        </div>

        <div class="border-t-2 border-black pt-3 space-y-2">
          <div class="flex justify-between items-center text-xs gap-2">
            <span class="font-bold truncate">{{ order.item }}<template v-if="order.variant"> ({{ order.variant }})</template></span>
            <span class="font-mono font-bold shrink-0">{{ formatMoney(order.price, order.currency) }}</span>
          </div>
          <span class="inline-block px-2 py-0.5 rounded bg-zinc-100 text-[11px] font-bold border border-zinc-300">
            Payment: {{ order.paymentStatus === 'Paid' ? 'Prepaid (UPI)' : 'COD / Pending' }}
          </span>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton label="Close" color="neutral" variant="ghost" @click="emit('close')" />
        <UButton label="Print label" icon="i-lucide-printer" color="primary" @click="print" />
      </div>
    </template>
  </UModal>
</template>
