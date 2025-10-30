<template>
  <section class="py-12">
    <div class="container-irr space-y-6">
      <div>
        <p class="kicker mb-3">Our focus areas</p>
        <h2 class="text-3xl font-bold text-brand-900">Where we activate your support</h2>
        <p class="text-slate-600">Each program is co-designed with local partners so funding stays accountable and responsive.</p>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <article v-for="cause in copy.causes" :key="cause.id" class="card p-6 flex h-full flex-col">
          <div class="flex items-center justify-between gap-4">
            <h3 class="text-xl font-semibold text-brand-900">{{ cause.title }}</h3>
            <span class="pill bg-accent-100 border-accent-200">{{ cause.id.slice(0, 2).toUpperCase() }}</span>
          </div>
          <p class="mt-4 text-sm leading-relaxed text-slate-600">{{ cause.description }}</p>
          <div class="mt-5 rounded-xl bg-accent-100 px-4 py-3 text-sm text-brand-800">
            {{ cause.impact }}
          </div>
          <RouterLink :to="`/causes/${cause.id}`" class="mt-auto btn btn-primary">Explore program</RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { copy } from "@lib/copy";
</script>
