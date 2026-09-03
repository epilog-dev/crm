<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { renderSVG } from 'uqr'

definePageMeta({
  layout: false,
  auth: false
})

interface PublicOrderItem {
  item_name: string
  variant_label: string | null
  quantity: number
  unit_price: number
  currency: string
}

interface PublicOrder {
  id: string
  order_code: string
  status: 'Confirmed' | 'Awaiting Payment' | 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled'
  payment_status: 'Pending' | 'Paid'
  payment_method: 'pay_now' | 'cod' | null
  currency: string
  customer_name: string | null
  customer_phone: string | null
  customer_address: string | null
  customer_pincode: string | null
  confirmed_by_customer: boolean
  receipt_uploaded: boolean
  payment_ref: string | null
  created_at: string
  order_items: PublicOrderItem[]
  store: { name: string, upi_vpa: string | null, cod_enabled: boolean, require_receipt_upload: boolean }
}

const route = useRoute()
const orderCode = computed(() => route.params.id as string)

const order = ref<PublicOrder | null>(null)
const loadError = ref('')
const loadingOrder = ref(true)

async function loadOrder() {
  loadingOrder.value = true
  loadError.value = ''
  try {
    order.value = await $fetch<PublicOrder>(`/api/order/${orderCode.value}`)
    formData.value.name = order.value.customer_name || formData.value.name
    formData.value.phone = order.value.customer_phone || formData.value.phone
    formData.value.address = order.value.customer_address || formData.value.address
    formData.value.pincode = order.value.customer_pincode || formData.value.pincode
    if (order.value.payment_method) formData.value.paymentMethod = order.value.payment_method
    if (order.value.payment_ref) formData.value.paymentRef = order.value.payment_ref
  } catch {
    loadError.value = 'This order link is invalid or has expired.'
  } finally {
    loadingOrder.value = false
  }
}

onMounted(loadOrder)

const item = computed(() => order.value?.order_items?.[0])

function money(amount: number | null | undefined, currency = 'INR') {
  const n = Number(amount ?? 0).toLocaleString('en-IN')
  return currency === 'INR' ? `₹${n}` : `${currency} ${n}`
}
const allowCod = computed(() => order.value?.store?.cod_enabled ?? false)
const requireReceipt = computed(() => order.value?.store?.require_receipt_upload ?? true)
const isSubmitted = computed(() => order.value?.confirmed_by_customer ?? false)

// UPI deep link — a prefilled payment intent with fixed values.
// Seller-set: payee VPA (store.upi_vpa) + payee name (store.name).
// Order-set: amount (unit_price, locked in the UPI app), note + reference (order code).
const upiVpa = computed(() => order.value?.store?.upi_vpa?.trim() || '')
const upiQuery = computed(() => {
  if (!upiVpa.value || !order.value || !item.value) return ''
  const params = new URLSearchParams({
    pa: upiVpa.value,
    pn: order.value.store.name,
    am: String(item.value.unit_price),
    cu: 'INR',
    tn: `Order ${order.value.order_code}`,
    tr: order.value.order_code
  })
  // UPI apps are happiest with %20 rather than "+" for spaces in the note.
  return params.toString().replace(/\+/g, '%20')
})
// Generic UPI intent — Android routes it to whichever UPI app is set as default.
const upiLink = computed(() => (upiQuery.value ? `upi://pay?${upiQuery.value}` : ''))
// Same payload, addressed to a specific app so the buyer picks instead of
// getting the system default (which might be WhatsApp Pay, a bank app, etc.).
const upiApps = computed(() => {
  const q = upiQuery.value
  if (!q) return []
  return [
    { name: 'Google Pay', href: `tez://upi/pay?${q}`, dot: '#4285F4' },
    { name: 'PhonePe', href: `phonepe://pay?${q}`, dot: '#5F259F' },
    { name: 'Paytm', href: `paytmmp://pay?${q}`, dot: '#00BAF2' },
    { name: 'Other UPI app', href: `upi://pay?${q}`, dot: '#16A34A' }
  ]
})
const upiQrSvg = computed(() =>
  upiLink.value
    ? renderSVG(upiLink.value, { ecc: 'M', border: 2, whiteColor: '#ffffff', blackColor: '#0a0a0a' })
    : ''
)

