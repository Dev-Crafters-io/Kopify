# Kopify - Aplikasi Kasir dan Manajemen Stok Kedai Kopi

**Anggota Tim:**

1. Api Widi Pratama - A11.2025.16268
2. Afrizal Irfan - A11.2025.16532
3. Dimas Putra Wijaya - A11.2025.16431

---

## 1. Latar Belakang & Studi Kasus

Kopify adalah sistem Point of Sale (POS) dan manajemen inventaris berbasis web untuk mendigitalisasi operasional kedai kopi. Sistem ini menyelesaikan masalah pencatatan manual yang sering memperlambat alur kerja kedai skala kecil–menengah, di antaranya:

- **Stok Fisik Tidak Terpantau:** Memisahkan pencatatan bahan satuan (seperti _takeaway cup_ atau _pastry_) dari menu jadi, memastikan jumlah fisik tercatat akurat dan terstruktur di dalam katalog.
- **Blind-Spot Pengawasan:** Menyediakan _dashboard_ agar pemilik dapat memantau penjualan dan sisa stok kapan saja, tanpa harus menunggu rekap pergantian _shift_.
- **Keterlambatan Pembaruan Stok:** Memotong stok secara otomatis saat transaksi kasir disimpan. Hal ini mencegah kasir kehabisan barang esensial di tengah jam sibuk karena lupa update buku stok.
- **Rekapitulasi Manual:** Menggantikan proses perhitungan nota kertas dengan kalkulator saat _closing_ menggunakan pencatatan riwayat transaksi digital.

---

## 2. Target Pengguna

Sistem memisahkan akses pengguna ke dalam 2 _role_ operasional:

1. **Admin / Kasir:** Eksekutor harian. Memiliki akses penuh (CRUD) terhadap manajemen produk, kategori, pembaruan stok, dan pemrosesan transaksi di meja kasir.
2. **Pemilik:** Pengawas operasional. Akses bersifat _read-only_ (opsional) untuk melihat _dashboard_ harian dan ringkasan stok tanpa izin untuk mengubah atau menghapus riwayat data.

---

## 3. Fitur Utama

Fitur wajib sistem yang ada di KOPIFY:

- **Autentikasi:** Login, Logout, dan Proteksi terhadap halaman-halaman sensitif.
- **Manajemen Inventaris (CRUD):** Kelola kategori, registrasi data produk, dan pengaturan jumlah stok.
- **Sistem Transaksi:** Antarmuka kasir untuk memproses pesanan dan menghitung total secara otomatis yang terhubung dengan pengurangan stok.
- **Navigasi AJAX:** Tampilan tabel daftar produk dan riwayat transaksi menggunakan fitur _pagination_ berbasis jQuery AJAX (navigasi perpindahan data tanpa _reload_ halaman).
- **Indikator Real-time:** Tampilan tanggal dan jam interaktif menggunakan JavaScript pada antarmuka pengguna.

---

## 4. Rancangan Antarmuka

Tata letak dan _mockup_ antarmuka dirancang di **Figma**.

