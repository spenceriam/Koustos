"use client";

import { authClient } from "@/lib/auth-client";

export function AuthButtons() {
  async function signIn(provider: "google" | "github") {
    await authClient.signIn.social({ provider });
  }

  async function signOut() {
    await authClient.signOut();
  }

  async function sendMagicLink(formData: FormData) {
    const email = formData.get("email");
    if (typeof email === "string" && email.trim()) {
      await authClient.signIn.magicLink({ email: email.trim() });
    }
  }

  return (
    <div className="space-y-3">
      <form action={sendMagicLink} className="flex flex-col gap-2">
        <label className="text-sm font-medium">Email sign-in link</label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded border px-3 py-2"
          placeholder="maintainer@example.com"
        />
        <button type="submit" className="rounded bg-[var(--fg)] px-3 py-2 text-white">
          Send magic link
        </button>
      </form>
      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 rounded border px-3 py-2 text-sm"
          onClick={() => signIn("google")}
        >
          Continue with Google
        </button>
        <button
          type="button"
          className="flex-1 rounded border px-3 py-2 text-sm"
          onClick={() => signIn("github")}
        >
          Continue with GitHub
        </button>
      </div>
      <button type="button" onClick={signOut} className="text-sm text-slate-500 underline">
        Sign out
      </button>
    </div>
  );
}
