# Milestone 3: Autentikasi dan Hak Akses per Peran — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Login PHP dengan tiga akun hardcoded, session, logout, dan proteksi halaman bertingkat per peran untuk keempat halaman app Kopify.

**Architecture:** Satu file `includes/auth.php` menyimpan data akun, tabel halaman→peran, dan semua fungsi auth. Guard (`require_page`) dan menu (`render_nav`) membaca tabel yang sama, jadi aturan akses ditulis sekali. Halaman `.html` di-rename ke `.php` dan hanya bagian nav, identitas, dan logout yang berubah.

**Tech Stack:** Native PHP 8.x (terpasang 8.5), `$_SESSION`, `password_hash`/`password_verify`, HTML/CSS/vanilla JS yang sudah ada. Tes dengan `assert()` lewat PHP CLI.

**Spec:** `docs/superpowers/specs/2026-11-19-milestone-3-auth-design.md`

## Global Constraints

- Nomor baris di setiap task merujuk ke isi file **sebelum** task itu menambah blok PHP di baris 1. Cari markup-nya dengan teks yang disebut, bukan hanya nomor baris.

- Tanpa framework, Composer, MySQL, atau jQuery. Hanya native PHP.
- Arsitektur per halaman dipertahankan: CSS/JS per halaman, tidak ada CSS bersama.
- Komentar seperlunya (panduan H.3): hanya *why* dan alur session/guard. Tanpa komentar dekoratif atau kode yang di-comment.
- Setiap output nilai dari session atau `$_POST` lewat `htmlspecialchars()`.
- Setiap `header('Location: ...')` langsung diikuti `exit;`.
- Copy pesan persis: `Username atau password salah.` · `Silakan masuk terlebih dahulu.` · `Anda tidak punya akses ke halaman {label}.` · `Anda sudah keluar.`
- Akun: `kasir`/`kasir123` (Api Widi), `manajer`/`manajer123` (Nama Manajer), `owner`/`owner123` (Dimas Wijaya).
- Edit file CSS/JS → naikkan `?v=` di HTML yang memuatnya.
- **Claude tidak melakukan commit.** Setiap task diakhiri pesan commit usulan; Dimm yang commit dan push.
- Port 8000 sedang dipakai server lain di mesin ini: verifikasi memakai `php -S 127.0.0.1:8001`. Matikan server setelah verifikasi.

## Review Focus

1. Username dengan spasi atau huruf besar (`" Kasir "`) → dinormalisasi `trim` + `strtolower` di `find_user`, login berhasil. Tes di Task 1.
2. Peran tak dikenal atau key halaman salah ketik (`can_access('admin', 'kasir')`, `can_access('kasir', 'gudang')`) → `false`, tanpa warning PHP. Tes di Task 1.
3. Username berisi HTML (`<script>alert(1)</script>`) saat login gagal → ditampilkan ter-escape di input. Cek curl di Task 3.
4. `POST` tanpa field (`username`/`password` tidak dikirim) → dianggap login gagal, tanpa warning `Undefined array key`. Cek curl di Task 3.
5. Membuka `includes/auth.php` lewat URL → respons kosong, tanpa HTML atau error. Cek curl di Task 5.
6. Membuka `tests/auth_test.php` lewat browser → **ditolak (404)**. Tes ini mengisi `$_SESSION['user']`, jadi tanpa penolakan siapa pun bisa login sebagai Manajer hanya dengan membuka URL-nya. Baris pertama tes di Task 1, cek curl di Task 5.

---

### Task 0: Prasyarat (manusia)

- [ ] **Step 1: Dimm meng-commit semua perubahan UI yang belum di-commit**

Run: `git status --short`
Expected: hanya `?? docs/superpowers/` dan `?? panduan_pbl_pbw.md`. Kalau masih ada file `M`, berhenti dan minta Dimm commit dulu (spec §7).

---

### Task 1: Data akun dan fungsi auth murni

**Files:**
- Create: `includes/auth.php`
- Create: `tests/auth_test.php`

**Interfaces:**
- Produces (dipakai semua task berikutnya):
  - Konstanta `USERS` (username → `['name','role','password_hash']`), `PAGES` (key → `['file','label','roles']`), `ROLE_LABELS`, `HOME_PAGE` (role → page key). Isi persis spec §6.2; konstanta `const` dipakai supaya fungsi bisa membacanya tanpa `global`.
  - `find_user(string $username, string $password): ?array` → `['username','name','role']` tanpa hash, atau `null`.
  - `can_access(string $role, string $pageKey): bool`
  - `home_url(string $role): string` → nama file, mis. `index.php`.

