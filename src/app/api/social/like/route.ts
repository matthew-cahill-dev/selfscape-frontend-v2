// selfscape-frontend-v2/src/app/api/social/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL!;
const isProd = process.env.NODE_ENV === "production";

// POST /api/social/like?id=<reflection_id>
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Get NextAuth JWT
  let token = await getToken({ req, secureCookie: isProd });
  if (!token) {
    const jar = cookies();
    token =
      (jar.get("__Secure-next-auth.session-token")?.value as any) ||
      (jar.get("next-auth.session-token")?.value as any) ||
      null;
  }
  if (!token) {
    return NextResponse.json(
      { error: "No session token. Are you logged in?" },
      { status: 401 }
    );
  }

  // Build backend URL
  const url = new URL(`${API.replace(/\/$/, "")}/social/like/`);
  url.searchParams.set("reflection_id", id);

  // Send to backend with Bearer
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${
        typeof token === "string" ? token : (token as any).accessToken || token.email
      }`,
    },
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
