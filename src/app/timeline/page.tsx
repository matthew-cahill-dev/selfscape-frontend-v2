"use client";

import { useEffect, useMemo, useState } from "react";
import TimelineEntryCard from "@/components/TimelineEntryCard";
import TabBar from "@/components/TabBar";
import { spacing, colors } from "@/ui/tokens";
import { listEntries } from "@/lib/api";
import { useUserEmail } from "@/hooks/useUserEmail";
import SearchDialog from "@/components/SearchDialog";

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
  const [searchOpen, setSearchOpen] = useState(false);

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
        <Header onOpenSearch={() => setSearchOpen(true)} />
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
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} email={email} />
    </div>
  );
}

function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
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
        <p className="text-xs font-semibold text-[#8a8ba0]">Only you can see this.</p>
      </div>

      {/* Reserve space on the RIGHT for the floating GlobalMenu (24px) + some gap */}
      <div className="relative flex items-center text-[#8a8ba0] pr-[20px]">
        {/* SEARCH: fixed 24x24 box so it matches the menu button; nudge vertically with translate/top */}
        <button
          aria-label="Search"
          onClick={onOpenSearch}
          className="hover:opacity-80 mr-[8px] relative flex items-center justify-center w-6 h-6 rounded-md bg-white border border-gray-200 shadow-sm -translate-y-[6px]"
          // OR use: style={{ top: '1px' }} with "relative" instead of translate
        >
          <span className="text-[16px] leading-none">🔍</span>
        </button>
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
    <div className="sticky top-[8px] z-10 bg-transparent">
      <h3 className="text-[13px] font-semibold text-[#8a8ba0] underline">{label}</h3>
    </div>
  );
}

/* helpers */
function groupByMonth(entries: Entry[]) {
  const map: Record<string, { entries: Entry[] }> = {};
  for (const e of entries) {
    const d = new Date(e.timestamp);
    const key = d.toLocaleString(undefined, { month: "long", year: "numeric" });
    (map[key] ||= { entries: [] }).entries.push(e);
  }
  return map;
}
