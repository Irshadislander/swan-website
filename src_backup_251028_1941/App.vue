<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main class="flex-1 container mx-auto px-4 py-8">
      <router-view />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/shared/NavBar.vue";
import SiteFooter from "@/shared/SiteFooter.vue";
</script>
