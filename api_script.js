document.addEventListener("DOMContentLoaded", async function () {


    // adat be olvasás (http://localhost/Remenysugar-Allatmenhely/api.php) ról 
    const response = await fetch("http://localhost/Remenysugar-Allatmenhely/api.php");
    const data = await response.json();

    const fajok = data.fajok;
    const allatok = data.allatok;


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
    const allatKartyaContainer = document.querySelector(".allat-racs");

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
            adatlapMegnyitasa(kartya);
        });

        kartya.innerHTML = `
            <img src="${allat.kep}" alt="${allat.nev} örökbefogadható ${allat.faj}">
            <span class="allat-cimke">${allat.nev}</span>
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
        allatKartyaContainer.appendChild(kartya);
    });


});





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