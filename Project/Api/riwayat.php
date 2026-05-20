<?php
header('Content-Type: application/json');
require '../koneksi.php';

$tanggal = $_GET['tanggal'] ?? '';
$status  = $_GET['status'] ?? '';
$tipe    = $_GET['tipe'] ?? '';

$sql = "SELECT * FROM v_transaksi_lengkap WHERE 1=1";

if ($tanggal) $sql .= " AND tanggal = '$tanggal'";
if ($status)  $sql .= " AND status = '$status'";
if ($tipe)    $sql .= " AND tipe_order = '$tipe'";

$sql .= " ORDER BY waktu DESC";

$result = mysqli_query($conn, $sql);
$data   = mysqli_fetch_all($result, MYSQLI_ASSOC);

foreach ($data as &$trx) {
    $id     = $trx['id_transaksi'];
    $detail = mysqli_query($conn, "SELECT m.nama_menu AS nama, dt.qty, dt.subtotal_item AS subtotal 
                               FROM detail_transaksi dt 
                               JOIN menu m ON dt.id_menu = m.id_menu 
                               WHERE dt.id_transaksi = $id");
    $trx['items'] = mysqli_fetch_all($detail, MYSQLI_ASSOC);
}

echo json_encode($data);
