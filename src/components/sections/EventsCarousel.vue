<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { RouterLink } from "vue-router";
import { getSite } from "@/lib/content";

const events = getSite().events ?? [];
const currentIndex = ref(0);
const total = events.length;

const go = (step: number) => {
  if (!total) return;
  currentIndex.value = (currentIndex.value + step + total) % total;
};

const activeEvent = computed(() => events[currentIndex.value] ?? null);

const setIndex = (index: number) => {
  if (index < 0 || index >= total) return;
  currentIndex.value = index;
};

watchEffect(() => {
  if (currentIndex.value >= total) {
    currentIndex.value = 0;
  }
});
</script>

<template>
  <section v-if="events.length" class="py-12 sm:py-16" data-animate="fade-up">
    <div class="container-irr space-y-6">
      <div class="text-center space-y-2">
        <p class="kicker">Events & webinars</p>
        <h2 class="section-heading text-3xl">Where we activate your support</h2>
        <p class="text-slate-600">Tune into live events, fundraising tours, and webinars to stay close to the work.</p>
      </div>

      <div class="event-slider card">
        <article v-if="activeEvent" class="space-y-3 text-center md:text-left md:grid md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-8">
          <div class="space-y-2">
            <p class="text-xs uppercase tracking-[0.35em] text-brand-600">{{ activeEvent.date }} • {{ activeEvent.location }}</p>
            <h3 class="text-2xl font-heading text-brand-900">{{ activeEvent.title }}</h3>
            <p class="text-slate-600">{{ activeEvent.summary }}</p>
            <RouterLink :to="activeEvent.link" class="btn btn-primary inline-flex justify-center md:justify-start">
              Learn more
            </RouterLink>
          </div>
          <div class="hidden md:flex justify-end gap-4">
            <button type="button" class="slider-btn" aria-label="Previous event" @click="go(-1)">‹</button>
            <button type="button" class="slider-btn" aria-label="Next event" @click="go(1)">›</button>
          </div>
        </article>
        <div class="flex justify-center gap-2 pt-4">
          <button
            v-for="(event, idx) in events"
            :key="event.title"
            type="button"
            class="h-2 w-8 rounded-full"
            :class="idx === currentIndex ? 'bg-brand-600' : 'bg-slate-300'"
            @click="setIndex(idx)"
            :aria-label="`Show event ${idx + 1}`"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.event-slider {
  padding: 2rem;
}
.slider-btn {
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}
</style>
