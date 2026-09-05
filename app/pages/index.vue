<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

definePageMeta({ layout: false, auth: false })

const root = ref<HTMLElement | null>(null)

useSeoMeta({
  title: 'Plum — Reply to Instagram DMs and manage orders, in one place',
  description:
    'Plum is a workspace for Instagram sellers: read and reply to DMs without leaving the app, then turn each conversation into a trackable order. Currently in early access — join the waitlist.',
  ogTitle: 'Your Instagram DMs, finally organised.',
  ogDescription:
    'Read every DM and reply from inside Plum, then turn confirmed buyers into trackable orders. Built for thrift, handmade, jewellery and boutique sellers in India. Now in early access.'
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

/**
 * Scroll-reveal: sections start visible and are only hidden once JS opts in
 * (so crawlers / JS-off / reduced-motion see everything). An IntersectionObserver
 * fades each `[data-reveal]` in as it enters; a failsafe sweep on scroll / resize /
 * visibilitychange catches anything the observer missed (fast fling, #anchor jump,
 * a tab restored from the background).
 */
let cleanupReveal: (() => void) | null = null

onMounted(() => {
  const el = root.value
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) return

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
      <LandingHeader />
      <LandingHero />
      <LandingMarquee />
      <LandingProblem />
      <LandingHowItWorks />
      <LandingWhyPlum />
      <LandingValidationPoll />
      <LandingSuggestionBox />
      <LandingEarlyAccess />
      <LandingFaq />
      <LandingFinalCta />
      <LandingFooter />
    </div>
  </div>
</template>

<!--
  Un-scoped on purpose: the reveal / marquee / tab-panel animation classes live
  on elements rendered by the <Landing*> child components, so a scoped block
  here wouldn't reach them. Selectors are namespaced under `.landing`.
-->
<style>
html {
  scroll-behavior: smooth;
}

.landing {
  font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}
.landing .font-display {
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
.landing .squiggle path {
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
.landing .marquee {
  animation: marquee 42s linear infinite;
}
.landing .marquee-wrap:hover .marquee {
  animation-play-state: paused;
}
@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}

/* Hero demo: tab crossfade + auto-cycle progress */
.landing .scrollbar-none {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.landing .scrollbar-none::-webkit-scrollbar {
  display: none;
}
.landing .tabpanel {
  transition: opacity 0.35s ease;
}
.landing .tab-progress {
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
  html {
    scroll-behavior: auto;
  }
  .landing [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .reveal-ready .squiggle path {
    stroke-dashoffset: 0;
  }
  .landing .marquee {
    animation: none;
  }
  .landing .tabpanel {
    transition: none;
  }
  .landing .tab-progress {
    display: none;
  }
}
</style>
