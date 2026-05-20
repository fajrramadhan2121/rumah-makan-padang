function togglePassword() {
    const input = document.getElementById('password');
    const icon = document.getElementById('eyeIcon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fa-solid fa-eye';
    }
}

function showAlert(msg) {
    const box = document.getElementById('alertBox');
    document.getElementById('alertMsg').textContent = msg;
    box.style.display = 'flex';
}

function hideAlert() {
    document.getElementById('alertBox').style.display = 'none';
}

async function doLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showAlert('Username dan password wajib diisi.');
        return;
    }

    hideAlert();

    const btn = document.getElementById('btnLogin');
    const btnText = document.getElementById('btnText');
    const btnLoad = document.getElementById('btnLoading');

    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoad.style.display = 'inline';

    try {
        const res = await fetch('../../api/auth.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (data.success) {
            localStorage.setItem('kasir', JSON.stringify(data.kasir));
            window.location.href = '../dashboard/index.php';
        } else {
            showAlert(data.message || 'Username atau password salah.');
        }
    } catch (err) {
        showAlert('Gagal terhubung ke server.');
    } finally {
        btn.disabled = false;
        btnText.style.display = 'inline';
        btnLoad.style.display = 'none';
    }
}

// Enter key trigger login
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', e => {
        if (e.key === 'Enter') doLogin();
    });
});