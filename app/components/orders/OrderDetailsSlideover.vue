<script setup lang="ts">
import { LazyOrdersShippingSlipModal, LazyOrdersReceiptModal } from '#components'
import type { OrderStatus } from '~/composables/useOrders'

/**
 * Manage one order: payment status, lifecycle status, receipt, shipping slip.
 * Reads the order from the shared cache by id so every update made here is
 * reflected in the table/board behind it without re-fetching.
 */
const props = defineProps<{ orderId: string }>()
const emit = defineEmits<{ close: [] }>()

const { getOrder, updateOrderStatus, updatePaymentStatus } = useOrders()
const { store } = useStore()
const toast = useToast()
const overlay = useOverlay()

const order = computed(() => getOrder(props.orderId))
const saving = ref(false)

const statusItems = ORDER_STATUSES.map(status => ({ label: status, value: status }))

const addressText = computed(() => {
  const c = order.value?.customer
  if (!c) return ''
  return [c.name, c.phone, c.address, c.pincode ? `Pincode: ${c.pincode}` : ''].filter(Boolean).join('\n')
})

const mapsUrl = computed(() => {
  const c = order.value?.customer
  if (!c?.address) return ''
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.address} ${c.pincode ?? ''}`)}`
})

const orderUrl = computed(() => {
  if (!order.value) return ''
  return import.meta.client ? `${window.location.origin}${order.value.orderLink}` : order.value.orderLink
})

async function run(action: () => Promise<unknown>) {
  saving.value = true
  try {
    await action()
  } catch (err) {
    toast.add({ title: 'Update failed', description: (err as Error).message, color: 'error' })
  } finally {
    saving.value = false
  }
}

function setStatus(status: OrderStatus) {
  if (!order.value || order.value.status === status) return
  run(() => updateOrderStatus(order.value!.id, status))
}

// Marking paid also advances the lifecycle when it's still at the "pre-payment"
// stages; marking pending pulls it back to Awaiting Payment.
function togglePayment() {
  const current = order.value
  if (!current) return
  run(async () => {
    if (current.paymentStatus === 'Pending') {
      const updated = await updatePaymentStatus(current.id, 'Paid')
      if (updated.status === 'Confirmed' || updated.status === 'Awaiting Payment') {
        await updateOrderStatus(current.id, 'Paid')
      }
    } else {
      await updatePaymentStatus(current.id, 'Pending')
      await updateOrderStatus(current.id, 'Awaiting Payment')
    }
  })
}

const slipModal = overlay.create(LazyOrdersShippingSlipModal)
const receiptModal = overlay.create(LazyOrdersReceiptModal)

function openSlip() {
  if (order.value) slipModal.open({ order: order.value, storeName: store.value?.name ?? 'DMSell' })
}

function openReceipt() {
  if (order.value) receiptModal.open({ order: order.value })
}
</script>

