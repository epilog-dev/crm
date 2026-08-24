<script setup lang="ts">
const { data: products } = await useFetch('/api/products')
</script>

<template>
  <h1 class="text-red-200">HOME</h1>
  <!-- <pre>{{ products }}</pre> -->
</template>
