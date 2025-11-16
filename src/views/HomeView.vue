<template>
  <div class="space-y-8">
    <BaseSection>
      <HomeHero />
    </BaseSection>

    <AboutStrip />
    <FocusAreas />
    <CausesGrid />
    <ImpactStrip />
    <DonationCampaigns />
    <MatchingGiftsSection />
    <EventsCarousel />
    <PastProjects />
    <StoriesPreview />
    <MoreWaysSection />
    <SignupForm class="mt-12" source="home" />
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
import DonationCampaigns from "@components/sections/DonationCampaigns.vue";
import MatchingGiftsSection from "@components/sections/MatchingGiftsSection.vue";
import EventsCarousel from "@components/sections/EventsCarousel.vue";
import PastProjects from "@components/sections/PastProjects.vue";
import StoriesPreview from "@components/sections/StoriesPreview.vue";
import MoreWaysSection from "@components/sections/MoreWaysSection.vue";
import CTABanner from "@components/sections/CTABanner.vue";
import PartnersRow from "@components/sections/PartnersRow.vue";
import SignupForm from "@components/newsletter/SignupForm.vue";
</script>
