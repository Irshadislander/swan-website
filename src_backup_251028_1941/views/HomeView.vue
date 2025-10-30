<template>
  <BaseSection>
    <h1 class="text-3xl font-bold mb-2">{{ copy.hero.title }}</h1>
    <p class="text-gray-600 dark:text-gray-300 mb-6">{{ copy.hero.blurb }}</p>
    <router-link to="/donate"><BaseButton>{{ copy.cta.sample }}</BaseButton></router-link>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseSection from "@/components/base/BaseSection.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import copy from "@/lib/copy";
</script>
