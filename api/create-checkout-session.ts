import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed')
  }

  try {
    const {
      priceId,
      amount,
      currency = 'USD',
      program,
      frequency = 'one-time',
      email,
      name,
    } = req.body ?? {}
    const secret = process.env.STRIPE_SECRET_KEY
    const site = process.env.VITE_SITE_URL || 'http://localhost:5173'

    if (!priceId) {
      const numericAmount = Number(amount)
      if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ ok: false, error: 'Invalid amount' })
      }
    }

    if (!secret) {
      return res.status(200).json({
        ok: false,
        mock: true,
        url: '/donate/success?id=MOCK',
      })
    }

    const stripe = new Stripe(secret, { apiVersion: '2024-06-20' })
    const mode = frequency === 'monthly' ? 'subscription' : 'payment'
    const session = await stripe.checkout.sessions.create({
      mode,
      success_url: `${site}/donate/success?id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/donate`,
      customer_email: email,
      metadata: {
        program: program ?? 'general',
        frequency,
        name: name ?? '',
        currency: String(currency).toUpperCase(),
      },
      line_items: priceId
        ? [
            {
              price: String(priceId),
              quantity: 1,
            },
          ]
        : [
            {
              price_data: {
                currency: String(currency).toLowerCase(),
                product_data: {
                  name: `${frequency === 'monthly' ? 'Monthly' : 'One-time'} gift to ${program ?? 'SWAN'}`,
                },
                unit_amount: Math.round(Number(amount) * 100),
              },
              quantity: 1,
            },
          ],
    })

    return res.status(200).json({ ok: true, url: session.url })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return res.status(500).json({ ok: false, error: message })
  }
}
