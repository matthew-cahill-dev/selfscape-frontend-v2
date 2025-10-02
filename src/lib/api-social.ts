// selfscape-frontend-v2/src/lib/api-social.ts

export type Reflection = {
  id: string;
  user_email: string;
  name?: string | null;
  avatar_url?: string | null;
  text: string;              // mapped from backend "content"
  created_at: string;        // ISO; mapped from backend "timestamp"
  likes?: number;
  comments_count?: number;   // derived from comments length when present
  image_url?: string | null;
};

export type Comment = {
  id: string;
  reflection_id: string;
  user_email: string;
  content: string;
  timestamp: string;         // ISO
  created_at?: string;       // tolerate alt field
  name?: string | null;
  avatar_url?: string | null;
};

// ---------- helpers ----------
function toArray(json: any): any[] {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.items)) return json.items; // backend envelope
  const candidates = ["data", "results", "rows", "posts", "reflections", "feed"];
  for (const k of candidates) if (Array.isArray(json?.[k])) return json[k];
  return [];
}

function coerceReflection(a: any): Reflection {
  return {
    id: String(a.id ?? a.uuid ?? a._id ?? ""),
    user_email: String(a.user_email ?? a.user?.email ?? ""),
    name: a.name ?? a.user?.name ?? null,
    avatar_url: a.avatar_url ?? a.user?.avatar_url ?? a.user?.image ?? null,
    text: String(a.text ?? a.content ?? ""),
    created_at: String(a.created_at ?? a.createdAt ?? a.timestamp ?? new Date().toISOString()),
    likes: Number(a.likes ?? 0),
    comments_count: Number(
      a.comments_count ?? (Array.isArray(a.comments) ? a.comments.length : 0) ?? 0
    ),
    image_url: a.image_url ?? a.imageUrl ?? null,
  };
}

function coerceComment(c: any): Comment {
  const ts = String(c.timestamp ?? c.created_at ?? c.createdAt ?? new Date().toISOString());
  return {
    id: String(c.id ?? c.uuid ?? c._id ?? ""),
    reflection_id: String(c.reflection_id ?? c.post_id ?? ""),
    user_email: String(c.user_email ?? c.user?.email ?? ""),
    content: String(c.content ?? c.text ?? ""),
    timestamp: ts,
    created_at: ts,
    name: c.name ?? c.user?.name ?? null,
    avatar_url: c.avatar_url ?? c.user?.avatar_url ?? c.user?.image ?? null,
  };
}

// ---------- feed ----------
export async function listSocialFeed({
  tab,
  email,
}: {
  tab: "following" | "all" | "mine";
  email?: string;
}): Promise<Reflection[]> {
  const url = new URL("/api/social", window.location.origin);
  url.searchParams.set("tab", tab);
  if (email) url.searchParams.set("user_email", email);

  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) throw new Error(`Failed to load social feed (${res.status})`);
  const json = await res.json();
  return toArray(json).map(coerceReflection);
}

// ---------- create post ----------
export async function createReflectionJSON({
  user_email,
  text,
  image_url,
}: {
  user_email: string;
  text: string;
  image_url?: string | null;
}): Promise<Reflection> {
  const res = await fetch("/api/social", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: text, image_url, user_email }),
  });

  const raw = await res.text().catch(() => "");
  let json: any = raw;
  try {
    json = JSON.parse(raw);
  } catch {}

  if (!res.ok) {
    const detail =
      (json && (json.detail || json.error || JSON.stringify(json))) || `HTTP ${res.status}`;
    throw new Error(`Failed to post (${res.status}) – ${detail}`);
  }
  return coerceReflection(Array.isArray(json) ? json[0] : json.post ?? json);
}

// ---------- like ----------
export async function likeReflection(id: string) {
  const url = new URL("/api/social/like", window.location.origin);
  url.searchParams.set("id", id);
  const res = await fetch(url.toString(), { method: "POST" });
  if (!res.ok) throw new Error(`Failed to like (${res.status})`);
  return await res.json();
}

// ---------- comments ----------
export async function commentReflection(
  reflection_id: string,
  content: string
): Promise<Comment> {
  const res = await fetch("/api/social/comment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reflection_id, content }),
  });

  const raw = await res.text().catch(() => "");
  let json: any = raw;
  try {
    json = JSON.parse(raw);
  } catch {}

  if (!res.ok) {
    throw new Error(`Failed to comment (${res.status}) ${raw}`);
  }

  // Backend may return the inserted row or just a message.
  if (json && json.id) return coerceComment(json);

  // Synthesize a minimal client-side object to show immediately.
  return coerceComment({
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now(),
    reflection_id,
    user_email: "",
    content,
    timestamp: new Date().toISOString(),
  });
}

export async function listComments(reflectionId: string): Promise<Comment[]> {
  const res = await fetch(
    `/api/social/comment?reflection_id=${encodeURIComponent(reflectionId)}`,
    { method: "GET" }
  );
  if (!res.ok) throw new Error(`Failed to fetch comments (${res.status})`);
  const json = await res.json();
  const arr = toArray(json);
  return arr.map(coerceComment);
}
