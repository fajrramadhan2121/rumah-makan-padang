<?php
header('Content-Type: application/json');
require '../koneksi.php';

$data     = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = md5($data['password'] ?? '');

$username = mysqli_real_escape_string($conn, $username);

$sql    = "SELECT a.*, k.nama, k.id_karyawan FROM akun a 
           JOIN karyawan k ON a.id_karyawan = k.id_karyawan
           WHERE a.username = '$username' AND a.password = '$password' AND a.is_aktif = 1";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) === 1) {
    $row = mysqli_fetch_assoc($result);
    echo json_encode([
        'success' => true,
        'kasir'   => [
            'id'   => $row['id_karyawan'],
            'nama' => $row['nama'],
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Username atau password salah.'
    ]);
}
