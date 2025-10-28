<template>
  <BaseSection>
    <div class="rounded-2xl bg-grayx-50 p-6 text-center">
      <p class="text-grayx-600">
        {{ copy.tagline }}
      </p>
      <div class="mt-4 grid grid-cols-2 gap-4 opacity-80 sm:grid-cols-4">
        <div
          v-for="n in copy.placeholders"
          :key="n"
          class="h-12 rounded bg-grayx-200"
          aria-hidden="true"
        ></div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseSection from '@/components/base/BaseSection.vue'
import { landingCopy } from '@/lib/copy'

const copy = landingCopy.partners
</script>
