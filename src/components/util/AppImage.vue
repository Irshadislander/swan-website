<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { whenVisible } from "@/lib/lazy";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  class?: string;
  lazy?: boolean;
  placeholder?: string;
};

const props = defineProps<Props>();

const resolvedSrc = computed(() => {
  const value = props.src;
  if (!value) return "";
  if (value.startsWith("http") || value.startsWith("/")) return value;
  return new URL(value, import.meta.url).href;
});

const widths = [480, 768, 1024, 1440];

const srcSet = computed(() => widths.map((w) => `${resolvedSrc.value}?w=${w} ${w}w`).join(", "));
const sizesAttr = computed(() => props.sizes ?? "(max-width: 768px) 100vw, 50vw");
const fallbackPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23d1d5db' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='4'/%3E%3C/svg%3E";

const lazy = computed(() => props.lazy !== false);
const placeholderSrc = computed(() => props.placeholder ?? fallbackPlaceholder);

const currentSrc = ref(lazy.value ? placeholderSrc.value : resolvedSrc.value);
const showHighRes = ref(!lazy.value);
const hasLoaded = ref(false);
const root = ref<HTMLElement | null>(null);

const activateHighRes = () => {
  if (!resolvedSrc.value) return;
  hasLoaded.value = false;
  currentSrc.value = resolvedSrc.value;
  showHighRes.value = true;
};

watch(resolvedSrc, (next) => {
  if (!next) return;
  hasLoaded.value = false;
  if (lazy.value && !showHighRes.value) {
    currentSrc.value = placeholderSrc.value;
    return;
  }
  currentSrc.value = next;
});

watch(
  () => props.placeholder,
  (next) => {
    if (!lazy.value || showHighRes.value) return;
    currentSrc.value = next ?? fallbackPlaceholder;
  }
);

onMounted(() => {
  if (!lazy.value) return;
  const el = root.value;
  if (!el) return;
  whenVisible(el, activateHighRes);
});

const onLoad = () => {
  if (showHighRes.value) {
    hasLoaded.value = true;
  }
};
</script>

<template>
  <picture v-if="resolvedSrc" ref="root" class="block">
    <source v-if="showHighRes" :srcset="srcSet" :sizes="sizesAttr" />
    <img
      :src="currentSrc"
      :alt="alt"
      :width="width"
      :height="height"
      :class="class"
      decoding="async"
      :loading="lazy ? 'lazy' : 'eager'"
      :fetchpriority="lazy ? 'auto' : 'high'"
      @load="onLoad"
    />
    <span v-if="lazy && !hasLoaded" class="sr-only">Loading image...</span>
  </picture>
</template>
