export type CurrencyCode = 'USD' | 'NPR' | 'INR'

export const CURRENCIES: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: 'USD', symbol: '$', label: 'USD — US Dollar' },
  { code: 'NPR', symbol: '₨', label: 'NPR — Nepalese Rupee' },
  { code: 'INR', symbol: '₹', label: 'INR — Indian Rupee' },
]

const getEnvPrice = (currency: CurrencyCode, schedule: 'ONETIME' | 'MONTHLY', amount: number) => {
  const key = `VITE_STRIPE_PRICE_${currency}_${schedule}_${amount}`
  const env = import.meta.env as Record<string, string | undefined>
  return env[key] ?? ''
}

const buildPriceMap = (currency: CurrencyCode, schedule: 'ONETIME' | 'MONTHLY', amounts: number[]) =>
  amounts.reduce<Record<number, string>>((acc, amount) => {
    acc[amount] = getEnvPrice(currency, schedule, amount)
    return acc
  }, {})

export const STRIPE_PRICES: Record<
  CurrencyCode,
  {
    oneTime: Record<number, string>
    monthly: Record<number, string>
  }
> = {
  USD: {
    oneTime: buildPriceMap('USD', 'ONETIME', [25, 50, 100, 250]),
    monthly: buildPriceMap('USD', 'MONTHLY', [10, 25, 50, 100]),
  },
  NPR: {
    oneTime: buildPriceMap('NPR', 'ONETIME', [1000, 2500, 5000, 10000]),
    monthly: buildPriceMap('NPR', 'MONTHLY', [800, 1500, 2500, 5000]),
  },
  INR: {
    oneTime: buildPriceMap('INR', 'ONETIME', [500, 1000, 2500, 5000]),
    monthly: buildPriceMap('INR', 'MONTHLY', [250, 500, 1000, 2500]),
  },
}

export function formatMoney(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}
