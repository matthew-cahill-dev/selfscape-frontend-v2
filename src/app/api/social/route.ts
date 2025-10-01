// selfscape-frontend-v2/src/app/api/social/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { SignJWT } from "jose";

const API = process.env.NEXT_PUBLIC_API_URL!;
const isProd = process.env.NODE_ENV === "production";

async function signBridgeJWT(email: string) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET not set");
  const key = new TextEncoder().encode(secret);
  // Short-lived, HS256 JWT containing only the email
  return await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime("10m")
    .sign(key);
}

// GET /api/social
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tab = searchParams.get("tab") ?? "all";
  const email = searchParams.get("user_email") ?? undefined;

  const url = new URL(`${API.replace(/\/$/, "")}/social/`);
  if (tab) url.searchParams.set("tab", tab);
  if (email) url.searchParams.set("user_email", email);

  const res = await fetch(url.toString(), { method: "GET" });
  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}

// POST /api/social  (create post)
export async function POST(req: NextRequest) {
  // Use NextAuth to decode the session *on the server* (works even if NextAuth encrypts the cookie)
  const token = await getToken({ req, secureCookie: isProd });
  const email = token?.email as string | undefined;

  if (!email) {
    return NextResponse.json(
      { error: "No session. Please sign in." },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const content =
    typeof body?.content === "string"
      ? body.content
      : typeof body?.text === "string"
      ? body.text
      : "";

  if (!content.trim()) {
    return NextResponse.json({ error: "Content is empty." }, { status: 400 });
  }

  // Mint a short-lived HS256 JWT that the backend will accept
  const bridge = await signBridgeJWT(email);

  const res = await fetch(`${API.replace(/\/$/, "")}/social/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bridge}`,
    },
    // backend expects { content }, it ignores image_url for now
    body: JSON.stringify({ content }),
  });

  const text = await res.text().catch(() => "");
  let json: any = text;
  try {
    json = JSON.parse(text);
  } catch {
    // non-JSON text; keep as-is for debugging
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: "Backend error", status: res.status, detail: json },
      { status: res.status }
    );
  }

  return NextResponse.json(json, { status: res.status });
}
