<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import QuickDonateBar from "@/components/hero/QuickDonateBar.vue";

const CAUSES = {
  education: {
    badge: "ED",
    title: "Education Access",
    lede:
      "Scholarships, safe classrooms, and mentoring programs keep rural students on track to graduate and dream bigger.",
    bullets: [
      "Scholarships cover tuition, uniforms, and entrance exam prep.",
      "School rehab teams retrofit classrooms and libraries after disasters.",
      "Mentorship clubs pair older students with primary school learners.",
    ],
    image: "/images/cause-education.jpg",
  },
  health: {
    badge: "HE",
    title: "Community Health",
    lede:
      "Mobile health camps run by Nepali nurses deliver checkups, medicines, and wellness training in hard-to-reach villages.",
    bullets: [
      "Mobile clinics offer maternal, pediatric, and chronic care checkups.",
      "Emergency funds cover referrals to partner hospitals when needed.",
      "Health promoters train local volunteers in nutrition and hygiene.",
    ],
    image: "/images/cause-health.jpg",
  },
  empowerment: {
    badge: "EM",
    title: "Women’s Leadership",
    lede:
      "Micro-grants and coaching empower women-led cooperatives to launch enterprises and keep profits in their communities.",
    bullets: [
      "Seed funding for cooperatives investing in agriculture and services.",
      "Financial literacy and digital record-keeping workshops.",
      "Market linkages to help cooperatives sell beyond their village.",
    ],
    image: "/images/cause-empowerment.jpg",
  },
} satisfies Record<string, { badge: string; title: string; lede: string; bullets: string[]; image: string }>;

const route = useRoute();
const cause = computed(() => CAUSES[(route.params.slug as string) ?? ""]);
</script>

<template>
  <section class="py-12 sm:py-16" v-if="cause">
    <div class="container-irr grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <article class="space-y-6">
        <div class="flex items-center gap-3">
          <span class="mini-badge">{{ cause.badge }}</span>
          <RouterLink to="/causes" class="text-sm text-brand-600 hover:text-brand-800">All causes</RouterLink>
        </div>
        <h1 class="font-heading text-3xl sm:text-4xl text-brand-900">{{ cause.title }}</h1>
        <p class="text-slate-700 text-lg leading-relaxed">{{ cause.lede }}</p>

        <ul class="space-y-3 text-slate-700">
          <li v-for="item in cause.bullets" :key="item" class="flex gap-3">
            <span class="pill bg-accent-50 border-accent-200 text-brand-700">✔</span>
            <span>{{ item }}</span>
          </li>
        </ul>

        <img :src="cause.image" :alt="cause.title" class="w-full rounded-2xl shadow-card object-cover" />
      </article>

      <aside class="card p-6 space-y-5 self-start">
        <h2 class="font-heading text-xl text-brand-900">Support {{ cause.title }}</h2>
        <p class="text-slate-600">
          Everything we do is driven with local partners and published transparency reports. Your gift keeps programs going in
          the most remote wards.
        </p>
        <QuickDonateBar />
        <div class="bg-brand-50/60 border border-brand-100 rounded-xl p-4 space-y-2 text-sm text-brand-800">
          <p class="font-semibold">Why SWAN?</p>
          <ul class="space-y-1">
            <li>• Local coordinators in every program district.</li>
            <li>• Transparent reporting with open budgets.</li>
            <li>• Programs co-designed with community leaders.</li>
          </ul>
        </div>
      </aside>
    </div>
  </section>

  <section v-else class="py-16">
    <div class="container-irr text-center space-y-3">
      <h1 class="font-heading text-3xl text-brand-900">Cause not found</h1>
      <RouterLink to="/causes" class="text-brand-600 hover:text-brand-800">Return to all causes</RouterLink>
    </div>
  </section>
</template>
