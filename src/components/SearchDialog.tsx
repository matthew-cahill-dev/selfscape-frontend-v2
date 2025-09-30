// selfscape-frontend-v2/src/components/SearchDialog.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { searchEntries } from "@/lib/api";
import { colors } from "@/ui/tokens";

type Entry = {
  id: string;
  text?: string;
  raw_text?: string;
  timestamp: string;
  key_ideas?: string[];
  emotion?: string;
  overall_tone?: string;
};

export default function SearchDialog({
  open,
  onClose,
  email,
  onSelectEntry,
}: {
  open: boolean;
  onClose: () => void;
  email: string | null;
  onSelectEntry?: (e: Entry) => void;
}) {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Entry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      setQ("");
      setResults([]);
      setBusy(false);
    }
  }, [open]);

  async function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email) return;
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setBusy(true);
    try {
      const { entries } = await searchEntries(email, q.trim());
      setResults(entries || []);
    } catch (err: any) {
      alert(err?.message ?? "Search failed");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* dimmer */}
      <button aria-label="Close search" onClick={onClose} className="absolute inset-0 bg-black/30" />
      {/* panel */}
      <div
        className="absolute left-1/2 top-10 w-[420px] -translate-x-1/2 rounded-2xl border bg-white p-3 shadow-xl"
        style={{ borderColor: "rgba(18,18,36,0.06)" }}
      >
        <form onSubmit={runSearch} className="flex items-center gap-2">
          <span className="text-xl">🔍</span>
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={email ? "Search your journal…" : "Sign in to search"}
            disabled={!email}
            className="flex-1 outline-none bg-transparent text-[15px] placeholder:text-[#8a8ba0]"
          />
          <button
            type="submit"
            disabled={!email || busy}
            className="px-3 py-1 rounded-full text-white text-sm font-semibold disabled:opacity-60"
            style={{ background: colors.purple }}
          >
            {busy ? "Searching…" : "Search"}
          </button>
        </form>

        <div className="mt-3 max-h-[60vh] overflow-auto pr-1">
          {results.length === 0 && q.trim() && !busy ? (
            <p className="text-sm text-[#8a8ba0] px-2 py-3">No results.</p>
          ) : null}

          {results.map((r) => {
            const text = r.text || r.raw_text || "";
            const when = new Date(r.timestamp).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });
            return (
              <button
                key={r.id}
                onClick={() => {
                  onSelectEntry?.(r);
                  onClose();
                }}
                className="w-full text-left rounded-xl border mb-2 p-3 hover:bg-[#f7f7fb]"
                style={{ borderColor: "rgba(18,18,36,0.06)" }}
              >
                <div className="text-xs text-[#8a8ba0]">{when}</div>
                <div className="mt-1 text-[14px] font-semibold text-[#121224] line-clamp-3">
                  {text}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
