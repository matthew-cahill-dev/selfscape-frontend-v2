// selfscape-frontend-v2/src/app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import GlobalMenu from "@/components/GlobalMenu";

export const metadata: Metadata = {
  title: "Selfscape",
  description: "Mobile-first Selfscape frontend (v2)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        {/* Global hamburger + right drawer available on EVERY page */}
        <GlobalMenu />
      </body>
    </html>
  );
}