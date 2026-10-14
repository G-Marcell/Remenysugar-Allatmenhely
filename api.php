<?php
// http://localhost/Remenysugar-Allatmenhely/api.php

header("Content-Type: application/json; charset=utf-8");

$conn = new mysqli("127.0.0.1", "root", "", "allatmenhely");
$conn->set_charset("utf8mb4");

$result = $conn->query(
    "SELECT DISTINCT fajok.faj_nev
    FROM (
        SELECT faj_id
        FROM animals
        WHERE statusz = 'Gazdikereső'
        ORDER BY erkezes ASC
        LIMIT 6
    ) AS legujabb
    INNER JOIN fajok
        ON legujabb.faj_id = fajok.faj_id"
);

$fajok = [];

while ($row = $result->fetch_assoc()) {
    $fajok[] = $row["faj_nev"];
}




//

$result = $conn->query(
    "SELECT
        animals.*,
        fajok.faj_nev AS faj
    FROM animals
    INNER JOIN fajok
        ON animals.faj_id = fajok.faj_id
    WHERE animals.statusz = 'Gazdikereső'
    ORDER BY animals.erkezes ASC
    LIMIT 6;
    ");

if (!$result) {
    die("SQL-hiba: " . $conn->error);
}

$allatok_limit = [];

while ($row = $result->fetch_assoc()) {
    $allatok_limit[] = $row;
}

//

$result = $conn->query(
    "SELECT
        animals.*,
        fajok.faj_nev AS faj,
        fajtaK.fajta_nev AS fajta
    FROM animals
    INNER JOIN fajok
        ON animals.faj_id = fajok.faj_id
    INNER JOIN fajtak
        ON animals.fajta_id = fajtak.fajta_id
    WHERE animals.statusz = 'Gazdikereső';
    ");

if (!$result) {
    die("SQL-hiba: " . $conn->error);
}

$allatok = [];

while ($row = $result->fetch_assoc()) {
    $allatok[] = $row;
}



// Válasz JSON formátumban



echo json_encode([
    "fajok" => $fajok,
    "allatok_limit" => $allatok_limit,
    "allatok" => $allatok
], JSON_UNESCAPED_UNICODE);


$conn->close();
?>