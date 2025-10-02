// selfscape-frontend-v2/src/components/SocialPostCard.tsx
"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { Reflection, commentReflection, listComments, type Comment } from "@/lib/api-social";

function fixDoubleEncoding(url?: string | null) {
  if (!url) return url;
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

  // --- comment state ---
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Derive the visible count: when the drawer is open, use loaded comments length; otherwise use post.comments_count
  const visibleCount = open ? comments.length : (post.comments_count ?? 0);

  // Load comments on open
  useEffect(() => {
    if (!open) return;
    setLoadingComments(true);
    listComments(post.id)
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch((e) => console.error(e))
      .finally(() => setLoadingComments(false));
  }, [open, post.id]);

  // Sort comments oldest -> newest (flip comparator for newest-first if you prefer)
  const ordered = useMemo(() => {
    return [...comments].sort((a, b) => {
      const at = new Date(a.created_at ?? a.timestamp).getTime();
      const bt = new Date(b.created_at ?? b.timestamp).getTime();
      return at - bt;
    });
  }, [comments]);

  async function handleSubmitComment() {
    const text = input.trim();
    if (!text) return;
    setSubmitting(true);
    try {
      const newComment = await commentReflection(post.id, text);

      // Normalize to the expected shape in case the backend returns a minimal body
      const normalized: Comment = {
        id: String(newComment.id),
        reflection_id: String(newComment.reflection_id ?? post.id),
        user_email: String(newComment.user_email ?? ""),
        content: String(newComment.content ?? text),
        timestamp: String(newComment.timestamp ?? new Date().toISOString()),
        created_at: String(newComment.created_at ?? newComment.timestamp ?? new Date().toISOString()),
        name: newComment.name ?? null,
        avatar_url: newComment.avatar_url ?? null,
      };

      setComments((prev) => [...prev, normalized]);
      setInput("");
    } catch (e) {
      console.error(e);
      alert("Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  }

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
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")}
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
          onClick={() => setOpen((v) => !v)}
        >
          💬 <span>{visibleCount}</span>
        </button>

        <button
          className="h-10 rounded-xl border bg-white px-4 text-[13px] font-semibold text-[#121224] flex items-center justify-center"
          style={{ borderColor: "rgba(18,18,36,0.06)" }}
          onClick={() => navigator.share?.({ text: post.text }).catch(() => {})}
        >
          ↗ Share
        </button>
      </div>

      {/* comments */}
      {open && (
        <div className="mt-3 space-y-3">
          {loadingComments ? (
            <p className="text-sm text-gray-500">Loading comments…</p>
          ) : ordered.length === 0 ? (
            <p className="text-sm text-gray-500">No comments yet.</p>
          ) : (
            ordered.map((c) => {
              const cAvatar = fixDoubleEncoding(c.avatar_url ?? undefined);
              const cWhen = new Date(c.created_at ?? c.timestamp).toLocaleString();
              const displayName = c.name || (c.user_email ? c.user_email.split("@")[0] : "You");
              return (
                <div
                  key={c.id}
                  className="rounded-xl border p-2"
                  style={{ borderColor: "rgba(18,18,36,0.06)" }}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-[#eee] shrink-0">
                      {cAvatar ? (
                        <Image
                          src={cAvatar}
                          alt=""
                          width={28}
                          height={28}
                          className="w-7 h-7 object-cover"
                          onError={(e) =>
                            ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")
                          }
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-semibold text-[#121224] truncate">
                        {displayName}
                      </div>
                      <div className="text-[12px] text-[#8a8ba0]">{cWhen}</div>
                      <div className="mt-1 text-[14px] text-[#121224] whitespace-pre-wrap break-words">
                        {c.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* comment box */}
          <div
            className="rounded-2xl border p-2"
            style={{ borderColor: "rgba(18,18,36,0.06)" }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write a comment…"
              className="w-full resize-none rounded-xl border p-2 text-[14px] text-[#121224] placeholder-[#8a8ba0] outline-none bg-white"
              style={{ borderColor: "rgba(18,18,36,0.06)" }}
              rows={3}
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                className="h-9 rounded-xl border bg-white px-4 text-[13px] font-semibold text-[#121224]"
                style={{ borderColor: "rgba(18,18,36,0.06)" }}
                onClick={() => setOpen(false)}
              >
                Close
              </button>
              <button
                disabled={submitting || !input.trim()}
                onClick={handleSubmitComment}
                className="h-9 rounded-xl px-4 text-[13px] font-semibold text-white disabled:opacity-50"
                style={{ backgroundColor: "#6e56cf" }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
