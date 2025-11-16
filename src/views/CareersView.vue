<script setup lang="ts">
import { RouterLink } from "vue-router";

const roles = [
  {
    title: "Programs Coordinator — Kathmandu",
    body: "Support partner reporting, grant compliance, and field visits 2x per month.",
  },
  {
    title: "Donor Stewardship Lead — Remote",
    body: "Manage supporter emails, receipts, and impact storytelling with our comms team.",
  },
  {
    title: "Volunteer Mobilizer — Lamjung",
    body: "Recruit and onboard community volunteers for upcoming health caravans.",
  },
];
</script>

<template>
  <section class="py-12 sm:py-16 bg-haze">
    <div class="container-irr space-y-8">
      <header class="space-y-3 text-center max-w-3xl mx-auto">
        <p class="kicker">Join the team</p>
        <h1 class="font-heading text-4xl text-brand-900">Careers at SWAN</h1>
        <p class="text-slate-600">
          We’re a nimble, mission-driven team working across Nepal and with the diaspora. Browse open roles or reach out with your resume.
        </p>
      </header>

      <div class="grid gap-4 md:grid-cols-3">
        <article v-for="role in roles" :key="role.title" class="card space-y-3">
          <h2 class="text-xl font-semibold text-brand-900">{{ role.title }}</h2>
          <p class="text-slate-600">{{ role.body }}</p>
        </article>
      </div>

      <div class="card flex flex-col gap-3 text-center">
        <p class="text-slate-600">
          Don’t see a role that fits? Send your resume and interests to
          <a href="mailto:hello@swan.org" class="text-brand-700 font-semibold">hello@swan.org</a>.
        </p>
        <RouterLink to="/contact" class="btn btn-primary self-center">Contact our team</RouterLink>
      </div>
    </div>
  </section>
</template>
