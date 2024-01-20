document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("tournamentForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const tournamentName = document.getElementById("tournamentName").value;
        const participantList = document.getElementById("participantList").value.split(",");
        const startDate = document.getElementById("startDate").value;
        const location = document.getElementById("location").value;

        // Tutaj możesz przekazać dane do funkcji tworzącej drabinkę turniejową
        createTournamentBracket(tournamentName, participantList, startDate, location);
    });

    function createTournamentBracket(name, participants, date, location) {
        // Logika tworzenia drabinki turniejowej
        // Możesz użyć participants.length do sprawdzenia ilości uczestników
        // i odpowiednio dostosować sposób generowania drabinki
        console.log("Tworzenie drabinki turniejowej dla turnieju:", name);
        console.log("Uczestnicy:", participants);
        console.log("Data rozpoczęcia:", date);
        console.log("Lokalizacja:", location);

        // Tutaj można dodać kod generujący bloki dla meczów
        const tournamentSection = document.querySelector(".content");
        tournamentSection.innerHTML = ""; // Czyszczenie sekcji drabinki przed dodaniem nowych elementów

        for (let i = 0; i < participants.length; i += 2) {
            const matchBlock = document.createElement("div");
            matchBlock.classList.add("match-block");

            const team1 = participants[i];
            const team2 = participants[i + 1];

            matchBlock.innerHTML = `<p>Mecz ${i / 2 + 1}</p><p>${team1} vs ${team2}</p>`;

            tournamentSection.appendChild(matchBlock);
        }
    }

    // Pozostała funkcjonalność, którą można dodać:
    // 1. Aktualizacja wyników meczów
    // 2. Wyświetlanie informacji o kolejnych rundach
    // 3. Dodawanie drużyn po rozpoczęciu turnieju
    // 4. Tworzenie dodatkowych statystyk turniejowych
    // itp.
});
