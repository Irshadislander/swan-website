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
    <section class="thanks-view">
      <div class="container-irr max-w-3xl text-center space-y-6" data-animate="fade-up">
        <p class="kicker">Thank you</p>
        <h1 class="thanks-view__title">
          {{ props.title || heading }}
        </h1>
        <p class="thanks-view__body">
          {{ props.message || body }}
        </p>
        <RouterLink class="btn btn-gradient" to="/">
          Return to home
        </RouterLink>
      </div>
    </section>
  </MainLayout>
</template>

<style scoped>
.thanks-view {
  padding: 5rem 0;
  background: radial-gradient(circle at top, rgba(34, 85, 230, 0.08), transparent 55%);
}

.thanks-view__title {
  font-family: "Playfair Display", "Times New Roman", serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  color: #0f172a;
  line-height: 1.2;
}

.thanks-view__body {
  font-size: 1.1rem;
  color: #475569;
}
</style>
