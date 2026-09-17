<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

/** Copies `text` to the clipboard and confirms with a toast + a brief check icon. */
const props = withDefaults(defineProps<{
  text: string
  label?: string
  /** Toast title shown after copying. */
  successMessage?: string
  size?: ButtonProps['size']
  color?: ButtonProps['color']
  variant?: ButtonProps['variant']
}>(), {
  label: 'Copy',
  successMessage: 'Copied to clipboard',
  size: 'xs',
  color: 'neutral',
  variant: 'outline'
})

const toast = useToast()
const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | null = null

async function copy() {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    toast.add({ title: props.successMessage, icon: 'i-lucide-clipboard-check', color: 'success' })
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = setTimeout(() => { copied.value = false }, 1500)
  } catch {
    toast.add({ title: 'Could not copy', description: 'Your browser blocked clipboard access.', color: 'error' })
  }
}

onUnmounted(() => {
  if (resetTimer) clearTimeout(resetTimer)
})
</script>

<template>
  <UButton
    :label="label"
    :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
    :size="size"
    :color="copied ? 'success' : color"
    :variant="variant"
    @click="copy"
  />
</template>
