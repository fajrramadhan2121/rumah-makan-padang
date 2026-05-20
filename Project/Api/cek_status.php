<?php

require '../koneksi.php';

$id = $_GET['id'];

$q = mysqli_query($conn,"
SELECT status
FROM transaksi
WHERE id_transaksi='$id'
");

$data = mysqli_fetch_assoc($q);

echo json_encode($data);