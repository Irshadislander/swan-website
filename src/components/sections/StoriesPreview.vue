<template>
  <section class="max-w-7xl mx-auto px-4 md:px-6 py-12">
    <h2 class="heading-font text-3xl font-semibold text-brand-800">Stories</h2>
    <div class="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <article v-for="i in 3" :key="i" class="rounded-2xl bg-white p-6 shadow-sm">
        <div class="h-36 bg-grayx-100 rounded-xl mb-3"></div>
        <h3 class="font-semibold">A Life Changed {{ i }}</h3>
        <p class="text-sm text-grayx-600 mt-1">Short excerpt from the field…</p>
        <RouterLink to="/stories" class="text-brand-700 font-semibold mt-2 inline-block">Read more →</RouterLink>
      </article>
    </div>
  </section>
</template>