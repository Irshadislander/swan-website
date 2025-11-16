<script setup lang="ts">
import { computed, reactive, watchEffect } from "vue";
import { RouterLink } from "vue-router";
import { getCauses, getSite } from "@/lib/content";

const site = getSite();
const focusAreas = site.focusAreas;
const causesIndex = getCauses().reduce<Record<string, { cardImage?: string }>>((acc, cause) => {
  acc[cause.slug] = { cardImage: cause.cardImage };
  return acc;
}, {});

const cards = computed(() =>
  focusAreas.map((area) => {
    const gallery = Array.isArray(area.gallery) ? area.gallery : [];
    const primaryImage =
      area.image ??
      causesIndex[area.slug]?.cardImage ??
      "/images/home/focus-education.jpg";
    return {
      ...area,
      gallery,
      image: gallery.length ? gallery[0].src : primaryImage,
    };
  })
);

const imageLoaded = reactive<Record<string, boolean>>({});
const galleryIndex = reactive<Record<string, number>>({});

const markLoaded = (slug: string) => {
  imageLoaded[slug] = true;
};

const nextSlide = (slug: string, length: number) => {
  if (length <= 1) return;
  galleryIndex[slug] = ((galleryIndex[slug] ?? 0) + 1) % length;
};

const prevSlide = (slug: string, length: number) => {
  if (length <= 1) return;
  galleryIndex[slug] = (galleryIndex[slug] ?? 0) - 1;
  if (galleryIndex[slug] < 0) {
    galleryIndex[slug] = length - 1;
  }
};

const setSlide = (slug: string, idx: number, length: number) => {
  if (length <= 0) return;
  if (idx < 0) idx = 0;
  if (idx >= length) idx = length - 1;
  galleryIndex[slug] = idx;
};

watchEffect(() => {
  cards.value.forEach((area) => {
    if (Array.isArray(area.gallery) && area.gallery.length > 0 && !(area.slug in galleryIndex)) {
      galleryIndex[area.slug] = 0;
    }
  });
});

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
            <template v-if="area.gallery && area.gallery.length">
              <div :class="['absolute inset-0 transition-opacity duration-500', imageLoaded[`${area.slug}-${galleryIndex[area.slug] ?? 0}`] ? 'opacity-0' : 'img-shell']"></div>
              <img
                :src="area.gallery[galleryIndex[area.slug] ?? 0]?.src"
                :alt="area.gallery[galleryIndex[area.slug] ?? 0]?.alt || `${area.title} gallery image`"
                loading="lazy"
                decoding="async"
                class="absolute inset-0 h-full w-full object-cover"
                @load="markLoaded(`${area.slug}-${galleryIndex[area.slug] ?? 0}`)"
              />
              <button
                v-if="area.gallery.length > 1"
                type="button"
                class="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-lg shadow transition hover:bg-white focus-ring focus:outline-none"
                :aria-label="`Previous ${area.title} photo`"
                @click="prevSlide(area.slug, area.gallery.length)"
              >
                ‹
              </button>
              <button
                v-if="area.gallery.length > 1"
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-lg shadow transition hover:bg-white focus-ring focus:outline-none"
                :aria-label="`Next ${area.title} photo`"
                @click="nextSlide(area.slug, area.gallery.length)"
              >
                ›
              </button>
              <div
                v-if="area.gallery.length > 1"
                class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2"
              >
                <button
                  v-for="(slide, idx) in area.gallery"
                  :key="slide.src"
                  type="button"
                  class="h-1.5 w-6 rounded-full transition focus:outline-none focus-visible:ring"
                  :class="(galleryIndex[area.slug] ?? 0) === idx ? 'bg-brand-600' : 'bg-white/60'"
                  :aria-label="`Show ${area.title} photo ${idx + 1}`"
                  @click="setSlide(area.slug, idx, area.gallery.length)"
                />
              </div>
            </template>
            <template v-else>
              <div :class="['absolute inset-0 transition-opacity duration-500', imageLoaded[area.slug] ? 'opacity-0' : 'img-shell']"></div>
              <img
                :src="area.image"
                :alt="`${area.title} program`"
                loading="lazy"
                decoding="async"
                class="absolute inset-0 h-full w-full object-cover"
                @load="markLoaded(area.slug)"
              />
            </template>
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
