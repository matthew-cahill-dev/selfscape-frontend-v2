import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F14",
        card: "rgba(255,255,255,0.05)",
        border: "rgba(255,255,255,0.10)",
        text: "#FFFFFF",
        textSub: "rgba(255,255,255,0.70)",
        accent: "#FFFFFF"
      },
      borderRadius: {
        card: "24px",
        btn: "12px",
        badge: "10px",
        input: "12px"
      }
    }
  },
  plugins: []
} satisfies Config;
