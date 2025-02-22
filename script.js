// Liste der 9 Personen
const personen = [
    "LUCAS", "ANNA", "LEO", "OMA", "OPA",
    "ALEX", "REINI", "BERND", "ANGIE"
];

const container = document.getElementById("listenContainer");

// Daten aus dem Local Storage laden
const gespeicherteWünsche = JSON.parse(localStorage.getItem("wunschlisten")) || {};

// Erstelle Wunschlisten für jede Person
personen.forEach(person => {
    const personDiv = document.createElement("div");
    personDiv.classList.add("person");
    personDiv.innerHTML = `
        <h2>${person}</h2>
        <ul id="liste-${person}"></ul>
        <input type="text" id="input-${person}" placeholder="Neuen Wunsch eingeben">
        <button onclick="wunschHinzufügen('${person}')">Hinzufügen</button>
    `;
    container.appendChild(personDiv);

    // Falls es gespeicherte Wünsche gibt, lade sie
    if (gespeicherteWünsche[person]) {
        gespeicherteWünsche[person].forEach(wunsch => {
            wunschHinzufügen(person, wunsch.text, wunsch.erledigt, false);
        });
    }
});

function wunschHinzufügen(person, text = null, erledigt = false, speichern = true) {
    const input = document.getElementById(`input-${person}`);
    const wunschText = text || input.value.trim();

    if (wunschText !== "") {
        const liste = document.getElementById(`liste-${person}`);
        const listItem = document.createElement("li");

        listItem.innerHTML = `
            <span>${wunschText}</span>
            <div class="checkbox-btn-group">
                <input type="checkbox" onclick="toggleErledigt(this)" ${erledigt ? "checked" : ""}>
                <button class="delete-btn" onclick="wunschLöschen(this, '${person}')">❌</button>
            </div>
        `;

        if (erledigt) {
            listItem.classList.add("completed");
        }

        liste.appendChild(listItem);
        input.value = "";

        if (speichern) speicherWünsche();
    }
}

function toggleErledigt(checkbox) {
    const listItem = checkbox.parentElement.parentElement;
    listItem.classList.toggle("completed", checkbox.checked);
    speicherWünsche();
}

function wunschLöschen(button, person) {
    const listItem = button.parentElement.parentElement;
    listItem.remove();
    speicherWünsche();
}

function speicherWünsche() {
    const neueDaten = {};

    personen.forEach(person => {
        const liste = document.getElementById(`liste-${person}`);
        const wünsche = [];

        liste.querySelectorAll("li").forEach(item => {
            const text = item.querySelector("span").textContent.trim();
            const erledigt = item.querySelector("input").checked;
            wünsche.push({ text, erledigt });
        });

        neueDaten[person] = wünsche;
    });

    localStorage.setItem("wunschlisten", JSON.stringify(neueDaten));
}
