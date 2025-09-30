/* src/app/record/page.tsx */
"use client";

export default function RecordScreen() {
  return (
    <div className="min-h-screen flex justify-center bg-[#0B0F14] text-[#FFFFFF]">
      {/* Outer container: fixed width 420, padding: 16px 16px 92px, gap: 10 */}
      <div
        className="w-[420px] flex flex-col"
        style={{ padding: "16px 16px 92px", gap: "10px" }}
      >
        {/* Intro text blocks */}
        <p
          className="font-semibold text-left text-[#8a8ba0]"
          style={{ width: 329.4, fontFamily: "Inter, sans-serif", fontSize: 15, lineHeight: "normal" }}
        >
          Your personal space for reflection, insight, and
          <br />emotional growth.
        </p>

        <p
          className="font-semibold text-left text-[#8a8ba0]"
          style={{
            width: 345.9,
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            lineHeight: "normal",
            opacity: 0.9,
          }}
        >
          Understand yourself more deeply — one entry at a time.
        </p>

        {/* Card 1: Background+Border+Shadow (auto width, h: 285, p: 15, r: 24) */}
        <div
          className="w-full"
          style={{
            height: 285,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: 15,
            borderRadius: 24,
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(18, 18, 36, 0.06)",
            boxShadow: "0 6px 24px 0 rgba(0,0,0,0.06)",
          }}
        >
          {/* Inner Background+Border (auto w, min-h:148, p: 17 top/left/right, 111 bottom, r: 24, opacity .9) */}
          <div
            className="w-full"
            style={{
              minHeight: 148,
              padding: "17px 17px 111px",
              borderRadius: 24,
              backgroundColor: "#FFFFFF",
              opacity: 0.9,
              border: "1px solid rgba(18,18,36,0.06)",
            }}
          />
          {/* Primary button (Background+Shadow): w 358, p 13x15, r 48, purple, center */}
          <div className="w-full flex justify-center">
            <button
              className="flex items-center justify-center text-white"
              style={{
                width: 358,
                padding: "13px 15px",
                borderRadius: 48,
                backgroundColor: "#6e56cf",
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
              }}
            >
              {/* Button text not specified in this block; leaving blank by spec */}
              <span className="sr-only">Primary action</span>
            </button>
          </div>

          {/* Two outline buttons: 174px each, p 11, r 12, gap 8, border rgba(18,18,36,0.06) */}
          <div className="w-full grid grid-cols-2 gap-3">
            <button
              className="flex items-center justify-center"
              style={{
                width: 174,
                padding: 11,
                borderRadius: 12,
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(18,18,36,0.06)",
                color: "#333245",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 14,
                lineHeight: "17px",
              }}
            >
              Undo
            </button>
            <button
              className="flex items-center justify-center"
              style={{
                width: 174,
                padding: 11,
                borderRadius: 12,
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(18,18,36,0.06)",
                color: "#333245",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 14,
                lineHeight: "17px",
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Card 2: Background+Border+Shadow (auto w, fixed h: 377, p:19, r:24) */}
        <div
          className="w-full"
          style={{
            height: 377,
            padding: 19,
            borderRadius: 24,
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(18,18,36,0.06)",
            boxShadow: "0 6px 24px 0 rgba(0,0,0,0.06)",
          }}
        >
          {/* Concentric circles block (centered) */}
          <div className="w-full flex flex-col items-center">
            <div
              className="flex items-center justify-center"
              style={{
                width: 180,
                height: 180,
                borderRadius: 90,
                backgroundColor: "#6e56cf",
                opacity: 0.14,
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  backgroundColor: "#6e56cf",
                  opacity: 0.18,
                }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: "#6e56cf",
                    opacity: 0.22,
                  }}
                >
                  {/* Vector: 26x26 white stroke 2.2px */}
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      border: "2.2px solid #FFFFFF",
                      borderRadius: 6,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Speaking time text */}
            <p
              className="mt-4 font-semibold text-[#8a8ba0]"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                lineHeight: "16px",
              }}
            >
              Speaking time detected: 0s
            </p>
          </div>

          {/* Purple CTA: 350px, p 13x15, r 48, center, label “Stop & Save” */}
          <div className="w-full flex justify-center mt-4">
            <button
              className="flex items-center justify-center text-white"
              style={{
                width: 350,
                padding: "13px 15px",
                borderRadius: 48,
                backgroundColor: "#6e56cf",
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  lineHeight: "17px",
                }}
              >
                Stop &amp; Save
              </span>
            </button>
          </div>

          {/* Two outline buttons (Redo / Preview): 170px each, p:11, r:12 */}
          <div className="w-full grid grid-cols-2 gap-3 mt-3">
            <button
              className="flex items-center justify-center"
              style={{
                width: 170,
                padding: 11,
                borderRadius: 12,
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(18,18,36,0.06)",
                color: "#333245",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 14,
                lineHeight: "17px",
              }}
            >
              Redo
            </button>
            <button
              className="flex items-center justify-center"
              style={{
                width: 170,
                padding: 11,
                borderRadius: 12,
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(18,18,36,0.06)",
                color: "#333245",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 14,
                lineHeight: "17px",
              }}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Bottom overlay bar: fixed w 420, h auto(91), padding 9 12 14, top border, bg #f7f7fb */}
        <footer
          className="w-[420px]"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "9px 12px 14px",
            borderTop: "1px solid rgba(18,18,36,0.06)",
            backgroundColor: "#f7f7fb",
          }}
        >
          {/* Add any footer content/controls here if needed */}
        </footer>
      </div>
    </div>
  );
}
