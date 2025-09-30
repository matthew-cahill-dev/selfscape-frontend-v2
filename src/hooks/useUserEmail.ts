// src/hooks/useUserEmail.ts
"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

// Returns the signed-in user's email.
// If not signed in, will trigger Google sign-in automatically (or you can remove that behavior).
export function useUserEmail() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Auto sign-in; or show a button elsewhere
      signIn("google");
    }
  }, [status]);

  return session?.user?.email ?? "";
}

