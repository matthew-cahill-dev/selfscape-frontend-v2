// selfscape-frontend-v2/src/app/api/token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Returns the raw session JWT so the frontend can send it as:
// Authorization: Bearer <token>
export async function GET(req: NextRequest) {
  // IMPORTANT: you must have NEXTAUTH_SECRET in your env
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ token: null, error: "NEXTAUTH_SECRET missing" }, { status: 500 });
  }

  // `raw: true` returns the encoded JWT string; without it you get a decoded object
  const raw = await getToken({ req, secret, raw: true });

  return NextResponse.json({ token: raw ?? null });
}
