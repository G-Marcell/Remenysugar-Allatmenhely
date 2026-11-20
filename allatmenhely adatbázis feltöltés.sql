USE allatmenhely;

-- ---------------------------------------------------------
-- insert to animals
-- ---------------------------------------------------------

INSERT INTO animals
(chip_szam, nev, faj_id, fajta_id, nem, szuletesi_datum,
 meret, statusz, kep_url)
VALUES
-- Kutyák (faj_id = 1)
('789012345678901', 'Zokni', 1, 3, 'Fiú', '2021-04-15', 'Nagy', 'Gazdikereső', 'https://example.com/zokni.jpg'),
('901234567890123', 'Rex', 1, 4, 'Fiú', '2019-07-11', 'Nagy', 'Karantén', 'https://example.com/rex.jpg'),
('556789012345678', 'Bodri', 1, 2, 'Fiú', '2020-10-30', 'Nagy', 'Gazdikereső', 'https://example.com/bodri.jpg'),
('778901234567890', 'Luna', 1, 5, 'Lány', '2022-06-18', 'Közepes', 'Gazdikereső', 'https://example.com/luna.jpg'),
('889012345678901', 'Max', 1, 6, 'Fiú', '2023-01-25', 'Közepes', 'Gazdikereső', 'https://example.com/max.jpg'),
('990123456789012', 'Bella', 1, 7, 'Lány', '2021-09-03', 'Kicsi', 'Gazdikereső', 'https://example.com/bella.jpg'),

-- Macskák (faj_id = 2)
('890123456789012', 'Mici', 2, 6, 'Lány', '2022-01-20', 'Kicsi', 'Gazdikereső', 'https://example.com/mici.jpg'),
('667890123456789', 'Hópihe', 2, 7, 'Lány', '2024-02-12', 'Kicsi', 'Karantén', 'https://example.com/hopihe.jpg'),
('101234567890123', 'Cirmi', 2, 8, 'Fiú', '2020-08-14', 'Kicsi', 'Gazdikereső', 'https://example.com/cirmi.jpg'),
('212345678901234', 'Nala', 2, 9, 'Lány', '2023-04-06', 'Kicsi', 'Gazdikereső', 'https://example.com/nala.jpg'),
('323456789012345', 'Kormi', 2, 10, 'Fiú', '2021-11-22', 'Közepes', 'Gazdikereső', 'https://example.com/kormi.jpg'),

-- Hörcsögök (faj_id = 3)
('112345678901234', 'Pamacs', 3, 13, 'Lány', '2023-05-09', 'Kicsi', 'Gazdikereső', 'https://example.com/pamacs.jpg'),
('434567890123456', 'Mogyoró', 3, 14, 'Fiú', '2024-01-12', 'Kicsi', 'Gazdikereső', 'https://example.com/mogyoro.jpg'),
('545678901234567', 'Gombóc', 3, 15, 'Lány', '2023-08-20', 'Kicsi', 'Gazdikereső', 'https://example.com/gomboc.jpg'),

-- Nyulak (faj_id = 4)
('223456789012345', 'Tappancs', 4, 17, 'Fiú', '2022-09-17', 'Közepes', 'Gazdikereső', 'https://example.com/tappancs.jpg'),
('656789012345678', 'Hókusz', 4, 18, 'Fiú', '2023-02-11', 'Kicsi', 'Gazdikereső', 'https://example.com/hokusz.jpg'),
('767890123456789', 'Pihe', 4, 19, 'Lány', '2022-12-05', 'Közepes', 'Gazdikereső', 'https://example.com/pihe.jpg'),

-- Tengerimalacok (faj_id = 5)
('445678901234567', 'Morzsa', 5, 21, 'Fiú', '2023-03-22', 'Kicsi', 'Gazdikereső', 'https://example.com/morzsa.jpg'),
('878901234567890', 'Bogyó', 5, 22, 'Lány', '2022-07-19', 'Kicsi', 'Gazdikereső', 'https://example.com/bogyo.jpg'),

-- Madarak (faj_id = 6)
('334567890123456', 'Csipike', 6, 25, 'Lány', '2021-12-01', 'Kicsi', 'Gazdisodott', 'https://example.com/csipike.jpg'),
('989012345678901', 'Fütyi', 6, 26, 'Fiú', '2022-05-14', 'Kicsi', 'Gazdikereső', 'https://example.com/futy i.jpg'),

-- Egyéb állatok (faj_id = 7)
('109876543210987', 'Tekla', 7, 30, 'Lány', '2020-06-21', 'Kicsi', 'Gazdikereső', 'https://example.com/tekla.jpg'),
('119876543210987', 'Samu', 7, 31, 'Fiú', '2022-03-08', 'Közepes', 'Gazdikereső', 'https://example.com/samu.jpg');

-- ---------------------------------------------------------
-- insert to onkentesek
-- ---------------------------------------------------------

INSERT INTO onkentesek
(teljes_nev, email, jelszo_hash, telefon, lakcim, iranyitoszam, szerep, statusz)
VALUES
('Tóth Réka', 'reka.toth@example.com', 'teszt_hash_05', '+36 30 111 2222', 'Duna utca 5.', '2310', 'Önkéntes', 'Aktív'),
('Kiss Bence', 'bence.kiss@example.com', 'teszt_hash_06', '+36 20 222 3333', 'Petőfi utca 7.', '2310', 'Önkéntes', 'Aktív'),
('Varga Lilla', 'lilla.varga@example.com', 'teszt_hash_07', '+36 70 333 4444', 'Iskola utca 9.', '2310', 'Alkalmazott', 'Aktív'),
('Molnár Dávid', 'david.molnar@example.com', 'teszt_hash_08', '+36 30 444 5555', 'Árpád utca 11.', '2310', 'Önkéntes', 'Inaktív'),
('Farkas Nóra', 'nora.farkas@example.com', 'teszt_hash_09', '+36 20 555 6666', 'Tavasz utca 14.', '2310', 'Önkéntes', 'Aktív'),
('Balogh Márk', 'mark.balogh@example.com', 'teszt_hash_10', '+36 70 666 7777', 'Kert utca 18.', '2310', 'Admin', 'Aktív');

