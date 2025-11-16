<script setup lang="ts">
import { getSite } from "@/lib/content";
import { RouterLink } from "vue-router";

const advocacy = getSite().advocacy;
</script>

<template>
  <section v-if="advocacy" class="py-12 sm:py-16">
    <div class="container-irr space-y-6">
      <header class="space-y-3 text-center max-w-3xl mx-auto">
        <p class="kicker">Advocacy</p>
        <h1 class="font-heading text-4xl text-brand-900">{{ advocacy.title }}</h1>
        <p class="text-slate-600">{{ advocacy.body }}</p>
      </header>

      <div class="grid gap-4 md:grid-cols-3">
        <article v-for="action in advocacy.actions" :key="action.title" class="card space-y-3">
          <h2 class="text-xl font-semibold text-brand-900">{{ action.title }}</h2>
          <p class="text-slate-600">{{ action.summary }}</p>
          <RouterLink :to="action.link" class="arrow-cta">Get details</RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>
