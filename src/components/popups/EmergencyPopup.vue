<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { getNav } from "@/lib/content";

const nav = getNav();
const alert = nav.alert ?? null;
const visible = ref(false);
const STORAGE_KEY = "swan:alert-dismissed";

const hasAlert = computed(() => Boolean(alert?.message && alert?.href));

const dismiss = () => {
  visible.value = false;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, "true");
  }
};

onMounted(() => {
  if (!hasAlert.value) return;
  const dismissed = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
  if (dismissed === "true") return;
  window.setTimeout(() => {
    visible.value = true;
  }, 2500);
});
</script>

<template>
  <transition name="popup-fade">
    <div v-if="visible && alert?.href" class="popup-backdrop" role="dialog" aria-modal="true">
      <div class="popup-card">
        <button type="button" class="popup-close" aria-label="Close alert" @click="dismiss">×</button>
        <p class="text-xs uppercase tracking-[0.35em] text-white/70">Emergency alert</p>
        <h3 class="text-2xl font-heading text-white">{{ alert.message }}</h3>
        <p class="text-white/80 text-sm">Tap to view the latest response and ways to help.</p>
        <RouterLink :to="alert.href" class="btn btn-gradient w-full" @click="dismiss">
          {{ alert.linkLabel ?? "Learn more" }}
        </RouterLink>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.popup-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 7, 30, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.popup-card {
  position: relative;
  width: min(420px, 100%);
  background: linear-gradient(135deg, #1d42d8, #102cab);
  color: #fff;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 35px 70px rgba(2, 7, 30, 0.45);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.popup-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
}

.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.2s ease;
}
.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}
</style>
