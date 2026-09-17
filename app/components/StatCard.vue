<script setup lang="ts">
import type { BadgeProps } from '@nuxt/ui'

/**
 * KPI tile: a label, one big number, an icon and an optional hint line.
 * `color` tints the value and icon (defaults to the neutral highlighted text).
 */
withDefaults(defineProps<{
  label: string
  value: string | number
  icon?: string
  hint?: string
  color?: BadgeProps['color']
}>(), { icon: undefined, hint: undefined, color: 'neutral' })

const valueClass: Record<NonNullable<BadgeProps['color']>, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-success',
  info: 'text-info',
  warning: 'text-warning',
  error: 'text-error',
  neutral: 'text-highlighted'
}
</script>

<template>
  <UPageCard variant="outline" :ui="{ container: 'p-4 sm:p-5 gap-2' }">
    <div class="flex items-center justify-between gap-2">
      <span class="text-xs font-medium text-muted">{{ label }}</span>
      <UIcon v-if="icon" :name="icon" :class="['size-4 shrink-0', valueClass[color]]" />
    </div>
    <div class="flex items-baseline gap-2 min-w-0">
      <span :class="['text-2xl font-extrabold tracking-tight truncate', valueClass[color]]">{{ value }}</span>
      <slot name="trailing" />
    </div>
    <p v-if="hint" class="text-[11px] text-dimmed">{{ hint }}</p>
  </UPageCard>
</template>
