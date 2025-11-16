<template>
  <section class="py-16" data-animate="fade-up">
    <div class="container-irr space-y-8">
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <p class="kicker">Field notes</p>
        <h2 class="section-heading">{{ storiesPreview.title }}</h2>
        <p class="text-slate-600">{{ storiesPreview.body }}</p>
      </div>

      <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article
          v-if="featuredStory"
          class="relative overflow-hidden rounded-3xl min-h-[360px] text-white shadow-2xl"
          @mouseenter="ensureStoryView()"
          data-animate="fade-up"
        >
          <img
            v-if="featuredStory.image"
            :src="featuredStory.image"
            :alt="featuredStory.title"
            class="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/10" />
          <div class="relative h-full p-8 flex flex-col gap-4">
            <p class="text-xs uppercase tracking-[0.35em] text-brand-200">{{ featuredStory.tag ?? "Story" }}</p>
            <h3 class="text-3xl font-semibold leading-tight">{{ featuredStory.title }}</h3>
            <p class="text-white/85 text-sm leading-relaxed flex-1">{{ featuredStory.excerpt }}</p>
            <RouterLink :to="featuredStory.to" class="btn btn-gradient w-fit" @mouseenter="ensureStoryView()">
              Read full story
            </RouterLink>
          </div>
        </article>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          <article
            v-for="(story, index) in supportingStories"
            :key="story.slug"
            class="card p-6 flex flex-col gap-4"
            @mouseenter="ensureStoryView()"
            data-animate="fade-up"
            :style="`--animate-delay: ${0.1 * (index + 1)}s`"
          >
            <div class="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-brand-600">
              <span>{{ story.tag ?? "Story" }}</span>
              <span v-if="story.date" class="text-slate-400 tracking-normal text-[11px]">{{ story.date }}</span>
            </div>
            <h3 class="text-xl font-semibold text-brand-900">{{ story.title }}</h3>
            <p class="text-sm text-slate-600 flex-1">{{ story.excerpt }}</p>
            <RouterLink :to="story.to" class="btn btn-primary w-fit" @mouseenter="ensureStoryView()">Read story</RouterLink>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getSite, getStories } from "@/lib/content";

const site = getSite();
const storiesPreview = site.storiesPreview;

type StoryMeta = {
  title: string;
  excerpt: string;
  image?: string;
  tag?: string;
  date?: string;
};

const storiesIndex = getStories().reduce<Record<string, StoryMeta>>((acc, story) => {
  acc[story.slug] = {
    title: story.title,
    excerpt: story.excerpt,
    image: story.image,
    tag: story.tag ?? story.category,
    date: story.date,
  };
  return acc;
}, {});

type PreviewStory = StoryMeta & { slug: string; to: string };

const previewStories = computed<PreviewStory[]>(() =>
  storiesPreview.items.reduce<PreviewStory[]>((list, slug) => {
    const story = storiesIndex[slug];
    if (!story) {
      return list;
    }
    list.push({ slug, ...story, to: `/stories/${slug}` });
    return list;
  }, [])
);

const featuredStory = computed(() => previewStories.value[0] ?? null);
const supportingStories = computed(() => previewStories.value.slice(1, 3));

let storyViewPrefetch: Promise<unknown> | null = null;
const ensureStoryView = () => {
  if (!storyViewPrefetch) {
    storyViewPrefetch = import(/* webpackChunkName: "view-story" */ "@/views/StoryDetailView.vue");
  }
};
</script>
