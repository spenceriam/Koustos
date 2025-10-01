"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function AuthButtons() {
  const [error, setError] = useState<string>("");
  const [showSignup, setShowSignup] = useState<boolean>(false);
  const [lastEmail, setLastEmail] = useState<string>("");

  async function signIn(provider: "google" | "github") {
    setError("");
    try {
      await authClient.signIn.social({ provider });
    } catch (err: any) {
      const msg = String(err?.message || "");
      if (/not\s*found|no\s*user|does\s*not\s*exist/i.test(msg)) {
        setError("Account not found. Please create an account below.");
        setShowSignup(true);
      } else {
        setError("Google sign in failed. Try again or create an account.");
      }
    }
  }

  async function passwordSignIn(formData: FormData) {
    setError("");
    const email = formData.get("email");
    const password = formData.get("password");
    if (typeof email === "string" && typeof password === "string") {
      setLastEmail(email);
      try {
        await authClient.signIn.password({ email, password });
      } catch (err: any) {
        const msg = String(err?.message || "");
        // If account does not exist, guide the user to sign up
        if (/not\s*found|no\s*user|does\s*not\s*exist/i.test(msg)) {
          setError("Account not found. Please create an account below.");
          setShowSignup(true);
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
      {/* Google first */}
      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 rounded border px-3 py-2 text-sm"
          onClick={() => signIn("google")}
        >
          Continue with Google
        </button>
      </div>

      {/* OR divider */}
      <div className="my-1 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-500">OR</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Email/password sign-in */}
      <form action={passwordSignIn} className="flex flex-col gap-2">
        <label className="text-sm font-medium">Email/password</label>
        <input type="email" name="email" required className="w-full rounded border px-3 py-2" placeholder="maintainer@example.com" />
        <input type="password" name="password" required className="w-full rounded border px-3 py-2" placeholder="Your password" />
        <button type="submit" className="rounded bg-[var(--fg)] px-3 py-2 text-white">Sign in</button>
      </form>

      {/* Create account shows only when sign-in says user not found */}
      {showSignup && (
        <form action={passwordSignUp} className="flex flex-col gap-2">
          <label className="text-sm font-medium">Create an account</label>
          <input type="email" name="email" defaultValue={lastEmail} required className="w-full rounded border px-3 py-2" placeholder="maintainer@example.com" />
          <input type="password" name="password" required className="w-full rounded border px-3 py-2" placeholder="Choose a password" />
          <button type="submit" className="rounded border px-3 py-2">Sign up</button>
        </form>
      )}
      {error && (
        <p className="text-xs text-red-600" role="alert" aria-live="assertive">{error}</p>
      )}
    </div>
  );
}
