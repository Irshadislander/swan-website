<template>
  <article
    :class="['break-inside-avoid rounded-2xl bg-white shadow-card border border-slate-200 overflow-hidden flex flex-col', $attrs.class]
    "
    @mouseenter="emit('prefetch')"
    @focusin="emit('prefetch')"
  >
    <div class="relative aspect-[4/3]">
      <div :class="['absolute inset-0 transition-opacity duration-500', imageLoaded ? 'opacity-0' : 'img-shell']"></div>
      <img
        :src="story.image"
        :alt="story.title"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 h-full w-full object-cover"
        @load="imageLoaded = true"
      />
    </div>
    <div class="p-6 flex flex-col gap-3">
      <span class="pill bg-brand-50 border-brand-200 text-brand-700 self-start text-xs font-semibold tracking-[0.2em] uppercase">
        {{ story.category }}
      </span>
      <RouterLink
        :to="story.to"
        class="font-heading text-2xl text-brand-900 leading-tight hover:text-brand-700"
        @click="emit('open', story.slug)"
      >
        {{ story.title }}
      </RouterLink>
      <p class="text-slate-600 text-sm leading-relaxed flex-1">{{ story.excerpt }}</p>
      <div class="text-xs text-slate-500">{{ formattedDate }}</div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import type { RouteLocationRaw } from "vue-router";

defineOptions({ inheritAttrs: false });

export type StoryCardProps = {
  title: string;
  excerpt: string;
  image: string;
  category: string;
  slug: string;
  date: string;
  to: RouteLocationRaw;
};

const props = defineProps<{ story: StoryCardProps }>();
const emit = defineEmits<{ (e: "prefetch"): void; (e: "open", slug: string): void }>();
const imageLoaded = ref(false);

const formattedDate = computed(() =>
  new Date(props.story.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
);
</script>
