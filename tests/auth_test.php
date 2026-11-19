<?php
// tes ini mengisi $_SESSION['user']; tolak dari browser supaya tidak jadi jalan pintas login
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

require __DIR__ . '/../includes/auth.php';

assert(find_user('kasir', 'kasir123')['role'] === 'kasir');
assert(find_user('manajer', 'manajer123')['name'] === 'Afrizal Irfan');
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

// return type `never` hanya ada di PHP >= 8.1; XAMPP lama (PHP 8.0/7.x) akan gagal parse di semua halaman
assert((string) (new ReflectionFunction('redirect'))->getReturnType() !== 'never');

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
assert(current_user_label() === 'Manajer: Afrizal Irfan');
ob_start();
render_nav('bom', 'mobile-nav-link');
$nav = ob_get_clean();
assert(substr_count($nav, '<a ') === 3);
assert(str_contains($nav, 'href="bom.php" class="mobile-nav-link active" aria-current="page"'));
assert(!str_contains($nav, 'laporan.php'));

echo "OK\n";
