"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export function useAuthenticatedEmail() {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const session = await authClient.session.get();
        if (!mounted) return;
        setEmail(session?.user?.email ?? "");
      } catch (error) {
        console.error("Failed to load authenticated user", error);
        if (mounted) setEmail("");
      }
    }

    loadSession();
    const maybeUnsub = authClient.session?.subscribe?.((session: any) => {
      if (!mounted) return;
      setEmail(session?.user?.email ?? "");
    });

    return () => {
      mounted = false;
      if (typeof maybeUnsub === "function") {
        try { maybeUnsub(); } catch {}
      }
    };
  }, []);

  return email;
}
