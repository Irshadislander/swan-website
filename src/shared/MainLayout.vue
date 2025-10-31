<template>
  <div class="min-h-screen flex flex-col bg-haze">
    <SkipToContent />
    <NavBar />
    <Maintenance v-if="showMaintenance" />
    <Breadcrumbs v-if="!isHome" />
    <main id="main" role="main" tabindex="-1" class="flex-1">
      <ErrorBoundary>
        <slot />
      </ErrorBoundary>
    </main>
    <ConsentBanner />
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import ConsentBanner from "@/components/util/ConsentBanner.vue";
import SkipToContent from "@/components/util/SkipToContent.vue";
import Breadcrumbs from "@/components/util/Breadcrumbs.vue";
import ErrorBoundary from "@/components/util/ErrorBoundary.vue";
import Maintenance from "@/components/util/Maintenance.vue";

const route = useRoute();
const isHome = computed(() => route.name === "home");
const showMaintenance = computed(() => import.meta.env.VITE_MAINTENANCE === "true");
</script>
