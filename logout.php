<?php
// shortcut: logout via GET bisa dipicu situs lain (CSRF), ubah ke form POST bila ada data sensitif
require_once __DIR__ . '/includes/auth.php';

// kosongkan isi session lalu hapus file session-nya di server
$_SESSION = [];
session_destroy();

// session baru dengan ID baru (cookie ikut diganti), hanya untuk membawa pesan ke halaman login
session_start();
session_regenerate_id(true);
set_flash('Anda sudah keluar.');
redirect('login.php');
