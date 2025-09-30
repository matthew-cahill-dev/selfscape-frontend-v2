// src/lib/api.ts
const API = process.env.NEXT_PUBLIC_API_URL!; // e.g. https://selfscape-backend.onrender.com

// If/when you add NextAuth JWT-protected routes, populate this.
async function authHeaders() {
  // const token = await getTokenSomehow();
  // return token ? { Authorization: `Bearer ${token}` } : {};
  return {};
}

export async function createEntry(params: { user_email: string; text: string }) {
  const res = await fetch(`${API}/entry/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify({ text: params.text, user_email: params.user_email }),
  });
  if (!res.ok) throw new Error(`POST /entry/ ${res.status}`);
  return res.json();
}

export async function listEntries(user_email: string, limit = 10, sort: "asc" | "desc" = "desc") {
  const url = new URL(`${API}/entries/`);
  url.searchParams.set("user", user_email);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort", sort);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { ...(await authHeaders()) },
  });
  if (!res.ok) throw new Error(`GET /entries/ ${res.status}`);
  return res.json();
}

export async function transcribeAudio(file: Blob) {
  const fd = new FormData();
  fd.append("audio", file, "recording.webm"); // backend expects field name "audio"
  const res = await fetch(`${API}/transcribe`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error(`POST /transcribe ${res.status}`);
  return res.json() as Promise<{ transcript: string }>;
}
