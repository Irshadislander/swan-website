<script setup lang="ts">
import BaseSection from "@/components/base/BaseSection.vue";

const reload = () => window.location.reload();
</script>

<template>
  <BaseSection>
    <div class="max-w-3xl mx-auto text-center py-16 space-y-6">
      <h1 class="font-heading text-5xl text-brand-900">Something went wrong</h1>
      <p class="text-slate-600 text-lg">Please try again in a moment.</p>
      <button type="button" class="btn pill focus-ring focus:outline-none" @click="reload">Reload</button>
    </div>
  </BaseSection>
</template>
