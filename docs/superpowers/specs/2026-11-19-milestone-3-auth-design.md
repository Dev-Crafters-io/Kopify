# Milestone 3: Autentikasi, Session, dan Hak Akses per Peran

Tanggal: 2026-11-19 · Status: draf, menunggu persetujuan PO

## 1. Tujuan dan alasan

Mengganti login palsu Milestone 2 (form `GET` ke `index.html`, flag `sessionStorage` yang tidak pernah dibaca, link "Akses Demo Cepat" tanpa password) dengan login PHP sungguhan. Targetnya rubrik Milestone 3 (15 poin, panduan bagian F):

| Rubrik | Poin | Dipenuhi oleh |
|---|---|---|
| Form login terhubung dengan PHP | 3 | `login.php` memproses `POST` ke dirinya sendiri |
| Login berhasil dan gagal ditangani | 3 | Redirect ke halaman awal peran / pesan error di form |
| Session tersimpan setelah login | 3 | `$_SESSION['user']` |
| Logout menghapus session | 2 | `logout.php` |
| Proteksi halaman | 3 | Guard di awal setiap halaman app |
| Kualitas kode, commit, penjelasan | 1 | Satu tabel akses, komentar seperlunya, commit bertahap |

Keputusan PO di luar rubrik: **akses dibatasi per peran**.

## 2. Goals, non-goals, anti-goals

**Goals**
- Tiga akun hardcoded, satu per peran: Kasir, Manajer, Owner.
- Hak akses bertingkat (lihat §4).
- Identitas user dari session tampil di topbar desktop dan drawer mobile di semua halaman app.
- Pesan jelas untuk: login gagal, belum login, dan akses ditolak.

**Non-goals (Milestone 3)**
- Database/MySQL (Milestone 4), registrasi, ganti/lupa password, "Ingat saya".
- Fungsi kontrol yang ditunda: search/filter inventori, hitung HPP, filter periode laporan.
- Redesign visual (lihat review frontend-design; dijadwalkan setelah Milestone 3).

**Anti-goals** (gagal walau "jalan")
- Ada jalan masuk ke halaman app tanpa password (link demo, URL langsung).
- UI menampilkan link yang ditolak saat diklik, atau sebaliknya: aturan menu dan aturan guard berbeda.
- Kode yang tidak bisa dijelaskan mahasiswa saat walkthrough (framework, class, autoloader).

## 3. Batasan

- Native PHP saja (PHP 8.x terpasang: 8.5). Tanpa framework, tanpa Composer, tanpa jQuery.
- Arsitektur halaman dipertahankan: satu file per layar, CSS/JS per halaman, tidak ada CSS bersama.
- Dijalankan dengan `php -S localhost:8000` dari root repo.
- Komentar seperlunya (panduan H.3): hanya untuk *why* dan alur session.

## 4. Peran, akun, dan hak akses

| Peran | Username | Nama tampil | Halaman awal | Kasir | Inventori | Komposisi Menu | Laporan |
|---|---|---|---|---|---|---|---|
| Kasir | `kasir` | Api Widi | `index.php` | ✓ | ✗ | ✗ | ✗ |
| Manajer | `manajer` | **Nama Manajer** (placeholder) | `index.php` | ✓ | ✓ | ✓ | ✗ |
| Owner | `owner` | Dimas Wijaya | `laporan.php` | ✓ | ✓ | ✓ | ✓ |

- Nama diambil dari data yang sudah tampil di halaman Milestone 2. Placeholder Manajer diganti cukup di satu baris array akun.
- Label "Admin" di topbar inventori/bom menjadi "Manajer".
- Password demo: `kasir123`, `manajer123`, `owner123`. Ditulis di README untuk penilai. Di kode disimpan sebagai hash `password_hash()` (bukan teks asli) dan dicek dengan `password_verify()`. Alasan: pola yang sama akan dipakai saat akun pindah ke tabel MySQL di Milestone 4, dan teks password tidak ikut tersimpan di repo publik sebagai literal di kode.

## 5. Pendekatan

Dipertimbangkan tiga cara menerapkan aturan "link terlarang disembunyikan" di 4 halaman × 2 menu (pill desktop dan drawer mobile):

