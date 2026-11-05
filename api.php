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

    loadEnv(__DIR__ . "/allatmenhely.env");

    $action = isset($_GET['action']) ? $_GET['action'] : '';

    // Csatlakozás a környezeti változókkal
    $conn = new mysqli(
        $_ENV['DB_HOST'],
        $_ENV['DB_USER'],
        $_ENV['DB_PASSWORD'],
        $_ENV['DB_NAME'],
        (int)$_ENV['DB_PORT']
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

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(["error" => "Hibás JSON formátum"]);
        exit;
    }

    // Jelszó hash-elése
    $jelszo_hash = password_hash($data["jelszo"], PASSWORD_BCRYPT);

    $stmt = $conn->prepare(
        "INSERT INTO onkentesek
        (teljes_nev, email, jelszo_hash, telefon, lakcim, iranyitoszam, szerep, statusz)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );

    $stmt->bind_param(
        "ssssssss",
        $data["teljes_nev"],
        $data["email"],
        $jelszo_hash,
        $data["telefon"],
        $data["lakcim"],
        $data["iranyitoszam"],
        $data["szerep"],
        $data["statusz"]
    );
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Sikertelen mentés"]);
    }

    $stmt->close();
}

function loadEnv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}



// Ezt a fájl végén egyszer hívjuk meg.
handleRequest();

?>
