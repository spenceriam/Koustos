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
    const unsubscribe = authClient.session.subscribe((session) => {
      if (!mounted) return;
      setEmail(session?.user?.email ?? "");
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return email;
}
