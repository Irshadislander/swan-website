<template>
  <div class="card p-4" role="region" aria-label="Quick donation">
    <el-form
      :model="quickForm"
      label-position="top"
      class="grid gap-3 sm:grid-cols-2 md:grid-cols-[repeat(4,minmax(0,1fr))_auto] md:items-center"
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

      <el-form-item label="Currency" class="m-0">
        <el-select
          v-model="currency"
          placeholder="Currency"
          size="large"
          class="w-full"
          :disabled="loading"
        >
          <el-option v-for="c in CURRENCIES" :key="c.code" :label="c.label" :value="c.code" />
        </el-select>
      </el-form-item>

      <el-form-item label="Donation amount" class="m-0">
        <el-select
          v-model="quickForm.amount"
          :placeholder="amountOptions.length ? formatMoney(amountOptions[0], currency) : ''"
          size="large"
          class="w-full"
          :disabled="loading"
          aria-describedby="quick-amount-help"
        >
          <el-option
            v-for="n in amountOptions"
            :key="n"
            :label="formatMoney(n, currency)"
            :value="n"
          />
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
        {{ loading ? 'Processing…' : 'Donate Now' }}
      </button>
    </el-form>
    <p id="quick-frequency-help" class="sr-only">Select one-time or monthly gift.</p>
    <p id="quick-amount-help" class="sr-only">Choose a preset gift amount.</p>
    <p id="quick-program-help" class="sr-only">Pick the program to receive your gift.</p>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { createCheckout } from '@/api/payments'
import { track } from '@/plugins/analytics'
import { useRouter } from 'vue-router'
import { CURRENCIES, STRIPE_PRICES, formatMoney, type CurrencyCode } from '@/config/stripe'

const quickForm = reactive({
  frequency: 'once' as 'once' | 'monthly',
  amount: 50,
  program: 'education',
})

const loading = ref(false)
const router = useRouter()
const currency = ref<CurrencyCode>('USD')

const contributionType = computed(() => (quickForm.frequency === 'monthly' ? 'monthly' : 'oneTime'))
const amountOptions = computed<number[]>(() => {
  const entries = STRIPE_PRICES[currency.value][contributionType.value]
  return Object.keys(entries)
    .map((key) => Number(key))
    .sort((a, b) => a - b)
})

watch([currency, () => quickForm.frequency], () => {
  const options = amountOptions.value
  if (options.length && !options.includes(quickForm.amount)) {
    quickForm.amount = options[0]!
  }
})

if (!amountOptions.value.includes(quickForm.amount) && amountOptions.value.length) {
  quickForm.amount = amountOptions.value[0]!
}

const donateLabel = computed(
  () =>
    `Donate ${quickForm.frequency === 'monthly' ? 'monthly' : 'once'} ${formatMoney(quickForm.amount, currency.value)} to SWAN`,
)

const handleSubmit = async () => {
  if (loading.value) return
  loading.value = true
  const frequency = quickForm.frequency === 'once' ? 'one-time' : 'monthly'
  const priceMap = STRIPE_PRICES[currency.value][contributionType.value]
  const priceId = priceMap[quickForm.amount] || null
  const payload = {
    name: 'Quick Donate',
    email: 'quickdonate@swan.org',
    amount: quickForm.amount,
    frequency,
    program: quickForm.program,
    currency: currency.value,
    priceId,
    note: 'Quick donate bar submission',
  }
  track('donate_intent', { ...payload, source: 'quick_bar', hasPrice: Boolean(priceId) })
  const checkout = await createCheckout(payload)
  loading.value = false

  if (checkout.ok) {
    window.location.href = checkout.url
    return
  }

  if ('mock' in checkout && checkout.mock) {
    router.push(checkout.url)
    track('donate_submit', {
      ...payload,
      id: 'MOCK',
      source: 'quick_bar',
      hasPrice: Boolean(priceId),
    })
    return
  }

  const message = ('error' in checkout && checkout.error) || 'Unable to start checkout'
  ElMessage.error(message)
  track('donate_error', {
    ...payload,
    source: 'quick_bar',
    error: message,
    hasPrice: Boolean(priceId),
  })
}
</script>
