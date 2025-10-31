export type CurrencyCode = 'USD' | 'NPR' | 'INR'

export const CURRENCIES: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: 'USD', symbol: '$', label: 'USD — US Dollar' },
  { code: 'NPR', symbol: '₨', label: 'NPR — Nepalese Rupee' },
  { code: 'INR', symbol: '₹', label: 'INR — Indian Rupee' },
]

export const STRIPE_PRICES: Record<
  CurrencyCode,
  {
    oneTime: Record<number, string>
    monthly: Record<number, string>
  }
> = {
  USD: {
    oneTime: {
      25: 'price_usd_25_onetime',
      50: 'price_usd_50_onetime',
      100: 'price_usd_100_onetime',
      250: 'price_usd_250_onetime',
    },
    monthly: {
      10: 'price_usd_10_monthly',
      25: 'price_usd_25_monthly',
      50: 'price_usd_50_monthly',
      100: 'price_usd_100_monthly',
    },
  },
  NPR: {
    oneTime: {
      1000: 'price_npr_1000_onetime',
      2500: 'price_npr_2500_onetime',
      5000: 'price_npr_5000_onetime',
      10000: 'price_npr_10000_onetime',
    },
    monthly: {
      800: 'price_npr_800_monthly',
      1500: 'price_npr_1500_monthly',
      2500: 'price_npr_2500_monthly',
      5000: 'price_npr_5000_monthly',
    },
  },
  INR: {
    oneTime: {
      1000: 'price_inr_1000_onetime',
      2500: 'price_inr_2500_onetime',
      5000: 'price_inr_5000_onetime',
      10000: 'price_inr_10000_onetime',
    },
    monthly: {
      750: 'price_inr_750_monthly',
      1500: 'price_inr_1500_monthly',
      2500: 'price_inr_2500_monthly',
      5000: 'price_inr_5000_monthly',
    },
  },
}

export function formatMoney(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}
