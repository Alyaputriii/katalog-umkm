# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase. Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Membuat koneksi Supabase untuk server di `lib/supabase/server.js` menggunakan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY`.
- Mengubah `app/page.jsx` menjadi async Server Component yang membaca data produk dari tabel `produk` di Supabase.
- Menampilkan pesan error dan penanganan tabel kosong ("Belum ada produk").
- Menghapus komponen `CatatanBelumAktif`.

**Perbaikan:**
- Menambahkan normalisasi URL Supabase agar mendukung URL dengan atau tanpa `/rest/v1/`.

## US-02 Detail produk

**Prompt:**
Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
- Mengubah `app/produk/[id]/page.jsx` untuk mengambil data satu produk berdasarkan `id` (`await params`) dari database Supabase.
- Memanggil `notFound()` jika produk tidak ditemukan atau ID tidak valid.
- Menghapus `CatatanBelumAktif` dan mempertahankan `TombolWhatsApp`.

**Perbaikan:**
- Tidak ada kendala.

## US-03 Pesan via WhatsApp

**Prompt:**
Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
- Mengubah `components/TombolWhatsApp.jsx` menjadi tag `<a>` yang mengarah ke `https://wa.me/<nomor>?text=<pesan>`.
- Pesan otomatis mencantumkan nama produk dan harga rupiah serta di-encode dengan `encodeURIComponent`.
- Membuka tautan di tab baru dengan `target="_blank"` dan `rel="noopener noreferrer"`.

**Perbaikan:**
- Tidak ada kendala.

## US-04 Login admin

**Prompt:**
Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
- Membuat koneksi sesi admin berbasis cookie di `lib/supabase/session.js` menggunakan `@supabase/ssr`.
- Membuat Server Action `login` dan `logout` di `app/admin/actions.js`.
- Menghubungkan form di `app/admin/login/page.jsx` dan menampilkan pesan error jika login gagal.
- Memfungsikan tombol "Keluar" di `components/NavAdmin.jsx`.

**Perbaikan:**
- Menerjemahkan pesan error bawaan Supabase (`Invalid login credentials`) menjadi pesan yang ramah (*Email atau password salah.*).

## US-05 Ganti password

**Prompt:**
Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Menambahkan Server Action `gantiPassword` di `app/admin/actions.js` yang memeriksa login admin terlebih dahulu.
- Validasi password di server (minimal 8 karakter dan sama dengan konfirmasi).
- Mengupdate password via `supabase.auth.updateUser`.
- Menampilkan pesan berhasil atau pesan error di `app/admin/password/page.jsx`.

**Perbaikan:**
- Tidak ada kendala.

## US-06 Proteksi halaman admin

**Prompt:**
Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
- Membuat `proxy.js` di root proyek untuk memproteksi semua rute `/admin` kecuali `/admin/login` menggunakan `@supabase/ssr`.
- Memastikan semua Server Action mutasi memeriksa autentikasi di server.
- Menghapus `CatatanBelumAktif` dari `app/admin/page.jsx`.

**Perbaikan:**
- Memastikan export `proxy` dan `config.matcher` terkonfigurasi dengan benar untuk Next.js 16.

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

### US-07 List Produk [BONUS]

**Prompt:**
Baca `AGENTS.md` dan `docs/user-stories.md` bagian US-07 — List Produk. Ikuti seluruh aturan keamanan dan kriteria selesai yang tercantum.
Implementasikan fitur List Produk sesuai acceptance criteria US-07. Periksa struktur proyek dan komponen yang sudah ada terlebih dahulu, lalu gunakan sumber data produk dan pola implementasi yang sesuai dengan arsitektur proyek saat ini.
Pastikan daftar produk ditampilkan sesuai kebutuhan user story, tampilannya konsisten dengan desain katalog UMKM, dan responsif di desktop maupun mobile. Tangani kondisi data kosong dan error jika diperlukan. Jangan menggunakan data dummy jika sumber data produk sudah tersedia.
Perbarui `PROMPTS.md` dengan prompt US-07 dan ringkasan implementasi. Jalankan pemeriksaan yang relevan dan laporkan file yang diubah serta kriteria yang sudah terpenuhi. Jangan menjalankan perintah Git karena commit dan push dilakukan secara manual.

**Hasil:**
- Mengubah `app/admin/page.jsx` agar mengambil daftar produk dari tabel `produk` di database Supabase menggunakan sesi admin (`createSessionClient`), bukan lagi dari `lib/data-contoh.js`.
- Memastikan halaman terlindungi dan memverifikasi sesi admin di server sebelum mengambil data.
- Menangani kondisi error pengambilan data dan kondisi jika tabel produk kosong dengan pesan yang jelas.
- Memperbarui `components/TabelProduk.jsx` agar tetap rapi, konsisten, dan responsif di desktop maupun mobile.

**Perbaikan:**
- Tidak ada kendala. Data dari Supabase langsung tampil pada tabel produk di `/admin`.


### US-08 Tambah produk [BONUS]

**Prompt:**
Baca `AGENTS.md` dan `docs/user-stories.md` bagian US-08 — Tambah Produk. Ikuti seluruh aturan keamanan dan kriteria selesai yang tercantum.
Implementasikan fitur tambah produk untuk admin sesuai acceptance criteria US-08. Periksa struktur proyek, sumber data produk, serta komponen dan pola form yang sudah ada sebelum melakukan perubahan.
Pastikan admin dapat menambahkan produk melalui form sesuai field dan validasi yang ditentukan dalam user story. Simpan data menggunakan mekanisme yang sesuai dengan arsitektur proyek, tampilkan pesan berhasil atau gagal, dan pastikan produk yang berhasil ditambahkan muncul pada daftar produk. Validasi input juga harus dilakukan di server, bukan hanya di sisi client.
Jangan melewati pemeriksaan autentikasi dan otorisasi pada proses yang mengubah data. Jangan menggunakan data dummy atau mengubah fitur lain di luar kebutuhan US-08.
Perbarui `PROMPTS.md` dengan prompt US-08 dan ringkasan hasil implementasi. Jalankan pemeriksaan yang relevan, lalu laporkan file yang diubah dan hasil pengujiannya. Jangan menjalankan perintah Git karena commit dan push dilakukan secara manual.

**Hasil:**
- Membuat Server Action `tambahProduk` di `app/admin/actions.js` yang memverifikasi autentikasi sesi admin sebelum memproses mutasi data.
- Menambahkan validasi input di server: nama produk wajib diisi dan harga harus berupa angka $\ge$ 0.
- Menyimpan data produk ke tabel `produk` di database Supabase menggunakan `createSessionClient`.
- Menghubungkan Server Action ke `components/FormProduk.jsx` dan `app/admin/produk/baru/page.jsx`.
- Melakukan revalidasi cache (`revalidatePath`) untuk `/` dan `/admin`, lalu mengarahkan kembali ke `/admin` disertai notifikasi berhasil.
- Menghapus komponen `CatatanBelumAktif` dari halaman tambah produk.

**Perbaikan:**
- Tidak ada kendala; form tambah produk berhasil divalidasi di server dan disimpan ke database Supabase.