| | Cara | Trade-off |
|---|---|---|
| A | `if (can_access(...))` di setiap link | Struktur halaman tetap, tapi ~32 kondisi tersebar; satu terlewat = bocor di UI. Duplikasi (H.3). |
| **B** | **Satu tabel halaman→peran; guard dan `render_nav()` membaca tabel yang sama** | Aturan ditulis sekali, menu dan proteksi tidak mungkin berbeda; perlu paham satu fungsi `foreach`. |
| C | Seluruh topbar jadi satu include | Duplikasi paling kecil, tapi topbar keempat halaman berbeda; mengubah UI dan berisiko regresi. |

**Dipilih PO: B.**

Untuk akses yang ditolak (user mengetik URL langsung), dipilih PO: **redirect ke halaman awal peran dengan flash message** "Anda tidak punya akses ke halaman Laporan." Alternatif yang ditolak: halaman 403 khusus (butuh halaman dan desain baru), redirect diam-diam (membingungkan).

## 6. Desain

### 6.1 File

```
includes/auth.php     tabel akun, tabel halaman, fungsi auth (tanpa output HTML)
login.php             (rename dari login.html) form + proses POST
logout.php            hapus session lalu redirect ke login
index.php, inventori.php, bom.php, laporan.php   (rename dari .html) + guard di baris pertama
tests/auth_test.php   tes logika auth dengan assert, dijalankan via CLI
```

Rename memakai `git mv` supaya riwayat file tetap terlacak.

### 6.2 Data di `includes/auth.php`

```php
$USERS = [
  'kasir'   => ['name' => 'Api Widi',     'role' => 'kasir',   'password_hash' => '$2y$...'],
  'manajer' => ['name' => 'Nama Manajer', 'role' => 'manajer', 'password_hash' => '$2y$...'],
  'owner'   => ['name' => 'Dimas Wijaya', 'role' => 'owner',   'password_hash' => '$2y$...'],
];

// satu sumber aturan: dipakai guard dan menu
$PAGES = [
  'kasir'     => ['file' => 'index.php',     'label' => 'Kasir',          'roles' => ['kasir', 'manajer', 'owner']],
  'inventori' => ['file' => 'inventori.php', 'label' => 'Inventori',      'roles' => ['manajer', 'owner']],
  'bom'       => ['file' => 'bom.php',       'label' => 'Komposisi Menu', 'roles' => ['manajer', 'owner']],
  'laporan'   => ['file' => 'laporan.php',   'label' => 'Laporan',        'roles' => ['owner']],
];

$ROLE_LABELS = ['kasir' => 'Kasir', 'manajer' => 'Manajer', 'owner' => 'Owner'];
$HOME_PAGE   = ['kasir' => 'kasir', 'manajer' => 'kasir', 'owner' => 'laporan'];
```

Bentuk persis (konstanta vs variabel global vs fungsi yang mengembalikan array) diserahkan ke builder, asalkan tetap satu sumber dan mudah dijelaskan.

### 6.3 Fungsi

| Fungsi | Isi | Pure? |
|---|---|---|
| `find_user($username, $password)` | Kembalikan data user bila username ada dan `password_verify` cocok, selain itu `null` | ya |
| `can_access($role, $pageKey)` | `in_array($role, $PAGES[$pageKey]['roles'])` | ya |
| `home_url($role)` | File halaman awal peran | ya |
| `current_user()` | `$_SESSION['user'] ?? null` | |
| `require_page($pageKey)` | Guard: belum login → flash "Silakan masuk terlebih dahulu." + redirect `login.php`. Login tapi tidak berhak → flash "Anda tidak punya akses ke halaman {label}." + redirect `home_url`. | |
| `set_flash($msg)` / `take_flash()` | Simpan pesan di `$_SESSION['flash']`; `take_flash` membaca lalu menghapusnya | |
| `render_nav($activeKey, $linkClass)` | `foreach $PAGES`, cetak `<a>` hanya untuk halaman yang boleh; tambah class `active` dan `aria-current="page"` pada halaman aktif | |

`session_start()` dipanggil sekali di `auth.php`. Setiap `header('Location: ...')` diikuti `exit;`.

`require_page()` juga mengirim `Cache-Control: no-store` supaya setelah logout tombol Back browser tidak menampilkan halaman app dari cache.

### 6.4 Alur

