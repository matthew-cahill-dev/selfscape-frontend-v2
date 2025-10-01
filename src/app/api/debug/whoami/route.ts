// selfscape-frontend-v2/src/app/api/debug/whoami/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL!;
const isProd = process.env.NODE_ENV === "production";

export async function GET(req: NextRequest) {
  // get raw JWT (don’t verify here, just forward)
  let bearer: string | null = await getToken({ req, raw: true, secureCookie: isProd });
  if (!bearer) {
    const jar = cookies();
    bearer =
      jar.get("__Secure-next-auth.session-token")?.value ??
      jar.get("next-auth.session-token")?.value ??
      null;
  }
  if (!bearer) {
    return NextResponse.json({ error: "No session token on frontend" }, { status: 401 });
  }

  const res = await fetch(`${API.replace(/\/$/, "")}/debug/whoami`, {
    method: "GET",
    headers: { Authorization: `Bearer ${bearer}` },
  });

  const text = await res.text().catch(() => "");
  let json: any = text;
  try { json = JSON.parse(text); } catch {}

  return NextResponse.json(json, { status: res.status });
}
