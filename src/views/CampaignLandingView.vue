<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { getSite } from "@/lib/content";

type CampaignCta = {
  label: string;
  to?: string;
  href?: string;
};

const route = useRoute();
const router = useRouter();
const campaigns = getSite().donation?.campaigns ?? [];
const campaign = computed(() => campaigns.find((item) => item.slug === (route.params.slug as string)));

const ctaBindings = (cta?: CampaignCta) => {
  if (!cta) return {};
  if (cta.to && !cta.href) return { to: cta.to };
  if (cta.href) {
    const external = /^https?:\/\//i.test(cta.href);
    return { href: cta.href, target: external ? "_blank" : undefined, rel: external ? "noopener" : undefined };
  }
  return {};
};

const goBack = () => router.push({ name: "donate" });
</script>

<template>
  <section v-if="campaign" class="py-12 sm:py-16">
    <div class="container-irr space-y-8">
      <nav class="text-sm">
        <RouterLink to="/donate" class="text-brand-600 hover:text-brand-800">← Back to donation options</RouterLink>
      </nav>

      <header class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="space-y-3">
          <p class="kicker text-brand-700">{{ campaign.tag }} fund</p>
          <h1 class="font-heading text-4xl text-brand-900">{{ campaign.title }}</h1>
          <p class="text-slate-600 text-lg leading-relaxed">{{ campaign.body ?? campaign.summary }}</p>
          <div class="flex flex-wrap gap-3">
            <component
              :is="campaign.cta?.to ? RouterLink : 'a'"
              class="btn btn-gradient"
              v-bind="ctaBindings(campaign.cta)"
            >
              {{ campaign.cta?.label ?? "Donate now" }}
            </component>
            <component
              v-if="campaign.secondaryCta"
              :is="campaign.secondaryCta?.to ? RouterLink : 'a'"
              class="pill"
              v-bind="ctaBindings(campaign.secondaryCta)"
            >
              {{ campaign.secondaryCta.label }}
            </component>
          </div>
        </div>
        <figure class="rounded-3xl overflow-hidden shadow-lg">
          <img :src="campaign.image" :alt="campaign.title" class="h-full w-full object-cover" loading="lazy" decoding="async" />
        </figure>
      </header>

      <div v-if="campaign.highlights?.length" class="grid gap-4 md:grid-cols-3">
        <article v-for="item in campaign.highlights" :key="item" class="card">
          <p class="text-sm text-slate-600">{{ item }}</p>
        </article>
      </div>
    </div>
  </section>

  <section v-else class="py-16">
    <div class="container-irr text-center space-y-3">
      <h1 class="font-heading text-3xl text-brand-900">Fund not found</h1>
      <p class="text-slate-600">The campaign you are looking for doesn’t exist anymore.</p>
      <button type="button" class="btn btn-primary" @click="goBack">Return to donate</button>
    </div>
  </section>
</template>
