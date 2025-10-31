<template>
  <BaseSection class="py-8">
    <ul class="stat-row">
      <li v-for="stat in stats" :key="stat.label">
        <span class="font-medium text-brand-900">{{ stat.label }}</span>
        <span class="text-brand-800 font-semibold">{{ formatValue(stat.value) }}{{ stat.suffix ?? "" }}</span>
      </li>
    </ul>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseSection from "@components/base/BaseSection.vue";
import { getSite } from "@/lib/content";

const stats = getSite().hero.stats;

const formatValue = (value: number) => new Intl.NumberFormat("en-US").format(value);
</script>
