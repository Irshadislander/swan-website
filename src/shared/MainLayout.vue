<template>
  <div class="min-h-screen flex flex-col body-font text-grayx-800">
    <NavBar />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup>
import NavBar from './NavBar.vue'
import SiteFooter from './SiteFooter.vue'
</script>