// selfscape-frontend-v2/src/app/api/social/comment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { authOptions } from "../../auth/[...nextauth]/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API = process.env.NEXT_PUBLIC_API_URL!;
const isProd = process.env.NODE_ENV === "production";

// ---------- POST: add a comment ----------
export async function POST(req: NextRequest) {
  let bearer: string | null = await getToken({
    req,
    raw: true,
    secureCookie: isProd,
    secret: authOptions.secret,
  });

  if (!bearer) {
    const jar = cookies();
    bearer =
      jar.get("__Secure-next-auth.session-token")?.value ??
      jar.get("next-auth.session-token")?.value ??
      null;
  }

  if (!bearer) {
    return NextResponse.json(
      { error: "No session token. Are you logged in?" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const reflection_id = (body?.reflection_id ?? "").trim();
  const content = (body?.content ?? "").trim();
  if (!reflection_id || !content) {
    return NextResponse.json(
      { error: "reflection_id and content are required" },
      { status: 400 }
    );
  }

  const res = await fetch(`${API.replace(/\/$/, "")}/social/comment/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearer}`,
    },
    body: JSON.stringify({ reflection_id, content }),
  });

  const text = await res.text().catch(() => "");
  let json: any = text;
  try {
    json = JSON.parse(text);
  } catch {}

  if (!res.ok) {
    return NextResponse.json(
      { error: "Backend error", status: res.status, detail: json },
      { status: res.status }
    );
  }

  return NextResponse.json(json, { status: res.status });
}

// ---------- GET: list comments (singular path) ----------
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reflection_id = searchParams.get("reflection_id");
  if (!reflection_id) {
    return NextResponse.json(
      { error: "reflection_id is required" },
      { status: 400 }
    );
  }

  const upstream = `${API.replace(/\/$/, "")}/social/comment/?reflection_id=${encodeURIComponent(
    reflection_id
  )}`;

  const res = await fetch(upstream, { method: "GET", headers: { Accept: "application/json" } });

  const text = await res.text().catch(() => "");
  let json: any = text;
  try {
    json = JSON.parse(text);
  } catch {}

  if (!res.ok) {
    return NextResponse.json(
      { error: "Backend error", status: res.status, detail: json },
      { status: res.status }
    );
  }

  return NextResponse.json(json, { status: 200 });
}
