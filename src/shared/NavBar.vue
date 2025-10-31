<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { getNav } from "@/lib/content";
import { track } from "@/plugins/analytics";

const open = ref(false);
const hover = ref<string | null>(null);
const menuButtonRef = ref<HTMLButtonElement | null>(null);
const drawerRef = ref<HTMLElement | null>(null);
const router = useRouter();
const nav = getNav();
const items = nav.primary;
const donateCta = nav.cta;
const donateLabel = donateCta?.label ?? "Donate";
const donateHref = donateCta?.href ?? "/donate";
const mobileMenuId = "mobile-nav-drawer";
let focusTimeout: number | null = null;
const navImageLoaded = reactive<Record<string, boolean>>({});

const clearFocusTimeout = () => {
  if (focusTimeout !== null) {
    window.clearTimeout(focusTimeout);
    focusTimeout = null;
  }
};

const closeMenus = () => {
  open.value = false;
  hover.value = null;
  clearFocusTimeout();
};

const toggleMobile = () => {
  open.value = !open.value;
};

const handleMegaFocus = (item: (typeof items)[number]) => {
  clearFocusTimeout();
  hover.value = item.cols ? item.label : null;
};

const handleMegaBlur = (event: FocusEvent) => {
  clearFocusTimeout();
  const next = event.relatedTarget as HTMLElement | null;
  const current = event.currentTarget as HTMLElement | null;
  focusTimeout = window.setTimeout(() => {
    if (!current) {
      hover.value = null;
      return;
    }
    if (!next || !current.contains(next)) {
      hover.value = null;
    }
  }, 0);
};

const logNavClick = (label: string, location: "header" | "mobile", extra: Record<string, unknown> = {}) => {
  track("nav_click", { label, location, ...extra });
};

const handleMobileNav = (label: string, extra: Record<string, unknown> = {}) => {
  logNavClick(label, "mobile", extra);
  closeMenus();
};

const handleKeydown = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    router.push({ name: "search" });
    return;
  }
  if (event.key === "Escape") {
    closeMenus();
  }
};

const handleDrawerKeydown = (event: KeyboardEvent) => {
  if (!open.value || event.key !== "Tab") return;
  const focusables = drawerRef.value?.querySelectorAll<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])");
  const elements = focusables ? Array.from(focusables) : [];
  if (elements.length === 0) return;
  const [first] = elements;
  const last = elements[elements.length - 1];
  if (!first || !last) return;
  const active = document.activeElement as HTMLElement | null;

  if (event.shiftKey) {
    if (active === first || !drawerRef.value?.contains(active)) {
      event.preventDefault();
      last.focus();
    }
    return;
  }

  if (active === last) {
    event.preventDefault();
    first.focus();
  }
};

const markNavImage = (href: string) => {
  navImageLoaded[href] = true;
};

watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    const firstFocusable = drawerRef.value?.querySelector<HTMLElement>("button, a, [tabindex]:not([tabindex='-1'])");
    firstFocusable?.focus();
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
    menuButtonRef.value?.focus();
  }
});

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  clearFocusTimeout();
  document.body.style.overflow = "";
});
</script>

