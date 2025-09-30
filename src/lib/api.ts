// selfscape-frontend-v2/src/lib/api.ts

const API = process.env.NEXT_PUBLIC_API_URL!; // e.g., https://selfscape-backend.onrender.com

let cachedToken: string | null | undefined; // undefined = not fetched yet

async function fetchToken(): Promise<string | null> {
  if (cachedToken !== undefined) return cachedToken ?? null;
  try {
    const res = await fetch("/api/token", { method: "GET", cache: "no-store" });
    if (!res.ok) throw new Error("token fetch failed");
    const { token } = (await res.json()) as { token: string | null };
    cachedToken = token ?? null;
    return cachedToken;
  } catch {
    cachedToken = null;
    return null;
  }
}

// Always return a Record<string, string> so it's valid HeadersInit
async function authHeaders(): Promise<Record<string, string>> {
  const token = await fetchToken();
  if (token) return { Authorization: `Bearer ${token}` };
  return {};
}

// ---------- API calls ----------

export async function createEntry(params: { user_email: string; text: string }) {
  const res = await fetch(`${API}/entry/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify({ text: params.text, user_email: params.user_email }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`POST /entry/ ${res.status} ${t}`);
  }
  return res.json();
}

export async function listEntries(user_email: string, limit = 10, sort: "asc" | "desc" = "desc") {
  const url = new URL(`${API}/entries/`);
  url.searchParams.set("user", user_email);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort", sort);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: await authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GET /entries/ ${res.status}`);
  return res.json();
}

export async function searchEntries(user_email: string, query: string) {
  const res = await fetch(`${API}/search/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify({ user_email, query }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`POST /search/ ${res.status} ${t}`);
  }
  return res.json() as Promise<{ entries: any[] }>;
}

export async function transcribeAudio(file: Blob) {
  const fd = new FormData();
  fd.append("audio", file, "recording.webm"); // backend expects field name "audio"
  const res = await fetch(`${API}/transcribe`, {
    method: "POST",
    body: fd, // browser sets boundary for multipart
  });
  if (!res.ok) throw new Error(`POST /transcribe ${res.status}`);
  return res.json() as Promise<{ transcript: string }>;
}
