import { colors } from "@/ui/tokens";

export default function TabBar() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[420px] flex gap-2 px-3 pt-[9px] pb-[14px]"
      style={{ background: colors.tabBg, borderTop: `1px solid ${colors.border06}` }}
    >
      <Tab label="Home" active>
        <path d="M12 3l8 7v9a2 2 0 0 1-2 2h-3v-6H9v6H6a2 2 0 0 1-2-2v-9l8-7z" />
      </Tab>
      <Tab label="Timeline">
        <path d="M4 19h16M4 5h16M8 5v14M16 5v14" />
      </Tab>
      <Tab label="Social">
        <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
      </Tab>
      <Tab label="Insights">
        <path d="M12 3v18M5 12h14" />
      </Tab>
      <Tab label="Profile">
        <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-5 0-9 3-9 6v1h18v-1c0-3-4-6-9-6z" />
      </Tab>
    </nav>
  );
}

function Tab({
  label,
  children,
  active = false,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <a
      href="#"
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
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          {children}
        </svg>
      </div>
      <span
        className={`mt-1 text-[12px] leading-[16px] font-medium ${
          active ? "text-[#6e56cf]" : "text-[#8a8ba0]"
        }`}
      >
        {label}
      </span>
    </a>
  );
}
