<script setup lang="ts">
import { computed, reactive } from "vue";
import { RouterLink } from "vue-router";
import { getCauses, getSite } from "@/lib/content";

const site = getSite();
const focusAreas = site.focusAreas;
const causesIndex = getCauses().reduce<Record<string, { cardImage?: string }>>((acc, cause) => {
  acc[cause.slug] = { cardImage: cause.cardImage };
  return acc;
}, {});

const cards = computed(() =>
  focusAreas.map((area) => ({
    ...area,
    image: causesIndex[area.slug]?.cardImage ?? "/images/home/focus-education.jpg",
  }))
);

const imageLoaded = reactive<Record<string, boolean>>({});

const markLoaded = (slug: string) => {
  imageLoaded[slug] = true;
};

let causeViewPrefetch: Promise<unknown> | null = null;
const ensureCauseView = () => {
  if (!causeViewPrefetch) {
    causeViewPrefetch = import(/* webpackChunkName: "view-cause" */ "@/views/CauseView.vue");
  }
};
</script>

<template>
  <section class="py-12 sm:py-16">
    <div class="container-irr">
      <div class="mb-8 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-6">
        <div>
          <p class="tracking-[0.2em] text-[12px] text-slate-500 mb-3">OUR FOCUS AREAS</p>
          <h2 class="font-heading text-3xl sm:text-4xl text-slate-900">Where we activate your support</h2>
          <p class="text-slate-600 mt-3">Each program is co-designed with local partners so funding stays accountable and responsive.</p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-5 lg:grid-cols-3">
        <article
          v-for="area in cards"
          :key="area.slug"
          class="card p-5 flex flex-col"
          @mouseenter="ensureCauseView()"
          @focusin="ensureCauseView()"
        >
          <div class="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl">
            <div :class="['absolute inset-0 transition-opacity duration-500', imageLoaded[area.slug] ? 'opacity-0' : 'img-shell']"></div>
            <img
              :src="area.image"
              :alt="`${area.title} program`"
              loading="lazy"
              decoding="async"
              class="absolute inset-0 h-full w-full object-cover"
              @load="markLoaded(area.slug)"
            />
          </div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-heading text-xl text-slate-900">{{ area.title }}</h3>
            <span class="mini-badge">{{ area.badge }}</span>
          </div>
          <p class="text-slate-600">{{ area.blurb }}</p>
          <p class="text-slate-700 mt-3">{{ area.stat }}</p>

          <RouterLink :to="area.to" class="arrow-cta mt-5 focus-ring focus:outline-none" @mouseenter="ensureCauseView()" @focusin="ensureCauseView()">
            Explore program
          </RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>
