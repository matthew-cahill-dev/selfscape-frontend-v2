// selfscape-frontend-v2/src/lib/storage.ts (finalized helper)
import { supabase } from "@/lib/supabase";

export async function uploadToSupabase(
  file: File,
  kind: "avatars" | "posts",
  uid: string
): Promise<{ publicUrl: string; path: string }> {
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}.${ext}`;
  const path = `${kind}/${uid}/${filename}`; // <= use uid, no encoding

  const { data, error } = await supabase.storage
    .from("media")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg",
    });

  if (error) throw error;

  // Get a public URL (bucket is public per your SQL)
  const { data: pub } = supabase.storage.from("media").getPublicUrl(path);

  return { publicUrl: pub.publicUrl, path: data?.path || path };
}
