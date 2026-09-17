<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

/** Manually adds a thread (stand-in for a real DM). Resolves with the handle, or undefined if dismissed. */
const emit = defineEmits<{ close: [handle?: string] }>()

const { startConversation } = useConversations()
const toast = useToast()

const schema = z.object({
  handle: z.string().trim().min(1, 'Instagram handle is required').regex(/^@?[A-Za-z0-9._]+$/, 'Letters, numbers, dots and underscores only'),
  name: z.string().trim().optional(),
  message: z.string().trim().optional()
})
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({ handle: '', name: '', message: '' })
const submitting = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  submitting.value = true
  try {
    await startConversation({
      handle: event.data.handle,
      name: event.data.name || undefined,
      message: event.data.message || undefined
    })
    emit('close', event.data.handle.replace(/^@/, ''))
  } catch (err) {
    toast.add({ title: 'Could not add conversation', description: (err as Error).message, color: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <UModal
    title="Simulate an incoming DM"
    description="Add a conversation manually to try the workflow before Instagram is connected."
    @update:open="(open: boolean) => !open && emit('close')"
  >
    <template #body>
      <UForm id="new-conversation-form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Instagram handle" name="handle" required>
          <UInput v-model="state.handle" placeholder="e.g. @maria" class="w-full" autofocus />
        </UFormField>
        <UFormField label="Display name" name="name" hint="Optional">
          <UInput v-model="state.name" placeholder="e.g. Maria Santos" class="w-full" />
        </UFormField>
        <UFormField label="First message" name="message" hint="Optional">
          <UTextarea v-model="state.message" placeholder="e.g. How much for the jacket?" :rows="3" class="w-full" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton label="Cancel" color="neutral" variant="ghost" @click="emit('close')" />
        <UButton type="submit" form="new-conversation-form" label="Start conversation" color="primary" :loading="submitting" />
      </div>
    </template>
  </UModal>
</template>
