<template>
  <section class="py-12">
    <div class="container-irr">
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-card">
        <div class="absolute -top-16 -right-24 h-56 w-56 rounded-full bg-white/10 blur-3xl"></div>
        <div class="relative flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
          <div class="max-w-2xl space-y-3">
            <h3 class="text-3xl font-semibold">{{ cta.title }}</h3>
            <p class="text-white/85 md:text-lg">{{ cta.body }}</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <RouterLink :to="cta.primaryCta.to" class="btn btn-gradient">{{ cta.primaryCta.label }}</RouterLink>
            <RouterLink :to="cta.secondaryCta.to" class="pill border-white/40 text-white">{{ cta.secondaryCta.label }}</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getSite } from "@/lib/content";

const cta = getSite().cta;
</script>
