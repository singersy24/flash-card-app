let flashcards = [];
let allFlashcards = [];
let currentCardIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let cardRevealed = false;
let missedCards = [];
let reviewingMissedCards = false;
let isProcessing = false; // Debounce flag

const flashcardsContainer = document.getElementById('flashcards-container');
const totalCardsElement = document.getElementById('total-cards');
const correctAnswersElement = document.getElementById('correct-answers');
const incorrectAnswersElement = document.getElementById('incorrect-answers');
const reviewingLabel = document.getElementById('reviewing-label');

// Event listeners for section buttons
const sgOneButton = document.querySelector('.sg-one-button');
const sectionOneButton = document.querySelector('.section-one-button');
const sectionTwoButton = document.querySelector('.section-two-button');

// Add all section buttons to an array
const sectionButtons = [sgOneButton, sectionOneButton, sectionTwoButton];

// Load flashcards from a JSON file
async function loadFlashcards(section) {
    try {
        const response = await fetch(section + '?cachebuster=' + new Date().getTime());
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        allFlashcards = data;
        totalCardsElement.innerText = allFlashcards.length;
        resetFlashcards(); // Call resetFlashcards here to initialize
    } catch (error) {
        console.error('Error loading flashcards:', error);
    }
}

// Event listeners for button clicks
sgOneButton.addEventListener('click', () => {
    loadFlashcards('ch-one-study-guide.json');
    setActiveButton(sgOneButton);
});

sectionOneButton.addEventListener('click', () => {
    loadFlashcards('flashcards-section-one.json');
    setActiveButton(sectionOneButton);
});

sectionTwoButton.addEventListener('click', () => {
    loadFlashcards('flashcards-section-two.json');
    setActiveButton(sectionTwoButton);
});

// Function to set the active button
function setActiveButton(activeButton) {
    sectionButtons.forEach(button => {
        button.classList.remove('active-button');
        button.classList.add('inactive-button');
    });
    activeButton.classList.add('active-button');
    activeButton.classList.remove('inactive-button');
}

// Create flashcard elements and add them to the container
function createFlashcards(cardsData) {
    flashcardsContainer.innerHTML = '';
    cardsData.forEach((cardData) => {
        const flashcardElement = document.createElement('div');
        flashcardElement.classList.add('flashcard');
        let exampleHTML = '';
        if (cardData.example) {
            exampleHTML = `<div class="example" style="display: none;">Example: ${cardData.example}</div>`;
        }
        flashcardElement.innerHTML = `
            <div class="definition">${cardData.definition}</div>
            <div class="term" style="display: none;">${cardData.term}</div>
            ${exampleHTML}
            <div class="button-container" style="display: none;">
                <button class="btn btn-success know-it">Know it</button>
                <button class="btn btn-danger dont-know-it">Don't know it</button>
            </div>
        `;
        flashcardElement.addEventListener('click', function(event) {
            handleCardClick(event, flashcardElement);
        });
        flashcardsContainer.appendChild(flashcardElement);
        flashcards.push(flashcardElement);
    });
}

// Display the flashcards
function displayFlashcards() {
    if (flashcards.length === 0) {
        console.error('No flashcards available to display.');
        return;
    }
    flashcards.forEach(card => card.style.display = 'none');
    showNextCard(flashcards, currentCardIndex);
}

// Handle card click events
function handleCardClick(event, flashcardElement) {
    if (!cardRevealed && !event.target.closest('.btn')) {
        const termElement = flashcardElement.querySelector('.term');
        const exampleElement = flashcardElement.querySelector('.example');
        const buttonContainer = flashcardElement.querySelector('.button-container');
        revealCard(termElement, exampleElement, buttonContainer);
    }
}

// Show the next card in the sequence
function showNextCard(cards, currentIndex) {
    flashcards.forEach(card => card.style.display = 'none');

    if (currentIndex >= cards.length) {
        handleEndOfCards();
        return;
    }

    const currentCard = cards[currentIndex];
    currentCard.style.display = 'block';
    resetCardVisibility();

    const knowItButton = currentCard.querySelector('.know-it');
    const dontKnowItButton = currentCard.querySelector('.dont-know-it');

    knowItButton.onclick = function(event) {
        event.stopPropagation();
        markAsKnown();
    };

    dontKnowItButton.onclick = function(event) {
        event.stopPropagation();
        markAsUnknown();
    };

    cardRevealed = false;
}

