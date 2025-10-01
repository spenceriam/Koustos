export async function sendMagicLink(_: { email: string; url: string }) {
  throw new Error("Magic link email sending is disabled in MVP");
}
