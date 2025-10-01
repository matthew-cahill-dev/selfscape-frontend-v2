// selfscape-frontend-v2/src/components/SocialPostCard.tsx
"use client";

import Image from "next/image";
import { Reflection } from "@/lib/api-social";

function fixDoubleEncoding(url?: string | null) {
  if (!url) return url;
  // If we see %2540, turn it back into %40
  return url.replace(/%2540/gi, "%40");
}

export default function SocialPostCard({
  post,
  onLike,
}: {
  post: Reflection;
  onLike?: () => void;
}) {
  const when = new Date(post.created_at).toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
  });

  const avatar = fixDoubleEncoding(post.avatar_url);

  return (
    <article
      className="rounded-3xl border bg-white p-[13px] shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
      style={{ borderColor: "rgba(0,0,0,0.06)" }}
    >
      {/* header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-[34px] h-[34px] rounded-full overflow-hidden bg-[#eee]">
            {avatar ? (
              <Image
                src={avatar}
                alt=""
                width={34}
                height={34}
                className="w-[34px] h-[34px] object-cover"
                // If the image genuinely 404s, fall back gracefully:
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  // hide the broken image area
                  el.style.visibility = "hidden";
                }}
              />
            ) : null}
          </div>
          <div className="leading-tight">
            <div className="text-[14px] font-semibold text-[#121224]">
              {post.name || "Anonymous"}
            </div>
            <div className="text-[12px] font-semibold text-[#8a8ba0]">
              @{post.user_email?.split("@")[0] ?? "user"} • {when}
            </div>
          </div>
        </div>
        <button
          aria-label="More"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#8a8ba0] hover:bg-[#f7f7fb]"
          title="More"
        >
          ⋯
        </button>
      </div>

      {/* body */}
      <div className="mt-2">
        <p className="text-[16px] font-semibold text-[#121224] whitespace-pre-wrap">
          {post.text}
        </p>
        {post.image_url ? (
          <div
            className="mt-3 overflow-hidden rounded-2xl border"
            style={{ borderColor: "rgba(18,18,36,0.06)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image_url} alt="" className="w-full h-auto object-cover" />
          </div>
        ) : null}
      </div>

      {/* actions */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          onClick={onLike}
          className="h-10 rounded-xl border bg-white px-4 text-[13px] font-semibold text-[#121224] flex items-center justify-center gap-2"
          style={{ borderColor: "rgba(18,18,36,0.06)" }}
        >
          ❤️ <span>{post.likes ?? 0}</span>
        </button>
        <button
          className="h-10 rounded-xl border bg-white px-4 text-[13px] font-semibold text-[#121224] flex items-center justify-center gap-2"
          style={{ borderColor: "rgba(18,18,36,0.06)" }}
          onClick={() => alert("TODO: open comments")}
        >
          💬 <span>{post.comments_count ?? 0}</span>
        </button>
        <button
          className="h-10 rounded-xl border bg-white px-4 text-[13px] font-semibold text-[#121224] flex items-center justify-center"
          style={{ borderColor: "rgba(18,18,36,0.06)" }}
          onClick={() => navigator.share?.({ text: post.text }).catch(() => {})}
        >
          ↗ Share
        </button>
      </div>
    </article>
  );
}