// Reveal the card's term, example (if any), and buttons
function revealCard(termElement, exampleElement, buttonContainer) {
    termElement.style.display = 'block';
    if (exampleElement) {
        exampleElement.style.display = 'block';
    }
    buttonContainer.style.display = 'block';
    cardRevealed = true;
}

// Mark the card as known
function markAsKnown() {
    correctAnswers++;
    correctAnswersElement.innerText = correctAnswers;
    showNextCard(flashcards, ++currentCardIndex);
}

// Mark the card as unknown
function markAsUnknown() {
    incorrectAnswers++;
    incorrectAnswersElement.innerText = incorrectAnswers;
    missedCards.push(flashcards[currentCardIndex]);
    showNextCard(flashcards, ++currentCardIndex);
}

// Handle the end of the flashcards
function handleEndOfCards() {
    if (missedCards.length > 0 && !reviewingMissedCards) {
        // Start reviewing missed cards
        alert('Reviewing missed cards.');
        reviewingMissedCards = true;
        currentCardIndex = 0;
        flashcards = missedCards.slice();
        missedCards = [];
        reviewingLabel.style.display = 'block';
        shuffle(flashcards);
        showNextCard(flashcards, currentCardIndex);
    } else if (reviewingMissedCards && missedCards.length > 0) {
        // Still have missed cards after reviewing, keep going
        alert('Continuing to review missed cards.');
        currentCardIndex = 0;
        flashcards = missedCards.slice();
        missedCards = [];
        shuffle(flashcards);
        showNextCard(flashcards, currentCardIndex);
    } else if (reviewingMissedCards && missedCards.length === 0) {
        // All missed cards reviewed correctly
        alert('You have reviewed all missed cards and got them correct!');
        reviewingMissedCards = false;
        reviewingLabel.style.display = 'none';
        resetFlashcards();
    } else {
        // All cards completed
        alert('You have completed all the cards!');
        resetFlashcards();
    }
}

// Reset flashcards for a new session
function resetFlashcards() {
    correctAnswers = 0;
    incorrectAnswers = 0;
    currentCardIndex = 0;
    missedCards = [];
    reviewingMissedCards = false;
    correctAnswersElement.innerText = correctAnswers;
    incorrectAnswersElement.innerText = incorrectAnswers;
    reviewingLabel.style.display = 'none';

    flashcards = [];
    createFlashcards(allFlashcards);
    shuffle(flashcards);
    showNextCard(flashcards, currentCardIndex);
}

// Shuffle the flashcards array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Reset card visibility
function resetCardVisibility() {
    const currentCard = flashcards[currentCardIndex];
    if (currentCard) {
        const termElement = currentCard.querySelector('.term');
        const exampleElement = currentCard.querySelector('.example');
        const buttonContainer = currentCard.querySelector('.button-container');
        termElement.style.display = 'none';
        if (exampleElement) {
            exampleElement.style.display = 'none';
        }
        buttonContainer.style.display = 'none';
        cardRevealed = false;
        currentCard.style.display = 'block';
    }
}

// Toggle dark mode
const darkModeToggle = document.querySelector('.dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    resetCardVisibility();
});

// Add event listener for reset button
const resetButton = document.querySelector('.reset-button');
resetButton.addEventListener('click', resetFlashcards);

// Add event listener for reset button
const resetButton = document.querySelector('.reset-button');
resetButton.addEventListener('click', resetFlashcards);

// Add an event listener to detect spacebar press
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !cardRevealed && !isProcessing) {
        isProcessing = true; // Set debounce flag to avoid multiple triggers
        const currentCard = flashcards[currentCardIndex];
        const termElement = currentCard.querySelector('.term');
        const exampleElement = currentCard.querySelector('.example');
        const buttonContainer = currentCard.querySelector('.button-container');
        revealCard(termElement, exampleElement, buttonContainer);
        setTimeout(() => isProcessing = false, 200); // Reset debounce flag after a short delay
    }
});

// Load the flashcards when the page is ready
loadFlashcards();
