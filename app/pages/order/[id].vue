<script setup lang="ts">
import { ref, computed } from 'vue'

const route = useRoute()

// Mock data store for orders
const mockOrders = ref<Record<string, any>>({
  'ORD-1082': {
    id: 'ORD-1082',
    customer: {
      name: 'Maria Santos',
      handle: '@maria',
      phone: '',
      address: '',
      pincode: ''
    },
    item: 'Nike Vintage Windbreaker Jacket',
    variant: 'M',
    price: 1500,
    currency: '₹',
    status: 'Confirmed', // Confirmed, Awaiting Payment, Paid, Shipped, Delivered, Cancelled
    paymentStatus: 'Pending', // Pending, Paid
    confirmedByCustomer: false,
    createdAt: 'Today, 2:30 PM'
  },
  'ORD-1079': {
    id: 'ORD-1079',
    customer: {
      name: 'Priya Sharma',
      handle: '@priya_s',
      phone: '9876543210',
      address: 'Flat 402, Sunshine Apartments, MG Road, Bengaluru',
      pincode: '560001'
    },
    item: 'Silk Slip Dress (Emerald)',
    variant: 'S',
    price: 2400,
    currency: '₹',
    status: 'Awaiting Payment',
    paymentStatus: 'Pending',
    confirmedByCustomer: true,
    createdAt: 'Yesterday'
  }
})

const orderId = computed(() => (route.params.id as string) || 'ORD-1082')

const order = computed(() => {
  if (mockOrders.value[orderId.value]) {
    return mockOrders.value[orderId.value]
  }
  // Default fallback order if id not found
  return {
    id: orderId.value,
    customer: {
      name: 'Maria Santos',
      handle: '@maria',
      phone: '',
      address: '',
      pincode: ''
    },
    item: 'Nike Vintage Windbreaker Jacket',
    variant: 'M',
    price: 1500,
    currency: '₹',
    status: 'Confirmed',
    paymentStatus: 'Pending',
    confirmedByCustomer: false,
    createdAt: 'Just now'
  }
})

const formData = ref({
  name: order.value.customer.name || '',
  phone: order.value.customer.phone || '',
  address: order.value.customer.address || '',
  pincode: order.value.customer.pincode || ''
})

const isSubmitting = ref(false)
const isSubmitted = ref(order.value.confirmedByCustomer)

function handleConfirmOrder() {
  if (!formData.value.name || !formData.value.phone || !formData.value.address || !formData.value.pincode) return
  
  isSubmitting.value = true
  setTimeout(() => {
    order.value.customer.name = formData.value.name
    order.value.customer.phone = formData.value.phone
    order.value.customer.address = formData.value.address
    order.value.customer.pincode = formData.value.pincode
    order.value.status = 'Awaiting Payment'
    order.value.confirmedByCustomer = true
    isSubmitted.value = true
    isSubmitting.value = false
  }, 800)
}

const statusSteps = ['Confirmed', 'Awaiting Payment', 'Paid', 'Shipped', 'Delivered']

function getStepIndex(status: string) {
  return statusSteps.indexOf(status)
}

useSeoMeta({
  title: `Order #${orderId.value} - Confirm Details`,
  description: 'Customer order confirmation and delivery tracking page'
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-between p-4 sm:p-6 font-sans">
    <div class="max-w-md mx-auto w-full space-y-6 py-6">
      
      <!-- Store Header -->
      <div class="text-center space-y-1">
        <div class="size-14 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
          ST
        </div>
        <h1 class="text-lg font-bold text-highlighted">Retro Thrift Store</h1>
        <p class="text-xs text-dimmed">Instagram Sales Order #{{ order.id }}</p>
      </div>

      <!-- Item Details Card -->
      <div class="bg-background rounded-2xl border border-default p-4 shadow-xs space-y-3">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="font-bold text-highlighted text-base">{{ order.item }}</h2>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-dimmed font-medium">
                Variant: {{ order.variant }}
              </span>
              <span class="text-xs text-muted">For {{ order.customer.handle }}</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-lg font-extrabold text-highlighted">{{ order.currency }}{{ order.price.toLocaleString('en-IN') }}</span>
          </div>
        </div>
      </div>

      <!-- Order Status Progress bar (if already confirmed or just confirmed) -->
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
                Pay seller via UPI / Bank transfer / COD as agreed in DM.
              </p>
              <p v-if="step === 'Paid' && order.paymentStatus === 'Paid'" class="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                Payment verified by seller.
              </p>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-default space-y-1 text-xs">
          <p class="font-semibold text-highlighted">Shipping Address:</p>
          <p class="text-dimmed">{{ formData.name }} • {{ formData.phone }}</p>
          <p class="text-dimmed">{{ formData.address }}, {{ formData.pincode }}</p>
        </div>
      </div>

      <!-- Customer Details Form (if not confirmed yet) -->
      <div v-else class="bg-background rounded-2xl border border-default p-5 shadow-xs space-y-4">
        <div>
          <h3 class="font-bold text-sm text-highlighted">Enter Shipping Information</h3>
          <p class="text-xs text-dimmed">Please fill in your delivery details to confirm this order with the seller.</p>
        </div>

        <form @submit.prevent="handleConfirmOrder" class="space-y-3">
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

          <UButton
            type="submit"
            label="Confirm Order & Request Delivery"
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
        <p>Payments are handled directly with the Instagram seller. Our app does not process money directly.</p>
      </div>

    </div>
  </div>
</template>
