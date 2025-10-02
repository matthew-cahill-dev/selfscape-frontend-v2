// selfscape-frontend-v2/src/app/api/social/comments/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // avoid caching during dev

const API = process.env.NEXT_PUBLIC_API_URL!;
if (!API) {
  throw new Error("NEXT_PUBLIC_API_URL not set");
}

// GET /api/social/comments?reflection_id=<id>
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
  } catch {
    // leave as text if not JSON
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: "Backend error", status: res.status, detail: json },
      { status: res.status }
    );
  }

  // Expecting an array of comments from backend
  return NextResponse.json(json, { status: 200 });
}
