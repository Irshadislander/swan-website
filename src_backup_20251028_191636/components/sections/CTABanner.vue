<template>
  <BaseSection>
    <div class="rounded-2xl bg-gradient-to-r from-mint-50 to-brand-50 p-8 text-center">
      <h3 class="heading-font text-2xl font-semibold text-brand-800">
        {{ copy.title }}
      </h3>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <BaseButton :to="copy.primaryCta.to">
          {{ copy.primaryCta.label }}
        </BaseButton>
        <BaseButton :to="copy.secondaryCta.to" variant="ghost">
          {{ copy.secondaryCta.label }}
        </BaseButton>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSection from '@/components/base/BaseSection.vue'
import { landingCopy } from '@/lib/copy'

const copy = landingCopy.ctaBanner
</script>
