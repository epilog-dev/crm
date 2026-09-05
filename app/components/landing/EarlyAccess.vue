<script setup lang="ts">
const { email, status, errorMessage, submit } = useWaitlist('early_access')
</script>

<template>
  <section id="early-access" class="mx-auto max-w-2xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
    <div data-reveal class="text-center">
      <p class="text-xs font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">Early access</p>
      <h2 class="font-display mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-balance sm:text-[2.6rem]">
        Be one of the first sellers to try it.
      </h2>
      <p class="mt-4 text-zinc-600 dark:text-zinc-300">
        Plum is in active development — built alongside real Instagram sellers, not for them. Join the list and we'll email you when your store gets a seat.
      </p>
    </div>

    <form
      v-if="status !== 'success'"
      data-reveal
      class="mx-auto mt-8 flex w-full max-w-md flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:border sm:border-black/10 sm:bg-white sm:p-1.5 sm:pl-5 dark:sm:border-white/10 dark:sm:bg-zinc-900"
      @submit.prevent="submit"
    >
      <label for="early-access-email" class="sr-only">Your email</label>
      <input
        id="early-access-email"
        v-model="email"
        type="email"
        inputmode="email"
        autocomplete="email"
        placeholder="you@yourstore.com"
        class="min-w-0 flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-violet-400 sm:border-0 sm:bg-transparent sm:p-0 sm:focus:border-0 dark:border-white/10 dark:bg-zinc-900 dark:sm:bg-transparent"
      >
      <button
        type="submit"
        :disabled="status === 'loading'"
        class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {{ status === 'loading' ? 'Joining…' : 'Join Early Access' }}
      </button>
    </form>
    <div v-else data-reveal class="mx-auto mt-8 max-w-md rounded-2xl border border-emerald-200 bg-emerald-50/60 px-6 py-5 text-center dark:border-emerald-500/25 dark:bg-emerald-500/[0.08]">
      <p class="font-display text-lg font-semibold text-emerald-700 dark:text-emerald-400">You're on the list</p>
      <p class="mt-1 text-sm text-emerald-700/80 dark:text-emerald-300/80">We'll email {{ email }} the moment your seat is ready.</p>
    </div>
    <p v-if="status === 'error'" data-reveal class="mt-3 text-center text-sm font-semibold text-rose-600 dark:text-rose-400">{{ errorMessage }}</p>

    <p data-reveal class="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
      Not ready to wait?
      <NuxtLink to="/register" class="font-semibold text-violet-600 hover:underline dark:text-violet-400">Try the demo now →</NuxtLink>
    </p>
  </section>
</template>