- [ ] **Step 1: Tulis tes yang gagal di `tests/auth_test.php`**

```php
<?php
// tes ini mengisi $_SESSION['user']; tolak dari browser supaya tidak jadi jalan pintas login
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

require __DIR__ . '/../includes/auth.php';

assert(find_user('kasir', 'kasir123')['role'] === 'kasir');
assert(find_user('manajer', 'manajer123')['name'] === 'Nama Manajer');
assert(find_user('owner', 'owner123')['role'] === 'owner');
assert(!array_key_exists('password_hash', find_user('kasir', 'kasir123')));
assert(find_user(' Kasir ', 'kasir123')['username'] === 'kasir');
assert(find_user('kasir', 'salah') === null);
assert(find_user('kasir', 'KASIR123') === null);
assert(find_user('tidakada', 'kasir123') === null);
assert(find_user('', '') === null);

$expected = [
  'kasir'   => ['kasir' => true, 'inventori' => false, 'bom' => false, 'laporan' => false],
  'manajer' => ['kasir' => true, 'inventori' => true,  'bom' => true,  'laporan' => false],
  'owner'   => ['kasir' => true, 'inventori' => true,  'bom' => true,  'laporan' => true],
];
foreach ($expected as $role => $pages) {
  foreach ($pages as $page => $allowed) {
    assert(can_access($role, $page) === $allowed, "$role -> $page");
  }
}
assert(can_access('admin', 'kasir') === false);
assert(can_access('kasir', 'gudang') === false);

assert(home_url('kasir') === 'index.php');
assert(home_url('manajer') === 'index.php');
assert(home_url('owner') === 'laporan.php');

echo "OK\n";
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `php -d zend.assertions=1 -d assert.exception=1 tests/auth_test.php`
Expected: FAIL, `Failed opening required ... includes/auth.php`

- [ ] **Step 3: Buat `includes/auth.php` dengan konstanta dan tiga fungsi**

- Hash dibuat sekali dengan `php -r 'echo password_hash("kasir123", PASSWORD_DEFAULT), PHP_EOL;'` (ulangi untuk `manajer123`, `owner123`) lalu ditempel ke `USERS`. Komentar satu baris: password demo tercatat di README, yang disimpan hanya hash.
- `find_user`: normalisasi `strtolower(trim($username))`, cek key ada di `USERS`, lalu `password_verify`. Kembalikan array tanpa `password_hash`.
- `can_access`: `isset(PAGES[$pageKey]) && in_array($role, PAGES[$pageKey]['roles'], true)`.
- `home_url`: `PAGES[HOME_PAGE[$role]]['file']`.
- File hanya berisi PHP, tanpa tag penutup `?>` (mencegah whitespace ikut terkirim sebelum `header()`).

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `php -d zend.assertions=1 -d assert.exception=1 tests/auth_test.php && php -l includes/auth.php`
Expected: `OK` lalu `No syntax errors detected`

- [ ] **Step 5: Commit usulan**

`feat(auth): data akun, tabel hak akses, dan tes fungsi auth`

---

### Task 2: Session, flash, guard, dan render menu

**Files:**
- Modify: `includes/auth.php`
- Modify: `tests/auth_test.php`

**Interfaces:**
- Consumes: Task 1.
- Produces:
  - `session_start()` di awal `auth.php` bila `session_status() === PHP_SESSION_NONE`.
  - `current_user(): ?array` → `$_SESSION['user'] ?? null`.
  - `current_user_label(): string` → mis. `Kasir: Api Widi` (belum di-escape; pemanggil yang meng-escape).
  - `login_user(array $user): void` → `session_regenerate_id(true)` lalu `$_SESSION['user'] = $user`.
  - `set_flash(string $message): void`, `take_flash(): ?string` (membaca lalu menghapus).
  - `require_page(string $pageKey): void` → guard; lihat spec §6.3 dan §6.4. Kirim `Cache-Control: no-store` sebelum render.
  - `render_nav(string $activeKey, string $linkClass): void` → echo `<a>` untuk halaman yang boleh dibuka peran saat ini, urutan sesuai `PAGES`; link aktif mendapat class `active` dan `aria-current="page"`.

- [ ] **Step 1: Tambah tes yang gagal di akhir `tests/auth_test.php` (sebelum `echo "OK"`)**

```php
set_flash('Halo');
assert(take_flash() === 'Halo');
assert(take_flash() === null);

