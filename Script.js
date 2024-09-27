const memoryGame = document.querySelector('.memory-game');
const gameOverScreen = document.getElementById('game-over');
const restartButton = document.getElementById('restart');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;
let totalPairs = 0;
let cardsArray = [];

const fruitSet = ['🍓', '🍍', '🍇', '🍉', '🍌', '🍒', '🍑', '🥝', '🍋', '🍈'];

document.getElementById('six-cards').addEventListener('click', () => startGame(6));
document.getElementById('twenty-cards').addEventListener('click', () => startGame(20));
restartButton.addEventListener('click', resetGame);

function startGame(numCards) {
    memoryGame.innerHTML = ''; // Clear any previous game
    cardsArray = [];
    matchedPairs = 0;
    gameOverScreen.classList.add('hidden');
    memoryGame.style.gridTemplateColumns = `repeat(${numCards === 6 ? 3 : 5}, 150px)`;

    let selectedFruits = fruitSet.slice(0, numCards / 2);
    cardsArray = [...selectedFruits, ...selectedFruits]; // Duplicate the fruits to create pairs

    shuffle(cardsArray);
    createCards(cardsArray);
    totalPairs = numCards / 2;
}

function createCards(cards) {
    cards.forEach(fruit => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.fruit = fruit;
        card.innerHTML = `
            <div class="front-face">${fruit}</div>
            <div class="back-face">❔</div>
        `;
        card.addEventListener('click', flipCard);
        memoryGame.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.fruit === secondCard.dataset.fruit;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedPairs++;
    resetBoard();

    if (matchedPairs === totalPairs) {
        gameOver();
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function gameOver() {
    gameOverScreen.classList.remove('hidden');
}

function resetGame() {
    gameOverScreen.classList.add('hidden');
    memoryGame.innerHTML = '';
    matchedPairs = 0;
}
