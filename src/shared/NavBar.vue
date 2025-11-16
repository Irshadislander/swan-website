<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { getNav, getSite } from "@/lib/content";
import { track } from "@/plugins/analytics";

const open = ref(false);
const hover = ref<string | null>(null);
const menuButtonRef = ref<HTMLButtonElement | null>(null);
const drawerRef = ref<HTMLElement | null>(null);
const router = useRouter();
type UtilityLink = {
  label: string;
  href?: string;
  icon?: string;
  type?: "search" | "link";
  external?: boolean;
};

const nav = getNav();
const site = getSite();
const brand = site.brand ?? { name: "SWAN", tagline: "Students Working Against Neglect" };
type MegaLink = { label: string; href: string; description?: string; external?: boolean };
type MegaColumn = { title?: string; summary?: string; href?: string; image?: string; links?: MegaLink[] };
const navAlert = nav.alert ?? null;
const utilities = (nav.utilities ?? []) as UtilityLink[];
const items = nav.primary;
const donateCta = nav.cta;
const donateLabel = donateCta?.label ?? "Donate";
const donateHref = donateCta?.href ?? "/donate";
const mobileMenuId = "mobile-nav-drawer";
let focusTimeout: number | null = null;
const alertCtaLabel = navAlert?.linkLabel ?? "Learn more";
const alertAriaLabel = computed(() => (navAlert?.message ? `Emergency alert: ${navAlert.message}` : ""));
const iconPaths: Record<string, string> = {
  search: "M11 2a9 9 0 016.32 15.32l3.69 3.68-1.42 1.42-3.7-3.68A9 9 0 1111 2zm0 2a7 7 0 100 14 7 7 0 000-14z",
  users: "M12 12a5 5 0 10-5-5 5 5 0 005 5zm-7 9v-1a5 5 0 015-5h4a5 5 0 015 5v1z",
  menu: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z",
  close: "M6.22 5.22l5.78 5.78 5.78-5.78 1.42 1.42-5.78 5.78 5.78 5.78-1.42 1.42-5.78-5.78-5.78 5.78-1.42-1.42 5.78-5.78-5.78-5.78z",
  default: "M12 2a10 10 0 11-10 10A10 10 0 0112 2z",
};

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

