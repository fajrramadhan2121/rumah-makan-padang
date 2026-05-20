<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — Rumah Padang Nusantara</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
</head>
<body>

<div class="login-bg">
    <div class="login-bg-pattern"></div>
</div>

<div class="login-wrapper">

    <!-- PANEL KIRI -->
    <div class="login-brand">
        <div class="brand-content">
            <div class="brand-icon"><i class="fa-solid fa-utensils"></i></div>
            <h1 class="brand-name">Rumah Padang<br><span>Nusantara</span></h1>
            <p class="brand-tagline">Sistem Kasir Digital</p>
            <div class="brand-divider"></div>
            <p class="brand-desc">Kelola transaksi restoran Anda dengan mudah, cepat, dan akurat.</p>
        </div>
        <div class="brand-footer">© 2026 Rumah Padang Nusantara</div>
    </div>

    <!-- PANEL KANAN -->
    <div class="login-card">
        <div class="login-card-inner">
            <div class="login-header">
                <h2>Selamat Datang</h2>
                <p>Masuk ke akun kasir Anda</p>
            </div>

            <div class="alert-box" id="alertBox" style="display:none">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span id="alertMsg">Username atau password salah.</span>
            </div>

            <div class="form-group">
                <label for="username">Username</label>
                <div class="input-wrap">
                    <i class="fa-solid fa-user"></i>
                    <input type="text" id="username" placeholder="Masukkan username" autocomplete="username">
                </div>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <div class="input-wrap">
                    <i class="fa-solid fa-lock"></i>
                    <input type="password" id="password" placeholder="Masukkan password" autocomplete="current-password">
                    <button class="btn-toggle-pw" type="button" onclick="togglePassword()" id="btnTogglePw">
                        <i class="fa-solid fa-eye" id="eyeIcon"></i>
                    </button>
                </div>
            </div>

            <button class="btn-login" id="btnLogin" onclick="doLogin()">
                <span id="btnText"><i class="fa-solid fa-right-to-bracket"></i> Masuk</span>
                <span id="btnLoading" style="display:none"><i class="fa-solid fa-spinner fa-spin"></i> Memproses...</span>
            </button>
        </div>
    </div>

</div>

<script src="script.js"></script>
</body>
</html>