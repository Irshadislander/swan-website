<script setup lang="ts">
import { RouterLink } from "vue-router";

type Emergency = {
  id: string;
  title: string;
  summary: string;
  updates: string;
  actions: Array<{ label: string; href: string }>;
};

const emergencies: Emergency[] = [
  {
    id: "gaza",
    title: "Gaza emergency fund",
    summary: "Mobile clinics, hot meals, and psychosocial care for families enduring blockade conditions.",
    updates: "Field partners are distributing hygiene kits in Rafah while preparing trauma support for children.",
    actions: [
      { label: "Give now", href: "/donate?campaign=gaza" },
      { label: "Read field notes", href: "/stories/library-rises" },
    ],
  },
  {
    id: "sudan",
    title: "Sudan relief caravan",
    summary: "Health caravans cross into Kassala with medicine, safe water, and cash stipends.",
    updates: "Nurses treated 1,200 people last week; more midwives deploy as soon as supplies arrive.",
    actions: [
      { label: "Fund a health kit", href: "/donate?campaign=sudan" },
      { label: "Volunteer interest", href: "/volunteer" },
    ],
  },
  {
    id: "nepal",
    title: "Nepal flood response",
    summary: "Shelter tarps, dry food, and counseling for displaced families in Madhesh Province.",
    updates: "Community leaders identified 430 households for immediate support after landslides.",
    actions: [
      { label: "Stock relief trucks", href: "/donate?campaign=nepal" },
      { label: "Contact our team", href: "/contact" },
    ],
  },
  {
    id: "usa",
    title: "USA relief fund",
    summary: "Emergency stipends and case management for immigrant families hit by severe storms.",
    updates: "SWAN partners in the Midwest are coordinating long-term housing and legal aid.",
    actions: [
      { label: "Support families", href: "/donate?campaign=usa" },
      { label: "Corporate match info", href: "/contact" },
    ],
  },
];

const readiness = [
  { label: "Emergency donate", href: "/donate?campaign=emergency" },
  { label: "Monthly lifeline", href: "/donate?frequency=monthly" },
  { label: "Press inquiries", href: "/media#press" },
  { label: "Volunteer deployments", href: "/volunteer" },
];
</script>

<template>
  <section class="py-12 sm:py-16 bg-haze">
    <div class="container-irr space-y-8">
      <header class="space-y-3 text-center max-w-3xl mx-auto">
        <p class="kicker text-brand-700">Emergency response</p>
        <h1 class="font-heading text-4xl text-brand-900">Rapid support for crises SWAN is responding to now</h1>
        <p class="text-slate-600">
          Your gift keeps mobile teams moving with food, medicine, and psychosocial care. Pick the emergency you’d like to fuel or
          start a general response gift so we can pivot fast.
        </p>
      </header>

      <div class="grid gap-6 md:grid-cols-2">
        <article
          v-for="emergency in emergencies"
          :key="emergency.id"
          :id="emergency.id"
          class="card space-y-4"
        >
          <p class="text-xs uppercase tracking-[0.35em] text-brand-600">Active response</p>
          <h2 class="text-2xl font-heading text-brand-900">{{ emergency.title }}</h2>
          <p class="text-slate-600">{{ emergency.summary }}</p>
          <p class="rounded-xl bg-white/80 border border-brand-50 px-4 py-3 text-sm text-brand-800">
            {{ emergency.updates }}
          </p>
          <div class="flex flex-wrap gap-3">
            <RouterLink
              v-for="action in emergency.actions"
              :key="action.label"
              :to="action.href"
              class="btn btn-primary flex-1 min-w-[140px] justify-center"
            >
              {{ action.label }}
            </RouterLink>
          </div>
        </article>
      </div>

      <div class="card space-y-4">
        <p class="text-xs uppercase tracking-[0.35em] text-brand-600">Readiness links</p>
        <div class="flex flex-wrap gap-3">
          <RouterLink v-for="link in readiness" :key="link.label" :to="link.href" class="pill">
            {{ link.label }}
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
