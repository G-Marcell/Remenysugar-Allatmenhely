let kartyak = null;
let szurogombok = null;

let hatter = null;
let bezarGomb = null;

let tipusElem = null;
let nevElem = null;
let korElem = null;
let erkezesElem = null;
let szemelyisegElem = null;
let eleresKereso = null;
let allatKartyak = null;

// Adatok összegyűjtése és tárolása
function dataStoring() {
    kartyak = document.querySelectorAll(".allat-kartya");
    szurogombok = document.querySelectorAll(".szurok button");
    
    hatter = document.getElementById("adatlapHatter");
    bezarGomb = document.getElementById("adatlapBezar");

    tipusElem = document.getElementById("adatlapTipus");
    nevElem = document.getElementById("adatlapNev");
    korElem = document.getElementById("adatlapKor");
    erkezesElem = document.getElementById("adatlapErkezes");
    szemelyisegElem = document.getElementById("adatlapSzemelyiseg");

    eleresKereso = document.getElementById("eleresKereso");

    // Adatlap bezarasa segédfüggvény
    function adatlapBezarasa() {
        if (hatter) {
            hatter.classList.remove("nyitva");
            hatter.classList.add("rejtett");
            hatter.setAttribute("aria-hidden", "true");
            document.body.style.overflow = ""; // Görgetés visszaengedése
        }
    }

    if (bezarGomb) {
        bezarGomb.removeEventListener("click", adatlapBezarasa);
        bezarGomb.addEventListener("click", adatlapBezarasa);
    }

    if (hatter) {
        hatter.addEventListener("click", function (event) {
            if (event.target === hatter) {
                adatlapBezarasa();
            }
        });
    }
}

// Kutyák és macskák szűrése (Egységesített, fix verzió)
function szures(gomb) {
    if (kartyak == null || kartyak.length === 0 || szurogombok == null || szurogombok.length === 0) {
        dataStoring();
    }

    const szuro = (gomb.dataset.filter || "").toLowerCase().trim();
    
    if (szurogombok) {
        szurogombok.forEach(function (masikGomb) {
            masikGomb.classList.remove("aktiv");
        });
    }

    gomb.classList.add("aktiv");

    if (kartyak) {
        kartyak.forEach(function (kartya) {
            const tipus = (kartya.dataset.tipus || "").toLowerCase().trim();

            if (szuro === "mind" || szuro === "" || tipus === szuro) {
                kartya.classList.remove("rejtett"); // Megjelenítés osztállyal
            } else {
                kartya.classList.add("rejtett");    // Elrejtés osztállyal
            }
        });
    }
}

// Fülek (Önkéntesség / Ideiglenes befogadás) váltása
const fulek = document.querySelectorAll(".ful");
const urlapCim = document.querySelector(".urlap-doboz h3");

fulek.forEach(ful => {
    ful.addEventListener("click", function () {
        fulek.forEach(f => f.classList.remove("aktiv"));
        this.classList.add("aktiv");

        if (this.textContent.includes("IDEIGLENES")) {
            urlapCim.textContent = "Ideiglenes befogadás jelentkezés";
        } else {
            urlapCim.textContent = "Önkéntes jelentkezés";
        }
    });
});

// Telefonszám mező ellenőrzése (ne lehessen betűt beírni)
const telefonMezo = document.getElementById("telefonMezo");
if (telefonMezo) {
    telefonMezo.addEventListener("input", function (e) {
        this.value = this.value.replace(/[^0-9+]/g, '');
    });
}

// Hamburgermenü kezelése mobilon
const hamburgerGomb = document.getElementById("hamburgerGomb");
const navMenu = document.getElementById("navMenu");

if (hamburgerGomb && navMenu) {
    hamburgerGomb.addEventListener("click", function () {
        navMenu.classList.toggle("nyitva");

        if (navMenu.classList.contains("nyitva")) {
            hamburgerGomb.textContent = "✕";
        } else {
            hamburgerGomb.textContent = "☰";
        }
    });

    const menuLinkek = navMenu.querySelectorAll("a");
    menuLinkek.forEach(link => {
        link.addEventListener("click", function () {
            navMenu.classList.remove("nyitva");
            hamburgerGomb.textContent = "☰";
        });
    });
}

