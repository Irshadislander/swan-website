<template>
  <div class="card p-6 space-y-4" role="region" aria-label="Email preview">
    <div class="flex items-center justify-between">
      <h2 class="font-heading text-xl text-brand-900">Email preview (dev only)</h2>
      <span class="text-xs text-slate-500">Sent to {{ donation.email }}</span>
    </div>
    <div class="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <header class="bg-brand-600 text-white py-4 px-6">
        <h3 class="font-heading text-lg">Thank you for supporting SWAN</h3>
      </header>
      <main class="p-6 space-y-3 text-sm text-slate-700">
        <p>Hi {{ donation.name }},</p>
        <p>
          We received your {{ donation.frequency === 'monthly' ? 'monthly' : 'one-time' }} gift of
          <strong>${{ donation.amount.toLocaleString() }}</strong> toward our {{ donation.program }} program.
        </p>
        <p>Your impact keeps teachers, nurses, and women leaders in the field across rural Nepal.</p>
        <p>
          Receipt ID: <strong>{{ donation.id }}</strong><br />
          Donated on {{ new Date(donation.ts).toLocaleString() }}
        </p>
        <p>If you have any questions, reply to this email or contact hello@swan.org.</p>
        <p>With gratitude,<br />The SWAN Team</p>
      </main>
      <footer class="bg-gray-100 text-xs text-slate-500 px-6 py-4">
        SWAN · Kathmandu, Nepal · Students Working Against Neglect
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DonationRecord } from "@/api/donations";

defineProps<{ donation: DonationRecord }>();
</script>
