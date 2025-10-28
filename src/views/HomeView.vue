<template>
  <MainLayout>
    <HomeHero />
    <AboutStrip />
    <CausesGrid />
    <ImpactStrip />
    <CTABanner />
    <StoriesPreview />
    <PartnersRow />
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/shared/MainLayout.vue'
import HomeHero from '@/components/hero/HomeHero.vue'
import AboutStrip from '@/components/sections/AboutStrip.vue'
import CausesGrid from '@/components/sections/CausesGrid.vue'
import ImpactStrip from '@/components/sections/ImpactStrip.vue'
import CTABanner from '@/components/sections/CTABanner.vue'
import StoriesPreview from '@/components/sections/StoriesPreview.vue'
import PartnersRow from '@/components/sections/PartnersRow.vue'
</script>
