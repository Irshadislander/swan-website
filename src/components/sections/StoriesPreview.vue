<template>
  <section class="py-12">
    <div class="container-irr space-y-6">
      <div>
        <p class="kicker mb-3">Field notes</p>
        <h2 class="text-3xl font-bold text-brand-900">{{ storiesPreview.title }}</h2>
        <p class="text-slate-600">{{ storiesPreview.body }}</p>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <article
          v-for="story in previewStories"
          :key="story.slug"
          class="card p-6 flex h-full flex-col"
          @mouseenter="ensureStoryView()"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Story</p>
          <h3 class="mt-3 text-xl font-semibold text-brand-900">{{ story.title }}</h3>
          <p class="mt-4 text-sm text-slate-600 flex-1">{{ story.excerpt }}</p>
          <RouterLink :to="story.to" class="mt-6 btn btn-primary" @mouseenter="ensureStoryView()">Read story</RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getSite, getStories } from "@/lib/content";

const site = getSite();
const storiesPreview = site.storiesPreview;
const storiesIndex = getStories().reduce<Record<string, { title: string; excerpt: string }>>((acc, story) => {
  acc[story.slug] = {
    title: story.title,
    excerpt: story.excerpt,
  };
  return acc;
}, {});

type PreviewStory = { slug: string; title: string; excerpt: string; to: string };

const previewStories = computed<PreviewStory[]>(() =>
  storiesPreview.items.reduce<PreviewStory[]>((list, slug) => {
    const story = storiesIndex[slug];
    if (!story) {
      return list;
    }
    list.push({ slug, title: story.title, excerpt: story.excerpt, to: `/stories/${slug}` });
    return list;
  }, [])
);

let storyViewPrefetch: Promise<unknown> | null = null;
const ensureStoryView = () => {
  if (!storyViewPrefetch) {
    storyViewPrefetch = import(/* webpackChunkName: "view-story" */ "@/views/StoryDetailView.vue");
  }
};
</script>
