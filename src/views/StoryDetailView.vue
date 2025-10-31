<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getStory, getStories } from "@/lib/content";
import { track } from "@/plugins/analytics";

const route = useRoute();
const router = useRouter();
const stories = getStories();

const story = computed(() => getStory((route.params.slug as string) ?? ""));
const storyIndex = computed(() => stories.findIndex((item) => item.slug === (route.params.slug as string)));
const previousStory = computed(() => (storyIndex.value > 0 ? stories[storyIndex.value - 1] : undefined));
const nextStory = computed(() =>
  storyIndex.value >= 0 && storyIndex.value < stories.length - 1 ? stories[storyIndex.value + 1] : undefined
);

const shareFeedback = ref<string | null>(null);
const feedbackTimeout = ref<number | null>(null);
const trackedSlug = ref<string | null>(null);
const heroLoaded = ref(false);

const formattedDate = computed(() =>
  story.value ? new Date(story.value.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""
);

const shareUrl = computed(() => {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${router.resolve({ name: "story", params: { slug: route.params.slug } }).href}`;
});

const clearFeedback = () => {
  if (feedbackTimeout.value) {
    window.clearTimeout(feedbackTimeout.value);
    feedbackTimeout.value = null;
  }
};

const setFeedback = (message: string) => {
  shareFeedback.value = message;
  clearFeedback();
  feedbackTimeout.value = window.setTimeout(() => {
    shareFeedback.value = null;
    feedbackTimeout.value = null;
  }, 2500);
};

const copyLink = async () => {
  if (!shareUrl.value) return;
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    setFeedback("Link copied to clipboard");
    story.value && track("story_share", { slug: story.value.slug, method: "copy" });
  } catch (error) {
    setFeedback("Copy failed. Please try again.");
  }
};

const shareTwitter = () => {
  if (!story.value || !shareUrl.value) return;
  const intentUrl = new URL("https://twitter.com/intent/tweet");
  intentUrl.searchParams.set("text", story.value.title);
  intentUrl.searchParams.set("url", shareUrl.value);
  window.open(intentUrl.toString(), "_blank", "noopener");
  track("story_share", { slug: story.value.slug, method: "twitter" });
};

watch(
  story,
  (value, previous) => {
    if (!value) {
      ElMessage.warning("Story not found.");
      router.replace({ name: "stories" });
      return;
    }
    heroLoaded.value = false;
    if (trackedSlug.value !== value.slug) {
      track("story_read", { slug: value.slug, category: value.tag });
      trackedSlug.value = value.slug;
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  clearFeedback();
});
</script>

<template>
  <section v-if="story" class="pb-16">
    <div class="bg-white/80 border-b border-slate-200">
      <div class="container-irr py-4">
        <RouterLink to="/stories" class="text-sm text-brand-600 hover:text-brand-800">← Back to stories</RouterLink>
      </div>
    </div>

    <div class="container-irr max-w-4xl mx-auto py-8 space-y-6 text-center">
      <span class="pill bg-brand-50 border-brand-200 text-brand-700 self-center w-fit">{{ story.tag }}</span>
      <h1 class="font-heading text-4xl sm:text-5xl text-brand-900 leading-tight">{{ story.title }}</h1>
      <p class="text-sm text-slate-500">{{ formattedDate }}</p>
    </div>

    <div class="container-irr max-w-5xl mx-auto">
      <div class="relative overflow-hidden rounded-3xl aspect-[16/9] bg-slate-200">
        <div :class="['absolute inset-0 transition-opacity duration-500', heroLoaded ? 'opacity-0' : 'img-shell']"></div>
        <img
          :src="story.image"
          :alt="story.title"
          class="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          @load="heroLoaded = true"
        />
      </div>
    </div>

    <div class="container-irr max-w-3xl mx-auto mt-10 space-y-10">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div class="flex gap-3">
          <button type="button" class="btn btn-primary" @click="copyLink">Copy link</button>
          <button type="button" class="btn" @click="shareTwitter">Share to X</button>
        </div>
        <p v-if="shareFeedback" class="text-xs text-slate-500">{{ shareFeedback }}</p>
      </div>

      <article class="prose prose-slate max-w-none">
        <p v-for="(paragraph, index) in story.body" :key="index">{{ paragraph }}</p>
      </article>

      <nav class="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
        <RouterLink
          v-if="previousStory"
          :to="{ name: 'story', params: { slug: previousStory.slug } }"
          class="text-brand-600 hover:text-brand-800"
        >
          ← Previous: {{ previousStory.title }}
        </RouterLink>
        <RouterLink
          v-if="nextStory"
          :to="{ name: 'story', params: { slug: nextStory.slug } }"
          class="text-brand-600 hover:text-brand-800 sm:ml-auto"
        >
          Next: {{ nextStory.title }} →
        </RouterLink>
      </nav>
    </div>
  </section>

  <section v-else class="py-16">
    <div class="container-irr text-center space-y-3">
      <h1 class="font-heading text-3xl text-brand-900">Story not found</h1>
      <RouterLink to="/stories" class="text-brand-600 hover:text-brand-800">Return to stories</RouterLink>
    </div>
  </section>
</template>
