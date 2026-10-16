# Kopify - Aplikasi Kasir dan Manajemen Stok Kedai Kopi

**Anggota Tim:**
1. Api Widi Pratama - A11.2025.16268
2. Afrizal Irfan - A11.2025.16532
3. Dimas Putra Wijaya - A11.2025.16431

---

## 1. Latar Belakang & Studi Kasus
Aplikasi ini dirancang untuk menyelesaikan berbagai permasalahan pencatatan dan operasional harian yang sering dialami oleh bisnis kedai kopi berskala kecil hingga menengah:

- **Data produk dan stok belum tercatat dengan rapi:** Kategori menu (seperti *Espresso Based*, *Manual Brew*, *Pastry*) sering tercampur dalam pencatatan manual. Pemantauan fisik barang satuan seperti *takeaway cup* dan *pastry* sering terlewat saat barang masuk gudang. Aplikasi ini menyediakan fitur kelola kategori dan produk untuk memastikan katalog menu terstruktur dan jumlah stok fisik barang tercatat secara pasti.
- **Pemilik usaha kesulitan memantau transaksi harian:** Pemilik kedai sering kali tidak berada di lokasi operasional. Tanpa sistem digital, pemilik harus menunggu pergantian *shift* untuk mengetahui jumlah produk yang terjual. Aplikasi ini menyediakan *dashboard* khusus dengan ringkasan jumlah produk, stok tersedia, dan transaksi hari ini.
- **Jumlah stok tidak diperbarui setelah penjualan:** Saat jam sibuk, kasir tidak memiliki waktu untuk memperbarui buku stok, menyebabkan kedai kehabisan barang esensial (seperti *cup*) di tengah operasional. Aplikasi ini menerapkan pengurangan stok secara real-time saat transaksi disimpan.
- **Rekap transaksi masih dilakukan secara manual:** Pada proses penutupan (*closing*), kasir harus menghitung ulang seluruh nota kertas. Aplikasi ini memiliki pencatatan transaksi penjualan beserta detail transaksi yang memuat produk, jumlah, harga, dan subtotal, sehingga menghilangkan kebutuhan rekapitulasi manual menggunakan kalkulator.


---

## 2. Target Pengguna
Aplikasi ini menggunakan sistem multi-peran (2 *Role*) untuk merepresentasikan operasional kedai kopi di dunia nyata:

1. **Admin / Kasir:** Bertugas dalam operasional harian. Peran ini memiliki hak akses penuh untuk mengelola produk, kategori, stok, dan transaksi.
2. **Pemilik:** Berfungsi sebagai peran pengawas. Peran ini bersifat opsional dan hanya memiliki hak akses (*read-only*) untuk melihat *dashboard* atau laporan sederhana tanpa bisa mengubah atau menghapus data transaksi.

---

## 3. Kebutuhan Fitur Utama 
Sesuai batasan sistem, aplikasi ini memiliki fitur inti:
- **Autentikasi & Keamanan:** Login, logout, dan proteksi halaman menggunakan session PHP.
- **Manajemen Inventaris (CRUD):** Kelola kategori dan data produk beserta jumlah stoknya.
- **Sistem Transaksi:** Pencatatan transaksi penjualan yang secara otomatis mengurangi stok produk terkait.
- **Tabel Interaktif:** Menampilkan daftar produk dan transaksi menggunakan fitur pagination berbasis jQuery AJAX agar perpindahan halaman terjadi tanpa memuat ulang (*reload*) keseluruhan situs.
- **Informasi Real-time:** Menampilkan tanggal dan waktu yang interaktif pada antarmuka kasir menggunakan JavaScript.

---

## 4. Rancangan Antarmuka 
Rancangan antarmuka aplikasi Kopify dibuat menggunakan **Figma**, mencakup wireframe untuk perencanaan tata letak awal (Login, Dashboard, Daftar Data, Form) dan *mockup* sebagai panduan visual akhir.

| Wireframe | Mockup Visual |
| :---: | :---: |
| ![Wireframe Login Kopify](assets/Kopify-wireframe.jpg) | ![Mockup Login Kopify](assets/mockup-login.jpg) |

**Tautan Figma:** [Kopify POS Login Design & Wireframe](https://www.figma.com/design/BMnRDSZJZvuPr5d14G8Ccm/Kopify-POS--Login-Prototype-2?node-id=0-1&p=f&m=draw)

---

## 5. Fitur Pengembangan Opsional
Selain fitur wajib, aplikasi ini mengimplementasikan dua fitur pengembangan opsional untuk meningkatkan efisiensi operasional kedai:
1. **Cetak Struk Sederhana:** Memudahkan kasir memberikan bukti pembayaran fisik kepada pelanggan layaknya sistem POS pada umumnya menggunakan format cetak HTML dasar.
2. **Peringatan Stok Menipis:** Memberikan indikator visual (*alert*) pada *dashboard* atau tabel produk apabila stok barang fisik (seperti *cup* atau *pastry*) sudah mencapai batas minimum.

