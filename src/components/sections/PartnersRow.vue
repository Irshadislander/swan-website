<template>
  <section class="py-12">
    <div class="container-irr space-y-6 text-center">
      <div>
        <p class="kicker mb-3">Partners</p>
        <h2 class="text-3xl font-bold text-brand-900">{{ partners.title }}</h2>
      </div>
      <div class="card flex flex-wrap items-center justify-center gap-6 px-6 py-8">
        <span
          v-for="logo in partners.logos"
          :key="logo"
          class="inline-flex items-center justify-center rounded-full border border-brand-200 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-700"
        >
          {{ logo }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getSite } from "@/lib/content";

const partners = getSite().partners;
</script>