$_SESSION['user'] = find_user('kasir', 'kasir123');
assert(current_user()['role'] === 'kasir');
assert(current_user_label() === 'Kasir: Api Widi');

ob_start();
render_nav('kasir', 'nav-pill');
$nav = ob_get_clean();
assert(str_contains($nav, 'href="index.php" class="nav-pill active" aria-current="page"'));
assert(!str_contains($nav, 'inventori.php'));
assert(!str_contains($nav, 'laporan.php'));

$_SESSION['user'] = find_user('manajer', 'manajer123');
assert(current_user_label() === 'Manajer: Nama Manajer');
ob_start();
render_nav('bom', 'mobile-nav-link');
$nav = ob_get_clean();
assert(substr_count($nav, '<a ') === 3);
assert(str_contains($nav, 'href="bom.php" class="mobile-nav-link active" aria-current="page"'));
assert(!str_contains($nav, 'laporan.php'));
```

- [ ] **Step 2: Jalankan, pastikan gagal**

Run: `php -d zend.assertions=1 -d assert.exception=1 tests/auth_test.php`
Expected: FAIL, `Call to undefined function set_flash()`

- [ ] **Step 3: Implementasikan fungsi-fungsi di Interfaces**

`require_page` (satu-satunya alur bercabang):

```
user = current_user()
if user null: set_flash('Silakan masuk terlebih dahulu.'); redirect login.php
if !can_access(user.role, pageKey): set_flash('Anda tidak punya akses ke halaman ' . PAGES[pageKey].label . '.'); redirect home_url(user.role)
header('Cache-Control: no-store')
```

Komentar satu baris di atas guard: kenapa dua pengecekan (login, lalu peran).

- [ ] **Step 4: Jalankan tes, pastikan lulus**

Run: `php -d zend.assertions=1 -d assert.exception=1 tests/auth_test.php`
Expected: `OK`

- [ ] **Step 5: Commit usulan**

`feat(auth): session, flash message, guard halaman, dan menu per peran`

---

### Task 3: Halaman login dan logout

**Files:**
- Rename: `login.html` → `login.php` (`git mv`)
- Create: `logout.php`
- Modify: `assets/css/login.css` (style `.login-alert`)

**Interfaces:**
- Consumes: `find_user`, `login_user`, `current_user`, `home_url`, `set_flash`, `take_flash`.

- [ ] **Step 1: `git mv login.html login.php`, lalu tambah blok PHP di baris 1**

Urutan: `require_once __DIR__ . '/includes/auth.php';` → jika `current_user()` ada, redirect `home_url`. Jika `$_SERVER['REQUEST_METHOD'] === 'POST'`: ambil `$_POST['username'] ?? ''` dan `$_POST['password'] ?? ''`, `find_user`; cocok → `login_user` + redirect `home_url`; gagal → `$error = 'Username atau password salah.'`, simpan username yang diketik. Selain itu `$message = take_flash()`.

- [ ] **Step 2: Ubah markup `login.php`**

- Baris 10: hapus `family=Caveat:wght@700&` dari URL Google Fonts.
- Baris 30: `<form action="login.php" method="POST" class="login-form">`.
- Di awal form: bila ada `$error` atau `$message`, `<p class="login-alert" role="alert">…</p>` (escaped).
- Input username: `value="<?= htmlspecialchars($username ?? '') ?>"`.
- Hapus blok `.form-options` (baris 57–63: "Ingat saya", "Lupa Password?"), blok `.demo-switcher` (baris 67–74), dan seluruh `<script>` (baris 80–93).
- Naikkan `login.css?v=2` → `?v=3`.

- [ ] **Step 3: Tambah `.login-alert` di `assets/css/login.css`**

Banner teks 14px, latar `#FEF2F2`, teks `#B91C1C` (rasio 5.9:1), radius sama dengan `.form-input`, tanpa border kiri berwarna. Hapus token `--font-family-quote` (Caveat) yang tidak dipakai.

- [ ] **Step 4: Buat `logout.php`**

`$_SESSION = []`, hapus cookie session (`setcookie(session_name(), '', time() - 3600, '/')`), `session_destroy()`, `session_start()` lagi, `set_flash('Anda sudah keluar.')`, redirect `login.php`. Komentar satu baris: `shortcut: logout via GET bisa dipicu situs lain (CSRF), ubah ke form POST bila ada data sensitif`.

- [ ] **Step 5: Verifikasi dengan server dan curl**

