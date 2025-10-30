<template>
  <div class="min-h-screen">
    <header class="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-900/80">
      <div class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <RouterLink to="/" class="font-semibold">SWAN</RouterLink>
        <nav class="flex items-center gap-4">
          <RouterLink to="/" class="hover:underline">Home</RouterLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-10">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
// empty
</script>
