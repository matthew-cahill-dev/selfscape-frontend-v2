"use client";

import { useState, useEffect } from "react";
import { colors, radii, shadows, type } from "@/ui/tokens";

export default function VoiceCard() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  function toggleRecording() {
    if (!recording) {
      setSeconds(0);
      setRecording(true);
      // TODO: start MediaRecorder & audio stream here
    } else {
      setRecording(false);
      // TODO: stop recorder and upload to backend
      alert("Audio stopped & saved (wire to backend)");
    }
  }

  return (
    <section
      className="mt-4 bg-white p-[19px]"
      style={{
        height: 377,
        borderRadius: radii.card,
        boxShadow: shadows.card,
        border: `1px solid ${colors.border06}`,
      }}
    >
      {/* Aura + mic */}
      <div className="w-full flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          <div
            className={`rounded-full flex items-center justify-center transition-all ${
              recording ? "animate-pulse" : ""
            }`}
            style={{
              width: 180,
              height: 180,
              background: colors.purple,
              opacity: 0.14,
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 140,
                height: 140,
                background: colors.purple,
                opacity: 0.18,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 100,
                height: 100,
                background: colors.purple,
                opacity: 0.22,
              }}
            />
            {/* mic glyph substitute */}
            <div className="absolute w-[26px] h-[26px] border-[2.2px] border-white rounded-md" />
          </div>
        </div>

        <p
          className="mt-4 font-semibold"
          style={{ color: colors.subText, fontSize: type.fine.size, lineHeight: `${type.fine.line}px` }}
        >
          Speaking time detected: {seconds}s
        </p>
      </div>

      {/* Record / Stop & Save */}
      <div className="w-full flex justify-center mt-4">
        <button
          onClick={toggleRecording}
          className="w-[350px] text-white font-semibold"
          style={{
            padding: "13px 15px",
            borderRadius: radii.pill,
            background: colors.purple,
            boxShadow: shadows.btn,
            fontSize: type.btn.size,
            lineHeight: `${type.btn.line}px`,
          }}
        >
          {recording ? "Stop & Save" : "Record"}
        </button>
      </div>

      {/* Redo / Preview (text-only) */}
      <div className="w-full grid grid-cols-2 gap-3 mt-3">
        <BtnOutline label="Redo" />
        <BtnOutline label="Preview" />
      </div>
    </section>
  );
}

function BtnOutline({ label }: { label: string }) {
  return (
    <button
      className="w-[170px] bg-white font-semibold flex items-center justify-center"
      style={{
        padding: 11,
        borderRadius: 12,
        border: `1px solid ${colors.border06}`,
        color: "#333245",
        fontSize: 14,
        lineHeight: "17px",
      }}
    >
      {label}
    </button>
  );
}
