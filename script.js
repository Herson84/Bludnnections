const gameBoard = document.getElementById('game-board');
const feedback = document.getElementById('feedback');
const submitButton = document.getElementById('submit');
const clearButton = document.getElementById('clear');
const openPreMadeGamesButton = document.getElementById('open-pre-made-games');
const preMadeGamesModal = document.getElementById('pre-made-games-modal');
const preMadeGamesList = document.getElementById('pre-made-games-list');
const errorMessageDisplay = document.getElementById('error-message');
const winLossModal = document.getElementById('win-loss-modal');
const winLossMessage = document.getElementById('win-loss-message');

let words = [];
let categories = [];
let selectedWords = [];
let wrongGuesses = 0;
const maxWrongGuesses = 2;
let gameActive = true;

const errorMessages = ["Bobcattttt,", "Dumbahh Urgyan Blud,", "7/60 incoming,"];

const preMadeGames = [
{
    title: "OG Bludnectionns",
    date: "2025-03-10",
    gameData: `
Caleb Lovers
MB,KH,LB,EP
Tuah's
Chum,Nahum,Pumpkin,Hawk
Empluzz at Westereville Nuzz
Notch,Reed,Ender Dragon,Warden
Caleb Something
North Star,Car Crash,Whit's,Urgyan
`
},

{
    title: "Ethan",
    date: "2025-03-11",
    gameData: `
Caleb Careers
Producer,Microbiologist,Best Buy,Dentist
Zaine Lore
Meat,Red Is Sus,Shower Snap Story,It Takes two To Tango
Caleb Quotes
If you have something to say say it to my face,Dammit I can't touch minors,Fuck that urgyan,Hope it's tight and pray to god it works
Pre-Calcuzz
Sorry guys I'm Bricked rn,Enslave Blud Sunde,Warden Up The Stairs,Gay Son or Thot Daughter
`
},

{
    title: "Jaren",
    date: "2025-03-14",
    gameData: `
RIP Mrs.Gmez "Never Forget"
Rocks,Statue,Hoff,Cops
Blud Prison Realm 2.0
Twin Towers,Villager Slave Farm,Vari,Penis Statue
Caleb Quotes
Urgyan,Respect Is Earned,Say It To My Face,She's The World
Lorali
Green Light,Youth Camp,Whit's,Strict Phone Policy
`
},

{
    title: "Zaine",
    date: "2025-03-10",
    gameData: `
Herson
7/60,Lean Mobile,Blud Prison Realm,3 Calcs(Slang)
Caleb Girl Moments
Jaren,Youth Camp,Yes my bf,Lesbian
Pre-Calcuzz
I'm Bricked,Izache Interviews,Up The Stairs, Backshots Chumball
Blud Prison Table
Domain and Range,Naggot Figure,Across the Commons,Notch
`
}];

function displayErrorMessage(message) {
    errorMessageDisplay.textContent = message;
    errorMessageDisplay.style.display = 'block';
    setTimeout(() => {
        errorMessageDisplay.style.display = 'none';
    }, 3000);
}

function initializeGame(customGame = null) {
    gameActive = true;
    wrongGuesses = 0;
    submitButton.disabled = false;

    if (customGame) {
        ({
            words,
            categories
        } = parseCustomGame(customGame));
    } else {
        words = ['Mr. Pack', 'Sunde', 'D1 Vari', 'Ksenja', 'Women dont deserve my respect', 'Statue', 'Unc Status', 'Is It a Snow Day?', 'Yogurt Picture', 'Childish Shi', 'Running from EP Interview', 'Making Soup', 'Hay Day', 'Mechanic', '7/60', 'ICE'];
        categories = [{
            name: 'Minecraft Mobs',
            words: ['Mr. Pack', 'Sunde', 'D1 Vari', 'Ksenja']
        }, {
            name: 'Senior Year',
            words: ['Women dont deserve my respect', 'Statue', 'Unc Status', 'Is It a Snow Day?']
        }, {
            name: 'Blud Prison Lunch Table',
            words: ['Yogurt Picture', 'Childish Shi', 'Running from EP Interview', 'Making Soup']
        }, {
            name: 'Herson Lore',
            words: ['Hay Day', 'Mechanic', '7/60', 'ICE']
        }];
    }


    shuffleArray(words);
    renderGameBoard();
    selectedWords = [];
    feedback.textContent = '';
}

