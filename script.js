// Initialize variables for tracking progress
let correctAnswers = 0;
let incorrectAnswers = 0;
let currentCardIndex = 0;
let flashcards;
let cardRevealed = false;

const totalCardsElement = document.getElementById('total-cards');
const correctAnswersElement = document.getElementById('correct-answers');
const incorrectAnswersElement = document.getElementById('incorrect-answers');

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
        alert('You have completed all the cards!');
        return;
    }

    // Hide all cards before showing the next one
    cards.forEach(card => card.style.display = 'none');

    const currentCard = cards[currentIndex];
    currentCard.style.display = 'block';

    const termElement = currentCard.querySelector('.term');
    const buttonContainer = currentCard.querySelector('.button-container');

    // Initially hide the term and button container
    termElement.style.display = 'none';
    buttonContainer.style.display = 'none';
    cardRevealed = false;

    // Set up the click event to toggle the term
    currentCard.onclick = function () {
        termElement.style.display = 'block';
        buttonContainer.style.display = 'block';
        cardRevealed = true;
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
    correctAnswersElement.innerText = correctAnswers;
    incorrectAnswersElement.innerText = incorrectAnswers;

    flashcards = allFlashcards.slice();  // Reset flashcards to the original full set
    shuffle(flashcards);
    flashcards.forEach(card => {
        card.style.display = 'none';
        card.querySelector('.term').style.display = 'none';
        card.querySelector('.button-container').style.display = 'none';
    });

    showNextCard(flashcards, currentCardIndex);
}

// Initialize the flashcards
const flashcardsContainer = document.getElementById('flashcards-container');
const allFlashcards = Array.from(flashcardsContainer.querySelectorAll('.flashcard'));  // Store the original set of all flashcards
flashcards = allFlashcards.slice();  // Copy the original flashcards array

shuffle(flashcards);

flashcards.forEach(card => {
    card.style.display = 'none';
});

showNextCard(flashcards, currentCardIndex);

// Function to reset the visibility of the current card
function resetCardVisibility() {
    const currentCard = flashcards[currentCardIndex];
    const termElement = currentCard.querySelector('.term');
    const buttonContainer = currentCard.querySelector('.button-container');

    termElement.style.display = 'none';
    buttonContainer.style.display = 'none';
    cardRevealed = false;
}

// Event listener for the dark mode toggle
const darkModeToggle = document.querySelector('.dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    resetCardVisibility();  // Reset the current card visibility when toggling dark mode
});

const resetButton = document.querySelector('.reset-button');
resetButton.addEventListener('click', resetFlashcards);

totalCardsElement.innerText = allFlashcards.length;
