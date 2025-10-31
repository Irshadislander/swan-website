<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { searchSite, type SearchItem } from "@/lib/search";
import StoryCard from "@/components/stories/StoryCard.vue";
import { track } from "@/plugins/analytics";

const router = useRouter();
const query = ref("");
const results = ref<SearchItem[]>([]);
const inputRef = ref<HTMLInputElement | null>(null);

const causeResults = computed(() => results.value.filter((item) => item.type === "cause"));
const storyResults = computed(() => results.value.filter((item) => item.type === "story"));

const updateResults = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    results.value = [];
    return;
  }
  const searchResults = searchSite(trimmed);
  results.value = searchResults;
  track("search_query", { q: trimmed, len: searchResults.length });
};

watch(query, updateResults);

const focusInput = () => {
  requestAnimationFrame(() => inputRef.value?.focus());
};

const handleGlobalKeys = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (router.currentRoute.value.name !== "search") {
      router.push({ name: "search" });
      setTimeout(focusInput, 50);
    } else {
      focusInput();
    }
  }
  if (event.key === "/" && !event.metaKey && !event.ctrlKey) {
    event.preventDefault();
    focusInput();
  }
  if (event.key === "Escape" && router.currentRoute.value.name === "search") {
    event.preventDefault();
    if (query.value) {
      query.value = "";
    } else {
      inputRef.value?.blur();
    }
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleGlobalKeys);
  focusInput();
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleGlobalKeys);
});

const openFirstResult = () => {
  const first = results.value[0];
  if (first) {
    router.push(first.path);
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    openFirstResult();
  }
};
</script>

<template>
  <section class="py-12 sm:py-16">
    <div class="container-irr max-w-5xl space-y-8">
      <div class="card p-6 space-y-4">
        <label for="site-search" class="block text-sm font-semibold text-slate-600">
          Search SWAN (Press / to focus, ⌘K)
        </label>
        <input
          id="site-search"
          ref="inputRef"
          v-model="query"
          type="search"
          placeholder="Search causes or stories..."
          class="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm focus-ring focus:outline-none"
          @keydown="handleKeydown"
        />
      </div>

      <div v-if="!query" class="card p-6 text-sm text-slate-600">
        Type a program, story, or keyword to explore SWAN.
      </div>

      <div v-else class="space-y-8">
        <section v-if="causeResults.length" aria-labelledby="search-causes" class="card p-6 space-y-4">
          <h2 id="search-causes" class="font-heading text-xl text-brand-900">Causes</h2>
          <div class="grid gap-4 md:grid-cols-2">
            <RouterLink
              v-for="cause in causeResults"
              :key="cause.slug"
              :to="cause.path"
              class="rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:shadow-md focus-ring focus:outline-none"
            >
              <p class="font-heading text-lg text-brand-900">{{ cause.title }}</p>
              <p class="mt-2 text-sm text-slate-600">{{ cause.excerpt }}</p>
              <span class="pill mt-3 inline-flex bg-brand-50 border-brand-200 text-brand-700">{{ cause.category }}</span>
            </RouterLink>
          </div>
        </section>

        <section v-if="storyResults.length" aria-labelledby="search-stories" class="space-y-4">
          <h2 id="search-stories" class="font-heading text-xl text-brand-900">Stories</h2>
          <div class="columns-1 md:columns-2 gap-6">
            <StoryCard
              v-for="story in storyResults"
              :key="story.slug"
              :story="{
                title: story.title,
                excerpt: story.excerpt,
                image: story.image ?? '',
                category: story.category,
                slug: story.slug,
                date: story.date ?? new Date().toISOString(),
                to: { name: 'story', params: { slug: story.slug } }
              }"
              class="mb-6"
            />
          </div>
        </section>

        <div v-if="query && !causeResults.length && !storyResults.length" class="card p-6 text-slate-600">
          No results for “{{ query }}”. Try another search term.
        </div>
      </div>
    </div>
  </section>
</template>
