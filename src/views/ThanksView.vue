<script setup lang="ts">
import MainLayout from '@/shared/MainLayout.vue'
import { useRoute, RouterLink } from 'vue-router'

const props = defineProps<{
  title?: string
  message?: string
}>()

const route = useRoute()
const formType = (route.query.form as string) || 'support'

const defaultCopy: Record<string, { heading: string; body: string }> = {
  volunteer: {
    heading: 'Thank you for volunteering!',
    body: "Our team will review your note and follow up within two business days. You'll also receive a confirmation email if provided.",
  },
  contact: {
    heading: 'Thanks for reaching out!',
    body: 'We received your message and will get back to you shortly with next steps.',
  },
  support: {
    heading: 'Thanks for getting in touch!',
    body: 'We appreciate your message and will respond soon.',
  },
}

const { heading, body } = defaultCopy[formType] ?? defaultCopy.support
</script>

<template>
  <MainLayout>
    <section class="py-16">
      <div class="container-irr max-w-2xl text-center space-y-6">
        <h1 class="font-heading text-3xl sm:text-4xl text-brand-900">
          {{ props.title || heading }}
        </h1>
        <p class="text-slate-600 text-lg">
          {{ props.message || body }}
        </p>
        <RouterLink class="btn btn-gradient" to="/">
          Return to home
        </RouterLink>
      </div>
    </section>
  </MainLayout>
</template>