<template>
  <USlideover
    :title="order ? `${order.orderCode} · ${order.customer.handle}` : 'Order details'"
    description="Manage order lifecycle & payment status"
    @update:open="(open: boolean) => !open && emit('close')"
  >
    <template #body>
      <div v-if="order" class="space-y-6">
        <!-- Buyer -->
        <UCard variant="soft" :ui="{ body: 'p-4 sm:p-4 space-y-3' }">
          <div class="flex items-center justify-between gap-3">
            <CustomerUser :name="order.customer.name" :handle="order.customer.handle" :avatar="order.customer.avatar" size="lg" />
            <UButton
              :to="instagramDmUrl(order.customer.handle)"
              target="_blank"
              label="DM on Instagram"
              icon="i-simple-icons-instagram"
              color="neutral"
              variant="outline"
              size="xs"
              class="shrink-0"
            />
          </div>

          <template v-if="order.customer.phone || order.customer.address">
            <USeparator />
            <dl class="text-xs space-y-1.5">
              <div v-if="order.customer.phone" class="flex gap-2">
                <dt class="text-muted w-16 shrink-0">Phone</dt>
                <dd class="text-highlighted font-medium">{{ order.customer.phone }}</dd>
              </div>
              <div v-if="order.customer.address" class="flex gap-2">
                <dt class="text-muted w-16 shrink-0">Address</dt>
                <dd class="text-highlighted">{{ order.customer.address }}<template v-if="order.customer.pincode">, {{ order.customer.pincode }}</template></dd>
              </div>
            </dl>
            <div class="flex items-center gap-2">
              <CopyButton :text="addressText" label="Copy address" success-message="Address copied" />
              <UButton
                v-if="mapsUrl"
                :to="mapsUrl"
                target="_blank"
                label="Maps"
                icon="i-lucide-map-pin"
                size="xs"
                color="neutral"
                variant="outline"
              />
            </div>
          </template>
          <p v-else class="text-xs text-dimmed">Delivery details will appear once the buyer confirms the order link.</p>
        </UCard>

        <!-- Item -->
        <section class="space-y-2">
          <h5 class="text-xs font-semibold uppercase tracking-wider text-muted">Item & pricing</h5>
          <div class="flex justify-between items-center gap-3 py-2 border-b border-default text-sm">
            <div class="min-w-0">
              <p class="font-semibold text-highlighted truncate">{{ order.item }}</p>
              <p v-if="order.variant" class="text-xs text-dimmed">Variant: {{ order.variant }}</p>
            </div>
            <span class="font-bold text-lg text-highlighted shrink-0">{{ formatMoney(order.price, order.currency) }}</span>
          </div>
        </section>

        <!-- Payment -->
        <UCard variant="outline" :ui="{ body: 'p-4 sm:p-4 space-y-3' }">
          <div class="flex justify-between items-center gap-2">
            <div>
              <h5 class="text-xs font-bold text-highlighted">Payment status</h5>
              <p class="text-[11px] text-dimmed">Mark when the buyer pays via UPI, bank or COD</p>
            </div>
            <PaymentStatusBadge :status="order.paymentStatus" size="sm" />
          </div>

          <div
            v-if="order.paymentRef"
            class="flex items-center justify-between gap-2 rounded-lg bg-elevated/40 border border-default px-2.5 py-1.5 text-[11px]"
          >
            <span class="text-muted shrink-0">UPI ref</span>
            <span class="font-mono font-semibold text-highlighted truncate">{{ order.paymentRef }}</span>
            <CopyButton :text="order.paymentRef" success-message="UPI reference copied" variant="ghost" />
          </div>
          <p v-else-if="order.paymentMethod === 'pay_now'" class="text-[11px] text-dimmed">
            No UPI reference from the buyer — look for “Order {{ order.orderCode }}” in your UPI app.
          </p>

          <UButton
            :label="order.paymentStatus === 'Paid' ? 'Mark as pending' : 'Mark as paid'"
            :icon="order.paymentStatus === 'Paid' ? 'i-lucide-undo-2' : 'i-lucide-badge-check'"
            :color="order.paymentStatus === 'Paid' ? 'warning' : 'success'"
            size="sm"
            block
            :loading="saving"
            @click="togglePayment"
          />
        </UCard>

        <!-- Receipt -->
        <UCard v-if="order.receiptUploaded" variant="outline" :ui="{ body: 'p-4 sm:p-4 space-y-3' }">
          <div class="flex justify-between items-center gap-2">
            <div>
              <h5 class="text-xs font-bold text-highlighted">Payment receipt</h5>
              <p class="text-[11px] text-dimmed">Screenshot uploaded by the buyer</p>
            </div>
            <UBadge color="success" variant="subtle" size="sm">Uploaded</UBadge>
          </div>
          <UButton label="View receipt" icon="i-lucide-receipt" color="neutral" variant="outline" size="sm" block @click="openReceipt" />
        </UCard>
        <UAlert
          v-else-if="order.paymentMethod === 'pay_now' && !order.paymentRef"
          icon="i-lucide-hourglass"
          color="neutral"
          variant="soft"
          description="Buyer chose Pay Now but hasn't left a UPI reference or screenshot yet."
          :ui="{ description: 'text-xs' }"
        />

        <!-- Lifecycle -->
        <section class="space-y-3">
          <h5 class="text-xs font-semibold uppercase tracking-wider text-muted">Order status</h5>
          <URadioGroup
            :model-value="order.status"
            :items="statusItems"
            variant="card"
            size="sm"
            indicator="hidden"
            :disabled="saving"
            :ui="{ fieldset: 'grid grid-cols-2 gap-2', label: 'text-xs font-semibold' }"
            @update:model-value="setStatus($event as OrderStatus)"
          />
        </section>

        <UButton
          label="Print / download shipping slip"
          icon="i-lucide-printer"
          color="neutral"
          variant="outline"
          block
          @click="openSlip"
        />

        <!-- Link -->
        <UFormField label="Customer order link" size="xs">
          <UFieldGroup class="w-full">
            <UInput :model-value="orderUrl" readonly class="flex-1 font-mono" size="xs" />
            <CopyButton :text="orderUrl" label="" success-message="Order link copied" />
            <UButton :to="order.orderLink" target="_blank" icon="i-lucide-external-link" size="xs" color="neutral" variant="outline" aria-label="Open order link" />
          </UFieldGroup>
        </UFormField>
      </div>

      <UEmpty v-else icon="i-lucide-search-x" title="Order not found" variant="naked" />
    </template>
  </USlideover>
</template>
