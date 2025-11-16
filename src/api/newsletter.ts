export type Signup = { email: string; name?: string };

export async function subscribe({ email, name }: Signup): Promise<{ ok: true } | { ok: false; error: string }> {
  const response = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });

  if (!response.ok) {
    return { ok: false, error: "Newsletter sign-up failed." };
  }

  const result = await response.json();
  return result;
}
