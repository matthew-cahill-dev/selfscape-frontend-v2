// selfscape-frontend-v2/src/app/social/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { colors, spacing } from "@/ui/tokens";
import TabBar from "@/components/TabBar";
import { useUserEmail } from "@/hooks/useUserEmail";
import SocialPostCard from "@/components/SocialPostCard";
import SocialComposer from "@/components/SocialComposer";
import { supabase } from "@/lib/supabase";
import { uploadToSupabase } from "@/lib/storage";
import {
  listSocialFeed,
  createReflectionJSON,
  likeReflection,
  type Reflection,
} from "@/lib/api-social";

type TabKey = "following" | "all" | "mine";

export default function SocialPage() {
  const email = useUserEmail();
  const [tab, setTab] = useState<TabKey>("all");
  const [items, setItems] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const rows = await listSocialFeed({ tab, email: email ?? undefined });
        if (alive) setItems(Array.isArray(rows) ? rows : []);
      } catch (e) {
        console.error(e);
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [tab, email]);

async function handlePost(text: string, image?: File) {
  if (!email || !text.trim()) return;
  setPosting(true);
  try {
    let image_url: string | undefined;

    if (image) {
      // Only require Supabase auth if we actually need to upload a file
      const { data: userData, error } = await supabase.auth.getUser();
      if (error || !userData?.user?.id) throw error || new Error("Not signed in to Supabase");
      const uid = userData.user.id;

      const { publicUrl } = await uploadToSupabase(image, "posts", uid);
      image_url = publicUrl;
    }

    const created = await createReflectionJSON({
      user_email: email,
      text: text.trim(),
      image_url,
    });

    setItems(prev => [created, ...(Array.isArray(prev) ? prev : [])]);
    window.dispatchEvent(new Event("social:refresh"));
  } catch (e) {
    console.error("Post failed:", e);
    alert((e as Error)?.message || "Failed to post. Please try again.");
  } finally {
    setPosting(false);
  }
}


  async function handleLike(id: string) {
    try {
      await likeReflection(id);
      setItems((prev) =>
        (Array.isArray(prev) ? prev : []).map((p) =>
          p.id === id ? { ...p, likes: (p.likes ?? 0) + 1 } : p
        )
      );
    } catch (e) {
      console.error(e);
    }
  }

  const tabDefs = useMemo(
    () => [
      { key: "following" as const, label: "Following" },
      { key: "all" as const, label: "All" },
      { key: "mine" as const, label: "My posts" },
    ],
    []
  );

  return (
    <div className="min-h-screen flex justify-center" style={{ background: colors.pageBg }}>
      <main
        className="w-[420px] flex flex-col"
        style={{
          padding: `${spacing.pageTop}px ${spacing.pageX}px calc(${spacing.pageBottom}px + env(safe-area-inset-bottom))`,
          gap: 12,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-semibold" style={{ fontSize: 16, color: "#121224" }}>
            Social
          </h1>
          <div className="flex items-center gap-2">
            <button
              aria-label="Search"
              className="w-9 h-9 rounded-xl border bg-white flex items-center justify-center"
              style={{ borderColor: "rgba(18,18,36,0.06)" }}
              onClick={() => alert("TODO: open social search")}
            >
              <span className="text-[16px]">🔍</span>
            </button>
            <button
              aria-label="Open composer"
              className="w-9 h-9 rounded-xl border bg-white flex items-center justify-center"
              style={{ borderColor: "rgba(18,18,36,0.06)" }}
              onClick={() => document.getElementById("composer")?.scrollIntoView({ behavior: "smooth" })}
            >
              <span className="text-[16px]">✏️</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex items-center justify-center gap-[6px] p-[5px] rounded-[48px] border bg-white"
          style={{ borderColor: "rgba(18,18,36,0.06)" }}
        >
          {tabDefs.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`h-9 px-4 rounded-[48px] text-sm font-semibold ${
                  active ? "text-white" : "text-[#8a8ba0]"
                }`}
                style={{ background: active ? "#6e56cf" : "transparent" }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Composer */}
        <SocialComposer id="composer" disabled={!email} posting={posting} onPost={handlePost} />

        {/* Feed */}
        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : (Array.isArray(items) ? items.length : 0) === 0 ? (
          <p className="text-sm text-[#8a8ba0]">No posts yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {(Array.isArray(items) ? items : []).map((p) => (
              <SocialPostCard key={p.id} post={p} onLike={() => handleLike(p.id)} />
            ))}
          </div>
        )}
      </main>

      <TabBar />
    </div>
  );
}
