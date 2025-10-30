<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const stories = {
  "library-rises": {
    tag: "Education",
    title: "A library rises in Lamjung",
    image: "/images/story-library.jpg",
    body: [
      "In the hillside community of Lamjung, the original school library collapsed during the 2015 earthquake. Students stored rescued books in metal trunks for years.",
      "Last year, the community organized, fundraising alongside SWAN supporters to rebuild a seismically safe reading space. Parents donated stonework and labor while SWAN covered engineering plans, timber, and youth volunteer stipends.",
      "Today, over 320 students borrow books weekly. The reading club now mentors younger students and hosts storytelling hours for families.",
    ],
  },
  "maternal-care-caravan": {
    tag: "Health",
    title: "Maternal care on the move",
    image: "/images/story-maternal.jpg",
    body: [
      "In remote Dhading, expectant mothers often walk for hours for prenatal checkups. SWAN’s mobile maternal caravan changes that reality.",
      "Every two weeks, a team of nurses and midwives travels by jeep and foot to reach villages without clinics. They carry ultrasound equipment, prenatal vitamins, and safe birth kits.",
      "Follow-ups show higher antenatal checkup rates and fewer preventable complications. New mothers say they now have a direct connection to care long after delivery.",
    ],
  },
  "coop-leaders": {
    tag: "Women’s Leadership",
    title: "Co-ops fueling village economies",
    image: "/images/story-coops.jpg",
    body: [
      "Across Lamjung and Kaski districts, women-led cooperatives are reshaping local economies with micro-grants and training backed by SWAN supporters.",
      "The cooperatives choose the ventures—goat rearing, tailoring, seed banks—and manage transparent repayment schedules. Profits are reinvested into new members.",
      "Over 71 enterprises have launched since 2021, generating livelihoods while keeping skills and profits anchored in their own villages.",
    ],
  },
} as const;

const route = useRoute();
const story = computed(() => stories[(route.params.slug as keyof typeof stories) ?? ""]);
</script>

<template>
  <section class="py-12 sm:py-16">
    <div class="container-irr space-y-6" v-if="story">
      <RouterLink to="/stories" class="text-sm text-brand-600 hover:text-brand-800">← Back to stories</RouterLink>
      <span class="pill border-brand-200 text-brand-700 self-start">{{ story.tag }}</span>
      <h1 class="font-heading text-3xl sm:text-4xl text-brand-900">{{ story.title }}</h1>
      <img :src="story.image" :alt="story.title" class="w-full rounded-2xl shadow-card object-cover max-h-[420px]" />
      <article class="space-y-4 text-slate-700 leading-relaxed">
        <p v-for="(paragraph, index) in story.body" :key="index">{{ paragraph }}</p>
      </article>
    </div>

    <div v-else class="container-irr py-16 text-center">
      <p class="text-slate-600">Story not found. <RouterLink to="/stories" class="text-brand-600">Return to stories</RouterLink>.</p>
    </div>
  </section>
</template>
