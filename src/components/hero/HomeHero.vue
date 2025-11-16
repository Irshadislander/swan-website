<template>
  <section class="pt-10 pb-16 sm:pt-14 sm:pb-24">
    <div class="container-irr grid md:grid-cols-2 gap-10 items-center">
      <div>
        <p class="kicker mb-4">{{ hero.eyebrow }}</p>
        <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight text-brand-900">
          {{ activeSlide.title }}
        </h1>
        <p class="mt-5 text-slate-700 max-w-prose">
          {{ activeSlide.copy }}
        </p>
        <div class="mt-6 flex gap-3">
          <RouterLink :to="hero.primaryCta.to" class="btn btn-gradient" aria-label="Donate to SWAN now">
            {{ hero.primaryCta.label }}
          </RouterLink>
          <RouterLink :to="hero.secondaryCta.to" class="pill border-brand-300 text-brand-900">
            {{ hero.secondaryCta.label }}
          </RouterLink>
        </div>
        <div class="mt-8">
          <QuickDonateBar />
        </div>
        <div class="mt-10 flex gap-2" role="tablist" aria-label="Featured SWAN programs">
          <button
            v-for="(slide, index) in slides"
            :key="slide.id"
            class="h-2 w-10 rounded-full transition"
            :class="index === currentIndex ? 'bg-brand-600' : 'bg-slate-300/70 hover:bg-brand-400'"
            type="button"
            :aria-label="`Show slide ${index + 1}`"
            :aria-selected="index === currentIndex"
            role="tab"
            @click="goTo(index)"
          />
        </div>
      </div>

      <div
        class="card relative overflow-hidden"
        @mouseenter="pause"
        @mouseleave="resume"
      >
        <button
          type="button"
          class="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-700 shadow hover:bg-white"
          aria-label="Previous slide"
          @click="previous"
        >
          ‹
        </button>
        <button
          type="button"
          class="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand-700 shadow hover:bg-white"
          aria-label="Next slide"
          @click="next"
        >
          ›
        </button>
        <div class="relative aspect-[4/3] w-full">
          <div
            v-for="(slide, index) in slides"
            :key="slide.id"
            class="absolute inset-0 transition-opacity duration-700"
            :class="index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          >
            <div class="relative h-full w-full">
              <div :class="['absolute inset-0', imageLoaded[index] ? 'opacity-0' : 'img-shell']" />
              <video
                v-if="slide.video"
                :poster="slide.video.poster ?? slide.image"
                autoplay
                muted
                loop
                playsinline
                class="h-full w-full object-cover"
                @loadeddata="markLoaded(index)"
              >
                <source :src="slide.video.src" type="video/mp4" />
              </video>
              <picture v-else>
                <source :srcset="`${slide.image} 1x, ${slide.image} 2x`" media="(min-width: 1024px)" />
                <img
                  :src="slide.image"
                  :alt="slide.alt"
                  loading="eager"
                  decoding="async"
                  class="h-full w-full object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  @load="markLoaded(index)"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="pb-12">
    <div class="container-irr">
      <ul class="stat-row">
        <li v-for="stat in hero.stats" :key="stat.label">
          <span class="font-medium">{{ stat.label }}</span>
          <span>{{ formatValue(stat.value) }}{{ stat.suffix ?? '' }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import QuickDonateBar from "@components/hero/QuickDonateBar.vue";
import { getSite } from "@/lib/content";
import { track } from "@/plugins/analytics";

type Slide = {
  id: string;
  title: string;
  copy: string;
  image: string;
  alt: string;
  video?: {
    src: string;
    poster?: string;
  };
};

const hero = getSite().hero;

const slides: Slide[] = [
  {
    id: "education",
    title: "Scholarships keep students in class",
    copy: "Fund tutoring, safe classrooms, and mentorship so rural students can graduate on time.",
    image: "/images/home/hero-1.jpg",
    video: {
      src: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
      poster: "/images/home/hero-1.jpg",
    },
    alt: "SWAN students studying together",
  },
  {
    id: "health",
    title: "Mobile nurses reach remote wards",
    copy: "Support health camps that hike for hours to deliver prenatal care and lifesaving medicine.",
    image: "/images/home/hero-2.jpg",
    alt: "Nurse providing care at a rural health camp",
  },
  {
    id: "women",
    title: "Women-led co-ops grow local jobs",
    copy: "Back entrepreneurs building seed banks and cooperatives that keep profits in their villages.",
    image: "/images/home/hero-3.jpg",
    alt: "Women leaders collaborating on a cooperative plan",
  },
];

const intervalMs = 7000;
const currentIndex = ref(0);
const imageLoaded = reactive<Record<number, boolean>>({});
const isPaused = ref(false);
const reduceMotion = ref(false);
let timer: number | null = null;
let motionQuery: MediaQueryList | null = null;
let motionListener: ((event: MediaQueryListEvent) => void) | null = null;

const activeSlide = computed(() => slides[currentIndex.value] ?? slides[0]!);

const markLoaded = (index: number) => {
  imageLoaded[index] = true;
};

const emitTrack = (index: number) => {
  track("hero_slide", { index, id: slides[index]?.id });
};

const goTo = (index: number) => {
  const mod = (index + slides.length) % slides.length;
  if (mod === currentIndex.value) return;
  stop();
  currentIndex.value = mod;
  emitTrack(mod);
  if (!isPaused.value && !reduceMotion.value) {
    start();
  }
};

const next = () => goTo(currentIndex.value + 1);
const previous = () => goTo(currentIndex.value - 1);

const stop = () => {
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
};

const start = () => {
  if (reduceMotion.value) return;
  stop();
  timer = window.setInterval(next, intervalMs);
};

const pause = () => {
  isPaused.value = true;
  stop();
};

const resume = () => {
  isPaused.value = false;
  if (!reduceMotion.value) {
    start();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "ArrowRight") {
    next();
  } else if (event.key === "ArrowLeft") {
    previous();
  }
};

onMounted(() => {
  emitTrack(currentIndex.value);
  if (typeof window !== "undefined" && "matchMedia" in window) {
    motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotion.value = motionQuery.matches;
    motionListener = (event: MediaQueryListEvent) => {
      reduceMotion.value = event.matches;
    };
    motionQuery.addEventListener("change", motionListener);
  }
  if (!reduceMotion.value) {
    start();
  }
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  stop();
  window.removeEventListener("keydown", handleKeydown);
  if (motionQuery && motionListener) {
    motionQuery.removeEventListener("change", motionListener);
  }
});

const formatValue = (value: number) => new Intl.NumberFormat("en-US").format(value);

watch(reduceMotion, (value) => {
  if (value) {
    stop();
  } else if (!isPaused.value) {
    start();
  }
});
</script>
