// selfscape-frontend-v2/src/lib/supabase.ts
"use client";

import { createClient } from "@supabase/supabase-js";

// These must be set in your env (.env.local for dev; project vars in prod)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Fail fast so it's obvious what's wrong during dev
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Add them to .env.local"
  );
}

// Singleton client for client components
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
