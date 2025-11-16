<script setup lang="ts">
const faqs = [
  {
    q: "How quickly do emergency gifts reach families?",
    a: "Emergency funds are wired within 24 hours to verified partners who pre-position supplies. We publish updates on the Urgent page once distributions begin.",
  },
  {
    q: "Are my donations tax deductible?",
    a: "Yes. SWAN is a registered nonprofit. You’ll receive an email receipt within minutes of donating and a consolidated yearly summary.",
  },
  {
    q: "Can I volunteer remotely?",
    a: "Absolutely. We host remote mentoring sessions, storytelling roles, and operational support for finance or communications.",
  },
];
</script>

<template>
  <section class="py-12 sm:py-16">
    <div class="container-irr space-y-6">
      <header class="space-y-2 text-center max-w-3xl mx-auto">
        <p class="kicker">Frequently asked questions</p>
        <h1 class="font-heading text-4xl text-brand-900">Need more details? Start here.</h1>
        <p class="text-slate-600">
          Contact us anytime if your question isn’t covered. We typically reply within one business day.
        </p>
      </header>

      <div class="card p-6">
        <el-collapse accordion>
          <el-collapse-item v-for="(faq, index) in faqs" :key="faq.q" :name="index">
            <template #title>
              <span class="font-semibold text-brand-900">{{ faq.q }}</span>
            </template>
            <p class="text-slate-600 leading-relaxed">{{ faq.a }}</p>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </section>
</template>
