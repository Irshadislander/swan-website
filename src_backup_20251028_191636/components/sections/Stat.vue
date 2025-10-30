<template>
  <div class="rounded-2xl bg-white p-6 text-center shadow-sm">
    <p class="text-3xl font-bold text-brand-700">{{ formattedValue }}+</p>
    <p class="mt-1 text-grayx-600">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number | string
  label: string
}>()

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return new Intl.NumberFormat('en-US').format(props.value)
  }
  return props.value
})
</script>
