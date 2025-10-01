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

function toArray(json: any): any[] {
  if (Array.isArray(json)) return json;
  // Backend /social GET returns: { items, nextCursor, hasMore }
  if (Array.isArray(json?.items)) return json.items;
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
    created_at: String(
      a.created_at ?? a.createdAt ?? a.timestamp ?? new Date().toISOString()
    ),
    likes: Number(a.likes ?? 0),
    comments_count: Number(
      a.comments_count ?? (Array.isArray(a.comments) ? a.comments.length : 0) ?? 0
    ),
    image_url: a.image_url ?? a.imageUrl ?? null,
  };
}

/**
 * Load the social feed through our Next.js proxy.
 * Backend supports tab=following|all|mine and optional user_email.
 */
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

/**
 * Create a post via the Next.js proxy.
 * The proxy attaches the NextAuth JWT and forwards {content} to FastAPI /social/.
 * `image_url` is accepted for future-proofing (stored server-side if you add it).
 */
export async function createReflectionJSON({
  user_email,
  text,
  image_url,
}: {
  user_email: string;
  text: string;
  image_url?: string | null;
}) {
  const res = await fetch("/api/social", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: text, image_url, user_email }),
  });

  const raw = await res.text().catch(() => "");
  let json: any = raw;
  try { json = JSON.parse(raw); } catch {}

  if (!res.ok) {
    // Show backend detail if present (helps when it’s 401)
    const detail =
      (json && (json.detail || json.error || JSON.stringify(json))) || `HTTP ${res.status}`;
    throw new Error(`Failed to post (${res.status}) – ${detail}`);
  }
  return coerceReflection(Array.isArray(json) ? json[0] : json.post ?? json);
}


/**
 * Like a post via the Next.js proxy (adds JWT and calls /social/like/?reflection_id=...).
 */
export async function likeReflection(id: string) {
  const url = new URL("/api/social/like", window.location.origin);
  url.searchParams.set("id", id);
  const res = await fetch(url.toString(), { method: "POST" });
  if (!res.ok) throw new Error(`Failed to like (${res.status})`);
  return await res.json();
}
