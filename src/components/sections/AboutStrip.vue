<template>
  <BaseSection>
    <div class="grid items-center gap-8 md:grid-cols-2">
      <div class="space-y-4">
        <p class="text-sm font-semibold uppercase tracking-wide text-brand-600">
          {{ copy.eyebrow }}
        </p>
        <h2 class="heading-font text-3xl font-semibold text-brand-800">
          {{ copy.title }}
        </h2>
        <p class="text-grayx-600">
          {{ copy.description }}
        </p>
        <BaseButton :to="copy.cta.to" variant="ghost" class="w-fit">
          {{ copy.cta.label }} →
        </BaseButton>
      </div>
      <div class="relative h-64 overflow-hidden rounded-2xl bg-grayx-100 md:h-80">
        <img
          v-if="hasAboutImage"
          src="/about-strip.jpg"
          :alt="copy.imageAlt"
          class="h-full w-full object-cover"
        />
        <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-brand-50 to-mint-50 text-brand-700">
          Visual coming soon
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
// About strip introducing the organisation with supporting imagery.
import { onMounted, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSection from '@/components/base/BaseSection.vue'
import { landingCopy } from '@/lib/copy'

const copy = landingCopy.aboutStrip
const hasAboutImage = ref(false)

onMounted(async () => {
  try {
    const response = await fetch('/about-strip.jpg', { method: 'HEAD' })
    hasAboutImage.value = response.ok
  } catch {
    hasAboutImage.value = false
  }
})
</script>
