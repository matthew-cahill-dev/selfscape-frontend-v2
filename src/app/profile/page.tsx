// selfscape-frontend-v2/src/app/profile/page.tsx

"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  return (
    <div className="min-h-screen flex justify-center bg-[#0B0F14] text-white">
      <main className="w-[420px] p-4">
        <h1 className="text-xl font-semibold mb-4">Profile</h1>
        <div className="space-y-2">
          <div>Status: {status}</div>
          <div>Email: {session?.user?.email ?? "—"}</div>
          {status === "authenticated" ? (
            <button className="mt-3 rounded-md bg-white/10 px-3 py-2" onClick={() => signOut()}>
              Sign out
            </button>
          ) : (
            <button className="mt-3 rounded-md bg-white/10 px-3 py-2" onClick={() => signIn("google")}>
              Sign in with Google
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
