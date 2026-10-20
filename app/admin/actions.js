"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/session";

/**
 * Server Action untuk memproses login admin.
 */
export async function login(arg1, arg2) {
  const formData = arg2 instanceof FormData ? arg2 : arg1 instanceof FormData ? arg1 : null;
  const isActionState = arg2 instanceof FormData;

  const email = formData?.get("email")?.toString().trim();
  const password = formData?.get("password")?.toString();

  if (!email || !password) {
    const pesan = "Email dan password wajib diisi.";
    if (isActionState) {
      return { error: pesan };
    }
    redirect("/admin/login?error=" + encodeURIComponent(pesan));
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const pesan = error.message?.toLowerCase().includes("invalid login credentials")
      ? "Email atau password salah."
      : error.message || "Gagal masuk.";

    if (isActionState) {
      return { error: pesan };
    }
    redirect("/admin/login?error=" + encodeURIComponent(pesan));
  }

  redirect("/admin");
}

/**
 * Server Action untuk mengakhiri sesi admin (keluar).
 */
export async function logout() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export { logout as keluar };

