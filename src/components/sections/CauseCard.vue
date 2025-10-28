<template>
  <article class="rounded-2xl border border-grayx-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
    <h3 class="text-xl font-semibold text-brand-800">
      {{ title }}
    </h3>
    <p class="mt-2 text-sm text-grayx-600">
      {{ description }}
    </p>
  </article>
</template>

<script setup lang="ts">
// Individual cause card to display a single focus area on the landing page.
defineProps<{
  title: string
  description: string
}>()
</script>
