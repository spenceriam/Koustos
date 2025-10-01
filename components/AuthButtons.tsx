"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function AuthButtons() {
  const [error, setError] = useState<string>("");
  async function signIn(provider: "google" | "github") {
    await authClient.signIn.social({ provider });
  }

  async function passwordSignIn(formData: FormData) {
    setError("");
    const email = formData.get("email");
    const password = formData.get("password");
    if (typeof email === "string" && typeof password === "string") {
      try {
        await authClient.signIn.password({ email, password });
      } catch (err: any) {
        const msg = String(err?.message || "");
        // If account does not exist, guide the user to sign up
        if (/not\s*found|no\s*user|does\s*not\s*exist/i.test(msg)) {
          setError("Account not found. Please create an account below.");
        } else {
          setError("Sign in failed. Check your credentials or create an account.");
        }
      }
    }
  }

  async function passwordSignUp(formData: FormData) {
    setError("");
    const email = formData.get("email");
    const password = formData.get("password");
    if (typeof email === "string" && typeof password === "string") {
      try {
        await authClient.signUp.password({ email, password });
      } catch (err: any) {
        setError("Sign up failed. Try a different email or password.");
      }
    }
  }

  async function signOut() {
    await authClient.signOut();
  }

  return (
    <div className="space-y-3">
      <form action={passwordSignIn} className="flex flex-col gap-2">
        <label className="text-sm font-medium">Email/password</label>
        <input type="email" name="email" required className="w-full rounded border px-3 py-2" placeholder="maintainer@example.com" />
        <input type="password" name="password" required className="w-full rounded border px-3 py-2" placeholder="Your password" />
        <button type="submit" className="rounded bg-[var(--fg)] px-3 py-2 text-white">Sign in</button>
      </form>
      <form action={passwordSignUp} className="flex flex-col gap-2">
        <label className="text-sm font-medium">Create an account</label>
        <input type="email" name="email" required className="w-full rounded border px-3 py-2" placeholder="maintainer@example.com" />
        <input type="password" name="password" required className="w-full rounded border px-3 py-2" placeholder="Choose a password" />
        <button type="submit" className="rounded border px-3 py-2">Sign up</button>
      </form>
      {error && (
        <p className="text-xs text-red-600" role="alert" aria-live="assertive">{error}</p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 rounded border px-3 py-2 text-sm"
          onClick={() => signIn("google")}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
