import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed')
  }

  try {
    const secret = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!secret || !webhookSecret) {
      return res.status(200).json({ ok: false, mock: true })
    }

    const stripe = new Stripe(secret, { apiVersion: '2024-06-20' })
    const signature = req.headers['stripe-signature'] as string | undefined

    if (!signature) {
      return res.status(400).json({ ok: false, error: 'Missing Stripe signature header' })
    }

    const rawBody = await getRawBody(req)
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const email = session.customer_details?.email || session.customer_email
      const amount = ((session.amount_total ?? session.amount_subtotal) || 0) / 100
      const currency = (session.currency || 'usd').toUpperCase()
      const frequency = session.mode === 'subscription' ? 'monthly' : 'one-time'
      const program = session.metadata?.program || 'General Fund'

      const resendKey = process.env.RESEND_API_KEY
      const from = process.env.RESEND_FROM_EMAIL || 'SWAN <no-reply@swan.org>'

      if (resendKey && email) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from,
              to: [email],
              subject: 'Thank you for your donation to SWAN',
              html: `
                <h2>Thank you!</h2>
                <p>We received your ${frequency} donation of <strong>${amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} ${currency}</strong> to ${program}.</p>
                <p>Receipt ID: ${session.id}</p>
              `,
            }),
          })
        } catch (error) {
          console.error('Failed to send Resend email', error)
        }
      }
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return res.status(400).json({ ok: false, error: message })
  }
}
