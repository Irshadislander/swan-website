<template>
  <section v-if="methods.length" class="py-12 sm:py-16" data-animate="fade-up">
    <div class="container-irr space-y-10">
      <div class="text-center space-y-3 max-w-2xl mx-auto">
        <p class="kicker">More ways to give</p>
        <h2 class="section-heading">Prefer a bank transfer or corporate gift?</h2>
        <p class="text-slate-600">
          We mirror IRUSA’s flexibility by supporting bank transfers, employer matches, and offline giving. Pick the option that
          keeps fees low for you.
        </p>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <article
          v-for="(method, index) in methods"
          :key="method.title"
          class="card space-y-4"
          data-animate="fade-up"
          :style="`--animate-delay: ${0.08 * index}s`"
        >
          <div class="text-xs uppercase tracking-[0.35em] text-brand-600">{{ method.tag }}</div>
          <h3 class="text-xl font-semibold text-brand-900">{{ method.title }}</h3>
          <p class="text-slate-600 text-sm leading-relaxed">{{ method.summary }}</p>
          <ul v-if="method.details?.length" class="text-sm text-slate-700 space-y-1.5">
            <li v-for="detail in method.details" :key="detail">• {{ detail }}</li>
          </ul>
          <component
            :is="method.cta?.to ? RouterLink : 'a'"
            class="btn btn-primary w-full justify-center"
            v-bind="ctaBindings(method.cta)"
          >
            {{ method.cta?.label ?? 'Contact us' }}
          </component>
        </article>
      </div>

      <div v-if="contact" class="card bg-brand-50/50 border border-brand-100 p-6 flex flex-col gap-2 text-slate-700">
        <p class="kicker mb-1 text-brand-700">{{ contact.title }}</p>
        <p>{{ contact.body }}</p>
        <div class="flex flex-wrap gap-4 text-sm">
          <a class="text-brand-700 font-semibold hover:text-brand-900" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
          <a class="text-brand-700 font-semibold hover:text-brand-900" :href="`tel:${contact.phone.replace(/\\s+/g, '')}`">
            {{ contact.phone }}
          </a>
          <span>{{ contact.hours }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { getSite } from "@/lib/content";

type MethodCta = {
  label: string;
  to?: string;
  href?: string;
};

const donation = getSite().donation ?? {};
const methods = donation.methods ?? [];
const contact = donation.contact ?? null;

const ctaBindings = (cta?: MethodCta) => {
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
</script>
