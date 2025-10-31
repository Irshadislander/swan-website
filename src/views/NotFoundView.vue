<script setup lang="ts">
import BaseSection from "@/components/base/BaseSection.vue";
import { RouterLink } from "vue-router";
</script>

<template>
  <BaseSection>
    <div class="max-w-3xl mx-auto text-center py-16 space-y-6">
      <h1 class="font-heading text-5xl text-brand-900">Page not found</h1>
      <p class="text-slate-600 text-lg">
        The page you’re looking for doesn’t exist or was moved.
      </p>
      <RouterLink to="/" class="btn btn-primary focus-ring focus:outline-none">Go home</RouterLink>
    </div>
  </BaseSection>
</template>
