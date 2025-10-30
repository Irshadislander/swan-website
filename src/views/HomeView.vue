<template>
  <div class="space-y-8">
    <BaseSection>
      <HomeHero />
    </BaseSection>

    <AboutStrip />
    <FocusAreas />
    <CausesGrid />
    <ImpactStrip />
    <StoriesPreview />
    <CTABanner />
    <PartnersRow />
  </div>
</template>

<script setup lang="ts">
import BaseSection from "@components/base/BaseSection.vue";
import HomeHero from "@components/hero/HomeHero.vue";
import AboutStrip from "@components/sections/AboutStrip.vue";
import FocusAreas from "@components/sections/FocusAreas.vue";
import CausesGrid from "@components/sections/CausesGrid.vue";
import ImpactStrip from "@components/sections/ImpactStrip.vue";
import StoriesPreview from "@components/sections/StoriesPreview.vue";
import CTABanner from "@components/sections/CTABanner.vue";
import PartnersRow from "@components/sections/PartnersRow.vue";
</script>
