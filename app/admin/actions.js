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

/**
 * Server Action untuk mengganti password admin yang sedang login.
 */
export async function gantiPassword(arg1, arg2) {
  const formData = arg2 instanceof FormData ? arg2 : arg1 instanceof FormData ? arg1 : null;
  const isActionState = arg2 instanceof FormData;

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  const passwordBaru = formData?.get("password_baru")?.toString();
  const konfirmasiPassword = formData?.get("konfirmasi_password")?.toString();

  if (!passwordBaru || passwordBaru.length < 8) {
    const pesan = "Password baru minimal 8 karakter.";
    if (isActionState) return { error: pesan };
    redirect("/admin/password?error=" + encodeURIComponent(pesan));
  }

  if (passwordBaru !== konfirmasiPassword) {
    const pesan = "Password baru dan konfirmasi tidak sama.";
    if (isActionState) return { error: pesan };
    redirect("/admin/password?error=" + encodeURIComponent(pesan));
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    const pesan = error.message || "Gagal mengganti password.";
    if (isActionState) return { error: pesan };
    redirect("/admin/password?error=" + encodeURIComponent(pesan));
  }

  const pesanSukses = "Password berhasil diganti.";
  if (isActionState) return { success: pesanSukses };
  redirect("/admin/password?berhasil=" + encodeURIComponent(pesanSukses));
}

export { gantiPassword as updatePassword };
