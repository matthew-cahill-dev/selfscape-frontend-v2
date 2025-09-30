// selfscape-frontend-v2/src/components/IntroText.tsx

import { colors, type } from "@/ui/tokens";

export default function IntroText() {
  return (
    <header>
      <h1
        className="font-semibold"
        style={{ fontSize: type.h1.size, lineHeight: `${type.h1.line}px`, color: colors.text }}
      >
        Selfscape
      </h1>

      <p
        className="mt-1 font-semibold"
        style={{ color: colors.subText, fontSize: type.introA.size, lineHeight: `${type.introA.line}px` }}
      >
        Your personal space for reflection, insight, and emotional growth.
      </p>

      <p
        className="mt-1 font-semibold"
        style={{
          color: colors.subText,
          opacity: type.introB.opacity,
          fontSize: type.introB.size,
          lineHeight: `${type.introB.line}px`,
        }}
      >
        Understand yourself more deeply — one entry at a time.
      </p>
    </header>
  );
}
