<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import StoryCard, { type StoryCardProps } from "@/components/stories/StoryCard.vue";
import { getStories } from "@/lib/content";
import { track } from "@/plugins/analytics";

const route = useRoute();
const router = useRouter();

const baseStories = getStories();

const stories = baseStories.map((story) => ({
  ...story,
  category: story.tag,
  to: { name: "story", params: { slug: story.slug } },
})) as (StoryCardProps & { body: string[] })[];

const categories = ["All", ...Array.from(new Set(stories.map((story) => story.category)))];

const selectedCategory = ref<string>((route.query.category as string) || "All");
const pageSize = 6;
const page = ref(1);
const loadingMore = ref(false);

const filteredStories = computed(() => {
  if (selectedCategory.value === "All") return stories;
  return stories.filter((story) => story.category === selectedCategory.value);
});

const visibleStories = computed(() => filteredStories.value.slice(0, page.value * pageSize));
const remainingStories = computed(() => Math.max(filteredStories.value.length - visibleStories.value.length, 0));
const hasMore = computed(() => remainingStories.value > 0);
const skeletonCount = computed(() => Math.min(pageSize, remainingStories.value));

watch(
  () => route.query.category,
  (value) => {
    const incoming = typeof value === "string" && categories.includes(value) ? value : "All";
    selectedCategory.value = incoming;
    page.value = 1;
  }
);

const updateQueryCategory = (category: string) => {
  const nextQuery = { ...route.query } as Record<string, string>;
  if (category === "All") {
    delete nextQuery.category;
  } else {
    nextQuery.category = category;
  }
  router.replace({ query: nextQuery });
};

const setCategory = (category: string) => {
  if (category === selectedCategory.value) return;
  selectedCategory.value = category;
  page.value = 1;
  track("stories_filter", { category });
  updateQueryCategory(category);
};

const loadMore = () => {
  if (!hasMore.value || loadingMore.value) return;
  loadingMore.value = true;
  track("stories_load_more", { page: page.value + 1, category: selectedCategory.value });
  window.setTimeout(() => {
    page.value += 1;
    loadingMore.value = false;
  }, 400);
};

let storyViewPrefetch: Promise<unknown> | null = null;
const ensureStoryView = () => {
  if (!storyViewPrefetch) {
    storyViewPrefetch = import(/* webpackChunkName: "view-story" */ "@/views/StoryDetailView.vue");
  }
};

const handleOpen = (slug: string) => {
  track("story_open", { slug });
};
</script>

<template>
  <section class="py-12 sm:py-16">
    <div class="container-irr space-y-6">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="kicker mb-3">Stories from the field</p>
          <h1 class="font-heading text-3xl sm:text-4xl text-brand-900">How communities are leading change</h1>
          <p class="text-slate-600 max-w-2xl">
            Follow the journeys of students, nurses, and women entrepreneurs who are steering SWAN programs in their own villages.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            class="pill text-sm"
            :class="selectedCategory === cat ? 'bg-brand-600 text-white border-brand-600' : 'bg-white hover:border-brand-400'"
            @click="setCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div class="grid gap-6">
        <div class="columns-1 md:columns-2 lg:columns-3 gap-6">
          <StoryCard
            v-for="story in visibleStories"
            :key="story.slug"
            :story="story"
            class="mb-6"
            @prefetch="ensureStoryView"
            @open="handleOpen"
          />
          <div
            v-if="loadingMore"
            v-for="index in skeletonCount"
            :key="`story-skeleton-${index}`"
            class="mb-6 break-inside-avoid rounded-2xl bg-slate-200/60 h-72 animate-pulse"
          ></div>
        </div>
      </div>

      <div v-if="hasMore" class="flex justify-center">
        <button type="button" class="btn btn-primary" @click="loadMore" @mouseenter="ensureStoryView">
          Load more stories
        </button>
      </div>
    </div>
  </section>
</template>
