// selfscape-frontend-v2/src/app/entry/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserEmail } from "@/hooks/useUserEmail";
import { colors, spacing } from "@/ui/tokens";
import TabBar from "@/components/TabBar";

// If you already have getEntry in "@/lib/api", import it instead of fetchEntryDirect
// import { getEntry } from "@/lib/api";

type Entry = {
  id: string;
  text?: string;
  raw_text?: string;
  timestamp: string;
  key_ideas?: string[];
  emotion?: string;
  overall_tone?: string;
};

async function fetchEntryDirect(id: string, email?: string): Promise<Entry | null> {
  // Fallback direct fetch in case you don’t have getEntry() in lib/api yet.
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set");
  const url = new URL(`${base.replace(/\/$/, "")}/entry/${encodeURIComponent(id)}`);
  if (email) url.searchParams.set("user_email", email);

  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) return null;
  return (await res.json()) as Entry;
}

export default function EntryPage() {
  const { id } = useParams<{ id: string }>();
  const email = useUserEmail();
  const router = useRouter();

  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function run() {
      if (!id) return;
      setLoading(true);
      setErr(null);
      try {
        // If you have getEntry, prefer:
        // const e = await getEntry(id as string, email ?? undefined);
        const e = await fetchEntryDirect(String(id), email ?? undefined);
        if (!alive) return;
        if (!e) {
          setErr("Not found");
          setEntry(null);
        } else {
          setEntry(e);
        }
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "Failed to load entry");
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, [id, email]);

  return (
    <div className="min-h-screen flex justify-center" style={{ background: colors.pageBg }}>
      <main
        className="w-[420px] flex flex-col"
        style={{
          padding: `${spacing.pageTop}px ${spacing.pageX}px calc(${spacing.pageBottom}px + env(safe-area-inset-bottom))`,
          gap: 12,
        }}
      >
        <header className="flex items-center justify-between" style={{ height: 36 }}>
          <button
            onClick={() => router.back()}
            className="text-[#8a8ba0] hover:opacity-80"
            aria-label="Go back"
          >
            ← Back
          </button>
          <h1 className="font-semibold" style={{ fontSize: 16, color: "#121224" }}>
            Entry
          </h1>
          <div className="w-10" />
        </header>

        {loading && <p className="text-sm text-gray-500">Loading entry…</p>}

        {!loading && err === "Not found" && (
          <div className="mt-4 rounded-xl border p-4 bg-white" style={{ borderColor: "rgba(18,18,36,0.06)" }}>
            <p className="text-sm text-[#8a8ba0]">This entry doesn’t exist or you don’t have access.</p>
          </div>
        )}

        {!loading && err && err !== "Not found" && (
          <div className="mt-4 rounded-xl border p-4 bg-white" style={{ borderColor: "rgba(18,18,36,0.06)" }}>
            <p className="text-sm text-red-600">Error: {err}</p>
          </div>
        )}

        {!loading && entry && (
          <article
            className="rounded-2xl border bg-white p-4"
            style={{ borderColor: "rgba(18,18,36,0.06)" }}
          >
            <time className="text-xs text-[#8a8ba0]">
              {new Date(entry.timestamp).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </time>

            <h2 className="mt-2 text-[14px] font-semibold text-[#121224]">Journal Entry</h2>
            <p className="mt-2 text-[14px] text-[#333245] whitespace-pre-wrap">
              {(entry.text || entry.raw_text || "").trim() || "—"}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Info label="Emotion" value={entry.emotion} />
              <Info label="Tone" value={entry.overall_tone || "-"} />
              {entry.key_ideas?.length ? (
                <div className="col-span-2">
                  <div className="text-xs font-semibold text-[#8a8ba0]">Key Ideas</div>
                  <ul className="mt-1 list-disc pl-5 text-[14px] text-[#333245]">
                    {entry.key_ideas.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </article>
        )}
      </main>

      <TabBar />
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl border p-2 bg-white" style={{ borderColor: "rgba(18,18,36,0.06)" }}>
      <div className="text-xs font-semibold text-[#8a8ba0]">{label}</div>
      <div className="text-[14px] text-[#121224] mt-0.5">{value || "-"}</div>
    </div>
  );
}
