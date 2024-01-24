// save form data to local storage
function saveFormDataToLocalStorage() {
    var formData = {
        tournamentName: document.getElementById('tournamentName').value,
        participantList: document.getElementById('participantList').value,
        startDate: document.getElementById('startDate').value,
        numberOfPlayers: participantList.length
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
    var numberOfPlayers = participantList.length;

    console.log('walidacja formularza...');
    var participantsArray = participantList.split(',').map(function (participant) {
        return participant.trim();
    });

    if (participantsArray.length % 2 !== 0) {
        alert('Number of players must be power of 2.');
        console.log('gdzie masz gości % 2 == 0?');
        return false;
    }

    // save info about turnament
    saveFormDataToLocalStorage();

    var tournamentInfo = `Tournament Name: ${tournamentName}\nParticipants: ${participantsArray.join(', ')}\nNumber of Players: ${participantsArray.length}\nStart Date: ${startDate}\n`;

    document.getElementById('tournamentInfo').innerText = tournamentInfo;

    document.querySelector('.bracket-section').style.display = 'flex';

    localStorage.setItem('formVisible', 'false');

    return true;
}

// Submit form
function submitForm() {
    console.log('Przesłanie formularza');

    var formSubmitted = validateForm();
    if (formSubmitted) {
        console.log('walidacja ok');

        generateBracket();

        var bracketSection = document.querySelector('.bracket-section');
        bracketSection.style.display = 'flex';
        bracketSection.style.alignItems  = 'center';
        bracketSection.style.justifyContent  = 'center';

        console.log('teraz powinna wyswietlic sie drabinka');

        hideForm();
    }
}

// empty table for participants who won
var selectedTeams = [];
//generate bracket
function generateBracket() {
    var bracketContainer = document.querySelector('.bracket-section');
    var participantsArray = document.getElementById('participantList').value.split(',').map(function (participant) {
        return participant.trim();
    });

    // clear bracket
    bracketContainer.innerHTML = '';

    var roundsCount = Math.ceil(Math.log2(participantsArray.length));

    // generate bracket for each round
    for (var round = 1; round <= roundsCount; round++) {
        var roundContainer = document.createElement('div');
        roundContainer.classList.add('round');
        roundContainer.innerHTML = '<h3>Round ' + round + '</h3>';

        var numberOfTeams = participantsArray.length / Math.pow(2, round - 1);

        for (var i = 0; i < numberOfTeams; i += 2) {
            var matchContainer = document.createElement('div');
            matchContainer.classList.add('bracket-container', 'match');

            var team1 = participantsArray[i];
            var team2 = getRandomOpponent(participantsArray, i);

            matchContainer.innerHTML = `
                <div class="player">
                    <label>${team1}</label>
                    <input type="checkbox" name="selectedTeams" value="${team1}">
                </div>
                <div class="divider"></div>
                <div class="player">
                    <label>${team2}</label>
                    <input type="checkbox" name="selectedTeams" value="${team2}">
                </div>
            `;

            roundContainer.appendChild(matchContainer);
        }

        bracketContainer.appendChild(roundContainer);
    }

    // Po zakończeniu generowania bracketu, sprawdź czy istnieje wybrany zwycięzca z poprzednich meczów
    if (selectedTeams.length > 0) {
        // Dodaj zwycięzców do nowej rundy
        var nextRoundContainer = document.createElement('div');
        nextRoundContainer.classList.add('round');
        nextRoundContainer.innerHTML = '<h3>Round ' + (roundsCount + 1) + '</h3>';

        for (var i = 0; i < selectedTeams.length; i += 2) {
            var matchContainer = document.createElement('div');
            matchContainer.classList.add('bracket-container', 'match');

            var team1 = selectedTeams[i];
            var team2 = selectedTeams[i + 1];

            matchContainer.innerHTML = `
                <div class="player">
                    <label>${team1}</label>
                    <input type="checkbox" name="selectedTeams" value="${team1}">
                </div>
                <div class="divider"></div>
                <div class="player">
                    <label>${team2}</label>
                    <input type="checkbox" name="selectedTeams" value="${team2}">
                </div>
            `;

            nextRoundContainer.appendChild(matchContainer);
        }

        bracketContainer.appendChild(nextRoundContainer);

        // Wyczyść tabelę zwycięzców
        selectedTeams = [];
    }
}
function getRandomOpponent(participantsArray, currentIndex) {
    // Remove the current participant from the array to avoid self-matching
    var remainingParticipants = participantsArray.filter((_, index) => index !== currentIndex);

    // Randomly select an opponent from the remaining participants
    var randomIndex = Math.floor(Math.random() * remainingParticipants.length);
    return remainingParticipants[randomIndex];
}

function isPowerOfTwo(number) {
    return (number & (number - 1)) === 0;
}

// Event listener for checkbox changes
document.addEventListener('change', function (event) {
    if (event.target.type === 'checkbox' && event.target.name === 'selectedTeams') {
        // Update the selected teams array
        var teamName = event.target.value;

        // Wyłącz wszystkie inne checkboxy w tym meczu
        var matchContainer = event.target.closest('.match');
        var checkboxesInMatch = matchContainer.querySelectorAll('input[name="selectedTeams"]');
        checkboxesInMatch.forEach(function (checkbox) {
            if (checkbox !== event.target) {
                checkbox.checked = false;
                // Dodaj wyłączone checkboxy do tablicy
                selectedTeams = selectedTeams.filter(team => team !== checkbox.value);
            }
        });

        // Dodaj lub usuń zaznaczony zespół do/z tablicy
        if (event.target.checked) {
            selectedTeams.push(teamName);
        } else {
            selectedTeams = selectedTeams.filter(team => team !== teamName);
        }
    }
});




document.addEventListener('DOMContentLoaded', function () {
    loadFormDataFromLocalStorage();

    var formVisible = localStorage.getItem('formVisible');

});