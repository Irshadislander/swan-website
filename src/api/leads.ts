export type LeadInput = {
  type: string
  data: Record<string, unknown>
}

export type LeadResponse =
  | { ok: true; id: string }
  | { ok: false; error?: string }

export async function saveLead(input: LeadInput): Promise<LeadResponse> {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    return { ok: false, error: 'Network error' }
  }

  return response.json()
}
