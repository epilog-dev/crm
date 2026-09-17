<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Conversation } from '~/composables/useConversations'

/** Turns a DM thread into an order. Resolves with the create result, or undefined if dismissed. */
export interface CreateOrderResult {
  orderCode: string
  autoLinked: boolean
  dmError: string | null
}

const props = defineProps<{ conversation: Conversation }>()
const emit = defineEmits<{ close: [result?: CreateOrderResult] }>()

const { createOrder } = useOrders()
const toast = useToast()

const schema = z.object({
  item: z.string().trim().min(1, 'Item name is required'),
  variant: z.string().trim().optional(),
  price: z.number({ message: 'Enter a price' }).positive('Price must be greater than 0')
})
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({ item: '', variant: '', price: undefined })
const submitting = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  submitting.value = true
  try {
    const created = await createOrder({
      conversationId: props.conversation.id,
      customer: { handle: props.conversation.handle, name: props.conversation.name, avatarUrl: props.conversation.avatar || undefined },
      itemName: event.data.item,
      variantLabel: event.data.variant || undefined,
      price: event.data.price
    })
    emit('close', { orderCode: created.orderCode, autoLinked: created.autoLinked, dmError: created.dmError })
  } catch (err) {
    toast.add({ title: 'Could not create order', description: (err as Error).message, color: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <UModal
    title="Create order from DM"
    description="Turn a confirmed customer DM into a tracked order link."
    @update:open="(open: boolean) => !open && emit('close')"
  >
    <template #body>
      <UForm id="create-order-form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UCard variant="soft" :ui="{ body: 'p-3 sm:p-3' }">
          <div class="flex items-center justify-between gap-2">
            <CustomerUser :name="conversation.name" :handle="conversation.handle" :avatar="conversation.avatar" size="sm" />
            <UBadge v-if="conversation.orderIds.length" color="success" variant="subtle" size="xs">
              Repeat buyer · {{ conversation.orderIds.length }} previous
            </UBadge>
          </div>
        </UCard>

        <UFormField label="Item name" name="item" required>
          <UInput v-model="state.item" placeholder="e.g. Vintage Denim Shirt" class="w-full" autofocus />
        </UFormField>

        <div class="grid grid-cols-2 gap-3">
          <UFormField label="Variant" name="variant" hint="Optional">
            <UInput v-model="state.variant" placeholder="e.g. L / Blue" class="w-full" />
          </UFormField>
          <UFormField label="Price (₹)" name="price" required>
            <UInputNumber v-model="state.price" :min="1" :step="1" placeholder="1800" class="w-full" :format-options="{ maximumFractionDigits: 0 }" />
          </UFormField>
        </div>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton label="Cancel" color="neutral" variant="ghost" @click="emit('close')" />
        <UButton type="submit" form="create-order-form" label="Generate & send order link" icon="i-lucide-link" color="primary" :loading="submitting" />
      </div>
    </template>
  </UModal>
</template>
