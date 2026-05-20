<?php
header('Content-Type: application/json');
require '../koneksi.php';

$action = $_GET['action'] ?? '';

if ($action === 'get_kategori') {
    $result = mysqli_query($conn, "SELECT * FROM kategori_menu ORDER BY nama_kategori");
    echo json_encode(mysqli_fetch_all($result, MYSQLI_ASSOC));
} elseif ($action === 'get_menu') {
    $result = mysqli_query($conn, "SELECT m.*, k.nama_kategori FROM menu m JOIN kategori_menu k ON m.id_kategori = k.id_kategori ORDER BY k.nama_kategori, m.nama_menu");
    echo json_encode(mysqli_fetch_all($result, MYSQLI_ASSOC));
} elseif ($action === 'get_meja') {
    $result = mysqli_query($conn, "SELECT * FROM meja ORDER BY nomor_meja");
    echo json_encode(mysqli_fetch_all($result, MYSQLI_ASSOC));
} elseif ($action === 'get_metode') {
    $result = mysqli_query($conn, "SELECT * FROM metode_pembayaran ORDER BY nama_metode");
    echo json_encode(mysqli_fetch_all($result, MYSQLI_ASSOC));
}
