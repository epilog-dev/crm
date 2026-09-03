<script setup lang="ts">
const pains = [
  {
    title: 'Confirmed buyers get buried',
    body: 'By the time you\'re free to reply, the person who agreed to buy is thirty chats up. The sale goes cold.'
  },
  {
    title: 'Payments you can\'t match',
    body: 'A screenshot lands at midnight. You\'re in GPay working out whether the money actually arrived, and from whom.'
  },
  {
    title: 'Order details everywhere',
    body: 'Size, quantity, COD or UPI — spread across five message bubbles, a voice note, and your memory.'
  },
  {
    title: 'Addresses asked twice',
    body: 'You ask again to be safe. It still ships to the wrong pincode and the parcel comes back.'
  }
]

const beforeList = ['47 unread DMs', 'Notes-app chaos', 'UPI screenshots in your gallery', 'Address… somewhere', 'Your memory', 'A 2 a.m. spreadsheet']
const afterList = ['One order link per buyer', 'Payment proof attached to the order', 'Address collected once, cleanly', 'A status the buyer can check themselves']
</script>

<template>
  <section id="problem" class="mx-auto max-w-5xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
    <div data-reveal class="mx-auto max-w-2xl text-center">
      <p class="text-xs font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">The problem</p>
      <h2 class="font-display mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-balance sm:text-[2.6rem]">
        The problem isn't getting customers. It's keeping track of the ones who actually bought.
      </h2>
    </div>

    <div class="mt-12 grid gap-4 sm:grid-cols-2">
      <div
        v-for="(pain, i) in pains"
        :key="pain.title"
        data-reveal
        :style="{ transitionDelay: `${i * 60}ms` }"
        class="rounded-2xl border border-black/[0.07] bg-white p-6 dark:border-white/10 dark:bg-zinc-900"
      >
        <span aria-hidden="true" class="block h-1 w-8 rounded-full bg-rose-400" />
        <h3 class="font-display mt-4 text-xl font-semibold leading-snug tracking-[-0.01em] text-balance">{{ pain.title }}</h3>
        <p class="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{{ pain.body }}</p>
        <p class="mt-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Every seller, every week</p>
      </div>
    </div>

    <!-- before / after -->
    <div data-reveal class="mt-6 grid gap-4 sm:grid-cols-2">
      <div class="rounded-2xl border border-rose-200/70 bg-rose-50/50 p-6 dark:border-rose-500/20 dark:bg-rose-500/[0.06]">
        <p class="text-xs font-bold uppercase tracking-wider text-rose-500">Today</p>
        <ul class="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li v-for="b in beforeList" :key="b" class="flex items-center gap-2">
            <span class="text-rose-400">✕</span> {{ b }}
          </li>
        </ul>
        <p class="mt-4 font-display text-lg font-semibold text-rose-600 dark:text-rose-400">Six places. Zero certainty.</p>
      </div>
      <div class="rounded-2xl border border-violet-200 bg-violet-50/60 p-6 dark:border-violet-500/25 dark:bg-violet-500/[0.08]">
        <p class="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">With Plum</p>
        <ul class="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
          <li v-for="a in afterList" :key="a" class="flex items-center gap-2">
            <UIcon name="i-lucide-check" class="size-4 shrink-0 text-emerald-500" /> {{ a }}
          </li>
        </ul>
        <p class="mt-4 font-display text-lg font-semibold text-violet-700 dark:text-violet-300">One order. Total clarity.</p>
      </div>
    </div>
  </section>
</template>
