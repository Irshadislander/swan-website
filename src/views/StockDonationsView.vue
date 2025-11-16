<script setup lang="ts">
import { getSite } from "@/lib/content";

const stock = getSite().stockDonations;
</script>

<template>
  <section v-if="stock" class="py-12 sm:py-16 bg-white">
    <div class="container-irr space-y-6">
      <header class="space-y-2 text-center max-w-3xl mx-auto">
        <p class="kicker">Stock & assets</p>
        <h1 class="font-heading text-4xl text-brand-900">{{ stock.title }}</h1>
        <p class="text-slate-600">{{ stock.body }}</p>
      </header>

      <div class="grid gap-6 md:grid-cols-2">
        <article class="card space-y-3">
          <h2 class="text-xl font-semibold text-brand-900">Transfer instructions</h2>
          <ul class="text-slate-600 space-y-1.5">
            <li v-for="line in stock.instructions" :key="line">• {{ line }}</li>
          </ul>
        </article>
        <article class="card space-y-3">
          <h2 class="text-xl font-semibold text-brand-900">Benefits</h2>
          <ul class="text-slate-600 space-y-1.5">
            <li v-for="line in stock.benefits" :key="line">• {{ line }}</li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>
