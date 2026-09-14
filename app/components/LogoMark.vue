<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 28 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
  >
    <rect width="64" height="64" rx="15" fill="#7c3aed" />
    <rect x="27" y="11" width="22" height="16" rx="6" fill="white" fill-opacity=".32" />
    <rect x="13" y="21" width="28" height="20" rx="7" fill="none" stroke="white" stroke-width="2.6" />
    <path d="M19 41 L19 48 L27 41 Z" fill="white" />
    <path d="M20 31 L25 36 L36 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
