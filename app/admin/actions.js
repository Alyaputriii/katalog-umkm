"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

/**
 * Server Action untuk menambah produk baru ke database.
 */
export async function tambahProduk(arg1, arg2) {
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

  const nama = formData?.get("nama")?.toString().trim();
  const hargaRaw = formData?.get("harga")?.toString().trim();
  const kategori = formData?.get("kategori")?.toString().trim() || null;
  const foto_url = formData?.get("foto_url")?.toString().trim() || null;
  const deskripsi = formData?.get("deskripsi")?.toString().trim() || null;

  if (!nama) {
    const pesan = "Nama produk wajib diisi.";
    if (isActionState) return { error: pesan };
    redirect("/admin/produk/baru?error=" + encodeURIComponent(pesan));
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    const pesan = "Harga harus berupa angka dan tidak boleh negatif.";
    if (isActionState) return { error: pesan };
    redirect("/admin/produk/baru?error=" + encodeURIComponent(pesan));
  }

  const { error } = await supabase.from("produk").insert({
    nama,
    harga,
    kategori,
    foto_url,
    deskripsi,
  });

  if (error) {
    const pesan = error.message || "Gagal menyimpan produk ke database.";
    if (isActionState) return { error: pesan };
    redirect("/admin/produk/baru?error=" + encodeURIComponent(pesan));
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?berhasil=" + encodeURIComponent("Produk berhasil ditambahkan."));
}

export { tambahProduk as createProduct };
