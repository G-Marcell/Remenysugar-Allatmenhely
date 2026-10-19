<?php

function getDistinctFajok($conn) {
    $result = $conn->query("
        SELECT DISTINCT f.faj_nev
        FROM (
            SELECT faj_id
            FROM animals
            WHERE statusz = 'Gazdikereső'
            ORDER BY erkezes ASC
            LIMIT 6
        ) AS legujabb
        INNER JOIN fajok f ON legujabb.faj_id = f.faj_id
    ");

    if (!$result) {
        throw new Exception($conn->error);
    }

    $fajok = [];

    while ($row = $result->fetch_assoc()) {
        $fajok[] = $row["faj_nev"];
    }

    return $fajok;
}


function getLimitedAnimals($conn) {
    $result = $conn->query("
        SELECT animals.*, fajok.faj_nev AS faj
        FROM animals
        INNER JOIN fajok ON animals.faj_id = fajok.faj_id
        WHERE animals.statusz = 'Gazdikereső'
        ORDER BY animals.erkezes ASC
        LIMIT 6
    ");

    if (!$result) {
        throw new Exception($conn->error);
    }

    $allatok_limit = [];

    while ($row = $result->fetch_assoc()) {
        $allatok_limit[] = $row;
    }

    return $allatok_limit;
}


function getAllAnimals($conn) {
    $result = $conn->query("
        SELECT
            animals.*,
            fajok.faj_nev AS faj,
            fajtak.fajta_nev AS fajta
        FROM animals
        INNER JOIN fajok ON animals.faj_id = fajok.faj_id
        INNER JOIN fajtak ON animals.fajta_id = fajtak.fajta_id
        WHERE animals.statusz = 'Gazdikereső'
    ");

    if (!$result) {
        throw new Exception($conn->error);
    }

    $allatok = [];

    while ($row = $result->fetch_assoc()) {
        $allatok[] = $row;
    }

    return $allatok;
}




// Központi irányító
function handleRequest() {
    header("Content-Type: application/json; charset=utf-8");

    $action = $_GET["action"] ?? "";

    $conn = new mysqli(
        "127.0.0.1",
        "root",
        "",
        "allatmenhely"
    );

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(["error" => "Adatbázis-kapcsolati hiba"]);
        return;
    }

    $conn->set_charset("utf8mb4");

    try {
        switch ($action) {
            case "getDistinctFajok":
                $data = getDistinctFajok($conn);
                break;

            case "getLimitedAnimals":
                $data = getLimitedAnimals($conn);
                break;

            case "getAllAnimals":
                $data = getAllAnimals($conn);
                break;

            case "handleApplication":
                handleApplication($conn);
                $conn->close();
                return;

            default:
                http_response_code(400);
                $data = ["error" => "Ismeretlen művelet"];
                break;
        }

        echo json_encode($data, JSON_UNESCAPED_UNICODE);

    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(["error" => "Szerverhiba"]);
    }

    $conn->close();
}



// Jelentkezés feldolgozása
function handleApplication($conn) {
    header("Content-Type: application/json; charset=utf-8");

    $data = json_decode(file_get_contents("php://input"), true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(["error" => "Hibás JSON formátum"]);
        return;
    }

    $input = file_get_contents("php://input");
    $data = json_decode($input, true);



    $stmt = $conn->prepare(
    "INSERT INTO jelentkezők (teljes_nev,email,telefon,lakcim,szuletesi_datum,szerep)
     VALUES (? ,? ,? ,? ,? ,? )"
    );


    $stmt->bind_param(
        "ssssss",
        $data["nev"],
        $data["email"],
        $data["telefon"],
        $data["lakcim"],
        $data["szuletesiDatum"],
        $data["type"]
    );
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Sikertelen mentés"]);
    }

    $stmt->close();
}


// Ezt a fájl végén egyszer hívjuk meg.
handleRequest();

?>
