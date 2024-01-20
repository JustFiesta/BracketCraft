// save form data to local storage
function saveFormDataToLocalStorage() {
    var formData = {
        tournamentName: document.getElementById('tournamentName').value,
        participantList: document.getElementById('participantList').value,
        startDate: document.getElementById('startDate').value,
        location: document.getElementById('location').value,
        numberOfPlayers: document.getElementById('numberOfPlayers').value
    };

    localStorage.setItem('formData', JSON.stringify(formData));
    console.log('Form data saved to localStorage:', formData);
}

function loadFormDataFromLocalStorage() {
    var formDataString = localStorage.getItem('formData');
    if (formDataString) {
        var formData = JSON.parse(formDataString);
        document.getElementById('tournamentName').value = formData.tournamentName;
        document.getElementById('participantList').value = formData.participantList;
        document.getElementById('startDate').value = formData.startDate;
        document.getElementById('location').value = formData.location;
        document.getElementById('numberOfPlayers').value = formData.numberOfPlayers;

        console.log('Form data loaded from localStorage:', formData);
    } else {
        console.log('No form data found in localStorage.');
    }
}

// Show form
function toggleForm() {
    var form = document.getElementById('tournamentForm');
    var collapseButton = document.getElementById('collapseFormButton');

    if (form.style.display !== 'block') {
        collapseButton.style.display = 'block';
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
        form.classList.add('expanded');

        localStorage.setItem('formVisible', 'true');
    }
    console.log('otwieranie formularza');
}


// Close form
function hideForm() {
    var form = document.getElementById('tournamentForm');
    var collapseButton = document.getElementById('collapseFormButton');
    
    // var bracketSection = document.querySelector('.bracket-section');
    // bracketSection.style.display = 'none';

    form.classList.add('collapsed');
    form.classList.remove('expanded');

    setTimeout(function () {
        collapseButton.style.display = 'none';
        form.style.display = 'none';
        form.classList.remove('collapsed');
    }, 500);

    localStorage.setItem('formVisible', 'false');

    console.log('zamykanie formularza');
}

// validate form
function validateForm() {
    var tournamentName = document.getElementById('tournamentName').value;
    var participantList = document.getElementById('participantList').value;
    var startDate = document.getElementById('startDate').value;
    var location = document.getElementById('location').value;
    var numberOfPlayers = document.getElementById('numberOfPlayers').value;

    console.log('walidacja formularza...');
    var participantsArray = participantList.split(',').map(function (participant) {
        return participant.trim();
    });

    if (participantsArray.length % 2 !== 0) {
        alert('Number of players must be even.');
        console.log('gdzie masz gości % 2 == 0?');
        return false;
    }
    if (participantsArray.length !== parseInt(numberOfPlayers)) {
        alert('Number of players must match the specified value.');
        console.log('błędna ilość graczy w sotsunku do wybranej liczby');
        return false;
    } 

    // info about turnament
    saveFormDataToLocalStorage();

    document.getElementById('numberOfPlayers').value = participantsArray.length;

    var tournamentInfo = `Tournament Name: ${tournamentName}\nParticipants: ${participantsArray.join(', ')}\nNumber of Players: ${participantsArray.length}\nStart Date: ${startDate}\nLocation: ${location}`;

    document.getElementById('tournamentInfo').innerText = tournamentInfo;

    document.querySelector('.bracket-section').style.display = 'block';

    localStorage.setItem('formVisible', 'false');

    return true;
}

// Submit form
function submitForm() {
    console.log('Przesłanie formularza');

    var formSubmitted = validateForm();
    if (formSubmitted) {
        console.log('walidacja ok');

        var bracketSection = document.querySelector('.bracket-section');
        bracketSection.style.display = 'block';

        console.log('teraz powinna wyswietlic sie drabinka');

        hideForm();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadFormDataFromLocalStorage();
    // ... (inny kod, jeśli jest)

    var formVisible = localStorage.getItem('formVisible');

    // (reszta kodu do obsługi widoczności formularza)
});

    // Pozostała funkcjonalność, którą można dodać:
    // 1. Aktualizacja wyników meczów
    // 2. Wyświetlanie informacji o kolejnych rundach