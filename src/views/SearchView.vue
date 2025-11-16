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
  <section class="py-12 sm:py-16 search-view">
    <div class="container-irr max-w-5xl space-y-8">
      <div class="search-panel" data-animate="fade-up">
        <label for="site-search" class="search-label">
          Search SWAN (Press / to focus, ⌘K)
        </label>
        <div class="search-input-wrap">
          <span>/</span>
          <input
            id="site-search"
            ref="inputRef"
            v-model="query"
            type="search"
            placeholder="Try “mobile health”, “cooperative”, “education”…"
            class="search-input"
            @keydown="handleKeydown"
          />
          <span>Enter</span>
        </div>
      </div>

      <div v-if="!query" class="search-empty" data-animate="fade-up">
        <p>Type a program, story, or keyword to explore SWAN.</p>
        <ul>
          <li>Education scholarships</li>
          <li>Women-led cooperatives</li>
          <li>Mobile nurses</li>
        </ul>
      </div>

      <div v-else class="space-y-10">
        <section v-if="causeResults.length" aria-labelledby="search-causes" class="search-section" data-animate="fade-up">
          <header class="search-section__header">
            <p class="kicker mb-1">Programs</p>
            <h2 id="search-causes" class="section-heading text-2xl">Causes that match “{{ query }}”</h2>
          </header>
          <div class="grid gap-4 md:grid-cols-2">
            <RouterLink
              v-for="cause in causeResults"
              :key="cause.slug"
              :to="cause.path"
              class="search-card focus-ring focus:outline-none"
            >
              <div class="flex items-center justify-between">
                <p class="font-heading text-lg text-brand-900">{{ cause.title }}</p>
                <span class="pill bg-brand-50 border-brand-200 text-brand-700">{{ cause.category }}</span>
              </div>
              <p class="mt-3 text-sm text-slate-600">{{ cause.excerpt }}</p>
              <span class="search-card__cta">Explore program →</span>
            </RouterLink>
          </div>
        </section>

        <section v-if="storyResults.length" aria-labelledby="search-stories" class="search-section" data-animate="fade-up">
          <header class="search-section__header">
            <p class="kicker mb-1">Stories</p>
            <h2 id="search-stories" class="section-heading text-2xl">Field notes mentioning “{{ query }}”</h2>
          </header>
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
              class="mb-6 story-result"
            />
          </div>
        </section>

        <div v-if="query && !causeResults.length && !storyResults.length" class="search-empty" data-animate="fade-up">
          <p>No results for “{{ query }}”. Try another search term.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.search-view {
  background: radial-gradient(circle at top, rgba(34, 85, 230, 0.08), transparent 60%);
}

.search-panel {
  border-radius: 1.75rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #fff;
  padding: 1.5rem;
  box-shadow: 0 25px 60px rgba(5, 27, 59, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  padding: 0.65rem 1rem;
  background: #f8fafc;
  font-size: 0.85rem;
  color: #475569;
}

.search-input-wrap span {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #94a3b8;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #0f172a;
}

.search-input:focus {
  outline: none;
}

.search-empty {
  border-radius: 1.5rem;
  border: 1px dashed rgba(15, 23, 42, 0.15);
  background: #fff;
  padding: 1.5rem;
  color: #475569;
}

.search-empty ul {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.8rem;
  font-size: 0.85rem;
}

.search-empty li {
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(34, 85, 230, 0.08);
  color: #2255e6;
}

.search-section {
  background: #fff;
  border-radius: 2rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
  padding: 1.8rem;
  box-shadow: 0 25px 60px rgba(5, 27, 59, 0.05);
}

.search-section__header {
  margin-bottom: 1.5rem;
}

.search-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.25rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(248, 250, 252, 0.8);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.search-card:hover {
  border-color: rgba(34, 85, 230, 0.4);
  box-shadow: 0 15px 35px rgba(34, 85, 230, 0.1);
  transform: translateY(-2px);
}

.search-card__cta {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2255e6;
}

.story-result :deep(.card) {
  border-radius: 1.5rem;
}
</style>