**Login (`login.php`)**
1. Sudah login → redirect ke `home_url`.
2. `POST`: `find_user(trim(username), password)`.
   - Cocok → `session_regenerate_id(true)` (cegah session fixation), simpan `$_SESSION['user'] = ['username','name','role']`, redirect ke `home_url`.
   - Gagal → tampilkan "Username atau password salah." di atas form; username yang diketik tetap terisi (di-escape), password dikosongkan. Pesan tidak membedakan username salah vs password salah.
3. `GET`: tampilkan form; jika ada flash (dari guard/logout), tampilkan.

**Halaman app**: baris pertama `require_once 'includes/auth.php'; require_page('inventori');`, lalu HTML seperti sekarang.

**Logout (`logout.php`)**: `$_SESSION = []`, hapus cookie session, `session_destroy()`, mulai session baru hanya untuk flash "Anda sudah keluar.", redirect `login.php`.
Logout tetap berupa link `GET` (markup sekarang). *shortcut: logout via GET bisa dipicu situs lain (CSRF), ubah ke form POST bila ada data sensitif.*

### 6.5 Perubahan markup

- Form login: `action="login.php" method="POST"`.
- Hapus: blok "Akses Demo Cepat", checkbox "Ingat saya", link "Lupa Password?" (kontrol tanpa fungsi), inline `<script>` `sessionStorage`, semua `onclick="sessionStorage.removeItem(...)"`, request font Caveat yang tidak dipakai.
- Semua link `*.html` → `*.php`; link logout → `logout.php`.
- Daftar link nav desktop dan drawer di 4 halaman diganti `<?php render_nav('inventori', 'nav-pill'); ?>` / `<?php render_nav('inventori', 'mobile-nav-link'); ?>`.
- Teks identitas ("Kasir: Api Widi", "Admin: Api Widi", "Owner: Dimas Wijaya") di topbar dan drawer diganti nilai dari session, selalu lewat `htmlspecialchars()`.
- Flash message hanya bisa muncul di `index.php` (halaman awal yang bisa menerima penolakan; Owner tidak pernah ditolak) dan `login.php`. Gaya: banner sederhana di bawah topbar/di atas form, memakai token warna yang ada, `role="alert"` agar dibacakan screen reader.

### 6.6 Pengujian

- **Otomatis (TDD)**: `tests/auth_test.php` memakai `assert()` untuk fungsi pure: `find_user` (benar, password salah, username tak dikenal, username kosong), `can_access` (seluruh 12 sel tabel §4), `home_url` (3 peran). Jalankan `php -d zend.assertions=1 tests/auth_test.php`.
- **Manual di browser** (rubrik menuntut cek tangan): login 3 akun; login gagal; buka keempat URL tanpa login; Kasir membuka `laporan.php`/`inventori.php` langsung; menu tiap peran; logout lalu tombol Back browser tidak membuka halaman app; tampilan 1440/768/390.

### 6.7 Dokumen

- README: cara menjalankan (`php -S localhost:8000`) dan tabel akun demo.
- `CLAUDE.md`: bagian Architecture dan Running diperbarui (halaman `.php`, `includes/auth.php`, `sessionStorage` dihapus).
- `docs/ai-usage-log.md`: entri Milestone 3 (field faktual oleh Claude; penjelasan dan hasil uji oleh mahasiswa).

## 7. Prasyarat dan checklist sebelum submit

- **Prasyarat:** semua perubahan UI yang belum di-commit (kontras, fokus, struk, card mobile, CLAUDE.md) di-commit terpisah oleh mahasiswa sebelum `git mv`, supaya riwayat Milestone 3 hanya berisi pekerjaan auth (H.5).
- **Sebelum submit:** ganti placeholder "Nama Manajer" di `$USERS` dengan nama anggota tim.

## 8. Diserahkan ke builder

- Bentuk penyimpanan tabel (konstanta/variabel/fungsi) dan nama variabel, asal satu sumber.
- Detail CSS banner flash dan pesan error login (mengikuti token warna halaman masing-masing).
- Urutan commit, asal bertahap dan deskriptif (H.5).

## 9. Keputusan Claude yang perlu dicek PO

- Username/password demo dan halaman awal per peran (§4).
- Menghapus "Ingat saya" dan "Lupa Password?" dari form login.
- Hash password + `session_regenerate_id` (keamanan, sedikit tambahan kode).
- Logout tetap `GET` dengan catatan shortcut.
