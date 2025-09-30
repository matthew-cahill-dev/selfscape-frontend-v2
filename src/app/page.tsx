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
          padding: `${spacing.pageTop}px ${spacing.pageX}px ${spacing.pageBottom}px`,
          gap: spacing.gap,
        }}
      >
        <IntroText />
        <JournalCard />
        <VoiceCard />
        <TabBar />
      </main>
    </div>
  );
}
