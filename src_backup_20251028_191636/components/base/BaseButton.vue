<template>
  <component
    :is="componentTag"
    :to="isRouterLink ? to : undefined"
    :href="isAnchor ? href : undefined"
    :type="isButton ? type : undefined"
    :class="[baseClasses, variantClasses, block ? 'w-full' : 'inline-flex', disabled ? 'opacity-60 cursor-not-allowed' : '']"
    :disabled="isButton ? disabled : undefined"
    :aria-disabled="!isButton && disabled ? 'true' : undefined"
    :tabindex="!isButton && disabled ? -1 : undefined"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
// Base button component that standardises primary and ghost variants across the site.
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost'
    to?: string
    href?: string
    type?: 'button' | 'submit' | 'reset'
    block?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    type: 'button',
    block: false,
    disabled: false,
  },
)

const isRouterLink = computed(() => Boolean(props.to))
const isAnchor = computed(() => Boolean(props.href))
const isButton = computed(() => !props.to && !props.href)

const componentTag = computed(() => {
  if (isRouterLink.value) return RouterLink
  if (isAnchor.value) return 'a'
  return 'button'
})

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600'

const variantClasses = computed(() => {
  if (props.variant === 'ghost') {
    return 'bg-white text-brand-700 ring-1 ring-grayx-200 hover:bg-grayx-50'
  }
  return 'bg-brand-600 text-white hover:bg-brand-700'
})
</script>
