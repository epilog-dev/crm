<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

// A tabbed walk-through of the real workflow.
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
</script>

<template>
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
            <div class="flex items-center gap-2 border-b border-black/[0.06] px-3 py-2.5 sm:gap-2.5 sm:px-4 dark:border-white/[0.06]">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-violet-500 text-xs font-bold text-white">P</span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-bold">Priya Nair <span class="text-xs font-normal text-zinc-400">@priya.thrifts</span></p>
                <p class="truncate text-[11px] font-medium text-emerald-500">Customer via Instagram DM</p>
              </div>
              <span class="hidden rounded-lg border border-black/10 px-2.5 py-1.5 text-[11px] font-semibold lg:inline dark:border-white/15">Message on IG</span>
              <span class="shrink-0 rounded-lg bg-violet-600 px-2.5 py-1.5 text-[11px] font-bold text-white sm:px-3">+ Order</span>
            </div>
            <div class="flex flex-1 flex-col justify-end gap-2.5 overflow-hidden p-3 sm:p-4">
              <div class="mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-100 px-3.5 py-2 text-xs dark:bg-zinc-800 sm:max-w-[80%]">Hi! Is the linen co-ord set still available in M?</div>
              <div class="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-violet-600 px-3.5 py-2 text-xs text-white sm:max-w-[80%]">Yes it is — ₹1,450 including shipping across India.</div>
              <div class="mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-100 px-3.5 py-2 text-xs dark:bg-zinc-800 sm:max-w-[80%]">Perfect. Can I get it by Friday?</div>
              <div class="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-violet-600 px-3.5 py-2 text-xs text-white sm:max-w-[80%]">Yep — 2 to 4 days. Sending your order link now 💜</div>
              <div class="mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-zinc-100 px-3.5 py-2 text-xs dark:bg-zinc-800 sm:max-w-[80%]">Great — how do I pay?</div>
            </div>
            <div class="space-y-2 border-t border-black/[0.06] p-3 dark:border-white/[0.06]">
              <div class="scrollbar-none flex gap-1.5 overflow-x-auto text-[10px]">
                <span class="shrink-0 rounded-full border border-black/10 px-2 py-1 text-zinc-500 dark:border-white/15">📦 In stock?</span>
                <span class="shrink-0 rounded-full border border-black/10 px-2 py-1 text-zinc-500 dark:border-white/15">🚚 Delivery time</span>
                <span class="shrink-0 rounded-full border border-pink-500/30 bg-pink-500/10 px-2 py-1 font-semibold text-pink-600 dark:text-pink-400">⚡ Create order link</span>
              </div>
              <div class="flex items-center gap-2 rounded-full border border-black/10 px-3.5 py-2 text-xs text-zinc-400 dark:border-white/15">
                Type a reply…
                <span class="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white"><UIcon name="i-lucide-send" class="size-3" /></span>
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
</template>
