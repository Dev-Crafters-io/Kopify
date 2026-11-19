# AI Usage Log — Kopify

Log ini mengikuti format minimal pada panduan PjBL PBW bagian I (Ketentuan Penggunaan AI).

- **Milestone 1:** tercatat di [README.md, bagian 6](../README.md#6-log-penggunaan-ai).
- **Milestone 2 dan seterusnya:** dicatat di file ini, satu section per milestone.

## Aturan Pengisian

1. Tulis satu entri setiap kali AI ikut menghasilkan kode, solusi, atau keputusan desain yang dipakai.
2. **Penjelasan Mahasiswa** wajib ditulis sendiri dengan bahasa sendiri, tidak disalin dari jawaban AI.
3. **Hasil Pengujian** hanya diisi dengan pengujian yang benar-benar dilakukan beserta hasil aslinya, termasuk jika gagal.
4. Isi **Oleh** dengan nama anggota tim yang menggunakan AI.
5. Isi **Commit Terkait** dengan hash atau judul commit hasilnya, supaya bisa ditelusuri saat code walkthrough.

## Template Entri

```markdown
### YYYY-MM-DD — <judul singkat>

- **Oleh:**
- **Tujuan:**
- **Prompt / Ringkasan Pertanyaan:**
- **Bagian Kode / Solusi yang Dibantu AI:**
- **Penjelasan Mahasiswa:**
- **Perubahan / Penyesuaian oleh Mahasiswa:**
- **Hasil Pengujian:**
- **Commit Terkait:**
```

---

## Milestone 2 — Front-end dan Interaksi Dasar

### 2026-11-12 — Review workflow pengembangan dan dokumen proyek

- **Oleh:** Dimm
- **Tujuan:** Mengevaluasi apakah workflow pengembangan (CLAUDE.md dan aturan skill AI) sudah sesuai dengan panduan PjBL PBW.
- **Prompt / Ringkasan Pertanyaan:** "Apakah sudah bagus workflow-nya untuk mengembangkan PjBL Kopify?", lalu "Buatkan draf perubahan CLAUDE.md dan template docs/ai-usage-log.md".
- **Bagian Kode / Solusi yang Dibantu AI:** Analisis kesesuaian CLAUDE.md dengan panduan (aturan komentar, AI Usage Log, prioritas instruksi skill, checklist milestone); draf perubahan `CLAUDE.md`; file template `docs/ai-usage-log.md`.
- **Penjelasan Mahasiswa:**
- **Perubahan / Penyesuaian oleh Mahasiswa:**
- **Hasil Pengujian:**
- **Commit Terkait:**

---

## Milestone 3 — Autentikasi dan Session PHP

### 2026-11-19 — Perbaikan UI sebelum Milestone 3 (audit, critique, harden, responsive)

- **Oleh:** Dimm
- **Tujuan:** Memperbaiki aksesibilitas dan konsistensi UI sebelum mulai Milestone 3.
- **Prompt / Ringkasan Pertanyaan:** "Lanjut project PjBL Kopify, cek pakai Graphify", "Sebelum itu aku mau improve dulu UI UX-nya", "Jalankan ketiganya" (audit, harden index, critique inventori/bom/laporan), lalu memilih fix kecil dan tabel jadi card di mobile.
- **Bagian Kode / Solusi yang Dibantu AI:** Warna token kontras (WCAG AA) dan aturan `:focus-visible` di 5 file CSS; struk kasir berbahasa Indonesia dan tanggal struk dari jam topbar (`dashboard.js`); istilah "Laba Kotor", warna badge pertumbuhan, taksonomi kategori inventori; layout card tabel di ≤768px (inventori, bom, laporan).
- **Penjelasan Mahasiswa:**
- **Perubahan / Penyesuaian oleh Mahasiswa:**
- **Hasil Pengujian:**
- **Commit Terkait:** `fix(kasir): …`, `fix(login): …`, `fix(inventori): …`, `fix(bom): …`, `fix(laporan): …`

### 2026-11-19 — Login, session, logout, dan hak akses per peran

- **Oleh:** Dimm
- **Tujuan:** Memenuhi rubrik Milestone 3 (login PHP, session, logout, proteksi halaman, identitas user, pesan login gagal) dengan akses dibatasi per peran.
- **Prompt / Ringkasan Pertanyaan:** Brainstorming desain (akses bertingkat Kasir/Manajer/Owner, redirect + flash message untuk akses ditolak, satu tabel akses bersama), lalu eksekusi rencana `docs/superpowers/plans/2026-11-19-milestone-3-auth.md`.
- **Bagian Kode / Solusi yang Dibantu AI:** `includes/auth.php` (akun dengan `password_hash`, tabel `PAGES`, `find_user`, `can_access`, `require_page`, `render_nav`, flash message, `session_regenerate_id`), `login.php`, `logout.php`, guard dan menu di `index.php`, `inventori.php`, `bom.php`, `laporan.php`, `tests/auth_test.php`.
- **Penjelasan Mahasiswa:**
- **Perubahan / Penyesuaian oleh Mahasiswa:**
- **Hasil Pengujian:**
- **Commit Terkait:**
