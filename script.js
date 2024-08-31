let flashcards = [
    {
        "term": "Axial",
        "definition": "Pertaining to the central part of the body, the head and trunk"
    },
    {
        "term": "Cephalic",
        "definition": "Pertaining to the head"
    },
    {
        "term": "Cranial",
        "definition": "Pertaining to the portion of the skull surrounding the brain"
    },
    // Add all other flashcards here...
];

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
    });

    showNextCard(flashcards, currentCardIndex);
}

displayFlashcards();

// The rest of your script.js code remains unchanged...
