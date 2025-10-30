<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { copy } from "@/lib/copy";

const open = ref(false);
const hover = ref<string | null>(null);
const items = copy.nav.primary;
</script>

<template>
  <header class="sticky top-0 z-40 shadow-sm">
    <div class="bg-brand-900 text-white text-[13px]">
      <div class="container-irr py-2 flex items-center justify-between">
        <span class="opacity-80">Grassroots impact in Nepal</span>
        <RouterLink class="underline hover:no-underline" to="/donate">Donate</RouterLink>
      </div>
    </div>

    <nav class="bg-white/95 backdrop-blur border-b border-slate-200">
      <div class="container-irr h-16 flex items-center justify-between">
        <RouterLink to="/" class="font-heading text-2xl font-bold text-brand-900">SWAN</RouterLink>

        <div class="hidden md:flex items-stretch gap-6 relative">
          <div
            v-for="it in items"
            :key="it.label"
            class="relative"
            @mouseenter="hover = it.mega ? it.label : null"
            @mouseleave="hover = null"
          >
            <RouterLink :to="it.to" class="h-16 flex items-center hover:text-brand-700">
              {{ it.label }}
            </RouterLink>

            <div
              v-if="it.mega && hover === it.label"
              class="absolute left-1/2 -translate-x-1/2 top-full w-[820px] mt-2"
            >
              <div class="card p-6 grid grid-cols-3 gap-6">
                <div v-for="col in it.mega.columns" :key="col.title">
                  <div class="text-[13px] uppercase tracking-wide text-slate-500 mb-2">{{ col.title }}</div>
                  <ul class="space-y-1.5">
                    <li v-for="link in col.items" :key="link.label">
                      <RouterLink :to="link.to" class="hover:text-brand-700">{{ link.label }}</RouterLink>
                    </li>
                  </ul>
                </div>
                <div class="col-span-3 pt-4 border-t border-slate-200 flex justify-end">
                  <RouterLink :to="it.mega.cta.to" class="btn btn-gradient">{{ it.mega.cta.label }}</RouterLink>
                </div>
              </div>
            </div>
          </div>

        <RouterLink to="/donate" class="btn btn-gradient ml-2 self-center">Donate</RouterLink>
        </div>

        <button class="md:hidden pill border-brand-300 text-brand-900" @click="open = true">Menu</button>
      </div>
    </nav>

    <transition name="fade">
      <div v-if="open" class="fixed inset-0 bg-black/30 z-50" @click="open = false" />
    </transition>
    <transition name="slide">
      <aside v-if="open" class="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-xl p-6 overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <div class="font-heading text-xl">Menu</div>
          <button class="pill" @click="open = false">Close</button>
        </div>
        <nav class="space-y-4">
          <div v-for="it in items" :key="it.label">
            <RouterLink :to="it.to" class="font-medium block mb-2" @click="open = false">{{ it.label }}</RouterLink>
            <div v-if="it.mega" class="ml-3 space-y-1">
              <div v-for="col in it.mega.columns" :key="col.title">
                <div class="text-[12px] uppercase tracking-wide text-slate-500 mt-2">{{ col.title }}</div>
                <RouterLink
                  v-for="link in col.items"
                  :key="link.label"
                  :to="link.to"
                  class="block py-1 text-sm"
                  @click="open = false"
                >{{ link.label }}</RouterLink>
              </div>
            </div>
          </div>
          <RouterLink to="/donate" class="btn btn-gradient block text-center" @click="open = false">Donate</RouterLink>
        </nav>
      </aside>
    </transition>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
