<script setup lang="ts">
import { computed } from "vue";
import { getStories, getSite } from "@/lib/content";
import { RouterLink } from "vue-router";

const stories = getStories();
const featuredStory = computed(() => stories[0]);
const supportingStories = computed(() => stories.slice(1, 4));

const site = getSite();
const mediaResources = site.mediaResources ?? {};
const pressResources = mediaResources.press ?? [];
const podcastResources = mediaResources.podcasts ?? [];
const reportResources = mediaResources.reports ?? [];
</script>

<template>
  <section class="py-12 sm:py-16">
    <div class="container-irr space-y-8">
      <header class="space-y-3 text-center max-w-3xl mx-auto">
        <p class="kicker">Media & stories</p>
        <h1 class="font-heading text-4xl text-brand-900">See how communities are steering SWAN’s impact</h1>
        <p class="text-slate-600">
          Browse field notes, download reports, or connect with our media desk for interviews and background.
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article
          v-if="featuredStory"
          class="relative overflow-hidden rounded-3xl min-h-[360px] text-white shadow-2xl"
        >
          <img :src="featuredStory.image" :alt="featuredStory.title" class="absolute inset-0 h-full w-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/10" />
          <div class="relative h-full p-8 flex flex-col gap-4">
            <p class="text-xs uppercase tracking-[0.35em] text-brand-200">{{ featuredStory.tag }}</p>
            <h2 class="text-3xl font-semibold leading-tight">{{ featuredStory.title }}</h2>
            <p class="text-white/85 text-sm leading-relaxed flex-1">{{ featuredStory.excerpt }}</p>
            <RouterLink :to="`/stories/${featuredStory.slug}`" class="btn btn-gradient w-fit">
              Read full story
            </RouterLink>
          </div>
        </article>

        <div class="grid gap-6">
          <article v-for="story in supportingStories" :key="story.slug" class="card space-y-3">
            <p class="text-xs uppercase tracking-[0.35em] text-brand-600">{{ story.tag }}</p>
            <h3 class="text-xl font-semibold text-brand-900">{{ story.title }}</h3>
            <p class="text-slate-600 text-sm flex-1">{{ story.excerpt }}</p>
            <RouterLink :to="`/stories/${story.slug}`" class="btn btn-primary w-fit">Read story</RouterLink>
          </article>
        </div>
      </div>

      <section v-if="podcastResources.length" class="space-y-3">
        <header>
          <p class="kicker">Podcasts & webinars</p>
          <h2 class="font-heading text-2xl text-brand-900">Listen in</h2>
        </header>
        <div class="grid gap-4 md:grid-cols-2">
          <article v-for="podcast in podcastResources" :key="podcast.title" class="card space-y-2">
            <h3 class="text-xl font-semibold text-brand-900">{{ podcast.title }}</h3>
            <p class="text-slate-600">{{ podcast.summary }}</p>
            <RouterLink :to="podcast.href" class="arrow-cta w-fit">Play episode</RouterLink>
          </article>
        </div>
      </section>

      <section v-if="pressResources.length" class="space-y-3" id="press">
        <header>
          <p class="kicker">Press</p>
          <h2 class="font-heading text-2xl text-brand-900">In the news</h2>
        </header>
        <div class="grid gap-4 md:grid-cols-2">
          <article v-for="press in pressResources" :key="press.title" class="card space-y-2">
            <p class="text-xs uppercase tracking-[0.35em] text-brand-600">{{ press.date }}</p>
            <h3 class="text-xl font-semibold text-brand-900">{{ press.title }}</h3>
            <p class="text-slate-600">{{ press.summary }}</p>
            <RouterLink :to="press.href" class="arrow-cta w-fit">Read</RouterLink>
          </article>
        </div>
      </section>

      <section v-if="reportResources.length" class="space-y-3" id="reports">
        <header>
          <p class="kicker">Reports</p>
          <h2 class="font-heading text-2xl text-brand-900">Download impact</h2>
        </header>
        <div class="grid gap-4 md:grid-cols-2">
          <article v-for="report in reportResources" :key="report.title" class="card space-y-2">
            <h3 class="text-xl font-semibold text-brand-900">{{ report.title }}</h3>
            <p class="text-slate-600">{{ report.summary }}</p>
            <a :href="report.href" class="arrow-cta w-fit" target="_blank" rel="noopener">Download</a>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>
