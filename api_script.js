


document.addEventListener("DOMContentLoaded", async () => {

    const response = await fetch("http://localhost/api.php");
    const fajok = await response.json();

    console.log(fajok);



    const szurok = document.querySelector(".szurok");

    for (let i = 0; i < fajok.length; i++) {
        const button = document.createElement("button");

        button.dataset.filter = fajok[i];
        button.type = "button";
        button.textContent = fajok[i];
        button.addEventListener("click", function () {
            szures(button);
        });

        szurok.appendChild(button);
    }
});