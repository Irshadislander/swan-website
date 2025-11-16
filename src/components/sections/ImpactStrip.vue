<template>
  <section class="py-16 bg-haze" data-animate="fade-up">
    <div class="container-irr grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-stretch">
      <div class="space-y-6">
        <div>
          <p class="kicker mb-3 text-brand-700">Why SWAN</p>
          <h2 class="section-heading">{{ impact.title }}</h2>
          <p class="text-slate-600 text-lg leading-relaxed">{{ impact.headline }}</p>
        </div>

        <div class="rounded-3xl bg-white shadow-card border border-white/70 p-6 space-y-4">
          <p class="text-sm uppercase tracking-[0.35em] text-brand-600">
            Accountability in every district
          </p>
          <ul class="space-y-3 text-slate-700">
            <li v-for="(item, index) in highlightItems" :key="item.title" class="flex gap-3">
              <span class="pill bg-brand-50/80 border-brand-100 text-brand-800">{{ index + 1 }}</span>
              <div>
                <p class="font-semibold text-brand-900">{{ item.title }}</p>
                <p class="text-sm text-slate-600 leading-relaxed">{{ item.description }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <article
          v-for="(item, idx) in impact.items"
          :key="item.title"
          class="rounded-3xl border border-white/60 bg-white shadow-card p-6 flex flex-col gap-3"
        >
          <span class="text-xs uppercase tracking-[0.35em] text-brand-600">Impact {{ idx + 1 }}</span>
          <h3 class="text-2xl font-semibold text-brand-900 leading-snug">{{ item.title }}</h3>
          <p class="text-sm text-slate-600 flex-1 leading-relaxed">{{ item.description }}</p>
          <div class="h-1 w-16 rounded-full bg-brand-200"></div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getSite } from "@/lib/content";

const site = getSite();
const impact = site.impact;

const highlightItems = computed(() => impact.items.slice(0, 2));
</script>
