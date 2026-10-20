import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat koneksi Supabase berbasis sesi admin dengan cookies (@supabase/ssr).
 * Menggunakan SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY.
 */
export async function createSessionClient() {
  const cookieStore = await cookies();

  const supabaseUrl = (process.env.SUPABASE_URL || "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\/rest\/v1\/?$/, "")
    .replace(/\/+$/, "");
  const supabasePublishableKey = (process.env.SUPABASE_PUBLISHABLE_KEY || "")
    .trim()
    .replace(/^["']|["']$/g, "");

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY belum diatur di environment variable."
    );
  }

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Method setAll dipanggil dari Server Component (bisa diabaikan jika middleware/proxy menyegarkan sesi)
        }
      },
    },
  });
}

export { createSessionClient as createAdminSessionClient };
export default createSessionClient;

