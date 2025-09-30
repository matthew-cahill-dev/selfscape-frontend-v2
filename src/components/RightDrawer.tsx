// selfscape-frontend-v2/src/components/RightDrawer.tsx
"use client";

import Link from "next/link";

export default function RightDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div className={`fixed inset-0 z-[55] ${open ? "" : "pointer-events-none"}`}>
      {/* scrim */}
      <button
        aria-label="Close menu"
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      {/* sheet */}
      <aside
        className={`absolute right-0 top-0 h-full w-[300px] bg-white shadow-2xl border-l transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ borderColor: "rgba(18,18,36,0.06)" }}
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold text-[#121224]">Menu</h3>
        </div>
        <nav className="flex flex-col">
          <MenuLink href="/">Home</MenuLink>
          <MenuLink href="/timeline">Timeline</MenuLink>
          <MenuLink href="/social">Social</MenuLink>
          <MenuLink href="/saved-insights">Insights</MenuLink>
          <MenuLink href="/profile">Profile</MenuLink>
          <hr className="my-3 border-t" style={{ borderColor: "rgba(18,18,36,0.06)" }} />
          {/* Extra items beyond bottom navbar */}
          <MenuLink href="/group">Group Recording</MenuLink>
          <MenuLink href="/settings">Settings</MenuLink>
        </nav>
      </aside>
    </div>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-4 py-3 text-[15px] font-medium text-[#333245] hover:bg-[#f7f7fb]"
    >
      {children}
    </Link>
  );
}
