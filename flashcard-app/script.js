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
const chEightButton = document.querySelector('.ch-8-button');
const chNineButton = document.querySelector('.ch-9-button');
const chTenButton = document.querySelector('.ch-10-button');
const sgThreeButton = document.querySelector('.sg-3-button');
const labElevenButton = document.querySelector('.lab-11-button');
const labTwelveButton = document.querySelector('.lab-12-button');

// Add all section buttons to an array
const sectionButtons = [chTenButton, chEightButton, chNineButton, labElevenButton, labTwelveButton, sgThreeButton];

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

chEightButton.addEventListener('click', () => {
  loadFlashcards('flashcards-ch-eight.json');
  setActiveButton(chEightButton);
});

chNineButton.addEventListener('click', () => {
    loadFlashcards('flashcards-ch-nine.json');
    setActiveButton(chNineButton);
});

chTenButton.addEventListener('click', () => {
    loadFlashcards('flashcards-ch-ten.json');
    setActiveButton(chTenButton);
});

sgThreeButton.addEventListener('click', () => {
    loadFlashcards('flashcards-sg-three.json');
    setActiveButton(sgThreeButton);
});

labElevenButton.addEventListener('click', () => {
  loadFlashcards('flashcards-lab-eleven.json');
  setActiveButton(labElevenButton);
});

labTwelveButton.addEventListener('click', () => {
    loadFlashcards('flashcards-lab-twelve.json'); // Assuming you have a JSON file for Lab 12 cards
    setActiveButton(labTwelveButton);
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

// ... [Other parts of your code remain unchanged] ...

// Create flashcard elements and add them to the container
function createFlashcards(cardsData) {
    flashcardsContainer.innerHTML = '';
    cardsData.forEach((cardData) => {
        const flashcardElement = document.createElement('div');
        flashcardElement.classList.add('flashcard');

        // Create HTML for the first image if available
        let imageHTML = '';
        if (cardData.image) {
            imageHTML = `<img class="first-image responsive-image" src="${cardData.image}" alt="Flashcard Image">`;
        }

        // Create HTML for the second image if available
        let image2HTML = '';
        if (cardData.image2) {
            image2HTML = `<img class="second-image responsive-image" src="${cardData.image2}" alt="Second Flashcard Image" style="display:none;">`;
        }

        // Set the innerHTML to include images, term, definition, and buttons
        flashcardElement.innerHTML = `
            ${imageHTML}  <!-- First Image -->
            ${image2HTML} <!-- Second Image (hidden initially) -->
            <div class="definition">${cardData.definition}</div>
            <div class="term" style="display: none;">${cardData.term}</div>
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
        const buttonContainer = flashcardElement.querySelector('.button-container');
        const image1Element = flashcardElement.querySelector('.first-image'); // Select the first image
        const image2Element = flashcardElement.querySelector('.second-image'); // Select the second image
        revealCard(termElement, buttonContainer, image2Element, image1Element);
    }
}

// Reveal the card's term, second image, and buttons
function revealCard(termElement, buttonContainer, image2Element, image1Element) {
    // Hide the first image
    if (image1Element) {
        image1Element.style.display = 'none';
    }
    // Show the second image
    if (image2Element) {
        image2Element.style.display = 'block';
    }
    termElement.style.display = 'block';
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
        const buttonContainer = currentCard.querySelector('.button-container');
        const image1Element = currentCard.querySelector('.first-image'); // Select the first image
        const image2Element = currentCard.querySelector('.second-image'); // Select the second image

        // Show the first image
        if (image1Element) {
            image1Element.style.display = 'block';
        }
        // Hide the second image
        if (image2Element) {
            image2Element.style.display = 'none';
        }
        termElement.style.display = 'none';
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

// Add an event listener to detect spacebar press
document.addEventListener('keydown', function(event) {
    // Only trigger on the first spacebar press (not key repeat) and if the card is not revealed
    if (event.code === 'Space' && !cardRevealed && !event.repeat) {
        if (flashcards.length > 0 && currentCardIndex < flashcards.length) {  // Check if flashcards exist
            const currentCard = flashcards[currentCardIndex];
            const termElement = currentCard.querySelector('.term');
            const buttonContainer = currentCard.querySelector('.button-container');
            const image1Element = currentCard.querySelector('.first-image'); // Select the first image
            const image2Element = currentCard.querySelector('.second-image'); // Select the second image

            // Reveal the card elements
            revealCard(termElement, buttonContainer, image2Element, image1Element);

            // Ensure that card stays revealed
            cardRevealed = true;
        } else {
            console.error('No flashcards available or invalid index.');
        }
    }
});
