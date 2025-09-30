import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Selfscape",
  description: "Mobile-first Selfscape frontend (v2)"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
