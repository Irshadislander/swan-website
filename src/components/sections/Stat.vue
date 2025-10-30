<template>
  <div class="flex h-full flex-col items-center justify-center rounded-3xl border border-white/70 bg-white/90 p-6 text-center shadow-lg shadow-brand/5">
    <p class="text-3xl font-bold text-brand">
      {{ displayValue }}<span class="text-brand-accent">{{ suffix }}</span>
    </p>
    <p class="mt-2 text-sm text-slate-600">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  value: number;
  suffix?: string;
  label: string;
}>();

const displayValue = computed(() => new Intl.NumberFormat("en-US").format(props.value));
const suffix = computed(() => props.suffix ?? "");
const label = computed(() => props.label);
</script>
