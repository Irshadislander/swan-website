<template>
  <section class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-brand-50 to-white"></div>

    <div class="relative max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center py-16 md:py-24">
      <div>
        <h1 class="heading-font text-4xl md:text-5xl font-bold text-brand-800">
          Empowering Lives through Education and Health
        </h1>
        <p class="mt-4 text-grayx-600 max-w-xl">
          Join us to uplift communities in Nepal with scholarships, health camps, and youth empowerment.
        </p>
        <div class="mt-8 flex gap-3">
          <RouterLink to="/donate" class="rounded-2xl px-6 py-3 bg-brand-600 text-white font-semibold hover:bg-brand-700">
            Donate Now
          </RouterLink>
          <RouterLink to="/get-involved" class="rounded-2xl px-6 py-3 bg-white text-brand-700 ring-1 ring-grayx-200 hover:bg-grayx-50">
            Join Us
          </RouterLink>
        </div>
      </div>

      <div class="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] bg-grayx-100">
        <img v-if="hasHero" src="/hero.jpg" alt="SWAN" class="object-cover w-full h-full" />
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const hasHero = ref(false)
onMounted(() => { fetch('/hero.jpg', { method: 'HEAD' }).then(r => hasHero.value = r.ok) })
</script>