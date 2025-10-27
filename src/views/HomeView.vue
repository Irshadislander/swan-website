<template>
  <MainLayout>
    <HomeHero />
    <section class="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 class="heading-font text-3xl font-semibold text-brand-800">About SWAN</h2>
          <p class="mt-3 text-grayx-600">
            Founded by students with a vision to uplift rural Nepal through education and health.
            We run scholarships, health camps, and community programs with full transparency.
          </p>
          <RouterLink to="/about" class="inline-block mt-4 text-brand-700 font-semibold">Learn more →</RouterLink>
        </div>
        <div class="h-56 md:h-72 rounded-2xl bg-grayx-100"></div>
      </div>
    </section>

    <CausesGrid />
    <ImpactStrip />
    <CTABanner />
    <StoriesPreview />
    <PartnersRow />
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/shared/MainLayout.vue'
import HomeHero from '@/components/hero/HomeHero.vue'
import CausesGrid from '@/components/sections/CausesGrid.vue'
import ImpactStrip from '@/components/sections/ImpactStrip.vue'
import CTABanner from '@/components/sections/CTABanner.vue'
import StoriesPreview from '@/components/sections/StoriesPreview.vue'
import PartnersRow from '@/components/sections/PartnersRow.vue'
</script>