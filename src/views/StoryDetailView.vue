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
  <section v-if="story" class="story-detail">
    <div class="story-detail__hero">
      <div class="container-irr max-w-5xl mx-auto space-y-6" data-animate="fade-up">
        <RouterLink to="/stories" class="story-detail__back">← Back to stories</RouterLink>
        <span class="pill bg-white/15 border-white/30 text-white/90 w-fit">{{ story.tag }}</span>
        <h1 class="story-detail__title">{{ story.title }}</h1>
        <p class="story-detail__date">{{ formattedDate }}</p>
      </div>
      <div class="story-detail__image-wrap container-irr max-w-5xl mx-auto">
        <div class="story-detail__image">
          <div :class="['absolute inset-0 transition-opacity duration-500', heroLoaded ? 'opacity-0' : 'img-shell']"></div>
          <img
            :src="story.image"
            :alt="story.title"
            loading="lazy"
            decoding="async"
            @load="heroLoaded = true"
          />
        </div>
      </div>
    </div>

    <div class="container-irr max-w-4xl mx-auto story-detail__body">
      <div class="story-detail__share" data-animate="fade-up">
        <div>
          <p class="text-xs uppercase tracking-[0.35em] text-brand-600">Share this story</p>
          <p class="text-sm text-slate-500">Help spread the word about community-led impact.</p>
        </div>
        <div class="flex gap-3">
          <button type="button" class="btn btn-primary" @click="copyLink">Copy link</button>
          <button type="button" class="btn" @click="shareTwitter">Share to X</button>
        </div>
        <p v-if="shareFeedback" class="text-xs text-slate-500">{{ shareFeedback }}</p>
      </div>

      <article class="story-detail__content" data-animate="fade-up">
        <p v-for="(paragraph, index) in story.body" :key="index">{{ paragraph }}</p>
      </article>

      <nav class="story-detail__nav" data-animate="fade-up">
        <RouterLink
          v-if="previousStory"
          :to="{ name: 'story', params: { slug: previousStory.slug } }"
          class="story-detail__pager"
        >
          <span>Previous story</span>
          <p>{{ previousStory.title }}</p>
        </RouterLink>
        <RouterLink
          v-if="nextStory"
          :to="{ name: 'story', params: { slug: nextStory.slug } }"
          class="story-detail__pager story-detail__pager--next"
        >
          <span>Next story</span>
          <p>{{ nextStory.title }}</p>
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

<style scoped>
.story-detail {
  background: radial-gradient(circle at top, rgba(34, 85, 230, 0.08), transparent 55%);
  padding-bottom: 4rem;
}

.story-detail__hero {
  background: linear-gradient(135deg, #051b3b, #102a5c 45%, #0f172a 90%);
  color: #fff;
  padding-bottom: 3rem;
}

.story-detail__back {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}

.story-detail__title {
  font-family: "Playfair Display", "Times New Roman", serif;
  font-size: clamp(2.5rem, 4vw, 3.75rem);
  line-height: 1.1;
  max-width: 52ch;
}

.story-detail__date {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
}

.story-detail__image-wrap {
  margin-top: 2rem;
}

.story-detail__image {
  position: relative;
  overflow: hidden;
  border-radius: 2rem;
  aspect-ratio: 16 / 9;
  background: rgba(15, 23, 42, 0.3);
  box-shadow: 0 30px 60px rgba(5, 27, 59, 0.4);
}

.story-detail__image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-detail__body {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.story-detail__share {
  border-radius: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 1.5rem;
  background: #fff;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: center;
}

.story-detail__content {
  background: #fff;
  border-radius: 2rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 2.25rem;
  font-size: 1.05rem;
  line-height: 1.8;
  color: #0f172a;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.08);
}

.story-detail__content p + p {
  margin-top: 1.5rem;
}

.story-detail__nav {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.story-detail__pager {
  border-radius: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 1.25rem;
  background: #fff;
  text-decoration: none;
  color: #0f172a;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.story-detail__pager span {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #94a3b8;
}

.story-detail__pager p {
  font-weight: 600;
  color: #2255e6;
}

.story-detail__pager:hover {
  border-color: rgba(34, 85, 230, 0.4);
  transform: translateY(-2px);
}

.story-detail__pager--next {
  text-align: right;
}
</style>
