export type Signup = { email: string; name?: string };

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function subscribe({ email, name }: Signup): Promise<{ ok: true } | { ok: false; error: string }> {
  await delay(700);
  if (!email.includes("@")) {
    return { ok: false, error: "Please enter a valid email." };
  }
  // TODO: integrate with real provider (Mailchimp/Elastic Email) via API proxy or edge function
  console.info("newsletter-subscribe", { email, name });
  return { ok: true };
}
