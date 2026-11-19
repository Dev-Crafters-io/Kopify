<?php
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

// Password demo tercatat di README untuk penilai; di kode hanya hash-nya yang disimpan.
const USERS = [
  'kasir' => [
    'name' => 'Api Widi',
    'role' => 'kasir',
    'password_hash' => '$2y$12$khMNBOFEV56uBxX/Kb4B1OAd0zVJxl42BfLMyja/oKifQt47gV5TC',
  ],
  'manajer' => [
    'name' => 'Afrizal Irfan',
    'role' => 'manajer',
    'password_hash' => '$2y$12$ZPXZ9v9Bn.UmqGuNDhmD3ep7qM1GtJHu.4qGr3D1jMXoiK1bH4Iaa',
  ],
  'owner' => [
    'name' => 'Dimas Wijaya',
    'role' => 'owner',
    'password_hash' => '$2y$12$Lf9HDTIC3kE8oD94RxAFkuyEdbvd0c3Fuv6A7GPbaztRZV1EbsnoK',
  ],
];

// Satu-satunya tabel hak akses: dipakai guard halaman dan menu navigasi.
const PAGES = [
  'kasir'     => ['file' => 'index.php',     'label' => 'Kasir',          'roles' => ['kasir', 'manajer', 'owner']],
  'inventori' => ['file' => 'inventori.php', 'label' => 'Inventori',      'roles' => ['manajer', 'owner']],
  'bom'       => ['file' => 'bom.php',       'label' => 'Komposisi Menu', 'roles' => ['manajer', 'owner']],
  'laporan'   => ['file' => 'laporan.php',   'label' => 'Laporan',        'roles' => ['owner']],
];

const ROLE_LABELS = ['kasir' => 'Kasir', 'manajer' => 'Manajer', 'owner' => 'Owner'];

const HOME_PAGE = ['kasir' => 'kasir', 'manajer' => 'kasir', 'owner' => 'laporan'];

function find_user(string $username, string $password): ?array
{
  $username = strtolower(trim($username));
  if (!isset(USERS[$username]) || !password_verify($password, USERS[$username]['password_hash'])) {
    return null;
  }

  return [
    'username' => $username,
    'name' => USERS[$username]['name'],
    'role' => USERS[$username]['role'],
  ];
}

function can_access(string $role, string $pageKey): bool
{
  return isset(PAGES[$pageKey]) && in_array($role, PAGES[$pageKey]['roles'], true);
}

function home_url(string $role): string
{
  return PAGES[HOME_PAGE[$role]]['file'];
}

function current_user(): ?array
{
  return $_SESSION['user'] ?? null;
}

function current_user_label(): string
{
  $user = current_user();
  return ROLE_LABELS[$user['role']] . ': ' . $user['name'];
}

function login_user(array $user): void
{
  // ID session diganti setelah login supaya ID lama (yang mungkin ditanam orang lain) tidak ikut terautentikasi
  session_regenerate_id(true);
  $_SESSION['user'] = $user;
}

function set_flash(string $message): void
{
  $_SESSION['flash'] = $message;
}

// Pesan flash hanya tampil sekali: dibaca lalu langsung dihapus dari session.
function take_flash(): ?string
{
  $message = $_SESSION['flash'] ?? null;
  unset($_SESSION['flash']);
  return $message;
}

function redirect(string $url): void
{
  header('Location: ' . $url);
  exit;
}

// Guard di baris pertama setiap halaman app: cek sudah login, lalu cek peran boleh membuka halaman ini.
function require_page(string $pageKey): void
{
  $user = current_user();
  if ($user === null) {
    set_flash('Silakan masuk terlebih dahulu.');
    redirect('login.php');
  }

  if (!can_access($user['role'], $pageKey)) {
    set_flash('Anda tidak punya akses ke halaman ' . PAGES[$pageKey]['label'] . '.');
    redirect(home_url($user['role']));
  }

  // halaman app tidak disimpan di cache browser, jadi tombol Back setelah logout tidak menampilkannya lagi
  header('Cache-Control: no-store');
}

function render_nav(string $activeKey, string $linkClass): void
{
  $role = current_user()['role'];
  foreach (PAGES as $key => $page) {
    if (!can_access($role, $key)) {
      continue;
    }

    $isActive = $key === $activeKey;
    $class = $isActive ? "$linkClass active" : $linkClass;
    $current = $isActive ? ' aria-current="page"' : '';
    echo "<a href=\"{$page['file']}\" class=\"$class\"$current>{$page['label']}</a>\n";
  }
}
