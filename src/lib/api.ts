const API = process.env.NEXT_PUBLIC_API_URL!;

export type Entry = {
  id: string;
  text?: string;
  timestamp?: string;
  summary?: {
    keyIdeas?: string[];
    insight?: string;
    reflection?: string;
    tone?: string;
    overallTone?: string;
    emotion?: string;
    digDeep?: string;
  };
};

async function api<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, { cache: "no-store", ...init });
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return res.json();
}

export const getEntries = () => api<Entry[]>("/entries/");
export const createEntry = (body: { user_email: string; text: string }) =>
  api("/entry/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
