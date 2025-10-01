const required = [
  "NEXT_PUBLIC_URL",
  "ENCRYPTION_KEY",
  "OPENAI_API_KEY",
];

export function assertEnv() {
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
  if ((process.env.ENCRYPTION_KEY || "").length !== 64) {
    throw new Error("ENCRYPTION_KEY must be 32-byte hex (64 chars)");
  }
}


