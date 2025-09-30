// selfscape-frontend-v2/src/components/TimelineEntryCard.tsx
import { format } from "date-fns";

type Entry = {
  id: string;
  text?: string;
  raw_text?: string;
  timestamp: string;
  key_ideas?: string[];
  emotion?: string;
  overall_tone?: string;
};

export default function TimelineEntryCard({ entry }: { entry: Entry }) {
  const time = format(new Date(entry.timestamp), "HH:mm");
  const text = entry.text || entry.raw_text || "";

  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#0000000f] p-4 mb-4 w-[388px]">
      <div className="flex items-center text-xs text-[#8a8ba0] mb-2">
        <span>{time}</span>
        <span className="mx-1">·</span>
        <span>📝 Text</span>
      </div>
      <p className="text-[#121224] text-base font-semibold leading-snug mb-3">{text}</p>
      <div className="flex flex-wrap gap-2">
        {entry.key_ideas?.map((tag) => <Tag key={tag} label={tag} />)}
        {entry.emotion && <Tag label={entry.emotion} />}
        {entry.overall_tone && <Tag label={entry.overall_tone} />}
      </div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="px-2 py-1 rounded-full bg-[#f4f4f7] text-xs text-[#333245] font-medium">{label}</span>
  );
}
