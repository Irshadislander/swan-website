<template>
  <section class="py-12">
    <div class="container-irr space-y-6">
      <div>
        <p class="kicker mb-3">Field notes</p>
        <h2 class="text-3xl font-bold text-brand-900">{{ copy.stories.title }}</h2>
        <p class="text-slate-600">{{ copy.stories.body }}</p>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <article v-for="story in copy.stories.items" :key="story.to" class="card p-6 flex h-full flex-col">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Story</p>
          <h3 class="mt-3 text-xl font-semibold text-brand-900">{{ story.title }}</h3>
          <p class="mt-4 text-sm text-slate-600 flex-1">{{ story.excerpt }}</p>
          <RouterLink :to="story.to" class="mt-6 btn btn-primary">Read story</RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { copy } from "@lib/copy";
</script>