const getIconPath = (icon?: string) => iconPaths[icon ?? "default"] ?? iconPaths.default;
const isExternal = (href?: string, explicit?: boolean) => Boolean(explicit || (href && /^https?:\/\//i.test(href)));

const logNavClick = (label: string, location: "header" | "mobile", extra: Record<string, unknown> = {}) => {
  track("nav_click", { label, location, ...extra });
};

const handleUtility = (item: UtilityLink, location: "header" | "mobile") => {
  logNavClick(item.label, location, { surface: "utility" });
  if (item.type === "search" || (!item.href && !item.external)) {
    router.push({ name: "search" });
    if (location === "mobile") closeMenus();
    return;
  }

  if (item.href) {
    if (isExternal(item.href, item.external)) {
      window.open(item.href, "_blank", "noopener");
    } else {
      router.push(item.href);
    }
    if (location === "mobile") closeMenus();
  }
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

const columnHasLinks = (col: MegaColumn): col is MegaColumn & { links: MegaLink[] } => {
  return Array.isArray(col.links) && col.links.length > 0;
};
</script>

<template>
  <header class="nav-header sticky top-0 z-40 shadow-sm" role="banner" @keyup.esc="closeMenus">
    <div v-if="navAlert?.message" class="nav-ticker" role="region" :aria-label="alertAriaLabel">
      <RouterLink
        v-if="navAlert?.href && !isExternal(navAlert.href)"
        class="nav-ticker-link container-irr"
        :to="navAlert.href"
        @click="logNavClick(alertCtaLabel, 'header', { surface: 'alert' })"
      >
        <div class="nav-ticker-track" aria-hidden="true">
          <span>{{ navAlert.message }} • {{ alertCtaLabel }}</span>
          <span>{{ navAlert.message }} • {{ alertCtaLabel }}</span>
          <span>{{ navAlert.message }} • {{ alertCtaLabel }}</span>
        </div>
        <span class="sr-only">{{ navAlert.message }}</span>
        <span class="nav-ticker-cta">
          {{ alertCtaLabel }}
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M5 12h14m0 0l-6-6m6 6l-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </RouterLink>
      <a
        v-else-if="navAlert?.href"
        class="nav-ticker-link container-irr"
        :href="navAlert.href"
        target="_blank"
        rel="noopener"
        @click="logNavClick(alertCtaLabel, 'header', { surface: 'alert' })"
      >
        <div class="nav-ticker-track" aria-hidden="true">
          <span>{{ navAlert.message }} • {{ alertCtaLabel }}</span>
          <span>{{ navAlert.message }} • {{ alertCtaLabel }}</span>
          <span>{{ navAlert.message }} • {{ alertCtaLabel }}</span>
        </div>
        <span class="sr-only">{{ navAlert.message }}</span>
        <span class="nav-ticker-cta">
          {{ alertCtaLabel }}
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M5 12h14m0 0l-6-6m6 6l-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </a>
      <div
        v-else
        class="nav-ticker-link container-irr"
      >
        <div class="nav-ticker-track" aria-hidden="true">
          <span>{{ navAlert.message }} • {{ alertCtaLabel }}</span>
          <span>{{ navAlert.message }} • {{ alertCtaLabel }}</span>
          <span>{{ navAlert.message }} • {{ alertCtaLabel }}</span>
        </div>
        <span class="sr-only">{{ navAlert.message }}</span>
        <span class="nav-ticker-cta">{{ alertCtaLabel }}</span>
      </div>
    </div>

    <nav class="nav-bar bg-white/95 backdrop-blur border-b border-gray-200" role="navigation" aria-label="Primary navigation">
      <div class="container-irr nav-row">
        <RouterLink to="/" class="nav-brand focus-ring focus:outline-none" aria-label="Go to SWAN home">
          <span class="nav-brand-name">{{ brand.name }}</span>
          <span class="nav-brand-tagline">{{ brand.tagline }}</span>
        </RouterLink>

        <div class="nav-links hidden lg:flex items-stretch gap-5 relative" role="menubar">
          <div
            v-for="item in items"
            :key="item.label"
            class="relative nav-link"
            @mouseenter="hover = item.cols ? item.label : null"
            @mouseleave="hover = null"
            @focusin="handleMegaFocus(item)"
            @focusout="handleMegaBlur"
          >
            <RouterLink
              :to="item.href"
              class="nav-link-trigger focus-ring focus:outline-none"
              role="menuitem"
              :aria-haspopup="Boolean(item.cols)"
              :aria-expanded="item.cols ? hover === item.label : undefined"
              @click="logNavClick(item.label, 'header')"
            >
              {{ item.label }}
              <svg v-if="item.cols" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </RouterLink>

            <div
              v-if="item.cols && hover === item.label"
              class="nav-mega"
              role="menu"
              :aria-label="`${item.label} submenu`"
            >
              <div class="nav-mega-grid">
                <div v-for="col in item.cols" :key="col.title ?? col.href" class="nav-mega-column">
                  <RouterLink
                    v-if="col.href && !columnHasLinks(col)"
                    :to="col.href"
                    class="nav-mega-link focus-ring focus:outline-none"
                    role="menuitem"
                    @click="logNavClick(col.title ?? col.href, 'header', { parent: item.label })"
                  >
                    <span class="nav-mega-title">{{ col.title }}</span>
                    <span v-if="col.summary" class="nav-mega-desc">
                      {{ col.summary }}
                    </span>
                  </RouterLink>
                  <div v-else-if="columnHasLinks(col)" class="nav-mega-list" role="group">
                    <p v-if="col.title" class="nav-mega-title">{{ col.title }}</p>
                    <p v-if="col.summary" class="nav-mega-desc">{{ col.summary }}</p>
                    <ul>
                      <li v-for="link in col.links" :key="link.label">
                        <RouterLink
                          v-if="!isExternal(link.href, link.external)"
                          :to="link.href"
                          class="nav-mega-list-link focus-ring focus:outline-none"
                          role="menuitem"
                          @click="logNavClick(link.label, 'header', { parent: item.label })"
                        >
                          <span>{{ link.label }}</span>
                          <small v-if="link.description">{{ link.description }}</small>
                        </RouterLink>
                        <a
                          v-else
                          :href="link.href"
                          target="_blank"
                          rel="noopener"
                          class="nav-mega-list-link focus-ring focus:outline-none"
                          role="menuitem"
                          @click="logNavClick(link.label, 'header', { parent: item.label, external: true })"
                        >
                          <span>{{ link.label }}</span>
                          <small v-if="link.description">{{ link.description }}</small>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="nav-actions flex items-center gap-3">
          <div v-if="utilities.length" class="hidden md:flex items-center gap-2">
            <button
              v-for="utility in utilities"
              :key="utility.label"
              type="button"
              class="nav-icon-btn focus-ring focus:outline-none"
              @click="handleUtility(utility, 'header')"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path :d="getIconPath(utility.icon)" fill="currentColor" />
              </svg>
              <span class="sr-only">{{ utility.label }}</span>
            </button>
          </div>
          <RouterLink
            :to="donateHref"
            class="nav-donate focus-ring focus:outline-none hidden md:inline-flex"
            :aria-label="`Donate to SWAN today`"
            @click="logNavClick(donateLabel, 'header', { surface: 'primary-nav' })"
          >
            <span>{{ donateLabel }}</span>
            <small>Keep programs running</small>
          </RouterLink>
          <button
            ref="menuButtonRef"
            class="nav-menu-btn md:hidden focus-ring focus:outline-none"
            type="button"
            :aria-expanded="open"
            :aria-controls="mobileMenuId"
            aria-label="Toggle navigation menu"
            @click="toggleMobile"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path :d="open ? iconPaths.close : iconPaths.menu" fill="currentColor" />
            </svg>
            <span>{{ open ? "Close" : "Menu" }}</span>
          </button>
        </div>
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
        class="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-xl p-6 overflow-y-auto flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        @keydown="handleDrawerKeydown"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="nav-brand-name text-xl">{{ brand.name }}</div>
          <button class="nav-icon-btn focus-ring focus:outline-none" type="button" @click="closeMenus">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path :d="iconPaths.close" fill="currentColor" />
            </svg>
            <span class="sr-only">Close menu</span>
          </button>
        </div>

        <div v-if="utilities.length" class="nav-mobile-utilities">
          <button
            v-for="utility in utilities"
            :key="utility.label"
            type="button"
            class="nav-mobile-utility focus-ring focus:outline-none"
            @click="handleUtility(utility, 'mobile')"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path :d="getIconPath(utility.icon)" fill="currentColor" />
            </svg>
            <span>{{ utility.label }}</span>
          </button>
        </div>

        <nav class="space-y-4 flex-1" role="navigation" aria-label="Mobile navigation">
          <div v-for="item in items" :key="item.label">
            <RouterLink :to="item.href" class="font-medium block mb-2 focus-ring focus:outline-none" @click="handleMobileNav(item.label)">
              {{ item.label }}
            </RouterLink>
            <div v-if="item.cols" class="ml-3 space-y-1">
              <RouterLink
                v-for="col in item.cols"
                :key="col.title"
                :to="col.href"
                class="block py-1 text-sm text-slate-600 focus-ring focus:outline-none"
                @click="handleMobileNav(col.title, { parent: item.label })"
              >
                {{ col.title }}
              </RouterLink>
            </div>
          </div>
        </nav>

        <div class="mt-6 space-y-3">
          <RouterLink
            :to="donateHref"
            class="nav-donate w-full justify-center focus-ring focus:outline-none"
            :aria-label="`Donate to SWAN`"
            @click="handleMobileNav(donateLabel)"
          >
            <span>{{ donateLabel }}</span>
            <small>Keep programs running</small>
          </RouterLink>
        </div>
      </aside>
    </transition>
  </header>
</template>

<style scoped>
.nav-ticker {
  background: #b91c1c;
  color: #fff;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-ticker-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.35rem 0;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
}

.nav-ticker-track {
  display: flex;
  gap: 2rem;
  animation: ticker-scroll 18s linear infinite;
  white-space: nowrap;
}

.nav-ticker-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 600;
  border-bottom: 1px solid currentColor;
}

.nav-bar .nav-row {
  min-height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.nav-brand {
  display: inline-flex;
  flex-direction: column;
  text-decoration: none;
  color: #051b3b;
}

.nav-brand-name {
  font-family: "Playfair Display", "Times New Roman", serif;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.1;
}

.nav-brand-tagline {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.28em;
  color: rgba(5, 27, 59, 0.7);
}

.nav-link-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  height: 4.5rem;
  padding: 0 0.35rem;
  font-weight: 600;
  color: #0f172a;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.nav-link {
  position: relative;
}

.nav-link-trigger svg {
  width: 1rem;
  height: 1rem;
}

.nav-link-trigger:hover,
.nav-link-trigger:focus-visible {
  color: #2255e6;
  border-color: #2255e6;
}

.nav-mega {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: calc(100% + 0.5rem);
  width: min(880px, 80vw);
  z-index: 30;
}

.nav-mega-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  background: #fff;
  box-shadow: 0 24px 50px rgba(5, 27, 59, 0.12);
  border: 1px solid rgba(2, 6, 23, 0.08);
}

.nav-mega-column {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.nav-mega-link {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  text-decoration: none;
  color: #0f172a;
  padding: 0.25rem 0;
}

.nav-mega-link:hover .nav-mega-title,
.nav-mega-link:focus-visible .nav-mega-title {
  color: #2255e6;
}

.nav-mega-title {
  font-weight: 600;
}

.nav-mega-desc {
  font-size: 0.85rem;
  color: #475569;
}

.nav-mega-list ul {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-mega-list-link {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.35rem 0;
  text-decoration: none;
  color: #0f172a;
  font-size: 0.9rem;
}

.nav-mega-list-link small {
  font-size: 0.75rem;
  color: #64748b;
}

.nav-mega-list-link:hover span,
.nav-mega-list-link:focus-visible span {
  color: #2255e6;
}

.nav-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  border: 1px solid rgba(2, 6, 23, 0.12);
  color: #0f172a;
  background: #fff;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.nav-icon-btn svg {
  width: 1.2rem;
  height: 1.2rem;
}

.nav-icon-btn:hover {
  border-color: #2255e6;
  color: #2255e6;
}

.nav-donate {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border-radius: 999px;
  padding: 0.65rem 1.5rem;
  background: linear-gradient(135deg, #2255e6, #1d4ed8);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 12px 24px rgba(34, 85, 230, 0.25);
}

.nav-donate small {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.85;
}

.nav-menu-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 999px;
  border: 1px solid rgba(2, 6, 23, 0.12);
  padding: 0.4rem 1rem;
  font-weight: 600;
  color: #0f172a;
}

.nav-menu-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.nav-mobile-utilities {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.nav-mobile-utility {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem;
  border-radius: 0.85rem;
  border: 1px solid rgba(2, 6, 23, 0.08);
  background: #f8fafc;
  font-weight: 600;
}

.nav-mobile-utility svg {
  width: 1.25rem;
  height: 1.25rem;
}

@keyframes ticker-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

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
