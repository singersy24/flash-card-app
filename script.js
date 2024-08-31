let flashcards = [];
let allFlashcards = [];
let currentCardIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
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
        console.log('Flashcards data:', data); // Log the JSON data
        allFlashcards = data;
        flashcards = [];  // Reset flashcards array
        totalCardsElement.innerText = allFlashcards.length;
        createFlashcards(allFlashcards); // Create DOM elements for flashcards
        shuffle(flashcards); // Shuffle the flashcards here
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
            <div class="term" style="display: none;">${cardData.term}</div>
            <div class="button-container" style="display: none;">
                <button class="btn btn-success know-it">Know it</button>
                <button class="btn btn-danger dont-know-it">Don't know it</button>
            </div>
        `;
        
        // Add event listener to reveal the term when clicking anywhere on the card
        flashcardElement.addEventListener('click', function () {
            const termElement = flashcardElement.querySelector('.term');
            const buttonContainer = flashcardElement.querySelector('.button-container');
            if (termElement.style.display === 'none') {
                termElement.style.display = 'block';
                buttonContainer.style.display = 'block';
            }
        });

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
        if (card) {
            card.style.display = 'none';  // Initially hide all cards
        } else {
            console.error('A card is undefined.');
        }
    });

    showNextCard(flashcards, currentCardIndex);  // Show the first card
}

function showNextCard(cards, currentIndex) {
    if (currentIndex >= cards.length) {
        handleEndOfCards();
        return;
    }

    console.log('Current index:', currentIndex, 'Total cards:', cards.length);

    // Hide all cards before showing the next one
    cards.forEach((card, i) => {
        if (card) {
            card.style.display = 'none';
        } else {
            console.error(`Card at index ${i} is undefined.`);
        }
    });

    const currentCard = cards[currentIndex];
    if (!currentCard) {
        console.error('Current card is undefined or null:', currentIndex);
        return;
    }

    currentCard.style.display = 'block';

    const termElement = currentCard.querySelector('.term');
    const buttonContainer = currentCard.querySelector('.button-container');

    const knowItButton = currentCard.querySelector('.know-it');
    const dontKnowItButton = currentCard.querySelector('.dont-know-it');

    knowItButton.onclick = function () {
        markAsKnown();
    };

    dontKnowItButton.onclick = function () {
        markAsUnknown();
    };
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
        shuffle(flashcards); // Shuffle the missed cards before reviewing
        showNextCard(flashcards, currentCardIndex);
    } else if (reviewingMissedCards && missedCards.length === 0) {
        alert('You have reviewed all missed cards and got them correct!');
        reviewingMissedCards = false;
        reviewingLabel.style.display = 'none'; // Hide the reviewing label
        resetFlashcards(); // Automatically reset all cards
    } else if (reviewingMissedCards) {
        currentCardIndex = 0;
        flashcards = missedCards.slice(); // Reload missed cards
        missedCards = []; // Clear missed cards array
        shuffle(flashcards); // Shuffle the missed cards before reviewing
        showNextCard(flashcards, currentCardIndex);
    } else {
        alert('You have completed all the cards!');
        resetFlashcards(); // Automatically reset all cards
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
    shuffle(flashcards);  // Shuffle them before displaying
    showNextCard(flashcards, currentCardIndex);  // Display the first card in an unrevealed state
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
    resetCardVisibility();  // Ensure the current card visibility is reset only if not revealed
});

const resetButton = document.querySelector('.reset-button');
resetButton.addEventListener('click', resetFlashcards);

function resetCardVisibility() {
    const currentCard = flashcards[currentCardIndex];
    if (!currentCard) {
        console.error('No current card found during reset.');
        return;
    }

    const termElement = currentCard.querySelector('.term');
    const buttonContainer = currentCard.querySelector('.button-container');

    if (termElement && buttonContainer) {
        termElement.style.display = 'none';  // Ensure term is hidden
        buttonContainer.style.display = 'none';  // Ensure buttons are hidden
    } else {
        console.error('Missing elements in the current card during reset.');
    }

    // Ensure that the flashcard itself is also visible
    currentCard.style.display = 'block';  // Ensure current card is visible
}

loadFlashcards();