**Tautan Figma:** [Kopify POS - all design](https://www.figma.com/design/BMnRDSZJZvuPr5d14G8Ccm/Kopify-POS-all-design?t=Yc5aYdiZTt4xx6Oe-1)

---

## 5. Fitur Pengembangan Opsional

Sistem juga mengimplementasikan modul tambahan untuk efisiensi di lapangan:

1. **Cetak Struk Transaksi:** Fitur cetak bukti pembayaran fisik (_thermal receipt layout_) berbasis HTML standar.
2. **Peringatan Batas Stok:** Indikator peringatan visual (_alert_) pada _dashboard_ yang menyala otomatis jika sisa barang fisik menyentuh batas minimum.

---

## 6. Log Penggunaan AI

Berikut adalah riwayat penggunaan AI sebagai copilot selama pengembangan Milestone 1:

| Tanggal         | Tujuan                                                                         | Prompt / Perintah                                                                                                                                                                               | Bagian Solusi yang Dibantu                                                                                                                                                                    | Penjelasan Konsep & Penyesuaian Mandiri                                                                                                                                                                                                                           | Hasil Pengujian                                                                                                              |
| :-------------- | :----------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| 13 Oktober 2026 | **Merancang struktur direktori proyek Git dan kerangka README.md**             | "Bagaimana struktur folder repositori Git yang rapi untuk proyek web PHP native tugas PjBL, serta kerangka awal untuk README.md?"                                                               | Memberikan rekomendasi struktur direktori modular (`docs/wireframe`, `assets/`, `src/`) serta kerangka poin-poin wajib README sesuai rubrik Milestone 1                                       | Struktur folder yang terstandarisasi mencegah kekacauan file antar anggota tim. Saya menyiapkan folder `assets/` khusus gambar antarmuka, folder `docs/`, dan menyusun draft latar belakang studi kasus Kopify                                                    | Struktur direktori berhasil diinisialisasi secara lokal dengan Git dan dokumen README.md terstruktur rapi                    |
| 13 Oktober 2026 | **Merancang antarmuka login split-screen dan pemisahan role**                  | "Bagaimana cara mendesain halaman login split-screen yang modern untuk aplikasi kasir kafe dengan pemisahan peran kasir dan pemilik?"                                                           | Memberikan panduan struktur layout split-screen (branding panel di kiri dan kartu login mengambang di kanan) serta UX pemilihan multi-peran (_dual CTA button_)                               | Layout split-screen membagi fokus antara identitas brand kafe di kiri dan form input di kanan. Saya menyesuaikan warna ke dark espresso dan krem, menambahkan logo cangkir, serta membuat tombol akses terpisah ("Masuk sebagai Kasir" dan "Masuk sebagai Owner") | Desain halaman login tampil elegan, rapi, dan memudahkan pengguna memilih peran operasional secara langsung                  |
| 14 Oktober 2026 | **Merumuskan alur kolaborasi Git 3 orang tanpa merge conflict**                | "Bagaimana strategi push dan alur kerja Git/GitHub yang aman untuk kolaborasi 3 orang di branch main agar tidak terjadi tabrakan atau merge conflict?"                                          | Memberikan panduan disiplin Git: kebiasaan `git pull` sebelum bekerja dan sebelum push, konfigurasi `pull.rebase false`, pembagian file kerja, serta larangan push force                      | Konflik Git terjadi jika dua orang mengedit baris file yang sama secara bersamaan. Kami sepakat membagi kepemilikan file kerja antar anggota dan mewajibkan sinkronisasi `git pull origin main` sebelum melakukan commit dan push                                 | Seluruh anggota tim memahami urutan terminal Git dan proses push perdana berjalan lancar tanpa file saling tertimpa          |
| 14 Oktober 2026 | **Menyusun struktur layout Dashboard POS dari referensi**                      | "Bagaimana cara membuat layout dashboard POS di Figma langkah demi langkah berdasarkan desain referensi?"                                                                                       | Memberikan panduan breakdown tata letak: pemisahan top bar navigasi, filter kategori, grid katalog produk, order tracker bawah, dan panel transaksi kasir di sisi kanan                       | POS kasir membutuhkan alur mata yang cepat: menu di tengah dan kalkulasi transaksi di kanan agar efisien saat melayani pelanggan. Saya menyesuaikan desain dengan palet warna krem-espresso, font IBM Plex Sans, dan indikator visual batas stok                  | Struktur layout dashboard kasir selesai dibuat di Figma dengan proporsi rapi dan hierarki visual yang jelas                  |
| 15 Oktober 2026 | **Evaluasi kritis (design audit) dan perbaikan antarmuka seluruh layar Figma** | "Roast secara objektif seluruh desain antarmuka Kopify POS saya di Figma, temukan kekurangan/inkonsistensi visual, berikan rekomendasi perbaikan, dan pandu langkah perbaikannya step by step." | Memberikan analisis kekurangan visual (hierarki tipografi, konsistensi margin/padding, kontras teks, dan keterbacaan data kasir) beserta panduan langkah perbaikan tata letak secara bertahap | Audit desain memastikan konsistensi sistem visual dan kepatuhan kontras WCAG. Saya menyelaraskan seluruh font isi ke IBM Plex Sans, memperbaiki kontras badge status stok, serta merapikan whitespace antar-komponen                                              | Tampilan seluruh 6 layar menjadi jauh lebih konsisten, proporsional, dan nyaman dibaca sebelum dikonversi ke wireframe       |
| 15 Oktober 2026 | **Analisis desain UI dan penerapan Auto Layout di Figma**                      | "Analisis desain dashboard Kopify saya dan pandu langkah-langkah menerapkan Auto Layout pada komponennya."                                                                                      | Meninjau konsistensi spacing dan hierarki visual, serta memberikan panduan nesting Auto Layout (pengaturan direction, padding, gap, serta Hug vs Fill container)                              | Auto layout meniru perilaku Flexbox di web sehingga elemen fleksibel mengikuti panjang teks. Saya mengatur padding dan gap secara manual pada komponen kartu produk, tombol aksi, dan daftar pesanan                                                              | Seluruh elemen UI dan kartu katalog fleksibel saat diisi variasi teks/harga tanpa merusak struktur tata letak                |
| 16 Oktober 2026 | **Penerapan soft shadow pada komponen dan kartu UI**                           | "Bagaimana cara menerapkan soft shadow di Figma agar kartu dan panel tidak terlihat kaku?"                                                                                                      | Memberikan formula pengaturan Drop Shadow halus (kombinasi blur besar, Y-offset kecil, dan opacity rendah menggunakan tint warna tema)                                                        | Drop shadow halus memberikan kesan elevasi visual tanpa merusak estetika flat luxury. Saya menggunakan transparansi rendah (5–8%) dengan dasar warna dark espresso pada kartu produk, panel pesanan, dan top bar                                                  | Komponen antarmuka memiliki efek kedalaman visual yang halus, elegan, dan menyatu alami dengan latar belakang krem           |
| 17 Oktober 2026 | **Merancang antarmuka tabel inventaris produk dan drawer edit data**           | "Bagaimana cara merancang antarmuka tabel inventaris produk beserta drawer edit data yang rapi dan user-friendly di Figma?"                                                                     | Memberikan panduan struktur tabel inventaris (kartu ringkasan metrik di atas, filter pencarian, badge status stok kritis, tombol aksi) serta konsep slide-over drawer untuk form edit         | Pola slide-over drawer mempercepat alur edit data barang tanpa kasir harus berpindah halaman. Saya menyusun field input drawer (upload gambar, nama, kategori, harga, dan stok) serta metrik stok kritis                                                          | Layout tabel inventaris dan drawer edit produk selesai dengan hierarki data yang jelas dan siap dijadikan acuan halaman CRUD |
| 17 Oktober 2026 | **Merancang tata letak struk kasir termal (thermal receipt)**                  | "Bagaimana cara merancang layout struk kasir termal di Figma yang padat dan informatif berdasarkan referensi struk belanja?"                                                                    | Memberikan panduan hierarki anatomi struk kasir (header toko, metadata transaksi, daftar item pesanan, total bayar, serta footer info pelengkap)                                              | Struk fisik mengutamakan keterbacaan cepat dalam ruang cetak sempit. Saya mengunci lebar kanvas di 340px, menerapkan tipografi Kopify, menambahkan badge metode QRIS, promo voucher, dan kredensial WiFi kafe                                                     | Komponen struk kasir termal selesai dengan tata letak rapat, proporsional, dan siap diadaptasi ke format cetak HTML dasar    |
| 18 Oktober 2026 | **Mengonversi desain UI Figma menjadi wireframe**                              | "Bagaimana cara mengubah desain UI berwarna di Figma menjadi wireframe abu-abu/grayscale secara cepat?"                                                                                         | Memberikan panduan teknik duplikasi frame dan penggunaan layer overlay dengan blend mode saturation/color                                                                                     | Wireframe monokrom bertujuan menguji struktur hierarki dan fungsi tanpa distraksi warna. Saya menerapkan overlay saturation pada seluruh frame duplikat dan mengecek keterbacaan teks                                                                             | Seluruh 6 layar tampil monokrom dengan kontras yang jelas dan berhasil diekspor sebagai aset wireframe                       |