const copiedVpa = ref(false)
function copyVpa() {
  if (!upiVpa.value) return
  navigator.clipboard.writeText(upiVpa.value)
  copiedVpa.value = true
  setTimeout(() => { copiedVpa.value = false }, 1800)
}

// UPI deep links only launch where a UPI app is installed (phones). On desktop
// the click quietly does nothing, so there we lead with the QR and show a hint.
const isAndroid = ref(false)
const isMobile = ref(false)
const upiAppMissing = ref(false)
onMounted(() => {
  const ua = navigator.userAgent
  isAndroid.value = /android/i.test(ua)
  isMobile.value = isAndroid.value || /iphone|ipad|ipod/i.test(ua)
})
function onUpiClick() {
  upiAppMissing.value = false
  // If a UPI app takes over, the tab goes hidden. If it never does, nothing
  // opened — show the "scan the QR instead" hint.
  let leftPage = false
  const onHide = () => { if (document.visibilityState === 'hidden') leftPage = true }
  document.addEventListener('visibilitychange', onHide)
  setTimeout(() => {
    document.removeEventListener('visibilitychange', onHide)
    if (!leftPage) upiAppMissing.value = true
  }, 1600)
}

const formData = ref({
  name: '',
  phone: '',
  address: '',
  pincode: '',
  paymentMethod: 'pay_now' as 'pay_now' | 'cod',
  paymentRef: '',
  receiptFile: null as File | null,
  receiptFileName: ''
})

const isSubmitting = ref(false)
const submitError = ref('')

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    formData.value.receiptFile = input.files[0]
    formData.value.receiptFileName = input.files[0].name
  }
}

