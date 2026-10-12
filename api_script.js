document.addEventListener("DOMContentLoaded", () => {
    const szurok = document.querySelector(".szurok");

    for (let i = 0; i < 4; i++) {
        const button = document.createElement("button");

        button.className = "aktiv";
        button.dataset.filter = "mind";
        button.type = "button";
        button.textContent = "MINDENKI";

        szurok.appendChild(button);
    }
});