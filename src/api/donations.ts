export type DonationFrequency = "one-time" | "monthly";

export type DonationPayload = {
  name: string;
  email: string;
  amount: number;
  frequency: DonationFrequency;
  program: string;
  note?: string;
};

export type DonationRecord = DonationPayload & {
  id: string;
  ts: number;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const store = new Map<string, DonationRecord>();

export async function submitDonation(
  payload: DonationPayload
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  await delay(900);
  if (!payload.email.includes("@") || payload.amount <= 0) {
    return { ok: false, error: "Invalid donation details supplied." };
  }
  const success = Math.random() <= 0.9;
  if (!success) {
    return { ok: false, error: "Payment service temporarily unavailable" };
  }
  const record = await createDonation(payload);
  return { ok: true, id: record.id };
}

export async function createDonation(payload: DonationPayload): Promise<DonationRecord> {
  await delay(200);
  const id = `D_${Date.now()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const record: DonationRecord = { ...payload, id, ts: Date.now() };
  store.set(id, record);
  return record;
}

export async function getDonation(id: string): Promise<DonationRecord | null> {
  await delay(200);
  return store.get(id) ?? null;
}
