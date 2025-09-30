// selfscape-frontend-v2/src/components/EntryCard.tsx

import type { Entry } from "@/types";  // ✅ pull from types.ts

export default function EntryCard({ e }: { e: Entry }) {
  return (
    <article className="rounded-card border border-border bg-card p-4 hover:bg-white/10 transition">
      <div className="flex items-center justify-between">
        <time className="text-[12px] leading-[18px] opacity-70">
          {e.timestamp ? new Date(e.timestamp).toLocaleString() : "—"}
        </time>
        <span className="text-[12px] leading-[18px] rounded-badge bg-border px-2 py-[2px]">
          {e.emotion ?? e.overall_tone ?? "—"}
        </span>
      </div>
      <p className="mt-3 text-[14px] leading-[22px] opacity-95">
        {e.text ?? e.insight ?? ""}
      </p>
    </article>
  );
}