-- ---------------------------------------------------------
-- insert to orvosi_ellatas
-- ---------------------------------------------------------

-- ---------------------------------------------------------
-- insert to orvosi_ellatas
-- ---------------------------------------------------------

INSERT INTO orvosi_ellatas
(animal_id, tipus, megnevezes, datum, kovetkezo_esedekesseg, orvos_neve, megjegyzes)
VALUES
(6, 'Vizsgálat', 'Általános kontroll', '2026-09-12', '2027-03-12', 'Dr. Nagy Éva', 'Kontrollvizsgálat rendben.'),
(7, 'Oltás', 'Kölyökkori oltás', '2026-09-18', '2027-09-18', 'Dr. Kiss András', 'Oltás beadva.'),
(8, 'Kezelés', 'Bőr ellenőrzése', '2026-09-21', '2026-10-21', 'Dr. Nagy Éva', 'Utóellenőrzés szükséges.'),
(9, 'Parazitamentesítés', 'Paraziták elleni kezelés', '2026-09-22', '2026-12-22', 'Dr. Kiss András', 'Kezelés elvégezve.'),
(10, 'Vizsgálat', 'Általános állapotfelmérés', '2026-09-23', '2027-03-23', 'Dr. Nagy Éva', 'Az állat állapota megfelelő.'),
(11, 'Oltás', 'Éves oltás', '2026-09-24', '2027-09-24', 'Dr. Kiss András', 'Oltási könyv frissítve.'),
(12, 'Kezelés', 'Általános kezelés', '2026-09-26', '2026-10-26', 'Dr. Nagy Éva', 'Kontroll javasolt.'),
(13, 'Vizsgálat', 'Megelőző vizsgálat', '2026-09-27', '2027-03-27', 'Dr. Kiss András', 'Állapotfelmérés megtörtént.'),
(14, 'Parazitamentesítés', 'Megelőző kezelés', '2026-09-29', '2026-12-29', 'Dr. Nagy Éva', 'Következő kezelés később esedékes.');


-- ---------------------------------------------------------
-- insert to feladatok
-- ---------------------------------------------------------

INSERT INTO feladatok
(allat_id, onkentes_id, tevekenyseg, idopont)
SELECT a.animal_id, o.onkentes_id, 'Sétáltatás', '2026-10-13 09:00:00'
FROM animals a
JOIN onkentesek o ON o.email = 'reka.toth@example.com'
WHERE a.nev = 'Zokni';

INSERT INTO feladatok
(allat_id, onkentes_id, tevekenyseg, idopont)
SELECT a.animal_id, o.onkentes_id, 'Etetés', '2026-10-13 09:30:00'
FROM animals a
JOIN onkentesek o ON o.email = 'bence.kiss@example.com'
WHERE a.nev = 'Mici';

INSERT INTO feladatok
(allat_id, onkentes_id, tevekenyseg, idopont)
SELECT a.animal_id, o.onkentes_id, 'Ketrec tisztítása', '2026-10-13 10:00:00'
FROM animals a
JOIN onkentesek o ON o.email = 'nora.farkas@example.com'
WHERE a.nev = 'Pamacs';

INSERT INTO feladatok
(allat_id, onkentes_id, tevekenyseg, idopont)
SELECT a.animal_id, o.onkentes_id, 'Játék és szocializáció', '2026-10-13 10:30:00'
FROM animals a
JOIN onkentesek o ON o.email = 'reka.toth@example.com'
WHERE a.nev = 'Tappancs';

INSERT INTO feladatok
(allat_id, onkentes_id, tevekenyseg, idopont)
SELECT a.animal_id, o.onkentes_id, 'Sétáltatás', '2026-10-13 11:00:00'
FROM animals a
JOIN onkentesek o ON o.email = 'bence.kiss@example.com'
WHERE a.nev = 'Csipike';

INSERT INTO feladatok
(allat_id, onkentes_id, tevekenyseg, idopont)
SELECT a.animal_id, o.onkentes_id, 'Etetés', '2026-10-13 11:30:00'
FROM animals a
JOIN onkentesek o ON o.email = 'nora.farkas@example.com'
WHERE a.nev = 'Morzsa';

INSERT INTO feladatok
(allat_id, onkentes_id, tevekenyseg, idopont)
SELECT a.animal_id, o.onkentes_id, 'Állapotellenőrzés', '2026-10-13 12:00:00'
FROM animals a
JOIN onkentesek o ON o.email = 'lilla.varga@example.com'
WHERE a.nev = 'Bodri';

INSERT INTO feladatok
(allat_id, onkentes_id, tevekenyseg, idopont)
SELECT a.animal_id, o.onkentes_id, 'Sétáltatás', '2026-10-13 13:00:00'
FROM animals a
JOIN onkentesek o ON o.email = 'reka.toth@example.com'
WHERE a.nev = 'Hópihe';

INSERT INTO feladatok
(allat_id, onkentes_id, tevekenyseg, idopont)
SELECT a.animal_id, o.onkentes_id, 'Környezet takarítása', '2026-10-13 14:00:00'
FROM animals a
JOIN onkentesek o ON o.email = 'mark.balogh@example.com'
WHERE a.nev = 'Rex';