```bash
php -l login.php && php -l logout.php
php -S 127.0.0.1:8001 >/dev/null 2>&1 & echo $! > /tmp/kopify-php.pid; sleep 1
J=$(mktemp)
curl -s -c $J -b $J -d 'username=kasir&password=salah' http://127.0.0.1:8001/login.php | grep -c 'Username atau password salah.'
curl -s -c $J -b $J -d 'username=<script>x</script>&password=a' http://127.0.0.1:8001/login.php | grep -c '&lt;script&gt;'
curl -s -c $J -b $J -X POST http://127.0.0.1:8001/login.php | grep -c 'Username atau password salah.'
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' -c $J -b $J -d 'username=kasir&password=kasir123' http://127.0.0.1:8001/login.php
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' -c $J -b $J http://127.0.0.1:8001/logout.php
curl -s -c $J -b $J http://127.0.0.1:8001/login.php | grep -c 'Anda sudah keluar.'
kill $(cat /tmp/kopify-php.pid)
```

Expected: `1`, `1`, `1`, `302 http://127.0.0.1:8001/index.php`, `302 http://127.0.0.1:8001/login.php`, `1`. Log server tanpa `Warning`/`Notice`.

- [ ] **Step 6: Commit usulan**

`feat(auth): login PHP dengan POST, pesan gagal, dan logout`

---

### Task 4: Halaman Kasir (`index.php`) dengan banner flash

**Files:**
- Rename: `index.html` → `index.php`
- Modify: `assets/css/dashboard.css` (style `.flash-message`)

**Interfaces:**
- Consumes: `require_page`, `render_nav`, `current_user_label`, `take_flash`.

- [ ] **Step 1: `git mv index.html index.php`, baris 1: `require_once` + `require_page('kasir');`**

- [ ] **Step 2: Ganti markup**

- Baris 31–34 (isi `<nav class="nav-pills">`): `<?php render_nav('kasir', 'nav-pill'); ?>`.
- Baris 64–67 (isi `<nav class="mobile-nav-menu">`): `<?php render_nav('kasir', 'mobile-nav-link'); ?>`.
- Baris 45 dan 72: `<span><?= htmlspecialchars(current_user_label()) ?></span>`.
- Baris 53 dan 74: `href="logout.php"`, hapus atribut `onclick`.
- Tepat setelah `</header>` (baris 80): bila `take_flash()` mengembalikan pesan, `<p class="flash-message" role="alert">…</p>` (escaped).

- [ ] **Step 3: `.flash-message` di `assets/css/dashboard.css`**

Latar `var(--color-warning-bg)`, teks `var(--color-warning-text)` (rasio ≥ 4.5:1), font 14px, padding dan radius mengikuti `.menu-search-bar`, tanpa border kiri berwarna. Naikkan `dashboard.css?v=11` → `?v=12`.

- [ ] **Step 4: Verifikasi**

```bash
php -l index.php
php -S 127.0.0.1:8001 >/dev/null 2>&1 & echo $! > /tmp/kopify-php.pid; sleep 1
J=$(mktemp)
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' -b $J http://127.0.0.1:8001/index.php
curl -s -c $J -b $J -d 'username=kasir&password=kasir123' -o /dev/null http://127.0.0.1:8001/login.php
curl -s -c $J -b $J -D - http://127.0.0.1:8001/index.php | grep -ci 'cache-control: no-store'
curl -s -c $J -b $J http://127.0.0.1:8001/index.php | grep -cE 'inventori\.php|laporan\.php|\.html"'
curl -s -c $J -b $J http://127.0.0.1:8001/index.php | grep -c 'Kasir: Api Widi'
kill $(cat /tmp/kopify-php.pid)
```

Expected: `302 http://127.0.0.1:8001/login.php`, `1`, `0`, `2`. (Di titik ini `inventori.html` dkk. masih menaut ke `index.html` yang sudah tidak ada; diperbaiki di Task 5.)

- [ ] **Step 5: Commit usulan**

`feat(auth): proteksi halaman kasir dan identitas user dari session`

---

### Task 5: Inventori, Komposisi Menu, dan Laporan

**Files:**
- Rename: `inventori.html`, `bom.html`, `laporan.html` → `.php`

**Interfaces:**
- Consumes: sama dengan Task 4. Key halaman: `inventori`, `bom`, `laporan`.

- [ ] **Step 1: `git mv` ketiga file; baris 1 masing-masing `require_once` + `require_page('<key>');`**

- [ ] **Step 2: Ganti markup di ketiga file**

