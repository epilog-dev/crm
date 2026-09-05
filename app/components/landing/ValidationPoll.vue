<script setup lang="ts">
type Answer = 'yes' | 'maybe' | 'no'

const answerOptions: { value: Answer, label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'no', label: 'No' }
]
const amountBands = [
  { value: 0, label: 'Free only' },
  { value: 149, label: 'Under ₹200' },
  { value: 300, label: '₹200–399' },
  { value: 550, label: '₹400–699' },
  { value: 800, label: '₹700+' }
]
const features = [
  { key: 'courier_tracking', label: 'Automatic shipment tracking updates — no more manually checking courier status' },
  { key: 'auto_payment_check', label: 'Automatic UPI payment verification — no more checking screenshots by hand' },
  { key: 'team_inbox', label: 'Assign DMs and orders to teammates when more than one person replies' },
  { key: 'whatsapp_inbox', label: 'The same unified inbox, but for WhatsApp too' },
  { key: 'repeat_buyer_insights', label: 'Simple repeat-buyer insights — who buys often, who to follow up with' }
]

const answer = ref<Answer | null>(null)
const monthlyAmount = ref<number | null>(null)
const selectedFeatures = ref<string[]>([])
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const errorMessage = ref('')

function selectAnswer(value: Answer) {
  answer.value = value
  if (value === 'no') monthlyAmount.value = null
}

async function submit() {
  if (!answer.value || status.value === 'loading') return
  status.value = 'loading'
  errorMessage.value = ''
  try {
    await $fetch('/api/validation-poll', {
      method: 'POST',
      body: { answer: answer.value, monthlyAmount: monthlyAmount.value }
    })
    if (selectedFeatures.value.length) {
      await $fetch('/api/feature-votes', { method: 'POST', body: { features: selectedFeatures.value } })
    }
    status.value = 'success'
  } catch {
    status.value = 'error'
    errorMessage.value = "That didn't go through — mind trying again?"
  }
}
</script>

<template>
  <section id="validate" class="mx-auto max-w-3xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
    <div data-reveal class="mx-auto max-w-2xl text-center">
      <p class="text-xs font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">Help us build the right thing</p>
      <h2 class="font-display mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-balance sm:text-[2.6rem]">
        Would you actually pay for this?
      </h2>
      <p class="mt-4 text-zinc-600 dark:text-zinc-300">
        Plum is still in early access. Your honest answer — yes, maybe, or no — decides what we build next, not what we hope you'll say.
      </p>
    </div>

    <div v-if="status !== 'success'" data-reveal class="mx-auto mt-8 flex max-w-sm items-center justify-center gap-2.5">
      <button
        v-for="opt in answerOptions"
        :key="opt.value"
        type="button"
        class="flex-1 cursor-pointer rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors"
        :class="answer === opt.value
          ? 'border-violet-600 bg-violet-600 text-white'
          : 'border-black/10 bg-white text-zinc-600 hover:border-violet-300 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-300'"
        @click="selectAnswer(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>

    <div v-if="status !== 'success' && (answer === 'yes' || answer === 'maybe')" data-reveal class="mx-auto mt-5 max-w-sm">
      <p class="mb-2 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">Realistically, what would you pay per month?</p>
      <div class="flex flex-wrap items-center justify-center gap-2">
        <button
          v-for="band in amountBands"
          :key="band.value"
          type="button"
          class="cursor-pointer rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors"
          :class="monthlyAmount === band.value
            ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300'
            : 'border-black/10 text-zinc-500 hover:border-violet-300 dark:border-white/15 dark:text-zinc-400'"
          @click="monthlyAmount = band.value"
        >
          {{ band.label }}
        </button>
      </div>
    </div>

    <div v-if="status !== 'success'" data-reveal class="mx-auto mt-10 max-w-lg border-t border-black/[0.08] pt-8 dark:border-white/10">
      <p class="text-center text-sm font-semibold text-zinc-700 dark:text-zinc-200">
        Which of these would you use? <span class="font-normal text-zinc-400">(pick as many as you like)</span>
      </p>
      <div class="mt-4 space-y-2.5">
        <label
          v-for="f in features"
          :key="f.key"
          class="flex cursor-pointer items-start gap-3 rounded-xl border border-black/[0.07] bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-zinc-900"
        >
          <input v-model="selectedFeatures" type="checkbox" :value="f.key" class="mt-0.5 size-4 shrink-0 accent-violet-600">
          <span class="text-zinc-700 dark:text-zinc-200">{{ f.label }}</span>
        </label>
      </div>
    </div>

    <div v-if="status !== 'success'" data-reveal class="mx-auto mt-8 max-w-sm text-center">
      <button
        type="button"
        :disabled="!answer || status === 'loading'"
        class="w-full cursor-pointer rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
        @click="submit"
      >
        {{ status === 'loading' ? 'Submitting…' : 'Submit my answer' }}
      </button>
      <p v-if="status === 'error'" class="mt-3 text-sm font-semibold text-rose-600 dark:text-rose-400">{{ errorMessage }}</p>
    </div>

    <div v-else data-reveal class="mx-auto mt-8 max-w-sm rounded-2xl border border-emerald-200 bg-emerald-50/60 px-6 py-5 text-center dark:border-emerald-500/25 dark:bg-emerald-500/[0.08]">
      <p class="font-display text-lg font-semibold text-emerald-700 dark:text-emerald-400">Thank you</p>
      <p class="mt-1 text-sm text-emerald-700/80 dark:text-emerald-300/80">That's exactly the kind of honesty that shapes what we build.</p>
    </div>
  </section>
</template>
