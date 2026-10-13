let kartyak=null;
let szurogombok=null;

let hatter=null;
let bezarGomb=null;

let tipusElem=null;
let nevElem=null;
let korElem=null;
let erkezesElem=null;
let szemelyisegElem=null;
 

    //gether all date for use and store it in local storage
    function dataStoring() {
            kartyak = document.querySelectorAll(".allat-kartya");
            
            hatter = document.getElementById("adatlapHatter");
            bezarGomb = document.getElementById("adatlapBezar");

            tipusElem = document.getElementById("adatlapTipus");
            nevElem = document.getElementById("adatlapNev");
            korElem = document.getElementById("adatlapKor");
            erkezesElem = document.getElementById("adatlapErkezes");
            szemelyisegElem = document.getElementById("adatlapSzemelyiseg");


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

    }





    // Kutyak es macskak szurese
    function szures(gomb) {
        const szuro = gomb.dataset.filter;

        if(kartyak==null){
            kartyak = document.querySelectorAll(".allat-kartya");
        }
        if(szurogombok==null){
            szurogombok = document.querySelectorAll(".szurok button");
        }



        szurogombok.forEach(function (masikGomb) {
            masikGomb.classList.remove("aktiv");
        });

        gomb.classList.add("aktiv");

        kartyak.forEach(function (kartya) {
            const tipus = kartya.dataset.tipus;

            if (szuro === "Mind" || tipus === szuro) {
                kartya.style.display = "";
            } else {
                kartya.style.display = "none";
            }
        });
    }


        // Reszletes adatlap megnyitasa
    function adatlapMegnyitasa(kartya) {

        if(kartyak==null){
            dataStoring();
        }


        const nev = kartya.dataset.nev;
        const tipus = kartya.dataset.tipus;
        const kor = kartya.dataset.kor;
        const erkezes = kartya.dataset.erkezes;
        const szemelyiseg = kartya.dataset.szemelyiseg;

        nevElem.textContent = nev;
        tipusElem.textContent =
            tipus === tipus.toLowerCase() ? tipus.charAt(0).toUpperCase() + tipus.slice(1) : tipus;

        korElem.textContent = "Életkor: " + kor;
        erkezesElem.textContent =
            "Menhelyre érkezett: " + erkezes;

        szemelyisegElem.textContent = szemelyiseg;

        hatter.classList.add("nyitva");
        hatter.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";


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