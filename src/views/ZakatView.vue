<script setup lang="ts">
import { getSite } from "@/lib/content";
import ZakatCalculator from "@/components/zakat/ZakatCalculator.vue";
import ZakatInfoSection from "@/components/zakat/ZakatInfoSection.vue";
import QuickDonateBar from "@/components/hero/QuickDonateBar.vue";

const zakat = getSite().zakat;
</script>

<template>
  <section class="py-12 sm:py-16 bg-haze" v-if="zakat">
    <div class="container-irr space-y-8">
      <header class="space-y-3 text-center max-w-3xl mx-auto">
        <p class="kicker">Zakat</p>
        <h1 class="font-heading text-4xl text-brand-900">{{ zakat.title }}</h1>
        <p class="text-slate-600">{{ zakat.body }}</p>
      </header>

      <QuickDonateBar />

      <ZakatCalculator />
      <ZakatInfoSection />
    </div>
  </section>
</template>
