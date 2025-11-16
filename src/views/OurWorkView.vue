<script setup lang="ts">
import AppImage from "@/components/util/AppImage.vue";
import { getCauses } from "@/lib/content";
import { RouterLink } from "vue-router";

const causes = getCauses();

const regions = [
  {
    id: "south-asia",
    title: "South Asia hubs",
    body: "Partner-led programs span Lamjung, Kaski, and Siraha districts with year-round youth and health services.",
  },
  {
    id: "nepal",
    title: "Rural Nepal focus",
    body: "We co-design projects with ward committees and cooperatives so decisions stay rooted in the communities served.",
  },
  {
    id: "diaspora",
    title: "Diaspora partnerships",
    body: "Supporters across the US and Gulf countries power scholarships, emergency funds, and career pathways.",
  },
];
</script>

<template>
  <section class="py-12 sm:py-16">
    <div class="container-irr space-y-8">
      <header class="space-y-3 text-center max-w-4xl mx-auto">
        <p class="kicker">Programs at a glance</p>
        <h1 class="font-heading text-4xl text-brand-900">Every SWAN initiative is locally rooted and globally supported</h1>
        <p class="text-slate-600">
          From mobile nurses to women-led cooperatives, your donations flow directly to partners co-creating solutions across Nepal and
          the diaspora.
        </p>
      </header>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="cause in causes" :key="cause.slug" class="card p-0 overflow-hidden flex flex-col">
          <AppImage :src="cause.cardImage ?? cause.heroImage" :alt="cause.name" class="h-44 w-full object-cover" />
          <div class="p-6 flex flex-col gap-3 flex-1">
            <p class="text-xs uppercase tracking-[0.35em] text-brand-600">{{ cause.code }}</p>
            <h2 class="text-xl font-heading text-brand-900">{{ cause.name }}</h2>
            <p class="text-slate-600 flex-1">{{ cause.lede }}</p>
            <RouterLink :to="`/causes/${cause.slug}`" class="arrow-cta mt-2">Explore {{ cause.name }}</RouterLink>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="py-12 sm:py-16 bg-white" id="regions">
    <div class="container-irr space-y-6">
      <header class="space-y-2">
        <p class="kicker text-brand-700">Regional approach</p>
        <h2 class="font-heading text-3xl text-brand-900">Where your support travels</h2>
      </header>
      <div class="grid gap-4 md:grid-cols-3">
        <article
          v-for="region in regions"
          :key="region.id"
          :id="region.id"
          class="rounded-2xl border border-brand-50 bg-haze p-5 space-y-2"
        >
          <h3 class="text-lg font-semibold text-brand-900">{{ region.title }}</h3>
          <p class="text-slate-600">{{ region.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
