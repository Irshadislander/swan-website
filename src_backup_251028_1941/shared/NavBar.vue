<template>
  <header class="border-b bg-white/80 dark:bg-black/30 backdrop-blur">
    <div class="container mx-auto px-4 h-14 flex items-center justify-between">
      <router-link to="/" class="font-semibold">SWAN</router-link>
      <nav class="flex gap-4 text-sm">
        <router-link to="/" class="hover:underline">Home</router-link>
        <router-link to="/donate" class="hover:underline">Donate</router-link>
      </nav>
    </div>
  </header>
</template>
