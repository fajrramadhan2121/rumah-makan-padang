<?php

$conn = mysqli_connect(
    "localhost",
    "root",
    "",
    "db_rumah_makan_padang"
);

if (!$conn) {
    die("Koneksi gagal");
}