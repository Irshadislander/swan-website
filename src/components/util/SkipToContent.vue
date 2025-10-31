<template>
  <a
    href="#main"
    class="sr-only focus:not-sr-only fixed top-2 left-2 btn focus-ring focus:outline-none"
    @click="focusMain"
  >
    Skip to content
  </a>
</template>

<script setup lang="ts">
const focusMain = () => {
  const target = document.getElementById("main");
  target?.focus();
};
</script>
