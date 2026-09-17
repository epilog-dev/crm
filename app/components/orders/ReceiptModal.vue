<script setup lang="ts">
import type { OrderViewModel } from '~/composables/useOrders'

/** Shows the buyer's uploaded payment screenshot via a short-lived signed URL. */
const props = defineProps<{ order: OrderViewModel }>()
const emit = defineEmits<{ close: [] }>()

const { fetchReceiptUrl } = useOrders()
const receiptUrl = ref<string | null>(null)
const status = ref<'pending' | 'success' | 'error'>('pending')
const error = ref<Error | null>(null)

// Signed URLs are short-lived, so fetch a fresh one every time the modal opens.
onMounted(async () => {
  try {
    receiptUrl.value = await fetchReceiptUrl(props.order.id)
    status.value = 'success'
  } catch (err) {
    error.value = err as Error
    status.value = 'error'
  }
})
</script>

<template>
  <UModal
    title="Payment Receipt"
    :description="`${order.orderCode} - ${order.customer.handle}`"
    @update:open="(open: boolean) => !open && emit('close')"
  >
    <template #body>
      <div v-if="status === 'pending'" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-2" class="size-6 animate-spin text-dimmed" />
      </div>
      <UAlert
        v-else-if="error || !receiptUrl"
        icon="i-lucide-alert-triangle"
        color="error"
        variant="soft"
        title="Couldn't load the receipt"
        :description="error?.message || 'The file may have been removed.'"
      />
      <div v-else class="rounded-xl overflow-hidden border border-default bg-black/5 flex items-center justify-center">
        <img :src="receiptUrl" alt="Payment receipt" class="max-h-[70vh] w-full object-contain">
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          v-if="receiptUrl"
          :to="receiptUrl"
          target="_blank"
          label="Open in new tab"
          icon="i-lucide-external-link"
          color="neutral"
          variant="outline"
        />
        <UButton label="Close" color="neutral" variant="ghost" @click="emit('close')" />
      </div>
    </template>
  </UModal>
</template>
