<script setup lang="ts">
const message = ref('')
const email = ref('')
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const errorMessage = ref('')

async function submit() {
  const value = message.value.trim()
  if (!value || status.value === 'loading') return
  status.value = 'loading'
  errorMessage.value = ''
  try {
    await $fetch('/api/suggestions', {
      method: 'POST',
      body: { message: value, email: email.value.trim() || undefined }
    })
    status.value = 'success'
    message.value = ''
    email.value = ''
  } catch {
    status.value = 'error'
    errorMessage.value = "That didn't send — try again?"
  }
}
</script>

<template>
  <section id="suggest" class="mx-auto max-w-2xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
    <div data-reveal class="text-center">
      <p class="text-xs font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">Help shape the product</p>
      <h2 class="font-display mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-balance sm:text-[2.6rem]">
        What would make this genuinely useful for you?
      </h2>
      <p class="mt-4 text-zinc-600 dark:text-zinc-300">
        An idea, a missing feature, a problem you keep running into with Instagram orders — tell us. We read every note before we build the next thing.
      </p>
    </div>

    <form data-reveal class="mt-8" @submit.prevent="submit">
      <textarea
        v-model="message"
        rows="4"
        placeholder='e.g. "I need to split one order into two shipments" or "Please add a WhatsApp inbox too"'
        class="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-violet-400 dark:border-white/10 dark:bg-zinc-900"
      />
      <div class="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <input
          v-model="email"
          type="email"
          inputmode="email"
          autocomplete="email"
          placeholder="Your email, if you'd like a reply (optional)"
          class="min-w-0 flex-1 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-violet-400 dark:border-white/10 dark:bg-zinc-900"
        >
        <button
          type="submit"
          :disabled="!message.trim() || status === 'loading'"
          class="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {{ status === 'loading' ? 'Sending…' : 'Send it over' }}
        </button>
      </div>
      <p v-if="status === 'success'" class="mt-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400">Got it — thank you. We actually read these.</p>
      <p v-if="status === 'error'" class="mt-3 text-sm font-semibold text-rose-600 dark:text-rose-400">{{ errorMessage }}</p>
    </form>
  </section>
</template>
