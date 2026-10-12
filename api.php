<?php
header("Content-Type: application/json; charset=utf-8");

$conn = new mysqli("127.0.0.1", "root", "", "allatmenhely");
$conn->set_charset("utf8mb4");

$result = $conn->query("SELECT `faj_nev` FROM `fajok`");

$fajok = [];

while ($row = $result->fetch_assoc()) {
    $fajok[] = $row["faj_nev"];
}

echo json_encode(
    $fajok,
    JSON_UNESCAPED_UNICODE
);
$conn->close();
?>