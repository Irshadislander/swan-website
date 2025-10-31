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
      25: '',
      50: '',
      100: '',
      250: '',
    },
    monthly: {
      10: '',
      25: '',
      50: '',
      100: '',
    },
  },
  NPR: {
    oneTime: {
      1000: '',
      2500: '',
      5000: '',
      10000: '',
    },
    monthly: {
      800: '',
      1500: '',
      2500: '',
      5000: '',
    },
  },
  INR: {
    oneTime: {
      500: '',
      1000: '',
      2500: '',
      5000: '',
    },
    monthly: {
      250: '',
      500: '',
      1000: '',
      2500: '',
    },
  },
}

export function formatMoney(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}
