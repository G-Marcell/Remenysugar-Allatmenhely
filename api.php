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

    $action = isset($_GET['action']) ? $_GET['action'] : '';

    $cacheConfig = [
        'getDistinctFajok'  => 300, 
        'getLimitedAnimals' => 300,  
        'getAllAnimals'     => 300   
    ];

    $cacheDir = __DIR__ . '/cache';
    $cacheFile = $cacheDir . '/' . $action . '.json';


    if (isset($cacheConfig[$action]) && file_exists($cacheFile)) {
        $age = time() - filemtime($cacheFile);
        if ($age < $cacheConfig[$action]) {
            readfile($cacheFile);
            return;
        }
    }

    loadEnv(__DIR__ . "/allatmenhely.env");

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

            case "handleAdoption":
                handleAdoption($conn);
                $conn->close();
                return;

            default:
                http_response_code(400);
                $data = ["error" => "Ismeretlen művelet"];
                break;
        }
        $jsonOutput = json_encode($data, JSON_UNESCAPED_UNICODE);

       if (isset($cacheConfig[$action])) {
            if (!is_dir($cacheDir)) {
                mkdir($cacheDir, 0755, true);
            }
            file_put_contents($cacheFile, $jsonOutput);
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



function handleAdoption($conn) {
    header("Content-Type: application/json; charset=utf-8");

    $data = json_decode(file_get_contents("php://input"), true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(["error" => "Hibás JSON formátum"]);
        return;
    }

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(["error" => "Hibás JSON formátum"]);
        exit;
    }
    
    if (empty($data["teljes_nev"]) || empty($data["email"]) || empty($data["telefonszam"]) || empty($data["animal_id"]) || empty($data["idopont"]) || empty($data["bemutatkozas"])) {
        http_response_code(400);
        echo json_encode(["error" => "Minden mező kitöltése kötelező!"]);
        return;
    }

    $conn->begin_transaction();
    try {
        $stmtCheck = $conn->prepare("SELECT orokbefogado_id FROM orokbefogadok WHERE email = ? LIMIT 1");
        $stmtCheck->bind_param("s", $data["email"]);
        $stmtCheck->execute();
        $result = $stmtCheck->get_result();

        if ($row = $result->fetch_assoc()) {
            $orokbefogado_id = $row["orokbefogado_id"];
            
            $stmtUpdate = $conn->prepare("UPDATE orokbefogadok SET teljes_nev = ?, telefonszam = ? WHERE orokbefogado_id = ?");
            $stmtUpdate->bind_param("ssi", $data["teljes_nev"], $data["telefonszam"], $orokbefogado_id);
            $stmtUpdate->execute();
            $stmtUpdate->close();
        } else {
            $stmtInsert = $conn->prepare("INSERT INTO orokbefogadok (teljes_nev, email, telefonszam) VALUES (?, ?, ?)");
            $stmtInsert->bind_param("sss", $data["teljes_nev"], $data["email"], $data["telefonszam"]);
            $stmtInsert->execute();
            
            $orokbefogado_id = $conn->insert_id;
            $stmtInsert->close();
        }
        $stmtCheck->close();


        $stmtApp = $conn->prepare("INSERT INTO orokbefogadasi_jelentkezesek (orokbefogado_id, animal_id, idopont, bemutatkozas) VALUES (?, ?, ?, ?)");
        $stmtApp->bind_param("iiss", $orokbefogado_id, $data["animal_id"], $data["idopont"], $data["bemutatkozas"]);
        $stmtApp->execute();
        $stmtApp->close();


        $conn->commit();
        echo json_encode(["success" => true, "message" => "Jelentkezés sikeresen rögzítve!"]);

    } catch (mysqli_sql_exception $e) {
        $conn->rollback();


        if ($e->getCode() === 1062) {
            http_response_code(409);
            echo json_encode(["error" => "Erre az állatra már adtál be jelentkezést ezzel az e-mail címmel!"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Adatbázis hiba történt a mentés során."]);
        }
    }
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
