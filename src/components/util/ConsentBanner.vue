<template>
  <transition name="banner-fade">
    <div
      v-if="visible"
      class="consent-banner fixed inset-x-0 bottom-0 z-50"
      role="dialog"
      aria-live="polite"
      aria-label="Analytics consent"
      @keyup.esc="decline"
    >
      <div class="container-irr consent-banner__inner">
        <div>
          <p class="kicker text-white/70 mb-1">Analytics consent</p>
          <p class="consent-banner__copy">We use cookies to improve SWAN programs. You can opt out anytime.</p>
        </div>
        <div class="consent-banner__actions">
          <button
            ref="acceptButton"
            type="button"
            class="btn btn-gradient min-w-[120px]"
            @click="accept"
          >
            Accept
          </button>
          <button type="button" class="btn consent-banner__decline min-w-[120px]" @click="decline">
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

.consent-banner {
  background: linear-gradient(135deg, rgba(5, 27, 59, 0.98), rgba(16, 42, 92, 0.98));
  color: #fff;
  padding: 1rem 0;
}

.consent-banner__inner {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

@media (min-width: 640px) {
  .consent-banner__inner {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.consent-banner__copy {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.88);
}

.consent-banner__actions {
  display: flex;
  gap: 0.75rem;
}

.consent-banner__decline {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
}
</style>
