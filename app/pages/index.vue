<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

definePageMeta({ layout: false, auth: false })

const root = ref<HTMLElement | null>(null)
const email = ref('')

useSeoMeta({
  title: 'Plum — The order desk for Instagram sellers',
  description:
    'You sell in Instagram DMs. Plum turns every conversation into a trackable order — the buyer adds their own address, pays your UPI, and follows the status. No storefront, no catalog, no gateway.',
  ogTitle: 'Instagram is your storefront. Plum keeps the orders straight.',
  ogDescription:
    'Plum turns DM conversations into organised, trackable orders. Built for thrift, handmade, jewellery and boutique sellers in India.'
})

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
    }
  ]
})

function goRegister() {
  return navigateTo({ path: '/register', query: email.value ? { email: email.value } : {} })
}

// Hero demo: a tabbed walk-through of the real workflow
const demoTabs = [
  { id: 'inbox', label: 'Inbox' },
  { id: 'create', label: 'Create order' },
  { id: 'link', label: 'Customer link' },
  { id: 'orders', label: 'Orders' }
]

const demoChats = [
  { initial: 'P', name: 'Priya Nair', handle: '@priya.thrifts', preview: 'Great — how do I pay?', active: true },
  { initial: 'R', name: 'Rohan Das', handle: '@rohan.kicks', preview: 'Do you have the blue pair in 9?', active: false },
  { initial: 'M', name: 'Meera Iqbal', handle: '@meera.ceramics', preview: 'Thank you! Just placed it', order: 'ORD-1074', active: false },
  { initial: 'A', name: 'Aditya Rao', handle: '@aditya.vault', preview: 'Is the denim jacket still up?', active: false }
]

const demoKanban = [
  {
    title: 'Confirmed',
    count: 4,
    tone: 'bg-zinc-400/20 text-zinc-500 dark:text-zinc-400',
    cards: [
      { code: 'ORD-1086', price: '₹1,900', item: 'Denim jacket · L', name: 'Aditya Rao', handle: '@aditya.vault', initial: 'A' },
      { code: 'ORD-1085', price: '₹640', item: 'Beaded hoop earrings', name: 'Sana Kapoor', handle: '@sana.makes', initial: 'S' }
    ]
  },
  {
    title: 'Awaiting payment',
    count: 3,
    tone: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    cards: [
      { code: 'ORD-1084', price: '₹2,200', item: 'Retro sneakers · UK 9', name: 'Rohan Das', handle: '@rohan.kicks', initial: 'R' }
    ]
  },
  {
    title: 'Paid',
    count: 5,
    tone: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    cards: [
      { code: 'ORD-1082', price: '₹1,450', item: 'Linen co-ord set · M', name: 'Priya Nair', handle: '@priya.thrifts', initial: 'P', active: true },
      { code: 'ORD-1081', price: '₹990', item: 'Ceramic planter', name: 'Nikhil Sen', handle: '@nikhil.clay', initial: 'N' }
    ]
  },
  {
    title: 'Shipped',
    count: 6,
    tone: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    cards: [
      { code: 'ORD-1078', price: '₹1,900', item: 'Corduroy shirt · M', name: 'Farah Ali', handle: '@farah.thrift', initial: 'F' }
    ]
  },
  {
    title: 'Delivered',
    count: 12,
    tone: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    cards: [
      { code: 'ORD-1069', price: '₹890', item: 'Mug set of 2', name: 'Meera Iqbal', handle: '@meera.ceramics', initial: 'M' }
    ]
  }
]
const activeTab = ref(0)
const autoPaused = ref(false)
const hovering = ref(false)
let tabTimer: ReturnType<typeof setInterval> | null = null

function pickTab(i: number) {
  activeTab.value = i
  autoPaused.value = true // a manual pick stops the auto-cycle for good
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  tabTimer = setInterval(() => {
    if (autoPaused.value || hovering.value || document.visibilityState !== 'visible') return
    activeTab.value = (activeTab.value + 1) % demoTabs.length
  }, 4600)
})
onUnmounted(() => {
  if (tabTimer) clearInterval(tabTimer)
})

