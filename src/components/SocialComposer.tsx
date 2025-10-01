// selfscape-frontend-v2/src/components/SocialComposer.tsx
"use client";

import { useRef, useState } from "react";
import { colors } from "@/ui/tokens";

export default function SocialComposer({
  id,
  disabled,
  posting,
  onPost,
}: {
  id?: string;
  disabled?: boolean;
  posting?: boolean;
  onPost: (text: string, image?: File) => Promise<void> | void;
}) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div
      id={id}
      className="rounded-3xl border bg-white p-3 shadow-sm"
      style={{ borderColor: "rgba(0,0,0,0.06)" }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share a reflection…"
        disabled={disabled || posting}
        className="w-full resize-none outline-none bg-transparent text-[16px] font-semibold text-[#121224] placeholder:text-[#8a8ba0] min-h-[88px]"
      />

      {image ? (
        <div className="mt-2 text-[12px] text-[#8a8ba0]">
          Selected: <span className="font-semibold text-[#333245]">{image.name}</span>
          <button
            className="ml-2 underline"
            onClick={() => setImage(undefined)}
            disabled={posting}
          >
            remove
          </button>
        </div>
      ) : null}

      <div className="mt-2 flex items-center justify-end gap-2">
        {/* Add photo */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="h-10 px-3 rounded-xl border bg-white text-sm font-semibold text-[#333245]"
          style={{ borderColor: "rgba(18,18,36,0.06)" }}
          disabled={disabled || posting}
        >
          📷 Add photo
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setImage(f);
          }}
        />

        {/* Cancel */}
        <button
          type="button"
          onClick={() => {
            setText("");
            setImage(undefined);
          }}
          className="h-10 px-4 rounded-xl border bg-white text-sm font-semibold text-[#121224]"
          style={{ borderColor: "rgba(18,18,36,0.06)" }}
          disabled={disabled || posting || (!text && !image)}
        >
          Cancel
        </button>

        {/* Post */}
        <button
          type="button"
          onClick={async () => {
            if (!text.trim() && !image) return;
            await onPost(text, image);
            setText("");
            setImage(undefined);
          }}
          className="h-10 px-4 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
          style={{ background: colors.purple }}
          disabled={disabled || posting || (!text.trim() && !image)}
        >
          {posting ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  );
}
