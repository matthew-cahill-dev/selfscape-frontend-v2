// selfscape-frontend-v2/src/components/GlobalMenu.tsx
"use client";

import { useState, useMemo } from "react";
import RightDrawer from "./RightDrawer";

/**
 * Global hamburger menu:
 * - Same visual size as the 🔍 (24×24).
 * - Sits INSIDE the 420px container at the top-right (where the search button was).
 * - We reserve space for it in each page header by adding right padding there.
 */
export default function GlobalMenu() {
  const [open, setOpen] = useState(false);

  // 420/2 = 210. Right inner edge of the container is at (50% + 210px).
  // We place the BUTTON'S CENTER 12px inside the right edge (button is 24px wide),
  // so: translateX(210px - 16px - 12px)
  //   - 16px is the pageX padding
  //   - 12px is half the button width
  const style = useMemo(
    () => ({
      left: "50%",
      transform: "translateX(calc(210px - 26px - 12px))",
      top: "16px",
    }),
    []
  );

  return (
    <>
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="fixed z-[54] flex items-center justify-center w-6 h-6 rounded-md bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition"
        style={style as React.CSSProperties}
      >
        <div className="flex flex-col justify-between w-[14px] h-[12px]">
          <span className="block w-full h-[1.5px] bg-[#333245] rounded" />
          <span className="block w-full h-[1.5px] bg-[#333245] rounded" />
          <span className="block w-full h-[1.5px] bg-[#333245] rounded" />
        </div>
      </button>

      <RightDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
