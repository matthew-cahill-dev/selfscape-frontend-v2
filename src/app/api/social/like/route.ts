// selfscape-frontend-v2/src/app/api/social/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { SignJWT } from "jose";

const API = process.env.NEXT_PUBLIC_API_URL!;
const isProd = process.env.NODE_ENV === "production";

async function signBridgeJWT(email: string) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET not set");
  const key = new TextEncoder().encode(secret);
  return await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime("10m")
    .sign(key);
}

// POST /api/social/like?id=<reflection_id>
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // Decode session server-side; we only need the email to mint our bridge token
  const token = await getToken({ req, secureCookie: isProd });
  const email = token?.email as string | undefined;
  if (!email) {
    return NextResponse.json(
      { error: "No session. Please sign in." },
      { status: 401 }
    );
  }

  const bridge = await signBridgeJWT(email);

  const url = new URL(`${API.replace(/\/$/, "")}/social/like/`);
  url.searchParams.set("reflection_id", id);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { Authorization: `Bearer ${bridge}` },
  });

  const text = await res.text().catch(() => "");
  let json: any = text;
  try {
    json = JSON.parse(text);
  } catch {
    // keep raw text if not JSON
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: "Backend error", status: res.status, detail: json },
      { status: res.status }
    );
  }

  return NextResponse.json(json, { status: res.status });
}
