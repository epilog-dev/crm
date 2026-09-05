<script setup lang="ts">
import { ref } from 'vue'

const navLinks = [
  { label: 'The problem', href: '#problem' },
  { label: 'How it works', href: '#how' },
  { label: 'Why Plum', href: '#why' },
  { label: 'Early access', href: '#early-access' },
  { label: 'FAQ', href: '#faq' }
]
const mobileMenuOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-black/[0.06] bg-[#f7f5f1]/80 backdrop-blur-md dark:border-white/[0.06] dark:bg-zinc-950/80">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
      <NuxtLink to="/" class="flex items-center gap-2.5">
        <span class="flex size-7 items-center justify-center rounded-lg bg-violet-600 text-sm font-black text-white">P</span>
        <span class="font-display text-xl font-semibold tracking-tight">Plum</span>
      </NuxtLink>

      <nav class="hidden items-center gap-8 text-sm font-medium text-zinc-500 dark:text-zinc-400 md:flex">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >{{ link.label }}</a>
      </nav>

      <div class="flex items-center gap-1 sm:gap-2">
        <UColorModeButton class="cursor-pointer" />
        <NuxtLink to="/login" class="hidden rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900 sm:block dark:text-zinc-300 dark:hover:text-white">
          Log in
        </NuxtLink>
        <a href="#early-access" class="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700">
          Join Early Access
        </a>

        <!-- Mobile menu -->
        <USlideover
          v-model:open="mobileMenuOpen"
          title="Menu"
          :ui="{ content: 'max-w-xs', body: 'sm:p-6' }"
        >
          <UButton
            icon="i-lucide-menu"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="Open menu"
            class="cursor-pointer md:hidden"
          />

          <template #body>
            <nav class="flex flex-col">
              <a
                v-for="link in navLinks"
                :key="link.href"
                :href="link.href"
                class="border-b border-black/[0.06] py-3.5 text-base font-medium text-zinc-700 transition-colors hover:text-violet-600 dark:border-white/[0.08] dark:text-zinc-200 dark:hover:text-violet-400"
                @click="mobileMenuOpen = false"
              >{{ link.label }}</a>
            </nav>

            <div class="mt-6 flex flex-col gap-2.5">
              <NuxtLink
                to="/login"
                class="rounded-full border border-black/10 py-2.5 text-center text-sm font-semibold text-zinc-700 transition-colors hover:bg-black/[0.03] dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/5"
                @click="mobileMenuOpen = false"
              >
                Log in
              </NuxtLink>
              <a
                href="#early-access"
                class="rounded-full bg-violet-600 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-violet-700"
                @click="mobileMenuOpen = false"
              >
                Join Early Access
              </a>
              <NuxtLink
                to="/register"
                class="rounded-full border border-black/10 py-2.5 text-center text-sm font-semibold text-zinc-700 transition-colors hover:bg-black/[0.03] dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/5"
                @click="mobileMenuOpen = false"
              >
                Try the demo
              </NuxtLink>
            </div>
          </template>
        </USlideover>
      </div>
    </div>
  </header>
</template>
