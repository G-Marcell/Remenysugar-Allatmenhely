-- =========================================================
-- ÁLLATMENHELY ADATBÁZIS
-- MySQL 8.x
-- =========================================================

CREATE DATABASE IF NOT EXISTS allatmenhely
CHARACTER SET utf8mb4
COLLATE utf8mb4_hungarian_ci;

USE allatmenhely;


-- =========================================================
-- 1. FAJOK
-- =========================================================

CREATE TABLE fajok (
    faj_id INT AUTO_INCREMENT PRIMARY KEY,
    faj_nev VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;


INSERT INTO fajok (faj_nev) VALUES
('Kutya'),
('Macska'),
('Hörcsög'),
('Nyúl'),
('Tengerimalac'),
('Madár'),
('Egyéb');


-- =========================================================
-- 2. FAJTÁK
-- =========================================================

CREATE TABLE fajtak (
    fajta_id INT AUTO_INCREMENT PRIMARY KEY,
    faj_id INT NOT NULL,
    fajta_nev VARCHAR(100) NOT NULL,

    CONSTRAINT fk_fajtak_faj
        FOREIGN KEY (faj_id)
        REFERENCES fajok(faj_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT uq_fajta
        UNIQUE (faj_id, fajta_nev)
) ENGINE=InnoDB;


-- Példa fajták

INSERT INTO fajtak (faj_id, fajta_nev)
SELECT faj_id, 'Tacskó'
FROM fajok
WHERE faj_nev = 'Kutya';

INSERT INTO fajtak (faj_id, fajta_nev)
SELECT faj_id, 'Német juhász'
FROM fajok
WHERE faj_nev = 'Kutya';

INSERT INTO fajtak (faj_id, fajta_nev)
SELECT faj_id, 'Labrador retriever'
FROM fajok
WHERE faj_nev = 'Kutya';

INSERT INTO fajtak (faj_id, fajta_nev)
SELECT faj_id, 'Main Coon'
FROM fajok
WHERE faj_nev = 'Macska';

INSERT INTO fajtak (faj_id, fajta_nev)
SELECT faj_id, 'Perzsa'
FROM fajok
WHERE faj_nev = 'Macska';

INSERT INTO fajtak (faj_id, fajta_nev)
SELECT faj_id, 'Brit rövidszőrű'
FROM fajok
WHERE faj_nev = 'Macska';


-- =========================================================
-- 3. ÁLLATOK
-- =========================================================

CREATE TABLE animals (
    animal_id INT AUTO_INCREMENT PRIMARY KEY,

    chip_szam VARCHAR(15) NOT NULL UNIQUE,

    nev VARCHAR(100) NOT NULL,

    faj_id INT NOT NULL,

    fajta_id INT NULL,

    nem ENUM(
        'Fiú',
        'Lány'
    ) NOT NULL,

    szuletesi_datum DATE NOT NULL,

    meret ENUM(
        'Kicsi',
        'Közepes',
        'Nagy'
    ) NOT NULL,

    statusz ENUM(
        'Karantén',
        'Gazdikereső',
        'Gazdisodott'
    ) NOT NULL DEFAULT 'Karantén',

    kep_url VARCHAR(500) NULL,

    CONSTRAINT fk_animals_faj
        FOREIGN KEY (faj_id)
        REFERENCES fajok(faj_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_animals_fajta
        FOREIGN KEY (fajta_id)
        REFERENCES fajtak(fajta_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT chk_chip_hossz
        CHECK (CHAR_LENGTH(chip_szam) = 15)

) ENGINE=InnoDB;


-- =========================================================
-- 4. ORVOSI ELLÁTÁS
-- =========================================================

CREATE TABLE orvosi_ellatas (
    medical_id INT AUTO_INCREMENT PRIMARY KEY,

    animal_id INT NOT NULL,

    tipus ENUM(
        'Oltás',
        'Műtét',
        'Kezelés',
        'Parazitamentesítés',
        'Vizsgálat',
        'Egyéb'
    ) NOT NULL,

    megnevezes VARCHAR(255) NOT NULL,

    datum DATE NOT NULL,

    kovetkezo_esedekesseg DATE NULL,

    orvos_neve VARCHAR(150) NOT NULL,

    megjegyzes TEXT NULL,

    CONSTRAINT fk_orvosi_ellatas_animal
        FOREIGN KEY (animal_id)
        REFERENCES animals(animal_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE

) ENGINE=InnoDB;


-- =========================================================
-- 5. ÖNKÉNTESEK
-- =========================================================

CREATE TABLE onkentesek (
    onkentes_id INT AUTO_INCREMENT PRIMARY KEY,

    teljes_nev VARCHAR(150) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    jelszo_hash VARCHAR(255) NOT NULL,

    telefon VARCHAR(30) NULL,

    lakcim VARCHAR(255) NULL,

    iranyitoszam CHAR(4) NULL,

    szerep ENUM(
        'Alkalmazott',
        'Önkéntes',
        'Admin'
    ) NOT NULL DEFAULT 'Önkéntes',

    statusz ENUM(
        'Aktív',
        'Inaktív'
    ) NOT NULL DEFAULT 'Aktív',

    CONSTRAINT chk_iranyitoszam
        CHECK (
            iranyitoszam IS NULL
            OR iranyitoszam REGEXP '^[0-9]{4}$'
        )

) ENGINE=InnoDB;


-- =========================================================
-- 6. FELADATOK / SÉTÁLTATÁSOK
-- =========================================================

CREATE TABLE feladatok (
    feladat_id INT AUTO_INCREMENT PRIMARY KEY,

    allat_id INT NOT NULL,

    onkentes_id INT NOT NULL,

    tevekenyseg VARCHAR(255) NOT NULL,

    idopont DATETIME NOT NULL,

    CONSTRAINT fk_feladatok_allat
        FOREIGN KEY (allat_id)
        REFERENCES animals(animal_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_feladatok_onkentes
        FOREIGN KEY (onkentes_id)
        REFERENCES onkentesek(onkentes_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE

) ENGINE=InnoDB;


-- =========================================================
-- 7. INDEXEK
-- =========================================================

CREATE INDEX idx_animals_faj
ON animals(faj_id);

CREATE INDEX idx_animals_fajta
ON animals(fajta_id);

CREATE INDEX idx_animals_statusz
ON animals(statusz);

CREATE INDEX idx_orvosi_animal
ON orvosi_ellatas(animal_id);

CREATE INDEX idx_orvosi_datum
ON orvosi_ellatas(datum);

CREATE INDEX idx_feladatok_allat
ON feladatok(allat_id);

CREATE INDEX idx_feladatok_onkentes
ON feladatok(onkentes_id);

CREATE INDEX idx_feladatok_idopont
ON feladatok(idopont);


-- =========================================================
-- 8. TRIGGEREK
-- Dátumellenőrzések
-- =========================================================

DELIMITER $$


-- ---------------------------------------------------------
-- Állat születési dátuma nem lehet jövőbeli
-- ---------------------------------------------------------

CREATE TRIGGER trg_animals_szuletesi_datum
BEFORE INSERT ON animals
FOR EACH ROW
BEGIN

    IF NEW.szuletesi_datum > CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
        'A születési dátum nem lehet jövőbeli dátum.';
    END IF;

END$$


-- UPDATE esetén is ellenőrizzük

CREATE TRIGGER trg_animals_szuletesi_datum_update
BEFORE UPDATE ON animals
FOR EACH ROW
BEGIN

    IF NEW.szuletesi_datum > CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
        'A születési dátum nem lehet jövőbeli dátum.';
    END IF;

END$$


-- ---------------------------------------------------------
-- Következő orvosi esedékesség nem lehet múltbeli
-- ---------------------------------------------------------

CREATE TRIGGER trg_orvosi_kovetkezo_datum
BEFORE INSERT ON orvosi_ellatas
FOR EACH ROW
BEGIN

    IF NEW.kovetkezo_esedekesseg IS NOT NULL
       AND NEW.kovetkezo_esedekesseg < CURDATE() THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
        'A következő esedékesség nem lehet múltbeli dátum.';

    END IF;

END$$


-- UPDATE esetén is ellenőrizzük

CREATE TRIGGER trg_orvosi_kovetkezo_datum_update
BEFORE UPDATE ON orvosi_ellatas
FOR EACH ROW
BEGIN

    IF NEW.kovetkezo_esedekesseg IS NOT NULL
       AND NEW.kovetkezo_esedekesseg < CURDATE() THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
        'A következő esedékesség nem lehet múltbeli dátum.';

    END IF;

END$$


DELIMITER ;