import Stripe from 'stripe'

const AMOUNTS = {
  USD: { oneTime: [25, 50, 100, 250], monthly: [10, 25, 50, 100] },
  NPR: { oneTime: [1000, 2500, 5000, 10000], monthly: [800, 1500, 2500, 5000] },
  INR: { oneTime: [500, 1000, 2500, 5000], monthly: [250, 500, 1000, 2500] },
} as const

type Currency = keyof typeof AMOUNTS

type Output = Record<Currency, { oneTime: Record<number, string>; monthly: Record<number, string> }>

async function main() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY missing in environment')

  const stripe = new Stripe(key, { apiVersion: '2024-06-20' })

  const out: Output = {
    USD: { oneTime: {}, monthly: {} },
    NPR: { oneTime: {}, monthly: {} },
    INR: { oneTime: {}, monthly: {} },
  }

  for (const currency of Object.keys(AMOUNTS) as Currency[]) {
    for (const amt of AMOUNTS[currency].oneTime) {
      const product = await stripe.products.create({
        name: `${currency} One-time Donation ${amt}`,
        metadata: { type: 'donation', frequency: 'one-time', currency },
      })
      const price = await stripe.prices.create({
        currency: currency.toLowerCase(),
        unit_amount: Math.round(amt * 100),
        product: product.id,
      })
      out[currency].oneTime[amt] = price.id
    }

    for (const amt of AMOUNTS[currency].monthly) {
      const product = await stripe.products.create({
        name: `${currency} Monthly Donation ${amt}`,
        metadata: { type: 'donation', frequency: 'monthly', currency },
      })
      const price = await stripe.prices.create({
        currency: currency.toLowerCase(),
        unit_amount: Math.round(amt * 100),
        recurring: { interval: 'month' },
        product: product.id,
      })
      out[currency].monthly[amt] = price.id
    }
  }

  console.log('\nPaste this object into STRIPE_PRICES in src/config/stripe.ts:\n')
  console.log(JSON.stringify(out, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
