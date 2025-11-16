<script setup lang="ts">
import { RouterLink } from "vue-router";
import { getSite } from "@/lib/content";

const zakat = getSite().zakat;
</script>

<template>
  <section v-if="zakat" class="grid gap-6 md:grid-cols-2">
    <article class="card space-y-3">
      <p class="text-xs uppercase tracking-[0.35em] text-brand-600">Zakat al-Fitr</p>
      <h2 class="text-2xl font-heading text-brand-900">{{ zakat.fitr.title }}</h2>
      <p class="text-slate-600">{{ zakat.fitr.body }}</p>
      <RouterLink v-if="zakat.fitr.cta" :to="zakat.fitr.cta.to" class="btn btn-primary w-fit">
        {{ zakat.fitr.cta.label }}
      </RouterLink>
    </article>
    <article class="card space-y-3" id="offline">
      <p class="text-xs uppercase tracking-[0.35em] text-brand-600">Offline giving</p>
      <h2 class="text-2xl font-heading text-brand-900">Bank transfers & drop-offs</h2>
      <ul class="text-slate-600 space-y-2">
        <li v-for="line in zakat.offline" :key="line">• {{ line }}</li>
      </ul>
      <RouterLink to="/contact" class="pill w-fit">Need help? Contact us</RouterLink>
    </article>
  </section>
</template>
