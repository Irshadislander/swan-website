<script setup lang="ts">
import { getSite } from "@/lib/content";

const regions = getSite().regionsOverview ?? [];
</script>

<template>
  <section class="py-12 sm:py-16 bg-haze">
    <div class="container-irr space-y-6">
      <header class="text-center space-y-2 max-w-3xl mx-auto">
        <p class="kicker">Where we work</p>
        <h1 class="font-heading text-4xl text-brand-900">Regions & focus districts</h1>
        <p class="text-slate-600">Every program is co-designed with ward committees, cooperatives, and diaspora partners.</p>
      </header>

      <div class="grid gap-5 md:grid-cols-3">
        <article v-for="region in regions" :key="region.id" class="card space-y-3">
          <p class="text-xs uppercase tracking-[0.35em] text-brand-600">{{ region.stats }}</p>
          <h2 class="text-2xl font-heading text-brand-900">{{ region.title }}</h2>
          <p class="text-slate-600">{{ region.body }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
