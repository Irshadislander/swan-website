<template>
  <BaseSection>
    <div class="flex flex-col gap-8">
      <div class="max-w-2xl space-y-3">
        <h2 class="heading-font text-3xl font-semibold text-brand-800">
          {{ copy.title }}
        </h2>
        <p class="text-grayx-600">
          {{ copy.description }}
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CauseCard v-for="item in copy.items" :key="item.title" :title="item.title" :description="item.description" />
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseSection from '@/components/base/BaseSection.vue'
import CauseCard from '@/components/sections/CauseCard.vue'
import { landingCopy } from '@/lib/copy'

const copy = landingCopy.causes
</script>
