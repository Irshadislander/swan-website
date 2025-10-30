<template>
  <BaseSection background="bg-brand-50" padding="tight">
    <div class="grid gap-6 sm:grid-cols-3">
      <Stat v-for="stat in stats" :key="stat.label" :value="stat.value" :label="stat.label" />
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseSection from '@/components/base/BaseSection.vue'
import { landingCopy } from '@/lib/copy'
import Stat from './Stat.vue'

const stats = landingCopy.impact.stats
</script>
