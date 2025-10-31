<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import QuickDonateBar from "@/components/hero/QuickDonateBar.vue";
import AppImage from "@/components/util/AppImage.vue";
import ImpactStatsRow from "@/components/causes/ImpactStatsRow.vue";
import FundUseChart from "@/components/causes/FundUseChart.vue";
import FAQAccordion from "@/components/causes/FAQAccordion.vue";
import { getCause } from "@/lib/content";
import { track } from "@/plugins/analytics";

const route = useRoute();
const router = useRouter();
const cause = computed(() => getCause((route.params.slug as string) ?? ""));

const goMonthly = () => {
  if (!cause.value) return;
  track("cause_cta_click", { slug: cause.value.slug, plan: "monthly" });
  router.push({ name: "donate", query: { frequency: "monthly", program: cause.value.slug } });
};
</script>

<template>
  <section class="py-12 sm:py-16" v-if="cause">
    <div class="container-irr grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <article class="space-y-6">
        <div class="flex items-center gap-3">
          <span class="mini-badge">{{ cause.code }}</span>
          <RouterLink to="/causes" class="text-sm text-brand-600 hover:text-brand-800">All causes</RouterLink>
        </div>
        <h1 class="font-heading text-3xl sm:text-4xl text-brand-900">{{ cause.name }}</h1>
        <p class="text-slate-700 text-lg leading-relaxed">{{ cause.lede }}</p>

        <ul class="space-y-3 text-slate-700">
          <li v-for="item in cause.body" :key="item" class="flex gap-3">
            <span class="pill bg-accent-50 border-accent-200 text-brand-700">✔</span>
            <span>{{ item }}</span>
          </li>
        </ul>

        <div class="aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <AppImage
            :src="cause.heroImage"
            :alt="cause.name"
            class="h-full w-full object-cover"
            :sizes="'(max-width: 768px) 100vw, 50vw'"
          />
        </div>

        <ImpactStatsRow v-if="cause.stats?.length" :stats="cause.stats" />

        <div v-if="cause.fundUse?.length" class="mt-8 space-y-6">
          <FundUseChart :breakdown="cause.fundUse" />
          <div class="text-center">
            <button type="button" class="btn btn-gradient focus-ring focus:outline-none" @click="goMonthly">
              Give monthly to {{ cause.name }}
            </button>
          </div>
        </div>

        <FAQAccordion v-if="cause.faq?.length" :items="cause.faq" class="mt-8" />
      </article>

      <aside class="card p-6 space-y-5 self-start">
        <h2 class="font-heading text-xl text-brand-900">Support {{ cause.name }}</h2>
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
