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

// Function to create flashcards (handles both images and text)
function createFlashcards(cardsData) {
    flashcardsContainer.innerHTML = '';
    cardsData.forEach((cardData) => {
        const flashcardElement = document.createElement('div');
        flashcardElement.classList.add('flashcard');

        // HTML for term (text or image) and definition (text or image)
        let termHTML = '';
        let definitionHTML = '';

        // Check if the card has an image or text for the term
        if (cardData.termImage) {
            termHTML = `<img src="${cardData.termImage}" alt="Term Image" class="term-content" style="width:100%; max-height:300px;">`;
        } else if (cardData.term) {
            termHTML = `<div class="term-content" style="font-weight: bold; font-size: 1.5em;">${cardData.term}</div>`;
        }

        // Check if the card has an image or text for the definition
        if (cardData.definitionImage) {
            definitionHTML = `<img src="${cardData.definitionImage}" alt="Definition Image" class="definition-content" style="width:100%; max-height:300px; display:none;">`;
        } else if (cardData.definition) {
            definitionHTML = `<div class="definition-content" style="display:none; font-size: 1.2em;">${cardData.definition}</div>`;
        }

        // Set the innerHTML to include term and definition (either text or image)
        flashcardElement.innerHTML = `
            ${termHTML}  <!-- Initially visible (term) -->
            ${definitionHTML} <!-- Initially hidden (definition) -->
            <div class="button-container" style="display: none;">
                <button class="btn btn-success know-it">Know it</button>
                <button class="btn btn-danger dont-know-it">Don't know it</button>
            </div>
        `;

        // Add a click event listener to toggle between term and definition
        flashcardElement.addEventListener('click', function(event) {
            const termContent = flashcardElement.querySelector('.term-content');
            const definitionContent = flashcardElement.querySelector('.definition-content');

            // Toggle visibility
            if (termContent && definitionContent) {
                if (termContent.style.display !== 'none') {
                    termContent.style.display = 'none';  // Hide term content
                    definitionContent.style.display = 'block';  // Show definition content
                } else {
                    termContent.style.display = 'block';  // Show term content
                    definitionContent.style.display = 'none';  // Hide definition content
                }
            }
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

// Handle the end of the flashcards
function handleEndOfCards() {
    if (missedCards.length > 0 && !reviewingMissedCards) {
        alert('Reviewing missed cards.');
        reviewingMissedCards = true;
        currentCardIndex = 0;
        flashcards = missedCards.slice();
        missedCards = [];
        reviewingLabel.style.display = 'block';
        shuffle(flashcards);
        showNextCard(flashcards, currentCardIndex);
    } else if (reviewingMissedCards && missedCards.length === 0) {
        alert('You have reviewed all missed cards and got them correct!');
        reviewingMissedCards = false;
        reviewingLabel.style.display = 'none';
        resetFlashcards();
    } else {
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

// Add event listener for spacebar press to reveal the card
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !cardRevealed && !event.repeat) {
        if (flashcards.length > 0 && currentCardIndex < flashcards.length) {
            const currentCard = flashcards[currentCardIndex];
            const termElement = currentCard.querySelector('.term');
            const exampleElement = currentCard.querySelector('.example');
            const buttonContainer = currentCard.querySelector('.button-container');
            revealCard(termElement, exampleElement, buttonContainer);
            cardRevealed = true;
        } else {
            console.error('No flashcards available or invalid index.');
        }
    }
});

// Reveal the card's term, example (if any), and buttons
function revealCard(termElement, exampleElement, buttonContainer) {
    termElement.style.display = 'block';
    if (exampleElement) {
        exampleElement.style.display = 'block';
    }
    buttonContainer.style.display = 'block';
    cardRevealed = true;
}