const audience = [
  'Thrift stores', 'Ceramic artists', 'Vintage clothing', 'Handmade jewellery',
  'Custom portraits', 'Home bakers', 'Resin art', 'Crochet & knits',
  'Beauty & botanicals', 'Sneaker resellers'
]

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

const steps = [
  { title: 'Chat like you always do', body: 'A customer finds you on Instagram and messages you. Nothing about that changes.' },
  { title: 'They decide to buy', body: 'Turn that conversation into an order right there — no storefront, no catalog to upload first.' },
  { title: 'Send the order link', body: 'Add the item, price and payment option. Plum drops a unique link straight into the chat.' },
  { title: 'They fill in the details', body: 'Name, phone and shipping address — typed by the buyer. No more typos, no more asking twice.' },
  { title: 'Pay on UPI, or pick COD', body: 'They pay straight to your UPI and attach the proof, or simply choose cash on delivery.' },
  { title: 'You run the order', body: 'Verify payment, update the status, print a 4×6 label, ship it. Everything on one screen.' }
]

const diffs = [
  { title: 'No product catalog', body: 'Never upload 200 products before your first sale. An order exists only when someone actually buys.' },
  { title: 'Instagram stays your storefront', body: 'Keep posting Reels, Stories and photos. Keep talking in DMs. Plum sits quietly behind it.' },
  { title: 'No AI guessing your orders', body: 'You decide when a conversation becomes an order — nothing gets mistaken for a sale by an algorithm.' },
  { title: 'UPI + COD, built in', body: 'Buyers pay straight to your UPI or choose COD. No payment gateway, no per-order cut.' }
]

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

const beforeList = ['47 unread DMs', 'Notes-app chaos', 'UPI screenshots in your gallery', 'Address… somewhere', 'Your memory', 'A 2 a.m. spreadsheet']
const afterList = ['One order link per buyer', 'Payment proof attached to the order', 'Address collected once, cleanly', 'A status the buyer can check themselves']

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

let cleanupReveal: (() => void) | null = null

onMounted(() => {
  const el = root.value
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) return // content stays visible

  const items = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'))
  el.classList.add('reveal-ready')

  const reveal = (target: Element) => target.classList.add('reveal-in')

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target)
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0, rootMargin: '0px 0px -8% 0px' }
  )

  // Failsafe: never leave a section permanently hidden if a fast scroll or an
  // in-page anchor jump outruns the observer.
  const sweep = () => {
    const limit = window.innerHeight * 0.92
    for (const item of items) {
      if (item.classList.contains('reveal-in')) continue
      if (item.getBoundingClientRect().top < limit) {
        reveal(item)
        io.unobserve(item)
      }
    }
  }

  requestAnimationFrame(() => {
    items.forEach((item) => io.observe(item))
    sweep()
  })

  // A tab that loads in the background gets no rAF/IntersectionObserver ticks;
  // re-run the sweep the moment it becomes visible so nothing stays hidden.
  const onVisible = () => {
    if (document.visibilityState === 'visible') sweep()
  }

  window.addEventListener('scroll', sweep, { passive: true })
  window.addEventListener('resize', sweep, { passive: true })
  document.addEventListener('visibilitychange', onVisible)
  cleanupReveal = () => {
    io.disconnect()
    window.removeEventListener('scroll', sweep)
    window.removeEventListener('resize', sweep)
    document.removeEventListener('visibilitychange', onVisible)
  }
})

onUnmounted(() => cleanupReveal?.())
</script>

