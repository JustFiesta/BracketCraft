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
        alert('Number of players must be a power of 2.');
        console.log('gdzie masz gości % 2 == 0?');
        return false;
    }

    // save info about turnament
    saveFormDataToLocalStorage();

    var tournamentInfoElement = document.getElementById('tournamentInfo');

    if (tournamentInfoElement) {
        var tournamentInfo = `Tournament Name: ${tournamentName}\nParticipants: ${participantsArray.join(', ')}\nNumber of Players: ${participantsArray.length}\nStart Date: ${startDate}\n`;

        tournamentInfoElement.innerText = tournamentInfo;
    } else {
        console.error('Element with id "tournamentInfo" not found.');
    }

    var bracketSection = document.querySelector('.bracket-section');
    bracketSection.style.display = 'flex';

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
        bracketSection.style.alignItems = 'center';
        bracketSection.style.justifyContent = 'center';

        console.log('teraz powinna wyswietlic sie drabinka');

        hideForm();

        var tournamentName = document.getElementById('tournamentName').value;
        var participantList = document.getElementById('participantList').value;
        var startDate = document.getElementById('startDate').value;

        let formInfo = {name: tournamentName, participants: participantList, date: startDate};

        const userJSON = JSON.stringify(formInfo);
        console.log(userJSON);
    }
}

// empty table for participants who won
var selectedTeams = [];

// empty table for participants who won
var selectedTeams = [];

// Ostatnia runda przed finałem
var isFinalRound = false;

//generate bracket
function generateBracket() {
    var bracketContainer = document.querySelector('.bracket-section');
    var participantsArray = document.getElementById('participantList').value.split(',').map(function (participant) {
        return participant.trim();
    });

    // clear bracket
    bracketContainer.innerHTML = '';

    var roundsCount = Math.ceil(Math.log2(participantsArray.length));

    // Ustaw flagę dla ostatniej rundy przed finałem
    isFinalRound = false;

    // generate bracket for the first round
    generateRound(participantsArray, 1);

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

            // Check if all matches in the current round have winners
            var allMatchesHaveWinners = selectedTeams.length === participantsArray.length / 2;

            if (allMatchesHaveWinners) {
                // Sprawdź, czy to jest ostatnia runda przed finałem
                if (!isFinalRound) {
                    // Generate the next round
                    generateNextRound(participantsArray);
                } else {
                    // W przeciwnym razie, to jest ostatnia runda, pokaż zwycięzcę turnieju
                    showWinner(selectedTeams[0]);
                }
            }
        }
    });
}

// Function to generate the next round
function generateNextRound(participantsArray) {
    var bracketContainer = document.querySelector('.bracket-section');

    // Po zakończeniu generowania bracketu, sprawdź czy istnieje wybrany zwycięzca z poprzednich meczów
    if (selectedTeams.length > 0 && selectedTeams.length === participantsArray.length / 2) {
        // Sprawdź, czy to jest ostatnia runda przed finałem
        var nextRoundNumber = bracketContainer.querySelectorAll('.round').length + 1;

        if (nextRoundNumber < Math.ceil(Math.log2(participantsArray.length))) {
            // Jeżeli nie osiągnęliśmy maksymalnej liczby rund, to sprawdzamy, czy wybrano połowę ze wszystkich uczestników
            if (selectedTeams.length === participantsArray.length / 2) {
                // Jeżeli tak, generuj kolejną rundę

                // Ogranicz pulę graczy do wybranych zwycięzców
                participantsArray = selectedTeams;

                // Wyczyść tabelę zwycięzców
                selectedTeams = [];

                generateRound(participantsArray, nextRoundNumber, participantsArray.length / 2);
            }
        } else {
            // W przeciwnym razie, to jest ostatnia runda przed finałem
            isFinalRound = true;

            // Jeśli jest to ostatnia runda przed finałem, zacznij od nowa od pierwszej rundy
            generateRound(selectedTeams, 1, selectedTeams.length / 2);

            // Wyczyść tabelę zwycięzców
            selectedTeams = [];
        }
    }
}



// Function to generate a specific round
function generateRound(participantsArray, round) {
    var bracketContainer = document.querySelector('.bracket-section');

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

// Function to show the winner
function showWinner(winner) {
    var bracketContainer = document.querySelector('.bracket-section');
    var winnerContainer = document.createElement('div');
    winnerContainer.classList.add('round', 'winner');
    winnerContainer.innerHTML = '<h3>Winner</h3>';
    winnerContainer.innerHTML += `
        <div class="bracket-container">
            <div class="player">
                <label>${winner}</label>
            </div>
        </div>
    `;
    bracketContainer.appendChild(winnerContainer);
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

document.addEventListener('DOMContentLoaded', function () {
    // Load form data from local storage
    loadFormDataFromLocalStorage();

    // Check if the form should be visible
    var formVisible = localStorage.getItem('formVisible');
    if (formVisible === 'true') {
        toggleForm();
    }

    // Generate the bracket
    generateBracket();
});

