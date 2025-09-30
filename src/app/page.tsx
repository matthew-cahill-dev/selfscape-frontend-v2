// selfscape-frontend-v2/src/app/page.tsx
import IntroText from "@/components/IntroText";
import JournalCard from "@/components/JournalCard";
import VoiceCard from "@/components/VoiceCard";
import TabBar from "@/components/TabBar";
import { colors, spacing } from "@/ui/tokens";

export default function Page() {
  return (
    <div className="min-h-screen flex justify-center" style={{ background: colors.pageBg }}>
      <main
        className="w-[420px] flex flex-col"
        style={{
          padding: `${spacing.pageTop}px ${spacing.pageX}px calc(${spacing.pageBottom}px + env(safe-area-inset-bottom))`,
          gap: spacing.gap,
        }}
      >
        <IntroText />
        <JournalCard />
        <VoiceCard />
      </main>
      <TabBar />
    </div>
  );
}
