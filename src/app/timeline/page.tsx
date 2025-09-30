// selfscape-frontend-v2/src/app/timeline/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import TimelineEntryCard from "@/components/TimelineEntryCard";
import TabBar from "@/components/TabBar";
import { spacing, colors } from "@/ui/tokens";
import { listEntries } from "@/lib/api";
import { useUserEmail } from "@/hooks/useUserEmail";

type Entry = {
  id: string;
  text?: string;
  raw_text?: string;
  timestamp: string;
  key_ideas?: string[];
  emotion?: string;
  overall_tone?: string;
};

export default function TimelinePage() {
  const email = useUserEmail();
  const [items, setItems] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      setLoading(true);
      try {
        const data = await listEntries(email, 50, "desc");
        setItems(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    run();
    const onRefresh = () => run();
    window.addEventListener("entries:refresh", onRefresh);
    return () => window.removeEventListener("entries:refresh", onRefresh);
  }, [email]);

  // Group by "Month YYYY"
  const groups = useMemo(() => groupByMonth(items), [items]);

  return (
    <div className="min-h-screen flex justify-center" style={{ background: colors.pageBg }}>
      <main
        className="w-[420px] flex flex-col"
        style={{
          padding: `${spacing.pageTop}px ${spacing.pageX}px calc(${spacing.pageBottom}px + env(safe-area-inset-bottom))`,
          gap: 12,
        }}
      >
        <Header />
        <ChipsRow />

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : Object.entries(groups).length === 0 ? (
          <p className="text-sm text-gray-500 mt-4">No entries yet.</p>
        ) : (
          Object.entries(groups).map(([monthLabel, group]) => (
            <section key={monthLabel} className="mt-[6px]">
              <DividerHeader label={monthLabel} />
              <div className="flex flex-col gap-[12px] mt-[10px]">
                {group.entries.map((e) => (
                  <TimelineEntryCard key={e.id} entry={e} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>
      <TabBar />
    </div>
  );
}

function Header() {
  return (
    <div
      className="flex items-center justify-between"
      style={{ height: 36, alignSelf: "stretch" }}
    >
      <div>
        <span
          className="font-semibold"
          style={{ fontSize: 16, lineHeight: "20px", color: "#121224" }}
        >
          Timeline
        </span>
        <p className="text-xs font-semibold text-[#8a8ba0]">
          Only you can see this.
        </p>
      </div>
      <div className="flex gap-3 text-[#8a8ba0] text-xl">
        <span>🔍</span>
        <span>⚙️</span>
      </div>
    </div>
  );
}

function ChipsRow() {
  const Chip = ({ label }: { label: string }) => (
    <div className="px-3 py-1 rounded-full border border-[#1212240f] bg-white text-sm font-medium text-[#333245]">
      {label}
    </div>
  );
  return (
    <div className="flex gap-2 flex-wrap">
      <Chip label="Type: Text/Voice" />
      <Chip label="Emotion" />
      <Chip label="Tone" />
      <Chip label="Tags" />
      <Chip label="Date Range" />
    </div>
  );
}

function DividerHeader({ label }: { label: string }) {
  return (
    <div
      className="sticky top-0 z-10 bg-[rgba(254,254,255,0.9)] backdrop-blur-sm"
      style={{ width: 388, padding: "6px 0 7px", marginBottom: 10 }}
    >
      <span
        className="font-semibold underline"
        style={{ fontSize: 13, color: "#8a8ba0" }}
      >
        {label}
      </span>
    </div>
  );
}

/* helpers */
function groupByMonth(entries: Entry[]) {
  const map: Record<string, { entries: Entry[] }> = {};
  for (const e of entries) {
    const d = new Date(e.timestamp);
    const key = d.toLocaleString(undefined, { month: "long", year: "numeric" });
    map[key] ||= { entries: [] };
    map[key].entries.push(e);
  }
  return map;
}
