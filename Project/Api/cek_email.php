<?php

require '../koneksi.php';

$hostname = '{imap.gmail.com:993/imap/ssl}INBOX';

$username = ' ';

$password = ' ';

$inbox = imap_open(
    $hostname,
    $username,
    $password
);

if(!$inbox){

    die('Gagal konek Gmail');

}

$emails = imap_search(
    $inbox,
    'UNSEEN'
);

if($emails){

    rsort($emails);

    foreach($emails as $email_number){

        $body = imap_body(
            $inbox,
            $email_number
        );
 
        if(
            stripos(
                $body,
                'berhasil diterima'
            ) !== false
        ){

            mysqli_query($conn,"
                UPDATE transaksi
                SET status='Selesai'
                WHERE id_transaksi = (
                    SELECT id_transaksi FROM (
                        SELECT id_transaksi
                        FROM transaksi
                        WHERE status='Menunggu'
                        ORDER BY id_transaksi DESC
                        LIMIT 1
                    ) as x
                )
            ");

            echo 'UPDATE BERHASIL';
            break;

        }

        imap_setflag_full(
            $inbox,
            $email_number,
            "\\Seen"
        );

    }

}

imap_close($inbox);

echo "OK";

?>