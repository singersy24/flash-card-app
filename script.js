let flashcards = [];
let allFlashcards = [];
let currentCardIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let cardRevealed = false;
let missedCards = [];
let reviewingMissedCards = false;

const flashcardsContainer = document.getElementById('flashcards-container');
const totalCardsElement = document.getElementById('total-cards');
const correctAnswersElement = document.getElementById('correct-answers');
const incorrectAnswersElement = document.getElementById('incorrect-answers');
const reviewingLabel = document.getElementById('reviewing-label');

async function loadFlashcards() {
    try {
        const response = await fetch('flashcards.json?cachebuster=' + new Date().getTime());
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        allFlashcards = data;
        flashcards = [];  // Reset flashcards array
        totalCardsElement.innerText = allFlashcards.length;
        createFlashcards(allFlashcards); // Create DOM elements for flashcards
        displayFlashcards();
    } catch (error) {
        console.error('Error loading flashcards:', error);
    }
}

function createFlashcards(cardsData) {
    flashcardsContainer.innerHTML = '';  // Clear any existing flashcards

    cardsData.forEach((cardData, index) => {
        const flashcardElement = document.createElement('div');
        flashcardElement.classList.add('flashcard');
        flashcardElement.innerHTML = `
            <div class="definition">${cardData.definition}</div>
            <div class="term">${cardData.term}</div>
            <div class="button-container">
                <button class="btn btn-success know-it">Know it</button>
                <button class="btn btn-danger dont-know-it">Don't know it</button>
            </div>
        `;
        flashcardsContainer.appendChild(flashcardElement);
        flashcards.push(flashcardElement); // Add the DOM element to the flashcards array
    });
}

function displayFlashcards() {
    if (flashcards.length === 0) {
        console.error('No flashcards available to display.');
        return;
    }

    flashcards.forEach(card => {
        card.style.display = 'none';  // Initially hide all cards
    });

    showNextCard(flashcards, currentCardIndex);  // Show the first card
}

function showNextCard(cards, currentIndex) {
    if (currentIndex >= cards.length) {
        handleEndOfCards();
        return;
    }

    // Hide all cards before showing the next one
    cards.forEach(card => {
        card.style.display = 'none';
    });

    const currentCard = cards[currentIndex];
    currentCard.style.display = 'block';

    const termElement = currentCard.querySelector('.term');
    const buttonContainer = currentCard.querySelector('.button-container');

    termElement.style.display = 'none'; // Hide term by default
    buttonContainer.style.display = 'none'; // Hide buttons by default
    cardRevealed = false; // Mark the card as not revealed

    // Reveal card on click
    currentCard.onclick = () => {
        if (!cardRevealed) {
            revealCard(termElement, buttonContainer);
        }
    };

    const knowItButton = currentCard.querySelector('.know-it');
    const dontKnowItButton = currentCard.querySelector('.dont-know-it');

    knowItButton.onclick = (event) => {
        event.stopPropagation(); // Prevent the card from being revealed again
        markAsKnown();
    };

    dontKnowItButton.onclick = (event) => {
        event.stopPropagation(); // Prevent the card from being revealed again
        markAsUnknown();
    };

    // Add event listener for key presses
    document.onkeydown = (event) => {
        if (event.key === ' ') {
            event.preventDefault();
            if (!cardRevealed) {
                revealCard(termElement, buttonContainer);
            } else {
                markAsKnown();
            }
        } else if (event.ctrlKey) {
            event.preventDefault();
            markAsUnknown();
        }
    };
}

function revealCard(termElement, buttonContainer) {
    termElement.style.display = 'block';
    buttonContainer.style.display = 'block';
    cardRevealed = true;
}

function markAsKnown() {
    correctAnswers++;
    correctAnswersElement.innerText = correctAnswers;
    const currentCard = flashcards[currentCardIndex];
    currentCard.style.display = 'none';
    showNextCard(flashcards, ++currentCardIndex);
}

function markAsUnknown() {
    incorrectAnswers++;
    incorrectAnswersElement.innerText = incorrectAnswers;
    const currentCard = flashcards[currentCardIndex];
    missedCards.push(currentCard);
    currentCard.style.display = 'none';
    showNextCard(flashcards, ++currentCardIndex);
}

function handleEndOfCards() {
    if (missedCards.length > 0 && !reviewingMissedCards) {
        alert('Reviewing missed cards.');
        reviewingMissedCards = true;
        currentCardIndex = 0;
        flashcards = missedCards.slice(); // Use a copy of missedCards array
        missedCards = []; // Clear missed cards array
        reviewingLabel.style.display = 'block'; // Show the reviewing label
        showNextCard(flashcards, currentCardIndex);
    } else if (reviewingMissedCards && missedCards.length === 0) {
        alert('You have reviewed all missed cards and got them correct!');
        reviewingMissedCards = false;
        reviewingLabel.style.display = 'none'; // Hide the reviewing label
        resetFlashcards(); // Optionally reset all cards or end the session
    } else if (reviewingMissedCards) {
        currentCardIndex = 0;
        flashcards = missedCards.slice(); // Reload missed cards
        missedCards = []; // Clear missed cards array
        showNextCard(flashcards, currentCardIndex);
    } else {
        alert('You have completed all the cards!');
    }
}

function resetFlashcards() {
    correctAnswers = 0;
    incorrectAnswers = 0;
    currentCardIndex = 0;
    missedCards = [];
    reviewingMissedCards = false;
    correctAnswersElement.innerText = correctAnswers;
    incorrectAnswersElement.innerText = incorrectAnswers;
    reviewingLabel.style.display = 'none';

    flashcards = [];  // Clear the flashcards array
    createFlashcards(allFlashcards);  // Recreate the flashcards
    shuffle(flashcards);
    showNextCard(flashcards, currentCardIndex);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const darkModeToggle = document.querySelector('.dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    hideCardContent(); // Ensure card content stays hidden when toggling dark mode
});

const resetButton = document.querySelector('.reset-button');
resetButton.addEventListener('click', resetFlashcards);

function hideCardContent() {
    const currentCard = flashcards[currentCardIndex];
    if (currentCard) {
        const termElement = currentCard.querySelector('.term');
        const buttonContainer = currentCard.querySelector('.button-container');

        termElement.style.display = 'none';
        buttonContainer.style.display = 'none';
        cardRevealed = false;
    }
}

loadFlashcards();
