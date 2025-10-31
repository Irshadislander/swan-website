<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getDonation, type DonationRecord } from "@/api/donations";
import { genReceiptPDF } from "../lib/receipt";
import EmailPreview from "@/components/donate/EmailPreview.vue";
import { track } from "@/plugins/analytics";

const route = useRoute();
const router = useRouter();
const donation = ref<DonationRecord | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const showEmailPreview = import.meta.env.DEV;

const donationId = computed(() => route.query.id as string | undefined);

const loadDonation = async () => {
  if (!donationId.value) {
    error.value = "Missing donation ID.";
    loading.value = false;
    return;
  }
  error.value = null;
  donation.value = null;
  loading.value = true;
  const record = await getDonation(donationId.value);
  if (!record) {
    error.value = "We couldn't find that donation.";
    loading.value = false;
    return;
  }
  donation.value = record;
  loading.value = false;
  track("donate_success", {
    id: record.id,
    amount: record.amount,
    frequency: record.frequency,
    program: record.program,
  });
};

const downloadReceipt = async () => {
  if (!donation.value) return;
  const blob = await genReceiptPDF(donation.value);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `SWAN-Receipt-${donation.value.id}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};

const emailReceipt = () => {
  if (!donation.value) return;
  ElMessage.info("We emailed your receipt to you (mock).");
};

const goToMonthly = () => {
  router.push({ name: "donate", query: { frequency: "monthly" } });
};

onMounted(() => {
  loadDonation();
});

watch(donationId, () => {
  loadDonation();
});
</script>

<template>
  <section class="py-16">
    <div class="container-irr max-w-3xl mx-auto">
      <div v-if="loading" class="card p-10 text-center">Loading your donation...</div>
      <div v-else-if="error" class="card p-10 text-center text-red-600">
        <p>{{ error }}</p>
        <button type="button" class="btn btn-primary mt-6" @click="router.push({ name: 'donate' })">Return to donate</button>
      </div>
      <div v-else class="space-y-8">
        <div class="card p-8 space-y-5 text-center">
          <h1 class="font-heading text-3xl text-brand-900">Thank you, {{ donation!.name }}!</h1>
          <p class="text-slate-600 max-w-xl mx-auto">
            Your gift fuels education, health, and women’s leadership programs in rural Nepal. We sent a receipt to {{ donation!.email }}.
          </p>
          <div class="grid gap-4 sm:grid-cols-3">
            <div class="rounded-xl bg-brand-50 p-4">
              <p class="text-xs uppercase tracking-[0.3em] text-brand-600">Amount</p>
              <p class="text-xl font-semibold text-brand-900 mt-1">${{ donation!.amount.toLocaleString() }}</p>
            </div>
            <div class="rounded-xl bg-brand-50 p-4">
              <p class="text-xs uppercase tracking-[0.3em] text-brand-600">Frequency</p>
              <p class="text-xl font-semibold text-brand-900 mt-1">{{ donation!.frequency === 'monthly' ? 'Monthly' : 'One-time' }}</p>
            </div>
            <div class="rounded-xl bg-brand-50 p-4">
              <p class="text-xs uppercase tracking-[0.3em] text-brand-600">Program</p>
              <p class="text-xl font-semibold text-brand-900 mt-1">{{ donation!.program }}</p>
            </div>
          </div>
          <div class="flex flex-wrap justify-center gap-3">
            <button type="button" class="btn btn-primary" @click="downloadReceipt">Download receipt (PDF)</button>
            <button type="button" class="btn" @click="emailReceipt">Email me a copy</button>
          </div>
        </div>

        <div class="card p-6 text-center">
          <p class="text-slate-600">Become a sustaining donor and keep programs running year-round.</p>
          <button type="button" class="btn btn-gradient mt-4" @click="goToMonthly">Give monthly instead</button>
        </div>

        <EmailPreview v-if="showEmailPreview && donation" :donation="donation" />
      </div>
    </div>
  </section>
</template>
