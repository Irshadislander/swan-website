<template>
  <section v-if="items.length" class="py-12 bg-white">
    <div class="container-irr space-y-8">
      <div class="flex flex-col items-center gap-3 text-center">
        <p class="kicker">Project impact</p>
        <h2 class="text-3xl font-bold text-brand-900">{{ sectionTitle }}</h2>
        <p v-if="sectionBody" class="text-slate-600 max-w-3xl">{{ sectionBody }}</p>
      </div>

      <div
        class="relative overflow-hidden rounded-3xl bg-grayx-100 shadow-xl"
        @mouseenter="stopAuto"
        @mouseleave="startAuto"
      >
        <Transition name="fade" mode="out-in">
          <article
            v-if="activeItem"
            :key="activeItem.title"
            :id="`past-project-${activeIndex}`"
            class="grid gap-0 md:grid-cols-2"
          >
            <figure class="aspect-[4/3] md:aspect-auto w-full overflow-hidden">
              <img
                :src="activeItem.image"
                :alt="activeItem.alt"
                loading="lazy"
                class="h-full w-full object-cover"
              />
            </figure>
            <div class="p-6 md:p-10 flex flex-col gap-4 bg-white/90 backdrop-blur">
              <div class="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-brand-600">
                <span>{{ activeItem.location }}</span>
                <span class="h-1 w-1 rounded-full bg-brand-300" aria-hidden="true"></span>
                <span>{{ activeItem.date }}</span>
              </div>
              <h3 class="text-2xl font-semibold text-brand-900">{{ activeItem.title }}</h3>
              <p class="text-slate-600 leading-relaxed">
                {{ activeItem.description }}
              </p>
            </div>
          </article>
        </Transition>

        <button
          v-if="hasMultiple"
          type="button"
          class="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-xl shadow-lg transition hover:bg-white focus:outline-none focus-visible:ring"
          @click="go(-1)"
          :aria-label="previousLabel"
        >
          ‹
        </button>
        <button
          v-if="hasMultiple"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-xl shadow-lg transition hover:bg-white focus:outline-none focus-visible:ring"
          @click="go(1)"
          :aria-label="nextLabel"
        >
          ›
        </button>
      </div>

      <div
        v-if="hasMultiple"
        class="flex justify-center gap-2"
        role="tablist"
        aria-label="Past project slides"
      >
        <button
          v-for="(item, idx) in items"
          :key="item.title"
          type="button"
          role="tab"
          class="h-2.5 w-8 rounded-full transition focus:outline-none focus-visible:ring"
          :class="activeIndex === idx ? 'bg-brand-600' : 'bg-grayx-200'"
          :aria-selected="activeIndex === idx"
          :aria-controls="`past-project-${idx}`"
          @click="setIndex(idx)"
        >
          <span class="sr-only">Show {{ item.title }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { getSite } from "@/lib/content";

const projects = computed(() => getSite().projects ?? null);
const items = computed(() => projects.value?.items ?? []);
const hasMultiple = computed(() => items.value.length > 1);
const sectionTitle = computed(() => projects.value?.title ?? "Community impact in focus");
const sectionBody = computed(() => projects.value?.body ?? "");

const activeIndex = ref(0);
const activeItem = computed(() => items.value[activeIndex.value] ?? null);

const go = (step: number) => {
  if (!items.value.length) return;
  const next = (activeIndex.value + step + items.value.length) % items.value.length;
  activeIndex.value = next;
};

const setIndex = (idx: number) => {
  if (idx < 0 || idx >= items.value.length) return;
  activeIndex.value = idx;
};

const previousLabel = computed(() => {
  const prevIdx = (activeIndex.value - 1 + items.value.length) % items.value.length;
  return `Previous project: ${items.value[prevIdx]?.title ?? ""}`;
});

const nextLabel = computed(() => {
  const nextIdx = (activeIndex.value + 1) % items.value.length;
  return `Next project: ${items.value[nextIdx]?.title ?? ""}`;
});

let timer: number | null = null;
const startAuto = () => {
  if (!hasMultiple.value) return;
  stopAuto();
  timer = window.setInterval(() => go(1), 8000);
};

const stopAuto = () => {
  if (timer) window.clearInterval(timer);
  timer = null;
};

onMounted(() => {
  startAuto();
});

onBeforeUnmount(() => {
  stopAuto();
});

watch(items, (list) => {
  if (!list.length) {
    activeIndex.value = 0;
    stopAuto();
  } else {
    if (activeIndex.value >= list.length) {
      activeIndex.value = 0;
    }
    startAuto();
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
