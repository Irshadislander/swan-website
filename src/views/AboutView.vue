<script setup lang="ts">
import { getSite } from "@/lib/content";

const site = getSite();

const pillars = [
  {
    title: "Mission",
    body: "SWAN advances education, health, and leadership programs alongside communities across Nepal.",
  },
  {
    title: "Vision",
    body: "Students, nurses, and women entrepreneurs steering their own solutions with sustained support.",
  },
  {
    title: "Values",
    body: "Community-led design, transparency, and rapid response when disasters strike.",
  },
];

const leadership = [
  { name: "Asha Tamang", title: "Executive Director" },
  { name: "Binod Gurung", title: "Programs Lead" },
  { name: "Maya Shrestha", title: "Finance & Compliance" },
];
</script>

<template>
  <section class="py-12 sm:py-16 bg-haze">
    <div class="container-irr space-y-8">
      <header class="space-y-3 max-w-3xl">
        <p class="kicker">About {{ site.brand.name }}</p>
        <h1 class="font-heading text-4xl text-brand-900">Students Working Against Neglect</h1>
        <p class="text-slate-600">
          Since 2004, {{ site.brand.name }} has partnered with rural leaders to keep classrooms open, nurses in the field, and women-led
          cooperatives thriving.
        </p>
      </header>

      <div class="grid gap-4 md:grid-cols-3">
        <article v-for="pillar in pillars" :key="pillar.title" class="card space-y-2">
          <h2 class="text-lg font-semibold text-brand-900">{{ pillar.title }}</h2>
          <p class="text-slate-600">{{ pillar.body }}</p>
        </article>
      </div>
    </div>
  </section>

  <section class="py-12 sm:py-16 bg-white" id="leadership">
    <div class="container-irr space-y-6">
      <h2 class="font-heading text-3xl text-brand-900">Leadership</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article v-for="person in leadership" :key="person.name" class="rounded-2xl border border-brand-50 bg-white p-5">
          <h3 class="text-xl font-semibold text-brand-900">{{ person.name }}</h3>
          <p class="text-sm text-slate-600">{{ person.title }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
