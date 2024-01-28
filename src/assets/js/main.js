// save form data to local storage
function saveFormDataToLocalStorage() {
    var formData = {
        tournamentName: document.getElementById('tournamentName').value,
        participantList: participantsArray.toString(),
        startDate: document.getElementById('startDate').value,
        numberOfPlayers: participantsArray.length
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
var participantArrayCopy;
var numberOfPlayers;
// validate form
function validateForm() {
    console.log('walidacja formularza...');

    var participantList = document.getElementById('participantList').value;
    
    //create array of participant list
    participantsArray = participantList.split(',').map(function (participant) {
        return participant.trim();
    });

    console.log('druzyny przed sprawdzeniem: ' + participantsArray);

    numberOfPlayers = participantsArray.length;

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

        //set info about tournament
        var tournamentName = document.getElementById('tournamentName').value;
        var tournamentDate = document.getElementById('startDate').value;
        var tournamentInfoContainer = document.getElementById('tournamentInfo');

        console.log('pokazuje info o turnieju');
        tournamentInfoContainer.style.display = 'flex';

        console.log(tournamentInfoContainer);

        if (tournamentInfoContainer == undefined) {
            console.error('div tournamentInfo undefined');
        } else {

            var tournamentInfoName = document.createElement('h2');
            tournamentInfoName.innerHTML =  tournamentName;
            
            var tournamentInfoDate = document.createElement('p');
            tournamentInfoDate.innerHTML = tournamentDate;

            tournamentInfoContainer.innerHTML = '';

            tournamentInfoContainer.appendChild(tournamentInfoName);
            tournamentInfoContainer.appendChild(tournamentInfoDate);
        }


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

// empty table for winners
var selectedTeams = [];

// flag for last round
var isFinalRound = false;

var roundCounter = 1;

//generate brackets
function generateBracket() {

    //generate bracket for the first round
    if (participantsArray.length <= 2){
        isFinalRound = true;
    }

    participantArrayCopy = structuredClone(participantsArray);

    generateRound(participantsArray, roundCounter);

    //listener for radio changes
    document.addEventListener('change', function (event) {
        // console.log('nasłuchiwanie radio');
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

                    //disable all other radiobuttons in the same match
                var matchRadios = event.target.closest('.match').querySelectorAll('input[type="radio"]');
                matchRadios.forEach(function (radio) {
                    if (radio !== event.target) {
                        radio.disabled = true;
                    }
                });
            }

            console.log('tabela wygranych druzyn: ' + selectedTeams);
            console.log('tabela globalna druzyn: ' + participantsArray);

            //check if all matches in the current round have winners
            var allMatchesHaveWinners = selectedTeams.length === participantsArray.length / 2;

            console.log('allMatchesHaveWinners: ' + allMatchesHaveWinners);

            if (allMatchesHaveWinners) {
                //is last round?
                if (!isFinalRound) {
                    //no - generate next
                    generateNextRound();
                } else {
                    //yes - show who won
                    showWinner(selectedTeams[0]);
                }
            }
        }
    });
}

// Function to generate the next round 
function generateNextRound() {
    console.log('generuje następną runde: ' + roundCounter);
    console.log('zwyciezcy poprzedniej z selectedTeams: ' + selectedTeams);
    console.log('zawartosc globalnej participantsArray: ' + participantsArray);

    participantArrayCopy = structuredClone(selectedTeams);

    // console.log('check pierwszego warunku:' + selectedTeams.length + ' > ' + 0 + ' && ' + selectedTeams.length + ' === ' + participantsArray.length / 2);

    //check if we have winners
    if (selectedTeams.length > 0 && selectedTeams.length === participantsArray.length / 2) {
        // Sprawdź, czy to jest ostatnia runda przed finałem

        // console.log('check drugiego warunku: ' + roundCounter  + ' < ' +  Math.ceil(Math.log2(numberOfPlayers)));

        //check if it should be normal round
        if (roundCounter < Math.ceil(Math.log2(numberOfPlayers))) {
            
            // console.log('check trzeciego warunku: ' + selectedTeams.length + ' === ' + participantsArray.length / 2);

            //check if we choosed winners from every match
            if (selectedTeams.length === participantsArray.length / 2) {
                //create next normal round for winners from previous one

                participantsArray = selectedTeams;
                // console.log('zwyciezcy rundy - podmiana na selected teams do participantsArray  ' + (roundCounter-1) + ': ' + participantsArray);
                
                generateRound(participantsArray, roundCounter);
                
                //make room for new winners
                selectedTeams = [];
            }
        } else {
            // its final then
            console.log('ustawiam finał');
            console.log('selectedTeams: ' + selectedTeams);
            console.log('participantsArray: ' + participantsArray);

            participantsArray = selectedTeams;

            isFinalRound = true;

            generateRound(selectedTeams, roundCounter);
        }
    }
    selectedTeams = [];
}

// Function to generate a specific round
function generateRound(participantsArray, round) {
    console.log('generuje runde');
    console.log('zawodnicy z poprzedniej w generateRound: ' + participantsArray.toString());
    var bracketContainer = document.querySelector('.bracket-section');

    var roundContainer = document.createElement('div');
    roundContainer.classList.add('round');
    roundContainer.innerHTML = '<h3>Round ' + round + '</h3>';

    var numberOfTeams = participantsArray.length;
    // console.log('liczba druzyn po rundzie ' + (roundCounter - 1) + ': ' + numberOfTeams);

    for (var i = 0; i < numberOfTeams; i += 2) {
        // console.log('genRound pętla for, druzyny w participantsArray: ' + participantsArray.toString());
        var matchContainer = document.createElement('div');
        matchContainer.classList.add('bracket-container', 'match');

        var team1 = getRandomOpponent(participantArrayCopy);
        var team2 = getRandomOpponent(participantArrayCopy);

        // console.log('randomowo dobierani przeciwnicy: ' + team1 + ' ' + team2);

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
    console.log('zwyciezca: ' + winner);
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

//select random opponent from the copy of global array and remove it after choosing
function getRandomOpponent(participantArrayCopy) {
    // console.log('losuje przeciwnika z kopii participantsArray: ' + participantArrayCopy);
    // console.log('globalna participantsArray: ' + participantsArray.toString());
    // console.log('check przeciwnika z selectedTeams: ' + selectedTeams.toString());

    //safety trigger
    if (participantArrayCopy.length === 0) {
        participantArrayCopy = selectedTeams.slice();
    }

    const randomIndex = Math.floor(Math.random() * participantArrayCopy.length);
    const selectedOpponent = participantArrayCopy.splice(randomIndex, 1)[0];

    // console.log('selectedOpponent: ' + selectedOpponent);
    // console.log('randomIndex: ' + randomIndex);

    return selectedOpponent;
}

function clearBracket(){
    console.log('czyszcze info o turnieju');

    //clear the bracket section
    var bracketContainer = document.querySelector('.bracket-section');
    bracketContainer.innerHTML = '';

    window.caches.clear;
    window.location.reload();

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

