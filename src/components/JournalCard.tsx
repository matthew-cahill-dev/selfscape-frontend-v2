// selfscape-frontend-v2/src/components/JournalCard.tsx
"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { colors, radii, shadows, type } from "@/ui/tokens";
import { createEntry } from "@/lib/api";

export default function JournalCard() {
  const { data: session, status } = useSession();
  const email = session?.user?.email ?? null;

  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSave() {
    if (!email) {
      signIn("google");
      return;
    }
    if (!text.trim()) return;

    setBusy(true);
    try {
      await createEntry({ user_email: email, text: text.trim() });
      setText("");
      // let other parts of the UI (timeline) refresh
      window.dispatchEvent(new CustomEvent("entries:refresh"));
    } catch (e: any) {
      alert(e?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  }

  const disabled = status === "loading" || !email;

  return (
    <section
      className="mt-4 bg-white"
      style={{
        borderRadius: radii.card,
        boxShadow: shadows.card,
        border: `1px solid ${colors.border06}`,
      }}
    >
      {/* textarea area — padding 17/17/111 to match Zeplin */}
      <div className="p-[17px] pb-[111px]" style={{ borderRadius: radii.card }}>
        <div
          className="rounded-[16px] border p-4"
          style={{ borderColor: colors.border06, color: colors.subText }}
        >
          <textarea
            className="w-full h-[120px] bg-transparent outline-none resize-none placeholder:text-[#8a8ba0] placeholder:opacity-60"
            placeholder={
              status === "loading"
                ? "Checking sign-in…"
                : email
                ? "What’s on your mind today?"
                : "Sign in to start journaling…"
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* primary CTA pill (358w, pill radius, p 13/15) */}
      <div className="px-4 pb-3 -mt-[82px] flex justify-center">
        <button
          onClick={onSave}
          disabled={busy || !text.trim() || disabled}
          className="w-[358px] text-white font-semibold disabled:opacity-60"
          style={{
            borderRadius: radii.pill,
            padding: "13px 15px",
            background: colors.purple,
            boxShadow: shadows.btn,
            fontSize: type.btn.size,
            lineHeight: `${type.btn.line}px`,
          }}
        >
          {busy ? "Saving…" : email ? "Save entry" : "Sign in to save"}
        </button>
      </div>

      {/* Undo / Clear */}
      <div className="px-4 pb-4 grid grid-cols-2 gap-3">
        <BtnOutline label="Undo" onClick={() => setText("")} />
        <BtnOutline label="Clear" onClick={() => setText("")} />
      </div>
    </section>
  );
}

function BtnOutline({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-[174px] bg-white font-semibold flex items-center justify-center"
      style={{
        padding: 11,
        borderRadius: 12,
        border: `1px solid ${colors.border06}`,
        color: "#333245",
        fontSize: 14,
        lineHeight: "17px",
      }}
    >
      {label}
    </button>
  );
}
