<script setup lang="ts">
import { getSite } from "@/lib/content";
import { RouterLink } from "vue-router";

const matching = getSite().matchingGifts;
</script>

<template>
  <section v-if="matching" class="py-12 sm:py-16" id="matching">
    <div class="container-irr">
      <div class="matching-card card bg-gradient-to-r from-brand-600 to-brand-800 text-white">
        <div class="space-y-3">
          <p class="text-xs uppercase tracking-[0.35em] text-white/70">Matching gifts</p>
          <h2 class="text-3xl font-heading">{{ matching.title }}</h2>
          <p class="text-white/85">{{ matching.body }}</p>
        </div>
        <div class="flex flex-col gap-3 md:flex-row md:items-center">
          <RouterLink v-if="matching.cta?.to" :to="matching.cta.to" class="btn btn-gradient">
            {{ matching.cta.label }}
          </RouterLink>
          <a
            v-else-if="matching.cta?.href"
            :href="matching.cta.href"
            class="btn btn-gradient"
            target="_blank"
            rel="noopener"
          >
            {{ matching.cta.label }}
          </a>

          <a
            v-if="matching.secondary?.href"
            :href="matching.secondary.href"
            class="pill border-white/60 text-white"
            target="_blank"
            rel="noopener"
          >
            {{ matching.secondary.label }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.matching-card {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
</style>
