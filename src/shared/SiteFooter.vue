<template>
  <footer class="bg-brand-900 text-white mt-16" role="contentinfo">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]">
      <div class="space-y-4">
        <div class="font-heading text-2xl mb-3">{{ site.brand.name }}</div>
        <p class="text-white/80">
          {{ footer.blurb }}
        </p>
        <p class="mt-4 text-sm text-white/60">{{ footer.contact.email }} • {{ footer.contact.location }}</p>
        <NewsletterSignup source="footer" />
      </div>
      <nav class="grid gap-6 sm:grid-cols-3">
        <div v-for="column in footer.columns" :key="column.heading">
          <h3 class="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">{{ column.heading }}</h3>
          <ul class="mt-3 space-y-2">
            <li v-for="link in column.links" :key="link.to">
              <RouterLink :to="link.to" class="hover:underline">{{ link.label }}</RouterLink>
            </li>
          </ul>
        </div>
      </nav>
      <div class="self-start flex flex-col gap-4">
        <RouterLink :to="donateHref" class="btn btn-gradient" aria-label="Donate to SWAN">{{ donateLabel }}</RouterLink>
        <ul class="text-xs text-white/60 space-y-1">
          <li v-for="link in footer.legal" :key="link.to">
            <RouterLink :to="link.to" class="hover:underline">{{ link.label }}</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { getSite } from "@/lib/content";
import NewsletterSignup from "@/components/newsletter/SignupForm.vue";

const site = getSite();
const footer = site.footer;
const donate = site.nav.cta;
const donateHref = donate?.href ?? "/donate";
const donateLabel = donate?.label ?? "Donate";
</script>
