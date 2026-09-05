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
        You keep selling in the DMs. Plum makes sure no order gets buried thirty chats up.
      </p>
      <div class="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="#early-access"
          class="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-violet-700 transition-colors hover:bg-violet-50 sm:w-auto"
        >
          Join Early Access <UIcon name="i-lucide-arrow-right" class="size-4" />
        </a>
        <NuxtLink
          to="/register"
          class="inline-flex w-full items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-white ring-1 ring-white/40 transition-colors hover:bg-white/10 sm:w-auto"
        >
          Try the demo
        </NuxtLink>
      </div>
      <p class="relative mt-4 text-xs text-violet-200">
        Already testing Plum? <NuxtLink to="/login" class="font-semibold underline underline-offset-2 hover:text-white">Log in</NuxtLink>
      </p>
    </div>
  </section>
</template>
