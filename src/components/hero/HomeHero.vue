<template>
  <section class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-brand-50 to-white"></div>

    <div class="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
      <div class="max-w-xl space-y-6">
        <h1 class="heading-font text-4xl font-bold text-brand-800 md:text-5xl">
          {{ heroCopy.title }}
        </h1>
        <p class="text-lg text-grayx-600">
          {{ heroCopy.tagline }}
        </p>
        <div class="flex flex-wrap gap-3">
          <BaseButton :to="heroCopy.primaryCta.to">
            {{ heroCopy.primaryCta.label }}
          </BaseButton>
          <BaseButton :to="heroCopy.secondaryCta.to" variant="ghost">
            {{ heroCopy.secondaryCta.label }}
          </BaseButton>
        </div>
      </div>

      <div class="relative overflow-hidden rounded-2xl bg-grayx-100 shadow-lg">
        <img
          v-if="hasHero"
          src="/hero.jpg"
          :alt="heroCopy.imageAlt"
          class="h-full w-full object-cover"
        />
        <div v-else class="flex h-full min-h-[280px] items-center justify-center bg-gradient-to-br from-mint-50 to-brand-100 text-brand-700">
          Image coming soon
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Landing hero with primary CTAs and optional background image.
import { onMounted, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { landingCopy } from '@/lib/copy'

const heroCopy = landingCopy.hero
const hasHero = ref(false)

onMounted(async () => {
  try {
    const response = await fetch('/hero.jpg', { method: 'HEAD' })
    hasHero.value = response.ok
  } catch {
    hasHero.value = false
  }
})
</script>
