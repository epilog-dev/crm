<script setup lang="ts">
const audience = [
  'Thrift stores', 'Ceramic artists', 'Vintage clothing', 'Handmade jewellery',
  'Custom portraits', 'Home bakers', 'Resin art', 'Crochet & knits',
  'Beauty & botanicals', 'Sneaker resellers'
]
</script>

<template>
  <section class="marquee-wrap mt-6 overflow-hidden border-y border-black/[0.06] py-4 dark:border-white/[0.06]">
    <div class="marquee flex w-max items-center gap-8 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
      <template v-for="n in 2" :key="n">
        <span v-for="a in audience" :key="`${n}-${a}`" class="flex items-center gap-8">
          {{ a }} <span class="text-violet-400">✳</span>
        </span>
      </template>
    </div>
  </section>
</template>
