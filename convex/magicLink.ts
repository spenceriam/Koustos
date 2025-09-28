import { Resend } from "resend";

export async function sendMagicLink({ email, url }: { email: string; url: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY must be set in the Convex environment");
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "bugs@koustos.dev",
    to: email,
    subject: "Sign in to Koustos",
    html: `
      <p>Use the link below to sign in:</p>
      <p><a href="${url}">${url}</a></p>
      <p>If you did not request this link you can ignore this email.</p>
    `,
  });
}
