<template>
  <div class="card p-4" role="region" aria-label="Quick donation">
    <el-form
      :model="quickForm"
      label-position="top"
      class="grid gap-3 sm:grid-cols-2 md:grid-cols-[repeat(3,minmax(0,1fr))_auto] md:items-center"
    >
      <el-form-item label="Donation frequency" class="m-0">
        <el-select
          v-model="quickForm.frequency"
          placeholder="One-time"
          size="large"
          class="w-full"
          :disabled="loading"
          aria-describedby="quick-frequency-help"
        >
          <el-option label="One-time" value="once" />
          <el-option label="Monthly" value="monthly" />
        </el-select>
      </el-form-item>

      <el-form-item label="Donation amount" class="m-0">
        <el-select
          v-model="quickForm.amount"
          placeholder="$50"
          size="large"
          class="w-full"
          :disabled="loading"
          aria-describedby="quick-amount-help"
        >
          <el-option v-for="n in amounts" :key="n" :label="`$${n}`" :value="n" />
        </el-select>
      </el-form-item>

      <el-form-item label="Program designation" class="m-0">
        <el-select
          v-model="quickForm.program"
          placeholder="Education Access"
          size="large"
          class="w-full"
          :disabled="loading"
          aria-describedby="quick-program-help"
        >
          <el-option label="Education Access" value="education" />
          <el-option label="Community Health" value="health" />
          <el-option label="Women’s Leadership" value="empowerment" />
        </el-select>
      </el-form-item>

      <button
        type="button"
        class="btn btn-primary self-stretch flex items-center justify-center"
        :aria-label="donateLabel"
        :aria-busy="loading"
        @click="handleSubmit"
        :disabled="loading"
      >
        {{ loading ? "Processing…" : "Donate Now" }}
      </button>
    </el-form>
    <p id="quick-frequency-help" class="sr-only">Select one-time or monthly gift.</p>
    <p id="quick-amount-help" class="sr-only">Choose a preset gift amount.</p>
    <p id="quick-program-help" class="sr-only">Pick the program to receive your gift.</p>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import type { DonationPayload } from "@/api/donations";
import { createCheckout } from "@/api/payments";
import { track } from "@/plugins/analytics";
import { useRouter } from "vue-router";

const quickForm = reactive({
  frequency: "once" as "once" | "monthly",
  amount: 50,
  program: "education",
});

const amounts = [25, 50, 100, 250, 500];
const loading = ref(false);
const router = useRouter();

const donateLabel = computed(
  () =>
    `Donate ${quickForm.frequency === "monthly" ? "monthly" : "once"} ${quickForm.amount ? `$${quickForm.amount}` : ""} to SWAN`
);

const handleSubmit = async () => {
  if (loading.value) return;
  loading.value = true;
  const payload: DonationPayload = {
    name: "Quick Donate",
    email: "quickdonate@swan.org",
    amount: quickForm.amount,
    frequency: quickForm.frequency === "once" ? "one-time" : "monthly",
    program: quickForm.program,
    note: "Quick donate bar submission",
  };
  track("donate_intent", { ...payload, source: "quick_bar" });
  const checkout = await createCheckout(payload);
  loading.value = false;

  if (checkout.ok) {
    window.location.href = checkout.url;
    return;
  }

  if ("mock" in checkout && checkout.mock) {
    router.push(checkout.url);
    track("donate_submit", { ...payload, id: "MOCK", source: "quick_bar" });
    return;
  }

  const message =
    ("error" in checkout && checkout.error) || "Unable to start checkout";
  ElMessage.error(message);
  track("donate_error", { ...payload, source: "quick_bar", error: message });
};
</script>