<template>
  <header class="sticky top-0 z-40 shadow-sm" role="banner" @keyup.esc="closeMenus">
    <div class="bg-brand-900 text-white text-[13px]">
      <div class="container-irr py-2 flex items-center justify-between">
        <span class="opacity-80">Grassroots impact in Nepal</span>
        <RouterLink
          class="underline hover:no-underline focus-ring focus:outline-none"
          :to="donateHref"
          :aria-label="`Donate to SWAN`"
          @click="logNavClick(donateLabel, 'header', { surface: 'top-strip' })"
        >
          {{ donateLabel }}
        </RouterLink>
      </div>
    </div>

    <nav class="bg-white/95 backdrop-blur border-b border-slate-200" role="navigation" aria-label="Primary navigation">
      <div class="container-irr h-16 flex items-center justify-between">
        <RouterLink to="/" class="font-heading text-2xl font-bold text-brand-900 focus-ring focus:outline-none">SWAN</RouterLink>

        <div class="hidden md:flex items-stretch gap-6 relative" role="menubar">
          <div
            v-for="item in items"
            :key="item.label"
            class="relative"
            @mouseenter="hover = item.cols ? item.label : null"
            @mouseleave="hover = null"
            @focusin="handleMegaFocus(item)"
            @focusout="handleMegaBlur"
          >
            <RouterLink
              :to="item.href"
              class="h-16 flex items-center hover:text-brand-700 focus-ring focus:outline-none"
              role="menuitem"
              :aria-haspopup="Boolean(item.cols)"
              :aria-expanded="item.cols ? hover === item.label : undefined"
              @click="logNavClick(item.label, 'header')"
            >
              {{ item.label }}
            </RouterLink>

            <div
              v-if="item.cols && hover === item.label"
              class="absolute left-1/2 -translate-x-1/2 top-full w-[820px] mt-2"
              role="menu"
              :aria-label="`${item.label} submenu`"
            >
              <div class="card p-6 grid grid-cols-3 gap-6">
                <RouterLink
                  v-for="col in item.cols"
                  :key="col.title"
                  :to="col.href"
                  class="flex items-center gap-4 rounded-xl p-3 hover:bg-slate-100 focus-ring focus:outline-none"
                  role="menuitem"
                  @click="logNavClick(col.title, 'header', { parent: item.label })"
                >
                  <div class="relative h-14 w-14 overflow-hidden rounded-xl">
                    <div :class="['absolute inset-0 transition-opacity duration-500', navImageLoaded[col.href] ? 'opacity-0' : 'img-shell']"></div>
                    <img
                      v-if="col.image"
                      :src="col.image"
                      :alt="col.title"
                      loading="lazy"
                      decoding="async"
                      class="absolute inset-0 h-full w-full object-cover"
                      @load="markNavImage(col.href)"
                    />
                  </div>
                  <div>
                    <div class="font-semibold text-brand-900">{{ col.title }}</div>
                    <p class="text-xs text-slate-600">Explore program</p>
                  </div>
                </RouterLink>
              </div>
            </div>
          </div>

          <RouterLink
            to="/search"
            class="h-16 flex items-center text-slate-600 hover:text-brand-700 focus-ring focus:outline-none"
            aria-label="Search"
            @click="logNavClick('Search', 'header', { surface: 'global' })"
          >
            Search
          </RouterLink>

          <RouterLink
            :to="donateHref"
            class="btn btn-gradient ml-2 self-center focus-ring focus:outline-none"
            :aria-label="`Donate to SWAN today`"
            @click="logNavClick(donateLabel, 'header', { surface: 'primary-nav' })"
          >
            {{ donateLabel }}
          </RouterLink>
        </div>

        <button
          ref="menuButtonRef"
          class="md:hidden pill border-brand-300 text-brand-900 focus-ring focus:outline-none"
          type="button"
          :aria-expanded="open"
          :aria-controls="mobileMenuId"
          aria-label="Toggle navigation menu"
          @click="toggleMobile"
        >
          Menu
        </button>
      </div>
    </nav>

    <transition name="fade">
      <div v-if="open" class="fixed inset-0 bg-black/30 z-50" aria-hidden="true" @click="closeMenus" />
    </transition>
    <transition name="slide">
      <aside
        v-if="open"
        :id="mobileMenuId"
        ref="drawerRef"
        class="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-xl p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        @keydown="handleDrawerKeydown"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="font-heading text-xl">Menu</div>
          <button class="pill focus-ring focus:outline-none" type="button" @click="closeMenus">Close</button>
        </div>
        <nav class="space-y-4" role="navigation" aria-label="Mobile navigation">
          <div v-for="item in items" :key="item.label">
            <RouterLink :to="item.href" class="font-medium block mb-2 focus-ring focus:outline-none" @click="handleMobileNav(item.label)">
              {{ item.label }}
            </RouterLink>
            <div v-if="item.cols" class="ml-3 space-y-1">
              <RouterLink
                v-for="col in item.cols"
                :key="col.title"
                :to="col.href"
                class="flex items-center gap-3 py-1 text-sm focus-ring focus:outline-none"
                @click="handleMobileNav(col.title, { parent: item.label })"
              >
                <div class="relative h-12 w-12 overflow-hidden rounded-lg">
                  <div :class="['absolute inset-0 transition-opacity duration-500', navImageLoaded[col.href] ? 'opacity-0' : 'img-shell']"></div>
                  <img
                    v-if="col.image"
                    :src="col.image"
                    :alt="col.title"
                    loading="lazy"
                    decoding="async"
                    class="absolute inset-0 h-full w-full object-cover"
                    @load="markNavImage(col.href)"
                  />
                </div>
                <span>{{ col.title }}</span>
              </RouterLink>
            </div>
          </div>
          <RouterLink
            to="/search"
            class="btn block text-center focus-ring focus:outline-none"
            aria-label="Search"
            @click="handleMobileNav('Search')"
          >
            Search
          </RouterLink>
          <RouterLink
            :to="donateHref"
            class="btn btn-gradient block text-center focus-ring focus:outline-none"
            :aria-label="`Donate to SWAN`"
            @click="handleMobileNav(donateLabel)"
          >
            {{ donateLabel }}
          </RouterLink>
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
