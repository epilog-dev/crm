<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')

function goRegister() {
  return navigateTo({ path: '/register', query: email.value ? { email: email.value } : {} })
}
</script>

<template>
  <section class="relative mx-auto max-w-3xl px-4 pt-16 pb-10 text-center sm:px-6 sm:pt-24">
    <!-- Hand-drawn doodles -->
    <svg aria-hidden="true" class="absolute left-[3%] top-[24%] hidden w-14 -rotate-[8deg] text-zinc-300 lg:block dark:text-zinc-700" viewBox="0 0 48 42" fill="none">
      <path d="M4 8c0-3 3-5 6-5h28c3 0 6 2 6 5v17c0 3-3 5-6 5H15l-8 7 1-7c-3 0-4-2-4-5z" stroke="currentColor" stroke-width="2.5" />
      <path d="M15 17c3 3.5 15 3.5 18 0" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
    </svg>
    <svg aria-hidden="true" class="absolute left-[12%] top-[52%] hidden w-16 text-zinc-300 xl:block dark:text-zinc-700" viewBox="0 0 80 76" fill="none">
      <path d="M70 8C44 20 34 40 60 66" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <path d="M48 60l12 8 4-16" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <div aria-hidden="true" class="absolute right-[5%] top-[22%] hidden -rotate-[8deg] text-pink-500 lg:block">
      <span class="text-2xl font-extrabold italic tracking-tight">finally.</span>
    </div>
    <svg aria-hidden="true" class="absolute right-[16%] top-[54%] hidden w-6 text-violet-400 lg:block dark:text-violet-500" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v20M4 4l16 16M20 4L4 20M2 12h20" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
    </svg>

    <p class="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-zinc-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
      <UIcon name="i-simple-icons-instagram" class="size-3.5 text-pink-500" />
      For thrift, handmade, jewellery &amp; boutique sellers
    </p>

    <h1 data-reveal class="font-display mx-auto mt-6 max-w-[19ch] text-[2.7rem] font-bold leading-[1.05] tracking-[-0.03em] text-balance sm:text-6xl sm:leading-[1.02]">
      Every Instagram order, in
      <span class="relative whitespace-nowrap">
        one place.
        <svg class="squiggle absolute -bottom-1.5 left-0 w-full text-pink-500" viewBox="0 0 220 14" fill="none" preserveAspectRatio="none" aria-hidden="true">
          <path d="M3 8c26-9 52 5 79-1s52-8 79-1 39 7 56 2" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
        </svg>
      </span>
    </h1>

    <p data-reveal class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 text-pretty dark:text-zinc-300" style="transition-delay: 60ms">
      You sell in Instagram DMs — no catalog, no checkout page. Plum turns each conversation into a
      trackable order the buyer fills in, pays for on UPI, and follows themselves.
    </p>

    <div data-reveal class="mt-9" style="transition-delay: 120ms">
      <form
        class="mx-auto flex w-full max-w-md flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:border sm:border-black/10 sm:bg-white sm:p-1.5 sm:pl-5 sm:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(80,40,160,0.25)] dark:sm:border-white/10 dark:sm:bg-zinc-900"
        @submit.prevent="goRegister"
      >
        <label for="hero-email" class="sr-only">Your email</label>
        <input
          id="hero-email"
          v-model="email"
          type="email"
          inputmode="email"
          autocomplete="email"
          placeholder="you@yourstore.com"
          class="min-w-0 flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-violet-400 sm:border-0 sm:bg-transparent sm:p-0 sm:text-base sm:focus:border-0 dark:border-white/10 dark:bg-zinc-900 dark:sm:bg-transparent"
        >
        <button
          type="submit"
          class="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
        >
          Start free
          <UIcon name="i-lucide-arrow-right" class="size-4" />
        </button>
      </form>
      <p class="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        Free to start · no card · your UPI, your couriers ·
        <a href="#how" class="font-semibold text-violet-600 hover:underline dark:text-violet-400">see how it works ↓</a>
      </p>
    </div>

    <LandingProductMock />
  </section>
</template>
