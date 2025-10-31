<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { createCheckout } from '@/api/payments'
import { track } from '@/plugins/analytics'
import { useRouter } from 'vue-router'
import { CURRENCIES, STRIPE_PRICES, formatMoney, type CurrencyCode } from '@/config/stripe'

const frequencies: Array<{ label: string; value: 'once' | 'monthly' }> = [
  { label: 'One-time', value: 'once' },
  { label: 'Monthly', value: 'monthly' },
]

const programs = [
  { label: 'Education', value: 'education' },
  { label: 'Community Health', value: 'health' },
  { label: 'Women’s Leadership', value: 'empowerment' },
]

const form = reactive({
  frequency: 'once' as 'once' | 'monthly',
  amount: 50,
  program: 'education',
  name: '',
  email: '',
})

const currency = ref<CurrencyCode>('USD')
const selectedAmount = ref(form.amount)
const nameError = ref('')
const emailError = ref('')
const liveMessage = ref('')
const nameId = 'donation-name'
const emailId = 'donation-email'
const nameErrorId = 'donation-name-error'
const emailErrorId = 'donation-email-error'
const loading = ref(false)

const router = useRouter()

const whyPoints = [
  'Transparent reporting with open program budgets.',
  'Local coordinators in every program district.',
  'Programs co-designed with community leaders.',
]

const contributionType = computed(() => (form.frequency === 'monthly' ? 'monthly' : 'oneTime'))
const amountOptions = computed<number[]>(() => {
  const entries = STRIPE_PRICES[currency.value][contributionType.value]
  return Object.keys(entries)
    .map((key) => Number(key))
    .sort((a, b) => a - b)
})

watch([currency, () => form.frequency], () => {
  const options = amountOptions.value
  if (options.length && !options.includes(form.amount)) {
    form.amount = options[0]!
  }
  selectedAmount.value = form.amount
})

watch(
  () => form.amount,
  (value: number) => {
    selectedAmount.value = value
  },
)

if (!amountOptions.value.includes(form.amount) && amountOptions.value.length) {
  form.amount = amountOptions.value[0]!
  selectedAmount.value = form.amount
}

function setAmount(value: number) {
  selectedAmount.value = value
  form.amount = value
}

function validate() {
  nameError.value = form.name.trim() ? '' : 'Name is required'
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  emailError.value = emailPattern.test(form.email.trim()) ? '' : 'Enter a valid email'
  if (nameError.value || emailError.value) {
    liveMessage.value = 'Please fix the highlighted fields before submitting.'
  } else {
    liveMessage.value = ''
  }
  return !nameError.value && !emailError.value
}

async function submit() {
  if (loading.value) return
  if (!validate()) {
    ElMessage.error('Please fix the highlighted fields.')
    return
  }

  loading.value = true
  const currencyCode = currency.value
  const frequencyValue = form.frequency === 'once' ? 'one-time' : 'monthly'
  const priceMap = STRIPE_PRICES[currencyCode][contributionType.value]
  const priceId = priceMap[form.amount]
  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    amount: form.amount,
    frequency: frequencyValue,
    program: form.program,
    currency: currencyCode,
    priceId,
  } as const

  track('donate_intent', { ...payload, source: 'donate_page', hasPrice: Boolean(priceId) })
  const checkout = await createCheckout(payload)
  loading.value = false

  if (checkout.ok) {
    window.location.href = checkout.url
    return
  }

  if ('mock' in checkout && checkout.mock) {
    track('donate_submit', {
      ...payload,
      id: 'MOCK',
      source: 'donate_page',
      hasPrice: Boolean(priceId),
    })
    router.push(checkout.url)
    return
  }

  const message = ('error' in checkout && checkout.error) || 'Unable to start checkout'
  ElMessage.error(message)
  liveMessage.value = message
  track('donate_error', {
    ...payload,
    error: message,
    source: 'donate_page',
    hasPrice: Boolean(priceId),
  })
}
</script>

