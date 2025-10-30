<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
    <div class="max-w-7xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-2">
        <span class="inline-block h-8 w-8 rounded-full bg-brand-600"></span>
        <span class="heading-font text-lg font-semibold text-brand-800">SWAN</span>
      </RouterLink>

      <nav class="hidden md:flex items-center gap-6 text-grayx-700">
        <RouterLink to="/about" class="hover:text-brand-700">About</RouterLink>
        <RouterLink to="/causes" class="hover:text-brand-700">Causes</RouterLink>
        <RouterLink to="/stories" class="hover:text-brand-700">Stories</RouterLink>
        <RouterLink to="/contact" class="hover:text-brand-700">Contact</RouterLink>
      </nav>

      <RouterLink
        to="/donate"
        class="rounded-2xl px-4 py-2 bg-brand-600 text-white font-semibold hover:bg-brand-700 transition">
        Donate
      </RouterLink>
    </div>
  </header>
</template>