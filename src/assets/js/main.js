function toggleForm() {
    var form = document.getElementById('tournamentForm');
    var isFormVisible = (form.style.display === 'block');
    var collapseButton = document.getElementById('collapseFormButton');

    if (!isFormVisible) {
        collapseButton.style.display = 'block';
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
        form.classList.add('expanded');
    }
}

document.getElementById('collapseFormButton').addEventListener('click', function () {
    var form = document.getElementById('tournamentForm');
    var collapseButton = document.getElementById('collapseFormButton');

    form.classList.add('collapsed');
    form.classList.remove('expanded');

    setTimeout(function () {
        collapseButton.style.display = 'none';
        form.style.display = 'none';
        form.classList.remove('collapsed');
    }, 500);
});


    // Pozostała funkcjonalność, którą można dodać:
    // 1. Aktualizacja wyników meczów
    // 2. Wyświetlanie informacji o kolejnych rundach
    // 3. Dodawanie drużyn po rozpoczęciu turnieju
    // 4. Tworzenie dodatkowych statystyk turniejowych
    // itp.
