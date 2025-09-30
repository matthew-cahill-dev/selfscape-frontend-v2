// selfscape-frontend-v2/src/ui/tokens.ts

// Zeplin tokens + updated periwinkle-purple gradient background
export const colors = {
  pageBg: "linear-gradient(135deg, #b8c7ff 0%, #d6ccff 100%)", 
  // slightly deeper purple tones:
  // #b8c7ff = periwinkle with a purple bias
  // #d6ccff = soft lavender-purple

  text: "#0B0F14", // dark text for contrast
  subText: "#8a8ba0",
  white: "#ffffff",
  purple: "#6e56cf",
  border06: "rgba(18,18,36,0.06)", // #121224 @ 6%
  tabBg: "#f7f7fb",

  // solid fallback if you need a single color
  periwinklePurple: "#b8c7ff",
};

export const radii = {
  card: 24,
  pill: 48,
  btnSm: 12,
  input: 16,
};

export const shadows = {
  card: "0 6px 24px rgba(0,0,0,0.06)",
  btn: "0 2px 8px rgba(0,0,0,0.04)",
};

export const spacing = {
  pageX: 16,
  pageTop: 16,
  pageBottom: 92,
  cardPadA: 15,
  cardPadB: 19,
  gap: 10,
};

export const type = {
  h1: { size: 22, line: 28, weight: 600 },
  introA: { size: 15, line: 22, weight: 600 },
  introB: { size: 13, line: 18, weight: 600, opacity: 0.9 },
  btn: { size: 14, line: 17, weight: 600 },
  fine: { size: 13, line: 16, weight: 600 },
};
