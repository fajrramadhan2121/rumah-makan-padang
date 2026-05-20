<?php

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$amount = $data['amount'];

$url = "https://qrisku.my.id/api";

$postData = [
    "amount" => $amount,
    "qris_statis" => "00020101021126570011ID.DANA.WWW011893600915315391687102091539168710303UMI51440014ID.CO.QRIS.WWW0215ID10210792199320303UMI5204481453033605802ID5914Fajar Store ID6011Kab. Kediri6105641576304EBFE"
];

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);

curl_close($ch);

echo $response;
?>