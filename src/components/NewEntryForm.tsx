// selfscape-frontend-v2/src/components/NewEntryForm.tsx

"use client";

import { useState } from "react";
import { createEntry } from "@/lib/api";

export default function NewEntryForm() {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const email = "you@selfscape.app"; // TODO: replace with NextAuth session user email

  async function onSave() {
    if (!text.trim()) return;
    setBusy(true);
    try {
      await createEntry({ user_email: email, text: text.trim() });
      setText("");
      window.dispatchEvent(new CustomEvent("entries:refresh"));
    } catch (e: any) {
      alert(e.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className="h-max rounded-card border border-border bg-card p-4">
      <h3 className="text-base font-semibold">New entry</h3>
      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write what's on your mind…"
        className="mt-3 w-full resize-none rounded-input border border-border bg-[#0F141B] p-3 text-sm outline-none placeholder:opacity-50 focus:ring-2 focus:ring-white/20"
      />
      <button
        onClick={onSave}
        disabled={busy || !text.trim()}
        className="mt-3 h-10 w-full rounded-btn bg-accent text-black text-sm font-semibold disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save entry"}
      </button>
    </aside>
  );
}
