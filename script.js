
document.addEventListener("DOMContentLoaded", function () {
    const kartyak = document.querySelectorAll(".allat-kartya");
    const szurogombok = document.querySelectorAll(".szurok button");

    const hatter = document.getElementById("adatlapHatter");
    const bezarGomb = document.getElementById("adatlapBezar");

    const tipusElem = document.getElementById("adatlapTipus");
    const nevElem = document.getElementById("adatlapNev");
    const korElem = document.getElementById("adatlapKor");
    const erkezesElem = document.getElementById("adatlapErkezes");
    const szemelyisegElem = document.getElementById("adatlapSzemelyiseg");

    // Kutyak es macskak szurese
    szurogombok.forEach(function (gomb) {
        gomb.addEventListener("click", function () {
            const szuro = gomb.dataset.filter;

            szurogombok.forEach(function (masikGomb) {
                masikGomb.classList.remove("aktiv");
            });

            gomb.classList.add("aktiv");

            kartyak.forEach(function (kartya) {
                const tipus = kartya.dataset.tipus;

                if (szuro === "mind" || tipus === szuro) {
                    kartya.style.display = "";
                } else {
                    kartya.style.display = "none";
                }
            });
        });
    });

    // Reszletes adatlap megnyitasa
    function adatlapMegnyitasa(kartya) {
        const nev = kartya.dataset.nev;
        const tipus = kartya.dataset.tipus;
        const kor = kartya.dataset.kor;
        const erkezes = kartya.dataset.erkezes;
        const szemelyiseg = kartya.dataset.szemelyiseg;

        nevElem.textContent = nev;
        tipusElem.textContent =
            tipus === "kutya" ? "KUTYA" : "MACSKA";

        korElem.textContent = "Életkor: " + kor;
        erkezesElem.textContent =
            "Menhelyre érkezett: " + erkezes;

        szemelyisegElem.textContent = szemelyiseg;

        hatter.classList.add("nyitva");
        hatter.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        bezarGomb.focus();
    }

    // Kartyara vagy a nyilra kattintva is megnyilik
    kartyak.forEach(function (kartya) {
        kartya.addEventListener("click", function () {
            adatlapMegnyitasa(kartya);
        });
    });

    // Adatlap bezarasa
    function adatlapBezarasa() {
        hatter.classList.remove("nyitva");
        hatter.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    bezarGomb.addEventListener("click", adatlapBezarasa);

    // Kattintas a sotet hatterre
    hatter.addEventListener("click", function (event) {
        if (event.target === hatter) {
            adatlapBezarasa();
        }
    });

    // Escape billentyuvel is bezarhato
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && hatter.classList.contains("nyitva")) {
            adatlapBezarasa();
        }
    });
});

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

//Telfonszám,ne lehessen betűt beírni
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

    // Ha rákattintunk egy menüpontra, a menü csukódjon be automatikusan
    const menuLinkek = navMenu.querySelectorAll("a");
    menuLinkek.forEach(link => {
        link.addEventListener("click", function () {
            navMenu.classList.remove("nyitva");
            hamburgerGomb.textContent = "☰";
        });
    });
}



document.addEventListener("DOMContentLoaded", function () {
    const eleresKereso = document.getElementById("eleresKereso");
    const allatKartyak = document.querySelectorAll(".allat-kartya");

    if (eleresKereso) {
        eleresKereso.addEventListener("input", function (e) {
            const keresettSzo = e.target.value.toLowerCase().trim();

            allatKartyak.forEach(kartya => {
                const nev = kartya.getAttribute("data-nev") ? kartya.getAttribute("data-nev").toLowerCase() : "";
                const tipus = kartya.getAttribute("data-tipus") ? kartya.getAttribute("data-tipus").toLowerCase() : "";
                const teljesSzoveg = kartya.textContent.toLowerCase();

                // Ha megegyezik a kereséssel (vagy üres a mező)
                const talalat = keresettSzo === "" ||
                                nev.includes(keresettSzo) ||
                                tipus.includes(keresettSzo) ||
                                teljesSzoveg.includes(keresettSzo);

                if (talalat) {
                    kartya.classList.remove("rejtett"); // Megjelenítés
                } else {
                    kartya.classList.add("rejtett");    // Elrejtés
                }
            });
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const szuroGomb = document.getElementById("szuroGomb");
    const szuroPanel = document.getElementById("szuroPanel");

    if (szuroGomb && szuroPanel) {
        szuroGomb.addEventListener("click", function () {
            // Megnyitja vagy bezárja a panelt a .rejtett osztály cserélgetésével
            szuroPanel.classList.toggle("rejtett");
        });
    }
});