<script setup lang="ts"></script>

<template>
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
</template>
