<script setup lang="ts">
import { RouterLink } from "vue-router";

const stories = [
  {
    slug: "library-rises",
    tag: "Education",
    title: "A library rises in Lamjung",
    excerpt:
      "Students and parents rebuilt their library after the 2015 quake—with SWAN covering materials and training for youth volunteers.",
    image: "/images/story-library.jpg",
  },
  {
    slug: "maternal-care-caravan",
    tag: "Health",
    title: "Maternal care on the move",
    excerpt:
      "Nurses and midwives travel four hours by jeep and foot to deliver prenatal checkups, vitamins, and safe birth plans to new mothers.",
    image: "/images/story-maternal.jpg",
  },
  {
    slug: "coop-leaders",
    tag: "Women’s Leadership",
    title: "Co-ops fueling village economies",
    excerpt:
      "Women-led cooperatives are investing micro-grants into goat farming, tailoring, and seed banks—creating lasting income at home.",
    image: "/images/story-coops.jpg",
  },
];
</script>

<template>
  <section class="py-12 sm:py-16">
    <div class="container-irr space-y-6">
      <div>
        <p class="kicker mb-3">Stories from the field</p>
        <h1 class="font-heading text-3xl sm:text-4xl text-brand-900">How communities are leading change</h1>
        <p class="text-slate-600 max-w-2xl">
          Follow the journeys of students, nurses, and women entrepreneurs who are steering SWAN programs in their own villages.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="story in stories" :key="story.slug" class="card overflow-hidden flex flex-col">
          <img :src="story.image" :alt="story.title" class="h-48 w-full object-cover" />

          <div class="p-6 flex flex-col flex-1">
            <span class="pill border-brand-200 text-brand-700 self-start">{{ story.tag }}</span>
            <h2 class="mt-4 font-heading text-2xl text-brand-900">{{ story.title }}</h2>
            <p class="mt-3 text-slate-600 flex-1">{{ story.excerpt }}</p>
            <RouterLink
              :to="{ name: 'story', params: { slug: story.slug } }"
              class="mt-6 text-brand-600 font-semibold hover:text-brand-800 transition-colors"
            >
              Read story →
            </RouterLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
