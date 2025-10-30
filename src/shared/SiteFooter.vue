<template>
  <footer class="bg-brand-900 text-white mt-16">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-8">
      <div>
        <div class="font-heading text-2xl mb-3">SWAN</div>
        <p class="text-white/80">
          Empowering lives through education, health, and women’s leadership across Nepal.
        </p>
      </div>
      <nav class="space-y-2">
        <RouterLink to="/about" class="block hover:underline">About</RouterLink>
        <RouterLink to="/causes" class="block hover:underline">Causes</RouterLink>
        <RouterLink to="/stories" class="block hover:underline">Stories</RouterLink>
        <RouterLink to="/contact" class="block hover:underline">Contact</RouterLink>
      </nav>
      <div class="self-end">
        <RouterLink to="/donate" class="btn btn-gradient">Donate</RouterLink>
      </div>
    </div>
  </footer>
</template>