async function handleConfirmOrder() {
  if (!formData.value.name || !formData.value.phone || !formData.value.address || !formData.value.pincode) return

  if (
    formData.value.paymentMethod === 'pay_now'
    && requireReceipt.value
    && !formData.value.paymentRef.trim()
    && !formData.value.receiptFile
  ) {
    submitError.value = 'Add your UPI reference number (or a screenshot) so the seller can confirm your payment.'
    return
  }

  submitError.value = ''
  isSubmitting.value = true
  try {
    if (formData.value.paymentMethod === 'pay_now' && formData.value.receiptFile) {
      const body = new FormData()
      body.append('file', formData.value.receiptFile)
      await $fetch(`/api/order/${orderCode.value}/receipt`, { method: 'POST', body })
    }

    order.value = await $fetch<PublicOrder>(`/api/order/${orderCode.value}`, {
      method: 'PATCH',
      body: {
        name: formData.value.name,
        phone: formData.value.phone,
        address: formData.value.address,
        pincode: formData.value.pincode,
        payment_method: formData.value.paymentMethod,
        payment_ref: formData.value.paymentRef.trim()
      }
    })
  } catch (err) {
    const message = (err as { data?: { message?: string } })?.data?.message
    submitError.value = message || 'Something went wrong. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const statusSteps = ['Confirmed', 'Awaiting Payment', 'Paid', 'Shipped', 'Delivered']

function getStepIndex(status: string) {
  return statusSteps.indexOf(status)
}

useSeoMeta({
  title: `Order #${orderCode.value} - Confirm Details`,
  description: 'Customer order confirmation, payment QR, and delivery tracking page'
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-between p-4 sm:p-6 font-sans">
    <!-- Loading state -->
    <div v-if="loadingOrder" class="flex-1 flex items-center justify-center">
      <UIcon name="i-lucide-loader-2" class="size-6 animate-spin text-dimmed" />
    </div>

    <!-- Error state -->
    <div v-else-if="loadError || !order" class="flex-1 flex flex-col items-center justify-center text-center space-y-2 max-w-sm mx-auto">
      <UIcon name="i-lucide-package-x" class="size-8 text-dimmed" />
      <h1 class="text-base font-bold text-highlighted">Order not found</h1>
      <p class="text-xs text-dimmed">{{ loadError || 'This order link is invalid.' }}</p>
    </div>

    <div v-else class="max-w-md mx-auto w-full space-y-6 py-6">

      <!-- Store Header -->
      <div class="text-center space-y-1">
        <div class="size-14 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
          {{ order.store.name.slice(0, 2).toUpperCase() }}
        </div>
        <h1 class="text-lg font-bold text-highlighted">{{ order.store.name }}</h1>
        <p class="text-xs text-dimmed">Instagram Sales Order #{{ order.order_code }}</p>
      </div>

      <!-- Item Details Card -->
      <div v-if="item" class="bg-background rounded-2xl border border-default p-4 shadow-xs space-y-3">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="font-bold text-highlighted text-base">{{ item.item_name }}</h2>
            <div v-if="item.variant_label" class="flex items-center gap-2 mt-1">
              <span class="text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-dimmed font-medium">
                Variant: {{ item.variant_label }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-lg font-extrabold text-highlighted">{{ money(item.unit_price, item.currency) }}</span>
          </div>
        </div>
      </div>

      <!-- Order Status Progress bar (if already confirmed) -->
      <div v-if="isSubmitted" class="bg-background rounded-2xl border border-default p-5 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm text-highlighted">Order Status</h3>
          <UBadge
            :color="order.status === 'Paid' ? 'success' : order.status === 'Shipped' ? 'info' : order.status === 'Delivered' ? 'success' : 'warning'"
            variant="subtle"
          >
            {{ order.status }}
          </UBadge>
        </div>

        <!-- Timeline steps -->
        <div class="relative pl-6 space-y-4 border-l-2 border-default">
          <div
            v-for="(step, idx) in statusSteps"
            :key="step"
            class="relative"
          >
            <span
              :class="[
                'absolute -left-[31px] top-0.5 size-4 rounded-full border-2 bg-background flex items-center justify-center text-[10px]',
                getStepIndex(order.status) >= idx
                  ? 'border-primary bg-primary text-inverted'
                  : 'border-default text-transparent'
              ]"
            >
              ✓
            </span>
            <div class="text-xs">
              <span :class="getStepIndex(order.status) >= idx ? 'font-bold text-highlighted' : 'text-dimmed'">
                {{ step }}
              </span>
              <p v-if="step === 'Awaiting Payment' && order.status === 'Awaiting Payment'" class="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
                <span v-if="order.payment_method === 'pay_now' && order.receipt_uploaded">Receipt uploaded! Seller will verify payment shortly.</span>
                <span v-else-if="order.payment_method === 'pay_now'">Seller will verify your payment shortly.</span>
                <span v-else>Pay Cash on Delivery (COD) when package arrives.</span>
              </p>
              <p v-if="step === 'Paid' && order.payment_status === 'Paid'" class="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                Payment verified by seller.
              </p>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-default space-y-1 text-xs">
          <p class="font-semibold text-highlighted">Delivery Information:</p>
          <p class="text-dimmed">{{ formData.name }} • {{ formData.phone }}</p>
          <p class="text-dimmed">{{ formData.address }}, {{ formData.pincode }}</p>
          <p class="text-muted mt-1">Payment Choice: <strong class="text-highlighted uppercase">{{ order.payment_method === 'pay_now' ? 'UPI / QR Paid' : 'Cash on Delivery (COD)' }}</strong></p>
          <p v-if="order.payment_ref" class="text-muted">UPI reference: <strong class="text-highlighted font-mono">{{ order.payment_ref }}</strong></p>
        </div>
      </div>

      <!-- Customer Details & Payment Options Form (if not confirmed yet) -->
      <div v-else class="bg-background rounded-2xl border border-default p-5 shadow-xs space-y-5">
        <div>
          <h3 class="font-bold text-sm text-highlighted">Delivery & Payment Details</h3>
          <p class="text-xs text-dimmed">Fill in your shipping details and select your payment method.</p>
        </div>

        <form @submit.prevent="handleConfirmOrder" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-highlighted mb-1">Full Name</label>
            <UInput v-model="formData.name" placeholder="e.g. Maria Santos" required size="md" class="w-full" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-highlighted mb-1">Phone Number</label>
            <UInput v-model="formData.phone" placeholder="10-digit mobile number" required size="md" class="w-full" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-highlighted mb-1">Shipping Address</label>
            <UTextarea v-model="formData.address" placeholder="House/Flat No., Building, Street, Area" required size="md" class="w-full" :rows="3" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-highlighted mb-1">Pincode</label>
            <UInput v-model="formData.pincode" placeholder="e.g. 560001" required size="md" class="w-full" />
          </div>

          <!-- PAYMENT METHOD SELECTOR -->
          <div class="space-y-2 pt-2 border-t border-default">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-highlighted">Select Payment Method</label>
              <span v-if="!allowCod" class="text-[10px] font-semibold text-amber-500">
                COD Disabled by Seller (Prepaid Only)
              </span>
            </div>

            <div :class="['grid gap-3', allowCod ? 'grid-cols-2' : 'grid-cols-1']">
              <!-- Pay Now (UPI / QR) -->
              <div
                @click="formData.paymentMethod = 'pay_now'"
                :class="[
                  'p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-1',
                  formData.paymentMethod === 'pay_now'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-default bg-elevated/20 hover:border-highlighted/30'
                ]"
              >
                <UIcon name="i-lucide-qr-code" class="size-6 text-primary" />
                <span class="text-xs font-bold text-highlighted">Pay Now</span>
                <span class="text-[10px] text-dimmed">UPI / Scan QR</span>
              </div>

              <!-- Cash on Delivery (COD) - Conditionally rendered based on Seller Settings -->
              <div
                v-if="allowCod"
                @click="formData.paymentMethod = 'cod'"
                :class="[
                  'p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-1',
                  formData.paymentMethod === 'cod'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-default bg-elevated/20 hover:border-highlighted/30'
                ]"
              >
                <UIcon name="i-lucide-banknote" class="size-6 text-emerald-500" />
                <span class="text-xs font-bold text-highlighted">Cash on Delivery</span>
                <span class="text-[10px] text-dimmed">Pay when delivered</span>
              </div>
            </div>
          </div>

          <!-- PAY NOW CONDITIONAL CONTENT: QR Code & Receipt Upload -->
          <div v-if="formData.paymentMethod === 'pay_now'" class="p-4 rounded-xl bg-elevated/40 border border-default space-y-3">
            <div class="text-center space-y-3">
              <span class="block text-xs font-bold text-highlighted">
                Pay {{ money(item?.unit_price, item?.currency) }} to {{ order.store.name }}
              </span>

              <template v-if="upiLink">
                <!-- Prefilled UPI payment (seller's VPA + name, this order's amount
                     locked, order code as note/ref). On phones the buyer picks their
                     app directly; on desktop the QR below is the real path. -->
                <template v-if="isMobile">
                  <div class="grid grid-cols-2 gap-2">
                    <a
                      v-for="app in upiApps"
                      :key="app.name"
                      :href="app.href"
                      class="flex items-center justify-center gap-2 rounded-xl border border-default bg-background py-2.5 text-xs font-bold text-highlighted transition-transform active:scale-[0.98]"
                      @click="onUpiClick"
                    >
                      <span class="size-2 shrink-0 rounded-full" :style="{ background: app.dot }" />
                      {{ app.name }}
                    </a>
                  </div>
                  <p class="text-[10px] text-dimmed">Amount is locked at {{ money(item?.unit_price, item?.currency) }}.</p>
                </template>

                <a
                  v-else
                  :href="upiLink"
                  class="flex w-full items-center justify-center gap-2 rounded-xl border border-default bg-background py-3 text-sm font-bold text-highlighted shadow-xs transition-transform active:scale-[0.99]"
                  @click="onUpiClick"
                >
                  <UIcon name="i-lucide-smartphone" class="size-4" />
                  Open a UPI app to pay
                </a>

                <p v-if="upiAppMissing" class="text-[11px] text-amber-600 dark:text-amber-400">
                  Couldn't open that app — try another, or scan the QR / copy the UPI ID below.
                </p>

                <!-- The same prefilled payment as a scannable QR -->
                <div class="space-y-1.5 pt-1">
                  <p class="text-[11px] font-semibold text-highlighted">
                    {{ isMobile ? '…or scan from another phone' : 'Scan with any UPI app' }}
                  </p>
                  <div
                    class="mx-auto size-44 rounded-xl border border-default bg-white p-2.5 shadow-xs [&>svg]:size-full"
                    v-html="upiQrSvg"
                  />
                </div>

                <!-- Manual fallback: copy the VPA and pay this amount by hand -->
                <button
                  type="button"
                  class="inline-flex cursor-pointer items-center gap-1.5 font-mono text-[11px] text-dimmed transition-colors hover:text-highlighted"
                  @click="copyVpa"
                >
                  <UIcon
                    :name="copiedVpa ? 'i-lucide-check' : 'i-lucide-copy'"
                    class="size-3"
                    :class="copiedVpa ? 'text-emerald-500' : ''"
                  />
                  {{ copiedVpa ? 'UPI ID copied' : `Copy UPI ID · ${upiVpa}` }}
                </button>
              </template>

              <div v-else class="rounded-xl border border-dashed border-default p-3 text-[11px] text-dimmed">
                This seller hasn't added a UPI ID yet. Message them for payment details, or choose Cash on Delivery.
              </div>
            </div>

            <!-- Payment proof: a reference number is the low-friction way; screenshot is optional -->
            <div class="space-y-3 pt-3 border-t border-default/60">
              <div>
                <label for="upi-ref" class="block text-xs font-semibold text-highlighted">
                  UPI reference number
                  <span v-if="requireReceipt && !formData.receiptFile" class="text-primary">*</span>
                  <span v-else class="font-normal text-dimmed">(recommended)</span>
                </label>
                <UInput
                  id="upi-ref"
                  v-model="formData.paymentRef"
                  inputmode="numeric"
                  autocomplete="off"
                  placeholder="e.g. 412345678901"
                  size="md"
                  class="w-full mt-1"
                />
                <p class="text-[10px] text-muted mt-1">
                  The 12-digit number your UPI app shows after you pay (also next to the payment in its history). Lets the seller confirm without asking.
                </p>
              </div>

              <details class="group">
                <summary class="flex cursor-pointer list-none items-center gap-1.5 text-[11px] font-semibold text-dimmed hover:text-highlighted [&::-webkit-details-marker]:hidden">
                  <UIcon name="i-lucide-paperclip" class="size-3.5 shrink-0" />
                  <span class="min-w-0 truncate">
                    {{ formData.receiptFileName ? `Screenshot attached · ${formData.receiptFileName}` : 'Prefer to attach a screenshot? (optional)' }}
                  </span>
                  <UIcon name="i-lucide-chevron-down" class="size-3.5 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div class="mt-2 flex items-center justify-center w-full">
                  <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-default rounded-xl cursor-pointer bg-background hover:bg-elevated/30 transition-colors">
                    <div class="flex flex-col items-center justify-center pt-2 pb-3">
                      <UIcon name="i-lucide-upload-cloud" class="size-6 text-dimmed mb-1" />
                      <p class="text-xs text-dimmed font-medium">
                        {{ formData.receiptFileName || 'Tap to upload payment screenshot' }}
                      </p>
                      <p v-if="!formData.receiptFileName" class="text-[10px] text-muted">PNG, JPG or WebP up to 5MB</p>
                    </div>
                    <input type="file" accept="image/*" class="hidden" @change="handleFileSelect" >
                  </label>
                </div>
              </details>
            </div>
          </div>

          <UAlert
            v-if="submitError"
            color="error"
            variant="soft"
            :description="submitError"
          />

          <UButton
            type="submit"
            :label="formData.paymentMethod === 'pay_now' ? 'I\'ve paid — confirm order' : 'Confirm Cash on Delivery Order'"
            color="primary"
            size="lg"
            block
            class="mt-2 font-bold cursor-pointer"
            :loading="isSubmitting"
          />
        </form>
      </div>

      <div class="text-center text-[11px] text-muted space-y-1">
        <p>⚡ Powered by DM Sales Workspace</p>
        <p>Direct seller fulfillment. No payment gateway fees charged.</p>
      </div>

    </div>
  </div>
</template>
