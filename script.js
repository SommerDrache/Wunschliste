// 🔥 Firebase-Funktionen aus window-Objekt holen
const database = window.firebaseDatabase;
const ref = window.firebaseRef;
const push = window.firebasePush;
const onValue = window.firebaseOnValue;
const update = window.firebaseUpdate;
const remove = window.firebaseRemove;

// 🔥 Test: Wird Firebase geladen?
console.log("🔥 Firebase geladen:", database);
console.log("📌 Firebase Ref geladen:", ref);
console.log("📌 Firebase Push geladen:", push);

if (!database) {
    console.error("❌ Firebase wurde NICHT richtig geladen! Prüfe deine Firebase-Konfiguration in index.html!");
}

// Liste der 9 Personen
const personen = [
    "Lucas", "Anna", "Leo", "Waltraud", "Wolfgang",
    "Alex", "Reini", "Bernd", "Angie"
];

const container = document.getElementById("listenContainer");

// Wunschlisten erstellen
function erstelleWunschlisten() {
    container.innerHTML = ""; 
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
        ladeWünsche(person);
    });
}

// 🔥 Funktion „wunschHinzufügen“ global machen
window.wunschHinzufügen = function(person) {
    const input = document.getElementById(`input-${person}`);
    const wunschText = input.value.trim();

    if (wunschText !== "") {
        push(ref(database, `wünsche/${person}`), { text: wunschText, erledigt: false });
        input.value = "";
    }
};

// 🔥 Funktion „ladeWünsche“ global machen
window.ladeWünsche = function(person) {
    const liste = document.getElementById(`liste-${person}`);

    onValue(ref(database, `wünsche/${person}`), snapshot => {
        liste.innerHTML = "";
        snapshot.forEach(childSnapshot => {
            const wunsch = childSnapshot.val();
            const listItem = document.createElement("li");

            listItem.innerHTML = `
                <span>${wunsch.text}</span>
                <div class="checkbox-btn-group">
                    <input type="checkbox" onclick="toggleErledigt('${person}', '${childSnapshot.key}', this)" ${wunsch.erledigt ? "checked" : ""}>
                    <button class="delete-btn" onclick="wunschLöschen('${person}', '${childSnapshot.key}')">❌</button>
                </div>
            `;
            if (wunsch.erledigt) listItem.classList.add("completed");
            liste.appendChild(listItem);
        });
    });
};

// 🔥 Funktion „toggleErledigt“ global machen
window.toggleErledigt = function(person, key, checkbox) {
    update(ref(database, `wünsche/${person}/${key}`), { erledigt: checkbox.checked });
};

// 🔥 Funktion „wunschLöschen“ global machen
window.wunschLöschen = function(person, key) {
    remove(ref(database, `wünsche/${person}/${key}`));
};

// 🔥 **Wunschlisten nach dem Laden der Seite erstellen**
window.onload = function() {
    erstelleWunschlisten();
};
