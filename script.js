
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
