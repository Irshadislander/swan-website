<template>
  <component :is="tag" :class="outerClasses">
    <div class="mx-auto max-w-7xl px-4 md:px-6">
      <slot />
    </div>
  </component>
</template>

<script setup lang="ts">
// Base section wrapper that standardises spacing and max-width constraints.
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    tag?: 'section' | 'div'
    padding?: 'default' | 'tight' | 'none'
    background?: string
  }>(),
  {
    tag: 'section',
    padding: 'default',
    background: '',
  },
)

const paddingClasses: Record<string, string> = {
  default: 'py-12',
  tight: 'py-8',
  none: 'py-0',
}

const outerClasses = computed(() =>
  [props.background, paddingClasses[props.padding] ?? paddingClasses.default].filter(Boolean).join(' '),
)
</script>
