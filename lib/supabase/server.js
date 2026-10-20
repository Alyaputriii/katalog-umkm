import { createClient } from "@supabase/supabase-js";

/**
 * Membuat koneksi Supabase untuk server (pengunjung).
 * Menggunakan SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable.
 */
export function createServerClient() {
  const supabaseUrl = (process.env.SUPABASE_URL || "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\/rest\/v1\/?$/, "")
    .replace(/\/+$/, "");
  const supabaseSecretKey = (process.env.SUPABASE_SECRET_KEY || "")
    .trim()
    .replace(/^["']|["']$/g, "");

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export { createServerClient as createClient };
export default createServerClient;