| | inventori / bom | laporan |
|---|---|---|
| Link nav desktop (isi `.nav-pills`) | baris 27–30 | baris 25–28 |
| Link drawer (isi `.mobile-nav-menu`) | baris 47–50 | baris 49–52 |
| Identitas desktop | baris 35 | baris 33 |
| Identitas drawer | baris 55 | baris 57 |
| Link logout (`href`, hapus `onclick`) | baris 37, 57 | baris 35, 59 |

Identitas memakai `current_user_label()` yang sama dengan Task 4 (label "Admin" otomatis menjadi "Manajer"). `role="navigation"` pada `<div class="nav-pills">` dihapus: div itu sudah berada di dalam `<nav>`.

- [ ] **Step 3: Verifikasi matriks akses**

```bash
for f in inventori bom laporan; do php -l $f.php; done
php -S 127.0.0.1:8001 >/dev/null 2>&1 & echo $! > /tmp/kopify-php.pid; sleep 1
for u in kasir manajer owner; do
  J=$(mktemp)
  curl -s -c $J -b $J -d "username=$u&password=${u}123" -o /dev/null http://127.0.0.1:8001/login.php
  for p in index inventori bom laporan; do
    printf '%s %s ' $u $p
    curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' -c $J -b $J http://127.0.0.1:8001/$p.php
  done
done
J=$(mktemp)
curl -s -c $J -b $J -d 'username=kasir&password=kasir123' -o /dev/null http://127.0.0.1:8001/login.php
curl -s -c $J -b $J -o /dev/null http://127.0.0.1:8001/laporan.php
curl -s -c $J -b $J http://127.0.0.1:8001/index.php | grep -c 'Anda tidak punya akses ke halaman Laporan.'
curl -s -w '%{size_download}\n' -o /dev/null http://127.0.0.1:8001/includes/auth.php
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8001/tests/auth_test.php
grep -rn '\.html"' *.php || echo "tidak ada link .html"
kill $(cat /tmp/kopify-php.pid)
```

Expected: 200 untuk sel ✓ dan `302 …/index.php` untuk sel ✗ di spec §4 (kasir: inventori, bom, laporan; manajer: laporan); `1`; `0`; `404`; `tidak ada link .html`.

- [ ] **Step 4: Detector dan tampilan**

Run: `"/home/dimm/.claude/plugins/cache/impeccable/impeccable/4.8.2/skills/impeccable/scripts/impeccable" detect --json login.php index.php inventori.php bom.php laporan.php`
Expected: tidak ada `low-contrast` baru. Screenshot Firefox headless hanya untuk `login.php` (dengan pesan error) pada 1440/768/390; halaman yang butuh login dicek di uji manual Task 6, karena headless tidak membawa cookie session.

- [ ] **Step 5: Commit usulan**

`feat(auth): proteksi halaman inventori, komposisi menu, dan laporan per peran`

---

### Task 6: Dokumentasi dan uji manual

**Files:**
- Modify: `README.md`, `CLAUDE.md`, `docs/ai-usage-log.md`

- [ ] **Step 1: README** — bagian cara menjalankan (`php -S localhost:8000`, buka `/login.php`) dan tabel akun demo (username, password, peran, halaman yang boleh dibuka).

- [ ] **Step 2: CLAUDE.md** — bagian Running dan Architecture: halaman `.php`, `includes/auth.php` sebagai satu sumber aturan akses, `sessionStorage` dihapus, `tests/auth_test.php` dan perintahnya. Bagian Current Development Stage tetap Milestone 3.

- [ ] **Step 3: `docs/ai-usage-log.md`** — section `## Milestone 3 — Autentikasi dan Session PHP` dengan satu entri; Claude mengisi Tanggal, Tujuan, Prompt, Bagian Kode, Commit Terkait. Penjelasan Mahasiswa, Perubahan oleh Mahasiswa, Hasil Pengujian dibiarkan kosong.

- [ ] **Step 4: Checklist uji manual untuk Dimm (browser nyata)**

1. Login tiga akun; tiap peran mendarat di halaman awalnya dan hanya melihat menu yang boleh.
2. Login salah → pesan muncul, username tetap terisi.
3. Buka keempat URL tanpa login → kembali ke login dengan pesan.
4. Kasir mengetik `/laporan.php` → kembali ke Kasir dengan pesan akses ditolak.
5. Logout → tombol Back tidak menampilkan halaman app.
6. Tekan Tab di login dan topbar → ring fokus terlihat.
7. Cek 1440/768/390.

- [ ] **Step 5: Commit usulan**

`docs: cara menjalankan, akun demo, dan log AI milestone 3`
