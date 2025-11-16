<script setup lang="ts">
import { reactive, computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { ElMessage } from "element-plus";
import { getSite } from "@/lib/content";
import { saveLead } from "@/api/leads";

const zakat = getSite().zakat;
const assets = zakat?.assets ?? [];
const nisab = zakat?.nisab ?? { gold: 85, silver: 595, goldPricePerGram: 65, silverPricePerGram: 0.8 };

type AssetState = Record<string, number>;

const state = reactive<AssetState>(
  assets.reduce<AssetState>((acc, asset) => {
    acc[asset.key] = 0;
    return acc;
  }, {})
);

const method = reactive<{ type: "gold" | "silver" }>({ type: "gold" });
const saving = ref(false);

const totalAssets = computed(() => Object.values(state).reduce((sum, value) => sum + (Number(value) || 0), 0));
const nisabValue = computed(() => {
  const grams = method.type === "gold" ? nisab.gold : nisab.silver;
  const price = method.type === "gold" ? nisab.goldPricePerGram : nisab.silverPricePerGram;
  return grams * price;
});
const owesZakat = computed(() => totalAssets.value >= nisabValue.value);
const zakatDue = computed(() => (owesZakat.value ? totalAssets.value * 0.025 : 0));

const saveCalculation = async () => {
  if (!totalAssets.value) {
    ElMessage.warning("Add amounts before saving your calculation.");
    return;
  }
  saving.value = true;
  const response = await saveLead({
    type: "zakat_calculation",
    data: {
      method: method.type,
      totalAssets: totalAssets.value,
      nisab: nisabValue.value,
      owesZakat: owesZakat.value,
      zakatDue: zakatDue.value,
    },
  });
  saving.value = false;
  if (response.ok) {
    ElMessage.success("Calculation saved for our giving desk.");
  } else {
    ElMessage.error(response.error || "Unable to save calculation.");
  }
};
</script>

<template>
  <section v-if="zakat" class="card space-y-4" id="calculator">
    <div class="space-y-2">
      <p class="text-xs uppercase tracking-[0.35em] text-brand-600">Zakat calculator</p>
      <h2 class="text-2xl font-heading text-brand-900">Estimate your obligation</h2>
      <p class="text-slate-600">Enter assets you held for one lunar year. We’ll compare against the nisab threshold.</p>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="pill text-sm"
        :class="method.type === 'gold' ? 'bg-brand-600 text-white border-brand-600' : ''"
        @click="method.type = 'gold'"
      >
        Gold nisab
      </button>
      <button
        type="button"
        class="pill text-sm"
        :class="method.type === 'silver' ? 'bg-brand-600 text-white border-brand-600' : ''"
        @click="method.type = 'silver'"
      >
        Silver nisab
      </button>
    </div>

    <div class="grid gap-3 sm:grid-cols-2">
      <label v-for="asset in assets" :key="asset.key" class="text-sm text-slate-700">
        {{ asset.label }}
        <input
          v-model.number="state[asset.key]"
          type="number"
          min="0"
          class="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
          placeholder="0"
        />
      </label>
    </div>

    <div class="rounded-2xl border border-brand-50 bg-haze px-4 py-3 space-y-1 text-sm">
      <p>Total assets: <strong>{{ totalAssets.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) }}</strong></p>
      <p>Nisab threshold: <strong>{{ nisabValue.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) }}</strong></p>
      <p v-if="owesZakat">Zakat due (2.5%): <strong>{{ zakatDue.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) }}</strong></p>
      <p v-else>You are below nisab. Zakat is not due, but voluntary sadaqah is always welcome.</p>
    </div>

    <div class="flex flex-wrap gap-3">
      <RouterLink v-if="owesZakat" :to="'/donate?campaign=zakat&amount=' + Math.round(zakatDue)" class="btn btn-gradient">
        Give {{ zakatDue.toLocaleString(undefined, { style: "currency", currency: "USD" }) }}
      </RouterLink>
      <RouterLink to="/donate?campaign=zakat" class="pill">Give to Zakat fund</RouterLink>
      <button type="button" class="btn" :aria-busy="saving" @click="saveCalculation">
        {{ saving ? "Saving…" : "Save calculation" }}
      </button>
    </div>
  </section>
</template>