<template>
  <section class="py-12 sm:py-16">
    <div class="container-irr grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      <el-form
        :model="form"
        label-position="top"
        class="card p-6 space-y-5"
        @submit.prevent="submit"
        aria-describedby="donate-live-region"
      >
        <div>
          <p class="kicker mb-3" id="donation-frequency-label">Choose frequency</p>
          <el-radio-group
            v-model="form.frequency"
            size="large"
            class="flex flex-wrap gap-2"
            aria-labelledby="donation-frequency-label"
            :disabled="loading"
          >
            <el-radio-button v-for="freq in frequencies" :key="freq.value" :label="freq.value">
              {{ freq.label }}
            </el-radio-button>
          </el-radio-group>
        </div>

        <div>
          <p class="kicker mb-3" id="donation-currency-label">Select currency</p>
          <el-select
            v-model="currency"
            size="large"
            class="w-full sm:w-64"
            aria-labelledby="donation-currency-label"
            :disabled="loading"
          >
            <el-option v-for="c in CURRENCIES" :key="c.code" :label="c.label" :value="c.code" />
          </el-select>
        </div>

        <div>
          <div class="kicker mb-3 flex items-center gap-2" id="donation-amount-label">
            <span>Select an amount</span>
            <span v-if="form.frequency === 'monthly'" class="pill text-xs">Monthly</span>
          </div>
          <div class="flex flex-wrap gap-2" role="group" aria-labelledby="donation-amount-label">
            <el-button
              v-for="amount in amountOptions"
              :key="amount"
              size="large"
              :class="[selectedAmount === amount ? 'btn btn-gradient' : 'btn']"
              :aria-pressed="selectedAmount === amount"
              :disabled="loading"
              @click="setAmount(amount)"
              type="button"
            >
              {{ formatMoney(amount, currency) }}
            </el-button>
          </div>
        </div>

        <div>
          <p class="kicker mb-3" id="donation-program-label">Program designation</p>
          <el-select
            v-model="form.program"
            placeholder="Choose a program"
            size="large"
            class="w-full"
            aria-labelledby="donation-program-label"
            :disabled="loading"
          >
            <el-option
              v-for="program in programs"
              :key="program.value"
              :label="program.label"
              :value="program.value"
            />
          </el-select>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-slate-700" :for="nameId">Full name</label>
            <input
              :id="nameId"
              v-model="form.name"
              type="text"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm"
              placeholder="Asha Tamang"
              :aria-describedby="nameError ? nameErrorId : undefined"
              autocomplete="name"
              :disabled="loading"
            />
            <p v-if="nameError" :id="nameErrorId" class="text-xs text-red-500 mt-1">
              {{ nameError }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700" :for="emailId">Email</label>
            <input
              :id="emailId"
              v-model="form.email"
              type="email"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 shadow-sm"
              placeholder="asha@swan.org"
              :aria-describedby="emailError ? emailErrorId : undefined"
              autocomplete="email"
              :disabled="loading"
            />
            <p v-if="emailError" :id="emailErrorId" class="text-xs text-red-500 mt-1">
              {{ emailError }}
            </p>
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-gradient w-full disabled:opacity-70"
          aria-label="Submit donation form"
          :aria-busy="loading"
          :disabled="loading"
        >
          {{ loading ? 'Processing…' : 'Submit donation' }}
        </button>
        <p class="sr-only" id="donate-live-region" aria-live="polite">{{ liveMessage }}</p>
        <p class="text-xs text-slate-500">
          Online card processing launches soon. Bank transfers in Nepal are available today—our team
          will follow up within one business day.
        </p>
      </el-form>

      <aside class="card p-6 space-y-4 self-start">
        <h2 class="font-heading text-xl text-brand-900">Why SWAN?</h2>
        <p class="text-slate-600">
          Every program is community-led and audited with full transparency. Your gift keeps nurses,
          teachers, and women leaders in the field.
        </p>
        <ul class="space-y-2 text-sm text-slate-700">
          <li v-for="point in whyPoints" :key="point" class="flex gap-3">
            <span class="pill bg-accent-100 border-accent-200">✔</span>
            <span>{{ point }}</span>
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>
