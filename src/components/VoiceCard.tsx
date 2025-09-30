"use client";

import { useEffect, useRef, useState } from "react";
import { colors, radii, shadows, type } from "@/ui/tokens";
import { createEntry, transcribeAudio } from "@/lib/api";

export default function VoiceCard() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  // TODO: replace with the logged-in email
  const email = "you@selfscape.app";

  useEffect(() => {
    if (!recording) return;
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000) as any;
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [recording]);

  async function startRecording() {
    setSeconds(0);
    chunksRef.current = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";
    const mr = new MediaRecorder(stream, { mimeType: mime });
    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    mr.start(250); // small chunks for responsiveness
    setRecording(true);
  }

  async function stopAndSave() {
    const mr = mediaRecorderRef.current;
    if (!mr) return;

    const stopped: Promise<void> = new Promise((resolve) => {
      mr.onstop = () => resolve();
    });
    mr.stop();
    setRecording(false);
    await stopped;

    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    if (!blob.size) {
      alert("No audio captured");
      return;
    }

    try {
      // 1) Transcribe server-side
      const { transcript } = await transcribeAudio(blob);

      // 2) Save as a text entry (ties into your /entry/ summarization + embedding)
      await createEntry({ user_email: email, text: (transcript || "").trim() });

      // notify & reset
      alert("Saved!");
      setSeconds(0);
      window.dispatchEvent(new CustomEvent("entries:refresh"));
    } catch (e: any) {
      alert(e?.message ?? "Audio save failed");
    }
  }

  function onClickRecord() {
    if (!recording) startRecording();
    else stopAndSave();
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
      {/* Aura */}
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
          onClick={onClickRecord}
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

      {/* Redo / Preview (text-only; wire later if needed) */}
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