<template>
  <div ref="root" class="landing min-h-dvh bg-[#f7f5f1] text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
    <!-- Soft wash behind the hero -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[760px] overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-violet-200/70 via-fuchsia-100/30 to-transparent dark:from-violet-600/15 dark:via-fuchsia-600/[0.06] dark:to-transparent" />
      <div class="absolute -top-40 left-1/2 size-[46rem] -translate-x-1/2 rounded-full bg-violet-300/30 blur-3xl dark:bg-violet-700/15" />
    </div>

    <div class="relative">
      <!-- Header -->
      <header class="sticky top-0 z-40 border-b border-black/[0.06] bg-[#f7f5f1]/80 backdrop-blur-md dark:border-white/[0.06] dark:bg-zinc-950/80">
        <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <NuxtLink to="/" class="flex items-center gap-2.5">
            <span class="flex size-7 items-center justify-center rounded-lg bg-violet-600 text-sm font-black text-white">P</span>
            <span class="font-display text-xl font-semibold tracking-tight">Plum</span>
          </NuxtLink>

          <nav class="hidden items-center gap-8 text-sm font-medium text-zinc-500 dark:text-zinc-400 md:flex">
            <a href="#problem" class="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">The problem</a>
            <a href="#how" class="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">How it works</a>
            <a href="#why" class="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">Why Plum</a>
            <a href="#pricing" class="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">Pricing</a>
            <a href="#faq" class="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">FAQ</a>
          </nav>

          <div class="flex items-center gap-1 sm:gap-2">
            <UColorModeButton class="cursor-pointer" />
            <NuxtLink to="/login" class="hidden rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900 sm:block dark:text-zinc-300 dark:hover:text-white">
              Log in
            </NuxtLink>
            <NuxtLink to="/register" class="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700">
              Start free
            </NuxtLink>
          </div>
        </div>
      </header>

      <!-- Hero -->
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

        <!-- Product frame: tabbed walk-through of the real workflow -->
        <div
          data-reveal
          class="relative mx-auto mt-14 max-w-5xl"
          style="transition-delay: 160ms"
          @mouseenter="hovering = true"
          @mouseleave="hovering = false"
        >
          <div class="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_24px_70px_-20px_rgba(80,40,160,0.35)] dark:border-white/10 dark:bg-zinc-900">
            <!-- Window bar + workflow tabs -->
            <div class="flex items-end gap-3 border-b border-black/[0.06] bg-zinc-50/80 px-3 pt-2.5 dark:border-white/[0.06] dark:bg-zinc-950/50">
              <div class="flex shrink-0 gap-1.5 pb-3 pl-1">
                <span class="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span class="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span class="size-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </div>
              <div class="scrollbar-none flex min-w-0 flex-1 gap-1 overflow-x-auto">
                <button
                  v-for="(t, i) in demoTabs"
                  :key="t.id"
                  type="button"
                  :aria-current="activeTab === i ? 'true' : undefined"
                  class="relative shrink-0 cursor-pointer whitespace-nowrap rounded-t-lg px-3 py-2 text-xs font-semibold transition-colors"
                  :class="activeTab === i
                    ? 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'"
                  @click="pickTab(i)"
                >
                  <span class="mr-1.5 text-[10px] font-bold text-violet-400">{{ String(i + 1).padStart(2, '0') }}</span>{{ t.label }}
                  <span
                    v-if="activeTab === i && !autoPaused"
                    :key="'progress-' + activeTab"
                    aria-hidden="true"
                    class="tab-progress absolute inset-x-0 -bottom-px h-0.5 origin-left bg-violet-500"
                  />
                </button>
              </div>
            </div>

            <!-- Panels -->
            <div class="relative h-[458px] overflow-hidden bg-white text-left text-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 sm:h-[478px]">

              <!-- 01 · Inbox -->
              <div
                class="tabpanel absolute inset-0 flex h-full"
                :class="activeTab === 0 ? 'opacity-100' : 'pointer-events-none opacity-0'"
                :inert="activeTab !== 0"
              >
                    <div class="hidden w-56 shrink-0 flex-col border-r border-black/[0.06] bg-zinc-50/60 sm:flex dark:border-white/[0.06] dark:bg-zinc-950/40">
                      <div class="flex items-center gap-1.5 border-b border-black/[0.06] px-3 py-2.5 dark:border-white/[0.06]">
                        <UIcon name="i-simple-icons-instagram" class="size-4 text-pink-500" />
                        <span class="text-xs font-bold">Instagram Sales DM</span>
                      </div>
                      <div class="flex-1 overflow-hidden">
                        <div
                          v-for="c in demoChats"
                          :key="c.handle"
                          class="flex gap-2.5 px-3 py-2.5 text-xs"
                          :class="c.active ? 'border-l-2 border-violet-500 bg-white dark:bg-zinc-900' : 'border-l-2 border-transparent'"
                        >
                          <span class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-violet-500 text-[10px] font-bold text-white">{{ c.initial }}</span>
                          <div class="min-w-0 flex-1">
                            <p class="truncate font-semibold">{{ c.name }} <span class="font-normal text-zinc-400">{{ c.handle }}</span></p>
                            <p class="truncate text-zinc-400">{{ c.preview }}</p>
                          </div>
                          <span v-if="c.order" class="mt-0.5 shrink-0 rounded bg-emerald-500/15 px-1 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">{{ c.order }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex min-w-0 flex-1 flex-col">
                      <div class="flex items-center gap-2.5 border-b border-black/[0.06] px-4 py-2.5 dark:border-white/[0.06]">
                        <span class="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-violet-500 text-xs font-bold text-white">P</span>
                        <div class="min-w-0 flex-1">
                          <p class="text-sm font-bold">Priya Nair <span class="text-xs font-normal text-zinc-400">@priya.thrifts</span></p>
                          <p class="text-[11px] font-medium text-emerald-500">Customer via Instagram DM</p>
                        </div>
                        <span class="hidden rounded-lg border border-black/10 px-2.5 py-1.5 text-[11px] font-semibold sm:inline dark:border-white/15">Message on IG</span>
                        <span class="rounded-lg bg-violet-600 px-3 py-1.5 text-[11px] font-bold text-white">+ Order</span>
                      </div>
                      <div class="flex-1 space-y-2.5 overflow-hidden p-4">
                        <div class="mr-auto max-w-[80%] rounded-2xl rounded-tl-sm bg-zinc-100 px-3.5 py-2 text-xs dark:bg-zinc-800">Hi! Is the linen co-ord set still available in M?</div>
                        <div class="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-violet-600 px-3.5 py-2 text-xs text-white">Yes it is — ₹1,450 including shipping.</div>
                        <div class="mr-auto max-w-[80%] rounded-2xl rounded-tl-sm bg-zinc-100 px-3.5 py-2 text-xs dark:bg-zinc-800">Great — how do I pay?</div>
                      </div>
                      <div class="space-y-2 border-t border-black/[0.06] p-3 dark:border-white/[0.06]">
                        <div class="scrollbar-none flex gap-1.5 overflow-x-auto text-[10px]">
                          <span class="shrink-0 rounded-full border border-black/10 px-2 py-1 text-zinc-500 dark:border-white/15">📦 In stock?</span>
                          <span class="shrink-0 rounded-full border border-black/10 px-2 py-1 text-zinc-500 dark:border-white/15">🚚 Delivery time</span>
                          <span class="shrink-0 rounded-full border border-pink-500/30 bg-pink-500/10 px-2 py-1 font-semibold text-pink-600 dark:text-pink-400">⚡ Create order link</span>
                        </div>
                        <div class="flex items-center gap-2 rounded-full border border-black/10 px-3.5 py-2 text-xs text-zinc-400 dark:border-white/15">
                          Type a reply…
                          <span class="ml-auto flex size-6 items-center justify-center rounded-full bg-violet-600 text-white"><UIcon name="i-lucide-send" class="size-3" /></span>
                        </div>
                      </div>
                    </div>
              </div>

              <!-- 02 · Create order -->
              <div
                class="tabpanel absolute inset-0 flex h-full items-center justify-center bg-zinc-50/70 p-5 dark:bg-zinc-950/30"
                :class="activeTab === 1 ? 'opacity-100' : 'pointer-events-none opacity-0'"
                :inert="activeTab !== 1"
              >
                    <div class="w-full max-w-sm rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                      <p class="text-sm font-bold">Create order from DM</p>
                      <p class="mt-0.5 text-[11px] text-zinc-400">Turn a confirmed DM into a tracked order link.</p>

                      <div class="mt-4 flex items-center justify-between rounded-lg border border-black/[0.06] bg-zinc-50 px-3 py-2 text-xs dark:border-white/[0.06] dark:bg-zinc-800/50">
                        <span class="text-zinc-400">Customer</span>
                        <span class="font-semibold">Priya Nair · @priya.thrifts</span>
                      </div>

                      <div class="mt-3 space-y-2.5">
                        <div>
                          <p class="mb-1 text-[11px] font-semibold text-zinc-500">Item name</p>
                          <div class="rounded-lg border border-black/10 px-3 py-2 text-xs dark:border-white/15">Linen co-ord set</div>
                        </div>
                        <div class="grid grid-cols-2 gap-2.5">
                          <div>
                            <p class="mb-1 text-[11px] font-semibold text-zinc-500">Variant</p>
                            <div class="rounded-lg border border-black/10 px-3 py-2 text-xs dark:border-white/15">M / Sage</div>
                          </div>
                          <div>
                            <p class="mb-1 text-[11px] font-semibold text-zinc-500">Price (₹)</p>
                            <div class="rounded-lg border border-black/10 px-3 py-2 text-xs dark:border-white/15">1,450</div>
                          </div>
                        </div>
                      </div>

                      <div class="mt-4 rounded-lg bg-violet-600 py-2.5 text-center text-xs font-bold text-white">Generate &amp; send order link</div>

                      <div class="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        <UIcon name="i-lucide-check" class="size-3.5 shrink-0" />
                        Link sent in the DM · plum.so/order/ORD-1082
                      </div>
                    </div>
              </div>

              <!-- 03 · Customer link -->
              <div
                class="tabpanel absolute inset-0 h-full overflow-hidden bg-zinc-100/70 p-4 dark:bg-zinc-950/50"
                :class="activeTab === 2 ? 'opacity-100' : 'pointer-events-none opacity-0'"
                :inert="activeTab !== 2"
              >
                    <div class="mx-auto flex h-full max-w-xs flex-col gap-2.5 overflow-hidden">
                      <div class="text-center">
                        <span class="mx-auto flex size-11 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 text-sm font-bold text-white">RT</span>
                        <p class="mt-1 text-sm font-bold">Retro Thrift Store</p>
                        <p class="text-[10px] text-zinc-400">Instagram Sales Order #ORD-1082</p>
                      </div>

                      <div class="flex items-center justify-between rounded-xl border border-black/10 bg-white px-3.5 py-2.5 dark:border-white/10 dark:bg-zinc-900">
                        <div>
                          <p class="text-xs font-bold">Linen co-ord set</p>
                          <span class="text-[10px] text-zinc-400">Variant: M / Sage</span>
                        </div>
                        <span class="text-sm font-extrabold">₹1,450</span>
                      </div>

                      <div class="flex-1 space-y-2 overflow-hidden rounded-xl border border-black/10 bg-white p-3.5 dark:border-white/10 dark:bg-zinc-900">
                        <p class="text-[11px] font-bold">Delivery &amp; payment</p>
                        <div class="rounded-lg border border-black/10 px-2.5 py-1.5 text-[11px] dark:border-white/15">Priya Nair · 98••• ••471</div>
                        <div class="rounded-lg border border-black/10 px-2.5 py-1.5 text-[11px] text-zinc-400 dark:border-white/15">14 Carter Road, Bandra W, Mumbai — 400050</div>
                        <div class="grid grid-cols-2 gap-2">
                          <div class="rounded-lg border-2 border-violet-500 bg-violet-500/5 px-2 py-1.5 text-center">
                            <p class="text-[11px] font-bold">Pay now</p>
                            <p class="text-[9px] text-zinc-400">UPI / Scan QR</p>
                          </div>
                          <div class="rounded-lg border border-black/10 px-2 py-1.5 text-center dark:border-white/15">
                            <p class="text-[11px] font-bold">Cash on delivery</p>
                            <p class="text-[9px] text-zinc-400">Pay when delivered</p>
                          </div>
                        </div>
                        <div class="flex items-center gap-2.5 rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800/50">
                          <svg viewBox="0 0 100 100" class="size-10 shrink-0 text-zinc-900 dark:text-zinc-100" aria-hidden="true">
                            <path fill="currentColor" d="M0 0h30v30H0zM40 0h10v10H40zM60 0h10v10H60zM70 0h30v30H70zM10 10h10v10H10zM80 10h10v10H80zM0 40h10v10H0zM20 40h20v10H20zM50 40h10v10H50zM70 40h20v10H70zM0 60h10v10H0zM30 60h10v10H30zM50 60h20v10H50zM80 60h20v10H80zM0 70h30v30H0zM40 70h20v10H40zM70 70h30v30H70zM10 80h10v10H10zM80 80h10v10H80z" />
                          </svg>
                          <div class="text-[10px]">
                            <p class="font-bold">Scan to pay ₹1,450</p>
                            <p class="font-mono text-zinc-400">retrothrift@upi</p>
                          </div>
                        </div>
                        <div class="rounded-lg bg-violet-600 py-2 text-center text-[11px] font-bold text-white">Upload receipt &amp; confirm</div>
                      </div>
                    </div>
              </div>

              <!-- 04 · Orders (Kanban board) -->
              <div
                class="tabpanel absolute inset-0 h-full overflow-hidden p-4 sm:p-5"
                :class="activeTab === 3 ? 'opacity-100' : 'pointer-events-none opacity-0'"
                :inert="activeTab !== 3"
              >
                <div class="flex items-center justify-between">
                  <div class="flex rounded-lg border border-black/10 p-0.5 text-[10px] font-semibold dark:border-white/15">
                    <span class="rounded-md px-2 py-1 text-zinc-400">Table</span>
                    <span class="rounded-md bg-white px-2 py-1 text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100">Kanban</span>
                  </div>
                  <span class="hidden text-[10px] text-zinc-400 sm:block">Drag a card to move it down the pipeline</span>
                </div>

                <div class="scrollbar-none mt-3 flex h-[calc(100%-2.25rem)] gap-3 overflow-x-auto pb-1">
                  <div
                    v-for="col in demoKanban"
                    :key="col.title"
                    class="flex w-44 shrink-0 flex-col rounded-xl border border-black/[0.07] bg-zinc-50/70 dark:border-white/[0.06] dark:bg-zinc-950/40"
                  >
                    <div class="flex items-center gap-1.5 border-b border-black/[0.06] px-3 py-2 dark:border-white/[0.06]">
                      <span class="text-[11px] font-bold">{{ col.title }}</span>
                      <span class="rounded-full px-1.5 text-[10px] font-bold" :class="col.tone">{{ col.count }}</span>
                    </div>
                    <div class="flex-1 space-y-2 overflow-hidden p-2">
                      <div
                        v-for="card in col.cards"
                        :key="card.code"
                        class="rounded-lg border bg-white p-2.5 shadow-sm dark:bg-zinc-900"
                        :class="card.active
                          ? 'border-violet-400 ring-1 ring-violet-400/40 dark:border-violet-500'
                          : 'border-black/10 dark:border-white/10'"
                      >
                        <div class="flex items-center justify-between">
                          <span class="font-mono text-[10px] font-bold text-violet-500">{{ card.code }}</span>
                          <span class="text-[10px] font-bold">{{ card.price }}</span>
                        </div>
                        <p class="mt-1 text-[11px] font-semibold leading-snug">{{ card.item }}</p>
                        <div class="mt-1.5 flex items-center gap-1.5 border-t border-black/[0.06] pt-1.5 dark:border-white/[0.06]">
                          <span class="flex size-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-violet-500 text-[8px] font-bold text-white">{{ card.initial }}</span>
                          <span class="truncate text-[10px] text-zinc-400">{{ card.name }} · {{ card.handle }}</span>
                        </div>
                      </div>
                      <div v-if="col.cards.length === 0" class="flex h-14 items-center justify-center rounded-lg border-2 border-dashed border-black/10 text-[10px] text-zinc-300 dark:border-white/10">
                        Drop here
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Audience marquee -->
      <section class="marquee-wrap mt-6 overflow-hidden border-y border-black/[0.06] py-4 dark:border-white/[0.06]">
        <div class="marquee flex w-max items-center gap-8 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
          <template v-for="n in 2" :key="n">
            <span v-for="a in audience" :key="`${n}-${a}`" class="flex items-center gap-8">
              {{ a }} <span class="text-violet-400">✳</span>
            </span>
          </template>
        </div>
      </section>

      <!-- The problem -->
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

      <!-- How it works -->
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

      <!-- Why Plum -->
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

      <!-- Pricing -->
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

      <!-- FAQ -->
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

      <!-- Final CTA -->
      <section class="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <div data-reveal class="relative overflow-hidden rounded-3xl bg-violet-600 px-6 py-16 text-center text-white sm:px-10 sm:py-20">
          <div aria-hidden="true" class="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden="true" class="pointer-events-none absolute -bottom-24 -left-10 size-64 rounded-full bg-fuchsia-400/20 blur-2xl" />
          <h2 class="font-display relative text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-balance sm:text-5xl">
            Your DMs can stay messy.<br class="hidden sm:block"> Your orders don't have to.
          </h2>
          <p class="relative mx-auto mt-4 max-w-lg text-violet-100">
            Keep selling on Instagram exactly as you do. Let Plum take care of the orders.
          </p>
          <div class="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <NuxtLink
              to="/register"
              class="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-violet-700 transition-colors hover:bg-violet-50 sm:w-auto"
            >
              Start free <UIcon name="i-lucide-arrow-right" class="size-4" />
            </NuxtLink>
            <NuxtLink
              to="/login"
              class="inline-flex w-full items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-white ring-1 ring-white/40 transition-colors hover:bg-white/10 sm:w-auto"
            >
              I already sell with Plum
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-black/[0.07] dark:border-white/[0.07]">
        <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row sm:px-6">
          <div class="flex items-center gap-2">
            <span class="flex size-6 items-center justify-center rounded-md bg-violet-600 text-[11px] font-black text-white">P</span>
            <span class="font-display font-semibold text-zinc-700 dark:text-zinc-300">Plum</span>
            <span>· Instagram DMs into orders</span>
          </div>
          <div class="flex items-center gap-6">
            <NuxtLink to="/login" class="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">Log in</NuxtLink>
            <NuxtLink to="/register" class="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">Start free</NuxtLink>
            <NuxtLink to="/app" class="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">Dashboard</NuxtLink>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
:global(html) {
  scroll-behavior: smooth;
}

.landing {
  font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}
.font-display {
  font-family: 'Bricolage Grotesque', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
  font-optical-sizing: auto;
}

.reveal-ready [data-reveal] {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-ready [data-reveal].reveal-in {
  opacity: 1;
  transform: none;
}

/* Hand-drawn underline: draws itself in when the headline reveals */
.squiggle path {
  stroke-dashoffset: 0;
}
.reveal-ready .squiggle path {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
}
.reveal-ready [data-reveal].reveal-in .squiggle path {
  animation: squiggle-draw 0.7s 0.2s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}
@keyframes squiggle-draw {
  to {
    stroke-dashoffset: 0;
  }
}

/* Audience marquee */
.marquee {
  animation: marquee 42s linear infinite;
}
.marquee-wrap:hover .marquee {
  animation-play-state: paused;
}
@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}

/* Hero demo: tab crossfade + auto-cycle progress */
.scrollbar-none {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.tabpanel {
  transition: opacity 0.35s ease;
}
.tab-progress {
  animation: tab-progress 4.6s linear forwards;
}
@keyframes tab-progress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  :global(html) {
    scroll-behavior: auto;
  }
  [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .reveal-ready .squiggle path {
    stroke-dashoffset: 0;
  }
  .marquee {
    animation: none;
  }
  .tabpanel {
    transition: none;
  }
  .tab-progress {
    display: none;
  }
}
</style>
