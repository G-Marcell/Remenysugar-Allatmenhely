document.addEventListener("DOMContentLoaded", async function () {

    const oldal = window.location.pathname;


    
    async function apiRequest(action) {

        const response = await fetch(
            `http://localhost/Remenysugar-Allatmenhely/api.php?action=${encodeURIComponent(action)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Hiba történt");
        }

        return data;
    }



    if (oldal.includes("remenysugar.html")) {

        const fajok = await apiRequest("getDistinctFajok");
        const allatok_limit = await apiRequest("getLimitedAnimals");

        //fajok alapján gombok létrehozása a szűrőhöz

        const szurok = document.querySelector(".szurok");

        for (let i = 0; i < fajok.length+1; i++) {
            if(i==fajok.length){
                const button = document.createElement("button");

                button.dataset.filter = "Mind";
                button.type = "button";
                button.textContent = "Mind";
                button.classList.add("aktiv");
                button.addEventListener("click", function () {
                    szures(button);
                });

                szurok.appendChild(button);
            }else{



                
            const button = document.createElement("button");

            button.dataset.filter = fajok[i];
            button.type = "button";
            button.textContent = fajok[i];
            button.addEventListener("click", function () {
                szures(button);
            });

            szurok.appendChild(button);}
        }

        // kártyák létrehozása az allatok alapján
        const allatKartyaContainerMainPage = document.querySelector(".allat-racs.fooldal-racs");

        allatok_limit.forEach(function (allat) {
            const kor = korSzamitas(allat.szuletesi_datum);
            const kartya = document.createElement("article");
            kartya.classList.add("allat-kartya");
            kartya.dataset.tipus = allat.faj;
            kartya.dataset.nev = allat.nev;
            kartya.dataset.kor = kor;
            kartya.dataset.erkezes = allat.erkezes;
            kartya.dataset.szemelyiseg = allat.leiras;
            kartya.addEventListener("click", function () {
                adatlapMegnyitasa(kartya);
            });



            // (https://raw.githubusercontent.com/G-Marcell/Remenysugar-Allatmenhely/main/animal_pictures/kep_neve.jpg) nek kell  lennie a linknek.
            kartya.innerHTML = `
                <img src="${allat.kep_url}" alt="${allat.nev} örökbefogadható ${allat.faj}">  
                <span class="allat-cimke">${allat.faj}</span>
                <div class="kartya-alja">
                    <div>
                        <h3>${allat.nev}</h3>
                        <p>${kor} éves</p>
                    </div>
                    <button class="reszlet-gomb" type="button"
                        aria-label="${allat.nev} adatlapja">→</button>
                </div>

                <div class="allat-hover">
                    <h3>${allat.nev} személyisége:</h3>
                    <p>${allat.leiras}</p>
                    <p><strong>Menhelyre érkezett:</strong> ${allat.erkezes}</p>
                    <p><strong>Életkor:</strong> ${kor} éves</p>
                    <span>Kattints a részletekért →</span>
                </div>

            `;
            allatKartyaContainerMainPage.appendChild(kartya);
        });
    }


    else if (oldal.includes("allatok.html")) 
    {
        // Lekérjük a fajokat a szűrőhöz és az összes állatot
        const fajok = await apiRequest("getDistinctFajok");
        const allatok = await apiRequest("getAllAnimals");

        // 1. Gombok létrehozása a szűrőhöz az allatok.html-en is
        const szurok = document.querySelector(".szurok");
        if (szurok) {
            szurok.innerHTML = ""; // Kiürítjük előtte

            for (let i = 0; i < fajok.length + 1; i++) {
                const button = document.createElement("button");
                button.type = "button";

                if (i === fajok.length) {
                    button.dataset.filter = "Mind";
                    button.textContent = "Mind";
                    button.classList.add("aktiv");
                } else {
                    button.dataset.filter = fajok[i];
                    button.textContent = fajok[i];
                }

                button.addEventListener("click", function () {
                    if (typeof szures === "function") {
                        szures(button);
                    }
                });

                szurok.appendChild(button);
            }
        }

        // 2. Kártyák létrehozása az állatok alapján
        const allatKartyaContainer = document.querySelector(".allat-racs");
        if (allatKartyaContainer) {
            allatKartyaContainer.innerHTML = "";

            allatok.forEach(function (allat) {
                const kor = korSzamitas(allat.szuletesi_datum);
                const kartya = document.createElement("article");
                kartya.classList.add("allat-kartya");
                kartya.dataset.tipus = allat.faj;
                kartya.dataset.nev = allat.nev;
                kartya.dataset.kor = kor;
                kartya.dataset.erkezes = allat.erkezes;
                kartya.dataset.szemelyiseg = allat.leiras;
                
                kartya.addEventListener("click", function () {
                    if (typeof adatlapMegnyitasa === "function") {
                        adatlapMegnyitasa(kartya);
                    }
                });

                kartya.innerHTML = `
                    <img src="${allat.kep_url}" alt="${allat.nev} örökbefogadható ${allat.faj}">  
                    <span class="allat-cimke">${allat.faj}</span>
                    <div class="kartya-alja">
                        <div>
                            <h3>${allat.nev}</h3>
                            <p>${kor} éves</p>
                        </div>
                        <button class="reszlet-gomb" type="button" aria-label="${allat.nev} adatlapja">→</button>
                    </div>

                    <div class="allat-hover">
                        <h3>${allat.nev} személyisége:</h3>
                        <p>${allat.leiras}</p>
                        <p><strong>Menhelyre érkezett:</strong> ${allat.erkezes}</p>
                        <p><strong>Életkor:</strong> ${kor} éves</p>
                        <span>Kattints a részletekért →</span>
                    </div>
                `;
                allatKartyaContainer.appendChild(kartya);
            });
        }

        // Frissítjük a script.js memóriáját, hogy a szűrés és a kereső azonnal lássa az elemeket
        if (typeof dataStoring === "function") {
            dataStoring();
        }
    }
});


function submitForm() {

    type = document.getElementsByClassName("ful aktiv")[0].textContent;
    nev = document.getElementById("teljesNev").value;
    telefon = document.getElementById("telefonMezo").value;
    email = document.getElementById("emailMezo").value;
    szuletesiDatum = document.getElementById("szuletesiDatum").value;
    lakcim = document.getElementById("lakcim").value;
    adatvedelem = document.getElementById("adatvedelem");

    if (adatvedelem.checked != true) {
        alert("Kérjük, fogadd el az adatvédelmi nyilatkozatot!");
        return false;
    }

    if (nev.value == "" || telefon.value == "" || email.value == "" || szuletesiDatum.value == "" || lakcim.value == "") {
        alert("Kérjük, töltsd ki az összes mezőt!");
        return false;
    }

    const formData = {
        type: type,
        nev: nev,
        telefon: telefon,
        email: email,
        szuletesiDatum: szuletesiDatum,
        lakcim: lakcim
    };


    //Beérkező adatok vizsgálata küldés elött



    // Küldés az API-nak

    fetch("http://localhost/Remenysugar-Allatmenhely/api.php?action=handleApplication", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("A form beküldése sikeres!");
            document.getElementById("jelentkezesForm").reset();
        } else {
            alert("Hiba történt a form beküldésekor.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hiba történt a form beküldésekor.");
    });

}




function korSzamitas(szuletesiDatum) {
    const szuletesi = new Date(szuletesiDatum);
    const ma = new Date();

    let kor = ma.getFullYear() - szuletesi.getFullYear();

    if (
        ma.getMonth() < szuletesi.getMonth() ||
        (
            ma.getMonth() === szuletesi.getMonth() &&
            ma.getDate() < szuletesi.getDate()
        )
    ) {
        kor--;
    }

    return kor;
}