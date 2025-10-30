<script setup lang="ts">
import { copy } from "@/lib/copy";
import { RouterLink } from "vue-router";

const areas = copy.focusAreas;
</script>

<template>
  <section class="py-12 sm:py-16">
    <div class="container-irr">
      <p class="tracking-[0.2em] text-[12px] text-slate-500 mb-3">OUR FOCUS AREAS</p>
      <h2 class="font-heading text-3xl sm:text-4xl text-slate-900 mb-6">Where we activate your support</h2>
      <p class="text-slate-600 mb-8">Each program is co-designed with local partners so funding stays accountable and responsive.</p>

      <div class="grid md:grid-cols-2 gap-5 lg:grid-cols-3">
        <article v-for="a in areas" :key="a.key" class="card p-5 flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-heading text-xl text-slate-900">{{ a.title }}</h3>
            <span class="mini-badge">{{ a.badge }}</span>
          </div>
          <p class="text-slate-600">{{ a.blurb }}</p>
          <p class="text-slate-700 mt-3">{{ a.stat }}</p>

          <RouterLink :to="a.to" class="arrow-cta mt-5">Explore program</RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>
