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
        const response = await fetch('flashcards.txt');
        const data = await response.txt();
        allFlashcards = data;
        flashcards = allFlashcards.slice();  // Copy the original flashcards array
        shuffle(flashcards);
        totalCardsElement.innerText = allFlashcards.length;
        displayFlashcards();
    } catch (error) {
        console.error('Error loading flashcards:', error);
    }
}

function displayFlashcards() {
    flashcardsContainer.innerHTML = '';  // Clear any existing flashcards

    flashcards.forEach((card, index) => {
        const flashcardElement = document.createElement('div');
        flashcardElement.classList.add('flashcard');
        flashcardElement.innerHTML = `
            <div class="definition">${card.definition}</div>
            <div class="term">${card.term}</div>
            <div class="button-container">
                <button class="btn btn-success know-it">Know it</button>
                <button class="btn btn-danger dont-know-it">Don't know it</button>
            </div>
        `;
        flashcardsContainer.appendChild(flashcardElement);
        flashcardElement.style.display = 'none';  // Hide all cards initially
        console.log(`Flashcard created for term: ${card.term}`);  // Log creation of each flashcard
    });

    showNextCard(flashcards, currentCardIndex);
}

// Shuffle function to randomize the flashcards
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to show the next flashcard
function showNextCard(cards, currentIndex) {
    if (currentIndex >= cards.length) {
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
            // Continue reviewing missed cards
            currentCardIndex = 0;
            flashcards = missedCards.slice(); // Reload missed cards
            missedCards = []; // Clear missed cards array
            showNextCard(flashcards, currentCardIndex);
        } else {
            alert('You have completed all the cards!');
        }
        return;
    }

    const currentCard = cards[currentIndex];
    if (!currentCard) {
        console.error('No card found at this index:', currentIndex);
        return;
    }

    // Hide all cards before showing the next one
    cards.forEach(card => {
        if (card) {
            card.style.display = 'none';
        } else {
            console.error('Undefined card in the array.');
        }
    });

    currentCard.style.display = 'block';

    const termElement = currentCard.querySelector('.term');
    const buttonContainer = currentCard.querySelector('.button-container');

    // Check if termElement and buttonContainer exist
    if (!termElement || !buttonContainer) {
        console.error('Missing elements in the card:', currentCard);
        return;
    }

    termElement.style.display = 'none';
    buttonContainer.style.display = 'none';
    cardRevealed = false;

    document.onclick = function (event) {
        if (!currentCard.contains(event.target)) {
            termElement.style.display = 'block';
            buttonContainer.style.display = 'block';
            cardRevealed = true;
        }
    };

    // Handle "Know it" button click
    const knowItButton = currentCard.querySelector('.know-it');
    const dontKnowItButton = currentCard.querySelector('.dont-know-it');

    knowItButton.onclick = function (event) {
        event.stopPropagation();
        correctAnswers++;
        correctAnswersElement.innerText = correctAnswers;
        currentCard.style.display = 'none';
        showNextCard(cards, ++currentCardIndex);
    };

    dontKnowItButton.onclick = function (event) {
        event.stopPropagation();
        incorrectAnswers++;
        incorrectAnswersElement.innerText = incorrectAnswers;
        missedCards.push(currentCard); // Push the entire card element to missedCards
        currentCard.style.display = 'none';
        showNextCard(cards, ++currentCardIndex);
    };

    // Define the function to handle key presses
    function handleKeyPress(event) {
        if (event.key === ' ') {
            event.preventDefault();
            if (!cardRevealed) {
                termElement.style.display = 'block';
                buttonContainer.style.display = 'block';
                cardRevealed = true;
            } else {
                knowItButton.click();
            }
        } else if (event.key === 'Shift') {
            dontKnowItButton.click();
        }
    }

    document.onkeydown = handleKeyPress;
}

function resetFlashcards() {
    correctAnswers = 0;
    incorrectAnswers = 0;
    currentCardIndex = 0;
    missedCards = [];
    reviewingMissedCards = false;
    correctAnswersElement.innerText = correctAnswers;
    incorrectAnswersElement.innerText = incorrectAnswers;
    reviewingLabel.style.display = 'none'; // Hide the reviewing label

    flashcards = allFlashcards.slice();  // Reset flashcards to the original full set
    shuffle(flashcards);
    flashcards.forEach(card => {
        card.style.display = 'none';
        card.querySelector('.term').style.display = 'none';
        card.querySelector('.button-container').style.display = 'none';
    });

    showNextCard(flashcards, currentCardIndex);
}

// Event listener for the dark mode toggle
const darkModeToggle = document.querySelector('.dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    resetCardVisibility();  // Reset the current card visibility when toggling dark mode
});

const resetButton = document.querySelector('.reset-button');
resetButton.addEventListener('click', resetFlashcards);

// Function to reset the visibility of the current card
function resetCardVisibility() {
    const currentCard = flashcards[currentCardIndex];
    if (!currentCard) {
        console.error('No current card found during reset.');
        return;
    }

    const termElement = currentCard.querySelector('.term');
    const buttonContainer = currentCard.querySelector('.button-container');

    if (termElement && buttonContainer) {
        termElement.style.display = 'none';
        buttonContainer.style.display = 'none';
        cardRevealed = false;
    } else {
        console.error('Missing elements in the current card during reset.');
    }
}

loadFlashcards();
