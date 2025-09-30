"use client";

import { useState } from "react";
import { colors, radii, shadows, type } from "@/ui/tokens";
import { createEntry } from "@/lib/api";

export default function JournalCard() {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  // TODO: replace this with the signed-in user's email (NextAuth)
  const email = "you@selfscape.app";

  async function onSave() {
    if (!text.trim()) return;
    setBusy(true);
    try {
      await createEntry({ user_email: email, text: text.trim() });
      setText("");
      // let other parts of the UI refresh (timeline, etc.)
      window.dispatchEvent(new CustomEvent("entries:refresh"));
    } catch (e: any) {
      alert(e?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className="mt-4 bg-white"
      style={{
        borderRadius: radii.card,
        boxShadow: shadows.card,
        border: `1px solid ${colors.border06}`,
      }}
    >
      {/* textarea area — padding 17/17/111 */}
      <div className="p-[17px] pb-[111px]" style={{ borderRadius: radii.card }}>
        <div
          className="rounded-[16px] border p-4"
          style={{ borderColor: colors.border06, color: colors.subText }}
        >
          <textarea
            className="w-full h-[120px] bg-transparent outline-none resize-none placeholder:text-[#8a8ba0] placeholder:opacity-60"
            placeholder="What’s on your mind today?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>

      {/* primary CTA pill (358w, pill radius, p 13/15) */}
      <div className="px-4 pb-3 -mt-[82px] flex justify-center">
        <button
          onClick={onSave}
          disabled={busy || !text.trim()}
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
          Save entry
        </button>
      </div>

      {/* Undo / Clear (text-only buttons) */}
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
