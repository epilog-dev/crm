<script setup lang="ts">
const faqs = [
  {
    label: 'Do I need to upload a product catalog?',
    content: 'No. An order is created only when someone actually buys — your Instagram feed already is your catalog. There is nothing to set up before your first sale.'
  },
  {
    label: 'Do my customers need an app or an account?',
    content: 'No. They open the order link, add their name and address once, pay or choose COD, and can reopen the same link any time to check the status.'
  },
  {
    label: 'Is there a payment gateway, or a cut on each order?',
    content: 'Neither. Buyers pay straight to your UPI and attach the screenshot, or choose cash on delivery. You mark the order paid. Every rupee is yours.'
  },
  {
    label: 'Does Plum read my DMs or decide what counts as an order?',
    content: 'No. You decide when a conversation becomes an order. Nothing is auto-detected, and no algorithm turns a "how much?" into a sale.'
  },
  {
    label: 'Can I keep selling exactly the way I do now?',
    content: 'Yes. Keep posting Reels and Stories, keep chatting in DMs. Plum only steps in once someone is ready to buy.'
  },
  {
    label: 'What about shipping and courier labels?',
    content: 'Copy the address into any courier app in one tap, or print a 4×6 label from the order. Plum never locks you to a single courier.'
  }
]
</script>

<template>
  <section id="faq" class="mx-auto max-w-2xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
    <div data-reveal class="text-center">
      <p class="text-xs font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">FAQ</p>
      <h2 class="font-display mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.6rem]">
        The questions sellers actually ask.
      </h2>
    </div>

    <UAccordion
      data-reveal
      :items="faqs"
      :unmount-on-hide="false"
      class="mt-10 border-t border-black/[0.08] dark:border-white/10"
      :ui="{
        item: 'border-b border-black/[0.08] dark:border-white/10',
        trigger: 'py-4 gap-4 text-base cursor-pointer group',
        label: 'font-semibold text-zinc-900 group-data-[state=open]:text-violet-600 dark:text-zinc-100 dark:group-data-[state=open]:text-violet-400 transition-colors',
        trailingIcon: 'size-4 text-zinc-400 group-data-[state=open]:text-violet-500',
        content: 'text-sm',
        body: 'pb-4 pr-8 leading-relaxed text-zinc-600 dark:text-zinc-300'
      }"
    />

    <p data-reveal class="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
      Still unsure?
      <NuxtLink to="/register" class="font-semibold text-violet-600 hover:underline dark:text-violet-400">Start free</NuxtLink>
      and poke around — there's nothing to set up first.
    </p>
  </section>
</template>
