<script setup lang="ts"></script>

<template>
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
</template>
