// save form data to local storage
function saveFormDataToLocalStorage() {
    var formData = {
        tournamentName: document.getElementById('tournamentName').value,
        participantList: participantsArray,
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
    // console.log('otwieranie formularza');
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

    // console.log('zamykanie formularza');
}

//check for team name duplication and fix it
function fixDuplicateTeams(participantsArray) {
    console.log('sprawdzenie duplikatów nazw');
    var teamCount = {};
    
    for (var i = 0; i < participantsArray.length; i++) {
        var team = participantsArray[i];
        
        if (teamCount[team]) {
            console.log('znaleziono taką samą druzyne - dopisuje liczbe');
            //if team was already found, add num to its name
            teamCount[team]++;
            participantsArray[i] = team + teamCount[team];
        } else {
            //set encounter as first
            teamCount[team] = 1;
        }
    }
}

//global info about teams
var participantsArray;
// validate form
function validateForm() {
    console.log('walidacja formularza...');

    var tournamentName = document.getElementById('tournamentName').value;
    var participantList = document.getElementById('participantList').value;
    var startDate = document.getElementById('startDate').value;
    
    //create array of participant list
    
    participantsArray = participantList.split(',').map(function (participant) {
        return participant.trim();
    });

    console.log('druzyny przed sprawdzeniem: ' + participantsArray);

    var numberOfPlayers = participantsArray.length;

    fixDuplicateTeams(participantsArray);

    console.log('druzyny po sprawdzeniu: ' + participantsArray);

    console.log('liczba druzyn: ' + numberOfPlayers);
    if ((numberOfPlayers & (numberOfPlayers - 1)) !== 0) {
        alert('Number of players must a power of 2.');
        console.log('gdzie masz parzyste drużyny???');
        return false;
    }

    // save info about turnament
    saveFormDataToLocalStorage();

    //set info about tournament
    var tournamentInfoContainer = document.querySelector('#tournamentInfo');

    tournamentInfoContainer.style.display = 'flex';

    console.log(tournamentInfoContainer);

    if (tournamentInfoContainer == undefined) {
        console.error('div tournamentInfo undefined');
    } else {
        var tournamentInfo = `<h2>Tournament Name: ${tournamentName}</h2>Participants: ${participantsArray.join(', ')}<br>Number of Players: ${participantsArray.length}<br>Start Date: ${startDate}<br>`;

        tournamentInfoContainer.innerHTML = tournamentInfo;
    }

    var bracketSection = document.querySelector('.bracket-section');
    bracketSection.style.display = 'flex';

    localStorage.setItem('formVisible', 'false');

    return true;
}

// Submit form
function submitForm() {
    var formSubmitted = validateForm();
    if (formSubmitted) {
        console.log('walidacja ok');

        //validation ok - generate brackets
        generateBracket();

        //display brackets in flex mode
        var bracketSection = document.querySelector('.bracket-section');
        bracketSection.style.display = 'flex';
        bracketSection.style.alignItems = 'center';
        bracketSection.style.justifyContent = 'center';

        //hide form after generating brackets
        hideForm();

        var tournamentName = document.getElementById('tournamentName').value;
        var participantList = document.getElementById('participantList').value;
        var startDate = document.getElementById('startDate').value;

        let formInfo = {name: tournamentName, participants: participantList, date: startDate};

        //JSON for project requirements
        const userJSON = JSON.stringify(formInfo);
        console.log(userJSON);
    }
}

// empty table for participants who won
var selectedTeams = [];

// flag for last round
var isFinalRound = false;

var roundCounter = 1;

//generate brackets
function generateBracket() {
    var bracketContainer = document.querySelector('.bracket-section');
    var participantsArray = document.getElementById('participantList').value.split(',').map(function (participant) {
        return participant.trim();
    });

    //clear bracket
    clearBracket();

    //generate bracket for the first round
    generateRound(participantsArray, roundCounter);

    //listener for radio changes
    document.addEventListener('change', function (event) {
        console.log('nasłuchiwanie radio');
        if (event.target.type === 'radio' && event.target.name === 'selectedTeams') {
            //get selected team
            var selectedTeam = event.target.value;
            console.log('wybrano druzyne: ' + selectedTeam);

            //get not selected team
            var unselectedTeam = participantsArray.filter(participant => participant !== selectedTeam)[0];
            console.log('niewybrana druzyna: ' + unselectedTeam);

            //if event occures add checked team ...
            if (event.target.checked) {
                console.log('dodanie druzyny: ' + selectedTeam);
                selectedTeams.push(selectedTeam);
            }
            //... and delete not choosed one if it is in array
            var indexOfUnselectedTeam = selectedTeams.indexOf(unselectedTeam);
            if (indexOfUnselectedTeam !== -1) {
                selectedTeams.splice(indexOfUnselectedTeam, 1);
            }
            console.log('tabela wygranych druzyn: ' + selectedTeams);

            //check if all matches in the current round have winners
            var allMatchesHaveWinners = selectedTeams.length === participantsArray.length / 2;

            if (allMatchesHaveWinners) {
                //is last round?
                if (!isFinalRound) {
                    //no - generate next
                    generateNextRound(participantsArray);
                } else {
                    //yes - show who won
                    showWinner(selectedTeams[0]);
                }
            }
        }
    });
}
//TODO
//generate next round with clean selectedTeams, and then add winners
// Function to generate the next round
function generateNextRound(participantsArray) {
    var bracketContainer = document.querySelector('.bracket-section');

    // Po zakończeniu generowania bracketu, sprawdź czy istnieje wybrany zwycięzca z poprzednich meczów
    if (selectedTeams.length > 0 && selectedTeams.length === participantsArray.length / 2) {
        // Sprawdź, czy to jest ostatnia runda przed finałem

        if (roundCounter < Math.ceil(Math.log2(participantsArray.length))) {
            // Jeżeli nie osiągnęliśmy maksymalnej liczby rund, to sprawdzamy, czy wybrano połowę ze wszystkich uczestników
            if (selectedTeams.length === participantsArray.length / 2) {
                // Jeżeli tak, generuj kolejną rundę

                // Ogranicz pulę graczy do wybranych zwycięzców
                participantsArray = selectedTeams;

                // Wyczyść tabelę zwycięzców
                selectedTeams = [];

                generateRound(participantsArray, roundCounter);
            }
        } else {
            // W przeciwnym razie, to jest ostatnia runda przed finałem
            isFinalRound = true;

            // Jeśli jest to ostatnia runda przed finałem, zacznij od nowa od pierwszej rundy
            generateRound(selectedTeams, roundCounter);
        }
    }
    selectedTeams = [];
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
            <form action="">
                <div class="player">
                    
                        <label>${team1}</label>
                        <input type="radio" name="selectedTeams" value="${team1}">
                    
                </div>
                <div class="divider"></div>
                <div class="player">
                        <label>${team2}</label>
                        <input type="radio" name="selectedTeams" value="${team2}">
                    
                </div>
            </form>
        `;

        roundContainer.appendChild(matchContainer);
    }

    bracketContainer.appendChild(roundContainer);
    roundCounter++;
}

// Function to show the winner
function showWinner(winner) {
    var bracketContainer = document.querySelector('.bracket-section');
    var winnerContainer = document.createElement('div');
    winnerContainer.classList.add('round');
    winnerContainer.innerHTML = '<h3>Winner</h3>';
    winnerContainer.innerHTML += `
        <div class="bracket-container winner">
            <div class="winner">
                <p>${winner}</p>
            </div>
        </div>
    `;
    bracketContainer.appendChild(winnerContainer);
}

function getRandomOpponent(participantsArray, currentIndex) {
    // Remove the current participant from the array to avoid self-matching
    participantsArray = participantsArray.filter((_, index) => index !== currentIndex);

    // Randomly select an opponent from the remaining participants
    var randomIndex = Math.floor(Math.random() * participantsArray.length);
    return participantsArray[randomIndex];
}

function clearBracket(){
    console.log('Clearing bracket adn turnament info');

    //clear the bracket section
    var bracketContainer = document.querySelector('.bracket-section');
    bracketContainer.innerHTML = '';

    //clear tournament info section
    var tournamentInfoContainer = document.querySelector('#tournamentInfo');
    tournamentInfoContainer.innerHTML = '';

    //reset information
    selectedTeams = [];
    isFinalRound = false;
    roundCounter = 1;
}

document.addEventListener('DOMContentLoaded', function () {
    // Load form data from local storage
    loadFormDataFromLocalStorage();

    // Check if the form should be visible
    var formVisible = localStorage.getItem('formVisible');
    if (formVisible === 'true') {
        toggleForm();
    }
});

