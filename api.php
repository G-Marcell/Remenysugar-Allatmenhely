<?php
// http://localhost/Remenysugar-Allatmenhely/api.php

header("Content-Type: application/json; charset=utf-8");

$conn = new mysqli("127.0.0.1", "root", "", "allatmenhely");
$conn->set_charset("utf8mb4");

$result = $conn->query("SELECT `faj_nev` FROM `fajok`");

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
    ORDER BY animals.erkezes DESC
    LIMIT 6;
    ");

if (!$result) {
    die("SQL-hiba: " . $conn->error);
}

$allatok = [];

while ($row = $result->fetch_assoc()) {
    $allatok[] = $row;
}

echo json_encode([
    "fajok" => $fajok,
    "allatok" => $allatok,
], JSON_UNESCAPED_UNICODE);


$conn->close();
?>