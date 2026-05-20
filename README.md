# 🍛 Rumah Makan Padang Nusantara — Sistem Kasir

Sistem kasir berbasis web untuk Rumah Makan Padang dengan fitur pembayaran QRIS dinamis dan notifikasi pembayaran otomatis via email.

---

## 📋 Fitur

- **Login Kasir** — autentikasi berdasarkan akun karyawan
- **Input Transaksi** — pilih menu, tipe order (Dine-in / Take-away / Online), dan metode pembayaran
- **Pembayaran QRIS Dinamis** — generate QR code otomatis sesuai nominal transaksi
- **Notifikasi Pembayaran Otomatis** — MacroDroid menangkap notifikasi DANA dan mengirim email, sistem membaca email via IMAP dan mengupdate status transaksi
- **Riwayat Transaksi** — filter berdasarkan tanggal, status, dan tipe order
- **Dashboard Statistik** — total transaksi, pendapatan, dan status shift harian

---

## 🗂️ Struktur Project

```
Project/
├── Api/
│   ├── auth.php            # Login kasir
│   ├── cek_email.php       # Baca email notif DANA via IMAP → update status
│   ├── cek_status.php      # Cek status transaksi (polling frontend)
│   ├── data.php            # Master data (menu, kategori, meja, metode)
│   ├── generate_qris.php   # Generate QRIS dinamis
│   ├── riwayat.php         # Riwayat transaksi
│   └── transaksi.php       # Input transaksi baru
├── Frontend/
│   ├── Dashboard/
│   │   ├── index.php
│   │   ├── script.js
│   │   └── style.css
│   └── Login/
│       ├── index.php
│       ├── script.js
│       └── style.css
├── koneksi.php             # Konfigurasi koneksi database
└── db_dummy.sql            # Data dummy 1000 transaksi
```

---

## ⚙️ Teknologi

| Komponen | Teknologi |
|---|---|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Backend | PHP (Native) |
| Database | MySQL / MariaDB |
| Server | Apache (XAMPP) |
| Notifikasi | MacroDroid + Gmail IMAP |
| QRIS | API qrisku.my.id |

---

## 🚀 Cara Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/fajrramadhan2121/rumah-makan-padang.git
```

### 2. Pindahkan ke htdocs
Salin folder `Project` ke dalam `C:/xampp/htdocs/`

### 3. Import Database
- Buka phpMyAdmin
- Buat database baru: `db_rumah_makan_padang`
- Import file SQL database

### 4. Konfigurasi Koneksi
Edit file `koneksi.php` sesuaikan dengan pengaturan database kamu:
```php
$conn = mysqli_connect("localhost", "root", "", "db_rumah_makan_padang");
```

### 5. Konfigurasi Email (cek_email.php)
Edit file `Api/cek_email.php` dan isi dengan kredensial Gmail kamu:
```php
$username = 'emailkamu@gmail.com';
$password = 'app_password_16_karakter';
```

> **Catatan:** Gunakan App Password Gmail, bukan password biasa.  
> Aktifkan 2-Step Verification → buat App Password di myaccount.google.com

### 6. Aktifkan IMAP Gmail
Gmail Settings → See all settings → Forwarding and POP/IMAP → **Enable IMAP**

---

## 📱 Konfigurasi MacroDroid

1. Buat automation baru di MacroDroid
2. **Trigger:** Notification Received → pilih aplikasi DANA
3. **Action:** Send Email
   - To: `emailkamu@gmail.com`
   - Subject: `Notif DANA`
   - Body: (kosong atau isi teks notifikasi)

---

## 🔄 Alur Pembayaran QRIS

```
Kasir input transaksi
        ↓
Generate QRIS dinamis sesuai nominal
        ↓
Pelanggan scan & bayar via DANA
        ↓
Notifikasi DANA masuk di HP kasir
        ↓
MacroDroid kirim email ke Gmail
        ↓
Frontend polling cek_email.php (tiap 5 detik)
        ↓
Email terdeteksi → status transaksi → Selesai
        ↓
Modal QRIS berubah jadi ✔ Transaksi Berhasil
```

---

## 🗄️ Database

Database: `db_rumah_makan_padang`

Tabel utama:
- `transaksi` — data transaksi dengan status: `Menunggu`, `Diproses`, `Selesai`, `Dibatalkan`
- `detail_transaksi` — item per transaksi
- `menu` — daftar menu beserta harga
- `kategori` — kategori menu
- `karyawan` — data karyawan/kasir
- `akun` — akun login kasir
- `meja` — data meja
- `metode_pembayaran` — metode bayar (QRIS, Tunai, dll)

---

Dibuat sebagai tugas mata kuliah — Sistem Informasi Rumah Makan Padang Nusantara.
