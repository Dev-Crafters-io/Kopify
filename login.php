<?php
require_once __DIR__ . '/includes/auth.php';

if (current_user() !== null) {
  redirect(home_url(current_user()['role']));
}

$username = '';
$error = null;
$message = take_flash();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // field yang dikirim sebagai array (username[]=...) dianggap kosong, bukan error 500
  $username = is_string($_POST['username'] ?? null) ? $_POST['username'] : '';
  $password = is_string($_POST['password'] ?? null) ? $_POST['password'] : '';
  $user = find_user($username, $password);

  if ($user !== null) {
    login_user($user);
    redirect(home_url($user['role']));
  }

  // pesan sengaja tidak menyebut bagian mana yang salah, supaya username valid tidak bisa ditebak
  $error = 'Username atau password salah.';
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kopify — Masuk Kasir & Owner</title>
  <link rel="icon" href="./assets/kopify-main-logo.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./assets/css/login.css?v=3">
</head>
<body>
  <div class="login-container">
    <section class="branding-pane">
      <div class="branding-logo-text">Kopify</div>
      <div class="branding-center-content">
        <img src="./assets/images/login-illustration.png" alt="Kopify Coffee Story" class="branding-illustration">
        <p class="branding-quote">Where Every Cup Tells a Story.</p>
      </div>
    </section>

    <main class="auth-pane">
      <div class="login-card">
        <header class="login-header">
          <h1 class="login-title">Kopify</h1>
          <p class="login-subtitle">Masuk ke sistem operasional kedai</p>
        </header>

        <form action="login.php" method="POST" class="login-form">
          <?php if ($error !== null || $message !== null): ?>
            <p class="login-alert" role="alert"><?= htmlspecialchars($error ?? $message) ?></p>
          <?php endif; ?>

          <div class="form-field">
            <label for="username" class="form-label">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              class="form-input" 
              placeholder="Masukkan username" 
              value="<?= htmlspecialchars($username) ?>"
              required
              autocomplete="username"
            >
          </div>

          <div class="form-field">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              class="form-input" 
              placeholder="Masukkan Password" 
              required
              autocomplete="current-password"
            >
          </div>

          <button type="submit" class="btn-primary">Masuk ke Akun</button>
        </form>
      </div>
    </main>
  </div>
</body>
</html>
