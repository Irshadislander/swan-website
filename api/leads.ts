import type { VercelRequest, VercelResponse } from '@vercel/node'

type LeadRecord = {
  id: string
  type: string
  data: Record<string, unknown>
  ts: number
}

const leads: LeadRecord[] = []

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed')
  }

  try {
    const { type, data } = req.body ?? {}
    if (!type || typeof type !== 'string') {
      return res.status(400).json({ ok: false, error: 'Lead type is required' })
    }
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ ok: false, error: 'Lead payload missing' })
    }

    const record: LeadRecord = {
      id: `L_${Date.now()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      type,
      data,
      ts: Date.now(),
    }
    leads.push(record)

    if (process.env.NODE_ENV !== 'production') {
      console.info('lead:create', record)
    }

    return res.status(200).json({ ok: true, id: record.id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return res.status(500).json({ ok: false, error: message })
  }
}
