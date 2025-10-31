<script setup lang="ts">
import { onErrorCaptured, ref } from "vue";
import { RouterLink } from "vue-router";

const err = ref<Error | null>(null);

onErrorCaptured((e) => {
  err.value = e as Error;
  return true;
});
</script>

<template>
  <slot v-if="!err" />
  <RouterLink
    v-else
    to="/error"
    class="block p-6 text-center text-red-700 underline focus-ring focus:outline-none"
  >
    An error occurred — view details
  </RouterLink>
</template>