// Keresőmező működése
document.addEventListener("DOMContentLoaded", function () {
    dataStoring();

    if (eleresKereso) {
        eleresKereso.addEventListener("input", function (e) {
            const keresettSzo = e.target.value.toLowerCase().trim();
            if (kartyak == null || kartyak.length <= 1) {
                dataStoring();
            }

            kartyak.forEach(kartya => {
                const nev = kartya.getAttribute("data-nev") ? kartya.getAttribute("data-nev").toLowerCase() : "";
                const tipus = kartya.getAttribute("data-tipus") ? kartya.getAttribute("data-tipus").toLowerCase() : "";
                const teljesSzoveg = kartya.textContent.toLowerCase();

                const talalat = keresettSzo === "" ||
                                nev.includes(keresettSzo) ||
                                tipus.includes(keresettSzo) ||
                                teljesSzoveg.includes(keresettSzo);

                if (talalat) {
                    kartya.classList.remove("rejtett");
                } else {
                    kartya.classList.add("rejtett");
                }
            });
        });
    }
});

// Adatlap és gombok kezelése DOM betöltődés után
document.addEventListener("DOMContentLoaded", function () {
    const adatlapHatter = document.getElementById("adatlapHatter");
    const adatlapVissza = document.getElementById("adatlapVissza");
    const orokbefogadGomb = document.getElementById("orokbefogadGomb");

    const adatlapKep = document.getElementById("adatlapKep");
    const adatlapTipus = document.getElementById("adatlapTipus");
    const adatlapNev = document.getElementById("adatlapNev");
    const adatlapKor = document.getElementById("adatlapKor");
    const adatlapErkezes = document.getElementById("adatlapErkezes");
    const adatlapSzemelyiseg = document.getElementById("adatlapSzemelyiseg");

    // 1. Kattintás bármelyik állat kártyára -> Adatlap megnyitása
    document.addEventListener("click", function (e) {
        const kartya = e.target.closest(".allat-kartya");
        if (kartya) {
            const tipus = kartya.getAttribute("data-tipus") || "Állat";
            const nev = kartya.getAttribute("data-nev") || "Névtelen";
            const kor = kartya.getAttribute("data-kor") || "Nincs megadva";
            const erkezes = kartya.getAttribute("data-erkezes") || "Nincs megadva";
            const szemelyiseg = kartya.getAttribute("data-szemelyiseg") || "Ehhez az állathoz még nincs megadva részletes leírás.";
            
            const imgElem = kartya.querySelector("img");
            const kepSrc = imgElem ? imgElem.src : "";

            if (adatlapKep) adatlapKep.src = kepSrc;
            if (adatlapTipus) adatlapTipus.textContent = tipus.toUpperCase();
            if (adatlapNev) adatlapNev.textContent = nev;
            if (adatlapKor) adatlapKor.textContent = kor;
            if (adatlapErkezes) adatlapErkezes.textContent = erkezes;
            if (adatlapSzemelyiseg) adatlapSzemelyiseg.textContent = szemelyiseg;

            if (adatlapHatter) {
                adatlapHatter.classList.remove("rejtett");
                adatlapHatter.classList.add("nyitva");
                document.body.style.overflow = "hidden";
            }
        }
    });

    // 2. Vissza gomb
    if (adatlapVissza) {
        adatlapVissza.addEventListener("click", function () {
            if (adatlapHatter) {
                adatlapHatter.classList.add("rejtett");
                adatlapHatter.classList.remove("nyitva");
                document.body.style.overflow = ""; 
            }
        });
    }

    // 3. Örökbefogadom gomb: Átirányítás és adatmentés sessionStorage-be
    if (orokbefogadGomb) {
        orokbefogadGomb.addEventListener("click", function () {
            const activeNevElem = document.getElementById("adatlapNev");
            const allatNev = activeNevElem ? activeNevElem.textContent : "Kedvenc";
            
            sessionStorage.setItem("orokbefogadandoAllat", allatNev);
            
            if (adatlapHatter) {
                adatlapHatter.classList.add("rejtett");
                adatlapHatter.classList.remove("nyitva");
                document.body.style.overflow = ""; 
            }
            window.location.href = "orokbefogadas.html";
        });
    }

    // 4. Kattintás a sötét háttérre kívül -> Bezárás
    if (adatlapHatter) {
        adatlapHatter.addEventListener("click", function (e) {
            if (e.target === adatlapHatter) {
                adatlapHatter.classList.add("rejtett");
                adatlapHatter.classList.remove("nyitva");
                document.body.style.overflow = ""; 
            }
        });
    }
});

const kivalasztottAllatCimke = document.getElementById("kivalasztottAllatNev");
if (kivalasztottAllatCimke) {
    const mentettNev = sessionStorage.getItem("orokbefogadandoAllat");
    if (mentettNev) {
        kivalasztottAllatCimke.textContent = mentettNev;
    }
}