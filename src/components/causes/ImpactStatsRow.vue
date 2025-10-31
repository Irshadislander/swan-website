<template>
  <section v-if="stats.length" class="card p-6">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.label" class="rounded-xl bg-brand-50/60 border border-brand-100 p-4 text-center">
        <p class="text-2xl font-semibold text-brand-900">{{ stat.value }}</p>
        <p class="mt-1 text-sm text-slate-600">{{ stat.label }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ stats: Array<{ label: string; value: string }> }>();
</script>
