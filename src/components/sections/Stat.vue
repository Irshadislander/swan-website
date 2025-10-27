<template>
  <div class="text-center rounded-2xl bg-white p-6 shadow-sm">
    <p class="text-3xl font-bold text-brand-700">{{ value }}+</p>
    <p class="mt-1 text-grayx-600">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ value:number|string; label:string }>()
</script>