<?php
header('Content-Type: application/json');
require '../koneksi.php';

$data = json_decode(file_get_contents('php://input'), true);

$id_karyawan = intval($data['kasir_id'] ?? 1);
$id_meja     = !empty($data['id_meja']) ? intval($data['id_meja']) : 'NULL';
$tipe_order  = mysqli_real_escape_string($conn, $data['tipe_order']);
$id_metode   = intval($data['id_metode']);
$tanggal     = date('Y-m-d');


$items_str = implode(',', array_map(fn($i) => intval($i['id_menu']) . ':' . intval($i['qty']), $data['items']));

$sql = "CALL sp_input_transaksi('$tanggal', $id_karyawan, $id_meja, '$tipe_order', $id_metode, '$items_str')";
$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode(['success' => false, 'message' => mysqli_error($conn)]);
    exit;
}

$row = mysqli_fetch_assoc($result);
echo json_encode([
    'success'      => true,
    'id_transaksi' => $row['id_transaksi_baru']
]);
