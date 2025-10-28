<template>
  <footer class="mt-20 bg-grayx-50">
    <div class="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:px-6 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="h-8 w-8 rounded-full bg-brand-600"></span>
          <span class="heading-font font-semibold text-brand-800">{{ copy.brand }}</span>
        </div>
        <p class="mt-3 text-sm text-grayx-600">
          {{ copy.footer.mission }}
        </p>
      </div>
      <div>
        <h4 class="font-semibold text-grayx-800">{{ copy.footer.explore }}</h4>
        <ul class="mt-3 space-y-2 text-sm">
          <li v-for="link in primaryLinks" :key="link.to">
            <RouterLink :to="link.to" class="hover:text-brand-700">
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold text-grayx-800">{{ copy.footer.involved }}</h4>
        <ul class="mt-3 space-y-2 text-sm">
          <li v-for="link in secondaryLinks" :key="link.to">
            <RouterLink :to="link.to" class="hover:text-brand-700">
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold text-grayx-800">{{ copy.footer.newsletter }}</h4>
        <form class="mt-3 flex flex-col gap-3 sm:flex-row" @submit.prevent>
          <BaseInput
            v-model="newsletterEmail"
            :placeholder="copy.footer.newsletterPlaceholder"
            type="email"
            class="flex-1"
          />
          <BaseButton type="submit">
            {{ copy.footer.newsletterCta }}
          </BaseButton>
        </form>
      </div>
    </div>
    <div class="border-t border-grayx-200 py-4 text-center text-xs text-grayx-500">
      {{ copy.footer.copyright }}
    </div>
  </footer>
</template>

<script setup lang="ts">
// Global footer with navigation links and newsletter opt-in placeholder.
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { landingCopy } from '@/lib/copy'

const copy = landingCopy
const primaryLinks = copy.nav.links.slice(0, 3)
const secondaryLinks = [
  { label: 'Volunteer', to: '/get-involved' },
  { label: copy.nav.donateLabel, to: '/donate' },
  { label: 'Contact', to: '/contact' },
]
const newsletterEmail = ref('')
</script>
