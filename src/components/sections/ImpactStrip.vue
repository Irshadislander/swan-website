<template>
  <section class="py-12">
    <div class="container-irr space-y-6">
      <div>
        <p class="kicker mb-3">Why SWAN</p>
        <h2 class="text-3xl font-bold text-brand-900">{{ copy.impact.title }}</h2>
        <p class="text-slate-600">{{ copy.impact.headline }}</p>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <article
          v-for="item in copy.impact.items"
          :key="item.title"
          class="card p-6 hover:-translate-y-1 hover:shadow-lg transition"
        >
          <div class="pill bg-accent-100 border-accent-200 mb-4">✔</div>
          <h3 class="text-xl font-semibold text-brand-900">{{ item.title }}</h3>
          <p class="mt-2 text-slate-600 text-sm leading-relaxed">{{ item.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { copy } from "@lib/copy";
</script>
