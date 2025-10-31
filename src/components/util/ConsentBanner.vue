<template>
  <transition name="banner-fade">
    <div
      v-if="visible"
      class="fixed inset-x-0 bottom-0 z-50 bg-brand-900 text-white"
      role="dialog"
      aria-live="polite"
      aria-label="Analytics consent"
      @keyup.esc="decline"
    >
      <div class="container-irr py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-white/90">
          We use cookies for analytics to improve SWAN programs. You can opt out anytime.
        </p>
        <div class="flex gap-2">
          <button
            ref="acceptButton"
            type="button"
            class="btn btn-gradient min-w-[120px]"
            @click="accept"
          >
            Accept
          </button>
          <button type="button" class="btn text-white border-white/40 min-w-[120px]" @click="decline">
            Decline
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { hasConsent, initAnalytics, recordConsent } from "@/plugins/analytics";

const visible = ref(false);
const acceptButton = ref<HTMLButtonElement | null>(null);

const hide = () => {
  visible.value = false;
};

const accept = () => {
  recordConsent("granted");
  initAnalytics(true);
  hide();
};

const decline = () => {
  recordConsent("denied");
  hide();
};

onMounted(() => {
  const consent = hasConsent();
  if (!consent || consent === null) {
    visible.value = true;
    requestAnimationFrame(() => {
      acceptButton.value?.focus();
    });
  }
});
</script>

<style scoped>
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
