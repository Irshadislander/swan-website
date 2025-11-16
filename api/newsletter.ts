import type { VercelRequest, VercelResponse } from '@vercel/node'

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY
const MAILCHIMP_DC = process.env.MAILCHIMP_DC
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed')
  }

  try {
    const { email, name } = req.body ?? {}
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ ok: false, error: 'Please provide a valid email.' })
    }

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_DC || !MAILCHIMP_AUDIENCE_ID) {
      return res.status(500).json({ ok: false, error: 'Newsletter service unavailable.' })
    }

    const endpoint = `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`
    const payload = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: typeof name === 'string' ? name : '',
      },
    }

    const auth = Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (response.status === 200 || response.status === 201) {
      return res.status(200).json({ ok: true })
    }

    const result = await response.json().catch(() => ({}))
    return res.status(response.status).json({
      ok: false,
      error: result?.detail || 'Unable to subscribe at this time.',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return res.status(500).json({ ok: false, error: message })
  }
}
