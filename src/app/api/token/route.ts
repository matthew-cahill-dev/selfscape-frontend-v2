// selfscape-frontend-v2/src/app/api/token/route.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET() {
  // getToken reads the NextAuth cookie, validates signature using NEXTAUTH_SECRET
  // raw: true returns the original compact JWT string your backend can verify.
  const raw = await getToken({ req: undefined as any, raw: true });
  // If you are on Next 14 app router, you cannot pass req; NextAuth reads cookies from headers internally.
  // raw can be null if unauthenticated
  if (!raw) return NextResponse.json({ token: null }, { status: 200 });
  return NextResponse.json({ token: raw });
}
