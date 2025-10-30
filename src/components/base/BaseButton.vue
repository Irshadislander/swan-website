<template>
  <button
    :class="[
      'btn',
      variant === 'primary' && 'btn-primary',
      variant === 'gradient' && 'btn-gradient',
      block && 'w-full'
    ]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ variant?: 'primary' | 'gradient'; block?: boolean }>()
</script>
