<script setup lang="ts">
const diffs = [
  { title: 'No product catalog', body: 'Never upload 200 products before your first sale. An order exists only when someone actually buys.' },
  { title: 'Instagram stays your storefront', body: 'Keep posting Reels, Stories and photos. Keep talking in DMs. Plum sits quietly behind it.' },
  { title: 'No AI guessing your orders', body: 'You decide when a conversation becomes an order — nothing gets mistaken for a sale by an algorithm.' },
  { title: 'UPI + COD, built in', body: 'Buyers pay straight to your UPI or choose COD. No payment gateway, no per-order cut.' }
]
</script>

<template>
  <section id="why" class="mx-auto max-w-5xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
    <div data-reveal class="mx-auto max-w-2xl text-center">
      <p class="text-xs font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">Why Plum</p>
      <h2 class="font-display mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.6rem]">
        Built for the way Instagram sellers actually sell.
      </h2>
    </div>

    <div class="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
      <div
        v-for="(d, i) in diffs"
        :key="d.title"
        data-reveal
        :style="{ transitionDelay: `${(i % 2) * 70}ms` }"
        class="border-t-2 border-violet-200 pt-4 dark:border-violet-500/30"
      >
        <h3 class="text-base font-bold">{{ d.title }}</h3>
        <p class="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{{ d.body }}</p>
      </div>
    </div>
  </section>
</template>
