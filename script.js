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

document.getElementById('section-1').addEventListener('click', () => {
    filterFlashcardsBySection(1);
    console.log('Section 1 clicked'); // Verify button click
});

document.getElementById('section-2').addEventListener('click', () => {
    filterFlashcardsBySection(2);
    console.log('Section 2 clicked'); // Verify button click
});

// Load flashcards from a JSON file
async function loadFlashcards() {
    try {
        const response = await fetch('flashcards.json?cachebuster=' + new Date().getTime());
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data); // Verify data is loaded
        allFlashcards = data;
        totalCardsElement.innerText = allFlashcards.length;
    } catch (error) {
        console.error('Error loading flashcards:', error);
    }
}

// Filter flashcards by the selected section
function filterFlashcardsBySection(section) {
    flashcards = allFlashcards.filter(card => card.section === section);
    resetFlashcards(); // Recreate and display flashcards for the selected section
}

// Create flashcard elements and add them to the container
function createFlashcards(cardsData) {
    flashcardsContainer.innerHTML = '';
    console.log(cardsData); // Verify flashcards creation
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
    displayFlashcards(); // Make sure this function is called to display the cards
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
    if (currentIndex >= cards.length) {
        handleEndOfCards();
        return;
    }

    cards.forEach(card => card.style.display = 'none');
    const currentCard = cards[currentIndex];
    currentCard.style.display = 'block';

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

// Mark the card as known and move to the next one
function markAsKnown() {
    correctAnswers++;
    correctAnswersElement.innerText = correctAnswers;
    showNextCard(flashcards, ++currentCardIndex);
}

// Mark the card as unknown and move to the next one
function markAsUnknown() {
    incorrectAnswers++;
    incorrectAnswersElement.innerText = incorrectAnswers;
    missedCards.push(flashcards[currentCardIndex]);
    showNextCard(flashcards, ++currentCardIndex);
}

// Handle the end of the flashcards sequence
function handleEndOfCards() {
    if (reviewingMissedCards && missedCards.length === 0) {
        alert('You have reviewed all missed cards and got them correct!');
        reviewingMissedCards = false;
        reviewingLabel.style.display = 'none';
        resetFlashcards();
    } else if (!reviewingMissedCards && missedCards.length > 0) {
        alert('Reviewing missed cards.');
        reviewingMissedCards = true;
        currentCardIndex = 0;
        flashcards = missedCards.slice();
        missedCards = [];
        reviewingLabel.style.display = 'block';
        shuffle(flashcards);
        showNextCard(flashcards, currentCardIndex);
    } else if (flashcards.length === 0 || currentCardIndex >= flashcards.length) {
        alert('You have completed all the cards!');
        // Don't call resetFlashcards here to avoid the infinite loop
        // Instead, simply stop or reset indices and give the user a choice to start over if needed.
        currentCardIndex = 0; // Reset the index if user wants to review again
    } else {
        showNextCard(flashcards, currentCardIndex);
    }
}

// Reset the flashcards for a new session
function resetFlashcards() {
    correctAnswers = 0;
    incorrectAnswers = 0;
    currentCardIndex = 0;
    missedCards = [];
    reviewingMissedCards = false;
    correctAnswersElement.innerText = correctAnswers;
    incorrectAnswersElement.innerText = incorrectAnswers;
    reviewingLabel.style.display = 'none';

    flashcards = [];  // Reset the flashcards array
    createFlashcards(flashcards);  // Recreate the flashcards
    shuffle(flashcards);  // Shuffle them before displaying
    if (flashcards.length > 0) {
        showNextCard(flashcards, currentCardIndex);  // Display the first card in an unrevealed state
    }
}

// Shuffle the flashcards array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Toggle dark mode and reset card visibility
const darkModeToggle = document.querySelector('.dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    resetCardVisibility();
});

// Add event listener for reset button
const resetButton = document.querySelector('.reset-button');
resetButton.addEventListener('click', resetFlashcards);

// Reset the visibility of the current card's term and buttons
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

// Load the flashcards when the page is ready
loadFlashcards();
