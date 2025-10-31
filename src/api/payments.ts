export type CheckoutPayload = {
  amount?: number | string
  program?: string
  frequency?: 'one-time' | 'monthly' | string
  email?: string
  name?: string
  currency?: string
  priceId?: string | null
  note?: string
}

export type CheckoutResponse =
  | { ok: true; url: string }
  | { ok: false; error?: string; mock?: false }
  | { ok: false; mock: true; url: string }

export async function createCheckout(payload: CheckoutPayload): Promise<CheckoutResponse> {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    return { ok: false, error: 'Network error' }
  }

  return response.json()
}