function renderGameBoard() {
    gameBoard.innerHTML = '';
    words.forEach(word => {
        const tile = document.createElement('div');
        tile.className = 'word-tile';
        tile.textContent = word;
        tile.addEventListener('click', () => toggleWordSelection(tile));
        gameBoard.appendChild(tile);
    });
}

function toggleWordSelection(tile) {
    if (!gameActive) return;
    if (selectedWords.length < 4 || tile.classList.contains('selected')) {
        tile.classList.toggle('selected');
        const word = tile.textContent;
        if (selectedWords.includes(word)) {
            selectedWords = selectedWords.filter(w => w !== word);
        } else {
            selectedWords.push(word);
        }
    }
}

function checkSelection() {
    if (!gameActive) return;

    if (selectedWords.length !== 4) {
        displayErrorMessage('Select 4 Words Goofy Bobcat.');
        return;
    }

    const categoryIndex = categories.findIndex(category =>
        category.words.every(word => selectedWords.includes(word))
    );

    if (categoryIndex !== -1) {
        feedback.textContent = `Correct! Category: ${categories[categoryIndex].name}`;
        categories.splice(categoryIndex, 1);
        selectedWords.forEach(word => {
            const index = words.indexOf(word);
            if (index !== -1) words.splice(index, 1);
        });
        selectedWords = [];
        renderGameBoard();

        if (categories.length === 0) {
            const winMessages = ["You Escaped Blud Prison", "You're So Tired"];
            const randomWinMessage = winMessages[Math.floor(Math.random() * winMessages.length)];
            showWinLossModal(randomWinMessage, true);
            submitButton.disabled = true;
            gameActive = false;
        }
    } else {
        wrongGuesses++;
        if (wrongGuesses > maxWrongGuesses) {
            showWinLossModal("You're Going To Blud Prison. Sending Blud Warden After You", false);
            submitButton.disabled = true;
            gameActive = false;
        } else {
            const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            displayErrorMessage(`${randomMessage} ${maxWrongGuesses - wrongGuesses + 1} guesses left.`);

            if (isOneAway()) {
                feedback.textContent = `Incorrect. ${maxWrongGuesses - wrongGuesses + 1} guesses left. One away!`;
            } else {
                feedback.textContent = `Incorrect. ${maxWrongGuesses - wrongGuesses + 1} guesses left.`;
            }
        }
    }
}

function isOneAway() {
    for (const category of categories) {
        let correctWords = 0;
        for (const word of selectedWords) {
            if (category.words.includes(word)) {
                correctWords++;
            }
        }
        if (correctWords === 3) {
            return true;
        }
    }
    return false;
}

function clearSelection() {
    selectedWords = [];
    document.querySelectorAll('.word-tile').forEach(tile => tile.classList.remove('selected'));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function parseCustomGame(input) {
    const lines = input.trim().split('\n');
    const customCategories = [];
    const customWords = [];

    for (let i = 0; i < lines.length; i += 2) {
        const categoryName = lines[i].trim();
        const categoryWords = lines[i + 1].split(',').map(word => word.trim());
        customCategories.push({
            name: categoryName,
            words: categoryWords
        });
        customWords.push(...categoryWords);
    }

    return {
        words: customWords,
        categories: customCategories
    };
}

function loadPreMadeGames() {
    preMadeGames.forEach((game, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<button data-index="${index}">${game.title} - ${game.date}</button>`;
        preMadeGamesList.appendChild(listItem);
    });
}

function showWinLossModal(message, win) {
    winLossMessage.textContent = message;
    winLossModal.style.display = 'block';

    setTimeout(() => {
        winLossModal.style.display = 'none';
        initializeGame();
    }, 5000);
}

function restartGame() {
    initializeGame();
}

submitButton.addEventListener('click', checkSelection);
clearButton.addEventListener('click', clearSelection);

openPreMadeGamesButton.addEventListener('click', () => {
    preMadeGamesModal.style.display = 'block';
});

preMadeGamesList.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        const gameIndex = event.target.dataset.index;
        initializeGame(preMadeGames[gameIndex].gameData);
        preMadeGamesModal.style.display = 'none';
    }
});

window.onclick = (event) => {
    if (event.target === preMadeGamesModal) {
        preMadeGamesModal.style.display = 'none';
    }
};

loadPreMadeGames();
initializeGame();
