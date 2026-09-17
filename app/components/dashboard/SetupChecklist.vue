<script setup lang="ts">
export interface SetupStep {
  id: number
  title: string
  description: string
  completed: boolean
  link: string
  linkText: string
}

const props = defineProps<{ steps: SetupStep[], dismissing?: boolean }>()
const emit = defineEmits<{ dismiss: [] }>()

const completedCount = computed(() => props.steps.filter(s => s.completed).length)
const percentage = computed(() => Math.round((completedCount.value / props.steps.length) * 100))
const allDone = computed(() => completedCount.value === props.steps.length)
</script>

<template>
  <!-- Finished: a one-line send-off the seller can clear, instead of a checklist of things already done. -->
  <UAlert
    v-if="allDone"
    icon="i-lucide-party-popper"
    color="success"
    variant="soft"
    title="You're all set"
    description="Instagram is connected and your first order is paid. The full workflow is up and running."
    :actions="[{ label: 'Dismiss', color: 'neutral', variant: 'outline', size: 'xs', loading: dismissing, onClick: () => emit('dismiss') }]"
    orientation="horizontal"
  />

  <UCard v-else variant="outline">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="font-bold text-base text-highlighted flex items-center gap-2">
            <UIcon name="i-lucide-list-checks" class="size-5 text-primary" />
            Seller Setup & Sales Flow Progress
          </h3>
          <p class="text-xs text-dimmed mt-0.5">Complete these core steps to start turning Instagram DMs into fulfilled sales.</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-highlighted">{{ completedCount }} of {{ steps.length }} completed</span>
          <UBadge color="primary" variant="subtle" size="md" class="font-bold">{{ percentage }}%</UBadge>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <UProgress :model-value="completedCount" :max="steps.length" size="sm" />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <UPageCard
          v-for="step in steps"
          :key="step.id"
          :variant="step.completed ? 'soft' : 'outline'"
          :highlight="!step.completed"
          :ui="{ container: 'p-3.5 sm:p-3.5 gap-2', title: 'text-xs', description: 'text-[11px] pl-7', footer: 'pt-2 mt-2 border-t border-default/50 w-full' }"
        >
          <template #title>
            <span class="flex items-start gap-2">
              <UIcon
                :name="step.completed ? 'i-lucide-circle-check' : 'i-lucide-circle'"
                :class="['size-5 shrink-0', step.completed ? 'text-success' : 'text-primary']"
              />
              <span :class="step.completed ? 'line-through text-dimmed' : ''">{{ step.id }}. {{ step.title }}</span>
            </span>
          </template>
          <template #description>
            {{ step.description }}
          </template>
          <template #footer>
            <div class="flex justify-between items-center text-[11px] w-full">
              <span :class="step.completed ? 'text-success font-semibold' : 'text-warning font-medium'">
                {{ step.completed ? 'Step completed' : 'Action required' }}
              </span>
              <UButton
                :to="step.link"
                :label="step.linkText"
                trailing-icon="i-lucide-arrow-right"
                color="primary"
                variant="link"
                size="xs"
                class="px-0"
              />
            </div>
          </template>
        </UPageCard>
      </div>
    </div>
  </UCard>
</template>
