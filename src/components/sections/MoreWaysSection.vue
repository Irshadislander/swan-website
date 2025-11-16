<script setup lang="ts">
import { getSite } from "@/lib/content";
import { RouterLink } from "vue-router";

const items = getSite().moreWays ?? [];
</script>

<template>
  <section v-if="items.length" class="py-12 sm:py-16 bg-haze" data-animate="fade-up">
    <div class="container-irr space-y-6">
      <div class="text-center space-y-2">
        <p class="kicker">More ways to give</p>
        <h2 class="section-heading text-3xl">Choose the option that works best for your family or company</h2>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <article v-for="item in items" :key="item.slug" class="card space-y-3">
          <h3 class="text-xl font-semibold text-brand-900">{{ item.title }}</h3>
          <p class="text-slate-600">{{ item.summary }}</p>
          <RouterLink v-if="item.cta?.to" :to="item.cta.to" class="arrow-cta"> {{ item.cta.label }}</RouterLink>
          <a
            v-else-if="item.cta?.href"
            :href="item.cta.href"
            class="arrow-cta"
            target="_blank"
            rel="noopener"
          >
            {{ item.cta.label }}
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
