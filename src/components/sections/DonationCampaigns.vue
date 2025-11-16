<template>
  <section v-if="campaigns.length" class="py-12 sm:py-16" data-animate="fade-up">
    <div class="container-irr space-y-8">
      <div class="text-center space-y-3 max-w-3xl mx-auto">
        <p class="kicker">Donation options</p>
        <h2 class="section-heading">Direct your gift to urgent field work</h2>
        <p class="text-slate-600">
          Choose a fund to support emergency health caravans, Gaza relief, Zakat al-Fitr, or orphan sponsorships. Every option routes
          dollars straight to partners on the ground.
        </p>
      </div>

      <div class="filters flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="pill text-sm whitespace-nowrap"
          :class="selectedCategory === category ? 'bg-brand-600 text-white border-brand-600' : 'bg-white hover:border-brand-400'"
          @click="selectCategory(category)"
        >
          {{ category }}
        </button>
      </div>

      <div class="relative">
        <button
          type="button"
          class="slider-control left-2"
          :disabled="!canScrollLeft"
          aria-label="Scroll campaigns left"
          @click="scrollSlider(-1)"
        >
          ‹
        </button>
        <div ref="sliderRef" class="campaign-slider" @scroll="handleScroll">
          <article v-for="campaign in filteredCampaigns" :key="campaign.slug" class="donation-card card">
            <div class="aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <img :src="campaign.image" :alt="campaign.title" loading="lazy" decoding="async" />
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.35em] text-brand-600">
                <span>{{ campaign.tag }}</span>
                <span class="inline-flex items-center gap-1 text-[11px] text-slate-500">
                  <span class="h-1.5 w-1.5 rounded-full bg-brand-400"></span>
                  Always-open
                </span>
              </div>
              <h3 class="text-xl font-semibold text-brand-900">{{ campaign.title }}</h3>
              <p class="text-slate-600 text-sm leading-relaxed">{{ campaign.summary }}</p>
              <ul v-if="campaign.highlights?.length" class="text-sm text-slate-600 space-y-1">
                <li v-for="item in campaign.highlights.slice(0, 2)" :key="item">• {{ item }}</li>
              </ul>
              <div class="flex flex-wrap gap-2 pt-1">
                <component
                  :is="campaign.cta?.to ? RouterLink : 'a'"
                  class="btn btn-gradient flex-1 justify-center"
                  v-bind="ctaBindings(campaign.cta)"
                >
                  {{ campaign.cta?.label ?? 'Donate now' }}
                </component>
                <component
                  v-if="campaign.secondaryCta"
                  :is="campaign.secondaryCta.to ? RouterLink : 'a'"
                  class="pill flex-1 justify-center text-sm"
                  v-bind="ctaBindings(campaign.secondaryCta)"
                >
                  {{ campaign.secondaryCta.label }}
                </component>
              </div>
            </div>
          </article>
        </div>
        <button
          type="button"
          class="slider-control right-2"
          :disabled="!canScrollRight"
          aria-label="Scroll campaigns right"
          @click="scrollSlider(1)"
        >
          ›
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { getSite } from "@/lib/content";

type CampaignCta = {
  label: string;
  to?: string;
  href?: string;
};

type Campaign = {
  slug: string;
  tag: string;
  title: string;
  summary: string;
  image: string;
  categories?: string[];
  highlights?: string[];
  cta?: CampaignCta;
  secondaryCta?: CampaignCta;
};

const campaigns = (getSite().donation?.campaigns ?? []).map((campaign) => ({
  ...campaign,
  categories: Array.isArray(campaign.categories) && campaign.categories.length ? campaign.categories : [campaign.tag],
})) as Campaign[];

const categories = computed(() => {
  const list = new Set<string>();
  campaigns.forEach((campaign) => campaign.categories?.forEach((cat) => list.add(cat)));
  return ["All", ...Array.from(list)];
});

const selectedCategory = ref("All");
const sliderRef = ref<HTMLDivElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const filteredCampaigns = computed(() => {
  if (selectedCategory.value === "All") return campaigns;
  return campaigns.filter((campaign) => campaign.categories?.includes(selectedCategory.value));
});

const selectCategory = (category: string) => {
  if (category === selectedCategory.value) return;
  selectedCategory.value = category;
};

const ctaBindings = (cta?: CampaignCta) => {
  if (!cta) return {};
  if (cta.to && !cta.href) {
    return { to: cta.to };
  }
  if (cta.href) {
    const external = /^https?:\/\//i.test(cta.href);
    return { href: cta.href, target: external ? "_blank" : undefined, rel: external ? "noopener" : undefined };
  }
  return {};
};

const updateScrollBounds = () => {
  const el = sliderRef.value;
  if (!el) {
    canScrollLeft.value = false;
    canScrollRight.value = false;
    return;
  }
  canScrollLeft.value = el.scrollLeft > 0;
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
};

const handleScroll = () => updateScrollBounds();

const scrollSlider = (direction: 1 | -1) => {
  const el = sliderRef.value;
  if (!el) return;
  const amount = el.clientWidth * 0.9 * direction;
  el.scrollBy({ left: amount, behavior: "smooth" });
};

nextTick(updateScrollBounds);

watch(filteredCampaigns, async () => {
  await nextTick();
  sliderRef.value?.scrollTo({ left: 0, behavior: "smooth" });
  updateScrollBounds();
});
</script>

<style scoped>
.filters {
  scrollbar-width: none;
}
.filters::-webkit-scrollbar {
  display: none;
}

.campaign-slider {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(280px, 360px);
  gap: 1.25rem;
  overflow-x: auto;
  padding: 0.5rem 0.25rem 0.5rem 0;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
}
.campaign-slider::-webkit-scrollbar {
  display: none;
}

.donation-card {
  scroll-snap-align: start;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 100%;
}

.donation-card img {
  transition: transform 0.6s ease;
}

.donation-card:hover img {
  transform: scale(1.05);
}

.slider-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
  z-index: 10;
}

.slider-control:disabled {
  opacity: 0.4;
  pointer-events: none;
}
@media (max-width: 768px) {
  .slider-control {
    display: none;
  }
}
</style>
