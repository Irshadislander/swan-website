import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const { subject, html } = req.body ?? {};

  try {
    const key = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO;

    if (!key || !to) {
      return res.status(500).json({ ok: false, error: "Email service not configured." });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SWAN <no-reply@swan.org>",
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return res.status(200).json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return res.status(500).json({ ok: false, error: message });
  }
}
