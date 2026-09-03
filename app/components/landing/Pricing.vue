<script setup lang="ts">
import { ref } from 'vue'

// Pricing (provisional — see docs; will be revisited)
const billing = ref<'monthly' | 'yearly'>('monthly')
const billingItems = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' }
]
const plans = [
  {
    name: 'Free',
    tagline: 'For sellers just getting started',
    price: { monthly: '₹0', yearly: '₹0' },
    unit: { monthly: 'forever', yearly: 'forever' },
    note: 'No card, no time limit',
    cta: 'Start free',
    featured: false,
    features: [
      'Up to 10 orders / month',
      'DM inbox & 1-click order links',
      'UPI + Cash on Delivery',
      'Address collected once, cleanly',
      'Live order tracking for buyers'
    ]
  },
  {
    name: 'Pro',
    tagline: 'For stores selling every week',
    price: { monthly: '₹299', yearly: '₹2,499' },
    unit: { monthly: '/ month', yearly: '/ year' },
    note: { monthly: 'billed monthly · cancel anytime', yearly: '≈ ₹208 / mo · 2 months free' },
    cta: 'Go Pro',
    featured: true,
    features: [
      'Everything in Free',
      'Unlimited orders',
      'Printable 4×6 courier labels',
      'CSV export & bulk actions',
      'Priority support'
    ]
  }
]
</script>

<template>
  <section id="pricing" class="mx-auto max-w-5xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
    <div data-reveal class="mx-auto max-w-2xl text-center">
      <p class="text-xs font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">Pricing</p>
      <h2 class="font-display mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-balance sm:text-[2.6rem]">
        Start free. Upgrade when it pays for itself.
      </h2>
      <p class="mt-4 text-zinc-600 dark:text-zinc-300">
        One plan for when you outgrow free — no per-order cut and no gateway fees, ever.
      </p>
    </div>

    <div data-reveal class="mt-8 flex flex-col items-center">
      <UTabs
        v-model="billing"
        :items="billingItems"
        :content="false"
        size="sm"
        class="w-fit"
        :ui="{ list: 'rounded-full', trigger: 'rounded-full px-4', indicator: 'rounded-full' }"
      />
      <p class="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">Yearly billing saves you about 2 months.</p>
    </div>

    <div class="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
      <div
        v-for="(plan, i) in plans"
        :key="plan.name"
        data-reveal
        :style="{ transitionDelay: `${i * 80}ms` }"
        class="relative flex flex-col rounded-2xl border p-6 sm:p-7"
        :class="plan.featured
          ? 'border-violet-300 bg-violet-50/50 ring-1 ring-violet-200 dark:border-violet-500/40 dark:bg-violet-500/[0.06] dark:ring-violet-500/20'
          : 'border-black/[0.09] bg-white dark:border-white/10 dark:bg-zinc-900'"
      >
        <UBadge
          v-if="plan.featured"
          label="Most popular"
          size="sm"
          class="absolute -top-2.5 right-6 rounded-full bg-violet-600 font-semibold text-white"
        />

        <h3 class="font-display text-lg font-semibold">{{ plan.name }}</h3>
        <p class="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{{ plan.tagline }}</p>

        <div class="mt-5 flex items-baseline gap-1.5">
          <span class="font-display text-4xl font-bold tracking-tight">{{ plan.price[billing] }}</span>
          <span class="text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ plan.unit[billing] }}</span>
        </div>
        <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {{ typeof plan.note === 'string' ? plan.note : plan.note[billing] }}
        </p>

        <UButton
          :to="{ path: '/register', query: { plan: plan.name.toLowerCase() } }"
          :label="plan.cta"
          block
          size="lg"
          :color="plan.featured ? 'primary' : 'neutral'"
          :variant="plan.featured ? 'solid' : 'outline'"
          :ui="{ base: plan.featured
            ? 'mt-6 justify-center rounded-full font-semibold bg-violet-600 text-white hover:bg-violet-700'
            : 'mt-6 justify-center rounded-full font-semibold' }"
          class="cursor-pointer"
        />

        <ul class="mt-6 space-y-2.5 text-sm">
          <li v-for="f in plan.features" :key="f" class="flex items-start gap-2.5 text-zinc-600 dark:text-zinc-300">
            <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-violet-500" />
            <span>{{ f }}</span>
          </li>
        </ul>
      </div>
    </div>

    <p data-reveal class="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
      Prices in INR. Start on Free and upgrade any time — your orders, buyers and history carry over.
    </p>
  </section>
</template>
