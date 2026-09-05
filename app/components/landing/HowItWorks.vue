<script setup lang="ts">
const steps = [
  { title: 'Chat right inside Plum', body: 'A customer finds you on Instagram and messages you — read it and reply right inside Plum, without switching back to Instagram.' },
  { title: 'They decide to buy', body: 'Turn that conversation into an order right there — no storefront, no catalog to upload first.' },
  { title: 'Send the order link', body: 'Add the item, price and payment option. Plum drops a unique link straight into the chat.' },
  { title: 'They fill in the details', body: 'Name, phone and shipping address — typed by the buyer. No more typos, no more asking twice.' },
  { title: 'Pay on UPI, or pick COD', body: 'They pay straight to your UPI and attach the proof, or simply choose cash on delivery.' },
  { title: 'You run the order', body: 'Verify payment, update the status, print a 4×6 label, ship it. Everything on one screen.' }
]
</script>

<template>
  <section id="how" class="scroll-mt-24 bg-white py-20 sm:py-28 dark:bg-zinc-900/40">
    <div class="mx-auto max-w-5xl px-4 sm:px-6">
      <div data-reveal class="mx-auto max-w-2xl text-center">
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">How it works</p>
        <h2 class="font-display mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.6rem]">
          Selling stays the same. The messy part doesn't.
        </h2>
        <p class="mt-4 text-zinc-600 dark:text-zinc-300">Six small steps. No new habits, no storefront, no catalog to upload.</p>
      </div>

      <ol class="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
        <li
          v-for="(step, i) in steps"
          :key="step.title"
          data-reveal
          :style="{ transitionDelay: `${(i % 2) * 70}ms` }"
          class="flex gap-4"
        >
          <span class="font-display shrink-0 text-2xl font-semibold text-violet-400 dark:text-violet-500">{{ String(i + 1).padStart(2, '0') }}</span>
          <div>
            <h3 class="text-base font-bold">{{ step.title }}</h3>
            <p class="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{{ step.body }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
