<template>
  <BaseSection>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h2 class="heading-font text-3xl font-semibold text-brand-800">
        {{ copy.title }}
      </h2>
      <RouterLink to="/stories" class="text-sm font-semibold text-brand-700 hover:text-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
        {{ copy.readMoreLabel }} →
      </RouterLink>
    </div>

    <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article v-for="item in copy.items" :key="item.title" class="rounded-2xl border border-grayx-100 bg-white p-6 shadow-sm">
        <div class="mb-3 h-36 rounded-xl bg-grayx-100"></div>
        <h3 class="text-lg font-semibold text-brand-800">
          {{ item.title }}
        </h3>
        <p class="mt-1 text-sm text-grayx-600">
          {{ item.excerpt || copy.fallbackExcerpt }}
        </p>
        <RouterLink to="/stories" class="mt-3 inline-flex items-center text-sm font-semibold text-brand-700 hover:text-brand-800">
          {{ copy.readMoreLabel }} →
        </RouterLink>
      </article>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseSection from '@/components/base/BaseSection.vue'
import { landingCopy } from '@/lib/copy'

const copy = landingCopy.stories
</script>
