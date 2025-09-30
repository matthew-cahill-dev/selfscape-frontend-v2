// selfscape-frontend-v2/src/components/TabBar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { colors } from "@/ui/tokens";

const tabs = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/timeline", label: "Timeline", icon: "📅" },
  { href: "/social", label: "Social", icon: "💬" },
  { href: "/insights", label: "Insights", icon: "✨" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[420px] flex gap-2 px-3 pt-[9px] pb-[14px] z-50"
      style={{ background: colors.tabBg, borderTop: `1px solid ${colors.border06}` }}
    >
      {tabs.map(({ href, label, icon }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex-1 flex flex-col items-center justify-center rounded-[16px] px-2 py-2 ${
              active ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]" : ""
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                active ? "text-white" : "text-[#8a8ba0]"
              }`}
              style={{ background: active ? colors.purple : "transparent" }}
            >
              <span className="text-[16px]">{icon}</span>
            </div>
            <span
              className={`mt-1 text-[12px] leading-[16px] font-medium ${
                active ? "text-[#6e56cf]" : "text-[#8a8ba0]"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

