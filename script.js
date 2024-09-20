// Create flashcard elements and add them to the container
function createFlashcards(cardsData) {
    flashcardsContainer.innerHTML = '';
    cardsData.forEach((cardData) => {
        const flashcardElement = document.createElement('div');
        flashcardElement.classList.add('flashcard');

        // Create HTML for the two images (initial image and revealed image)
        let imageHTML = '';
        if (cardData.image && cardData.revealedImage) {
            imageHTML = `
                <img src="${cardData.image}" alt="Flashcard Initial Image" class="flashcard-image" style="width:100%; max-height:300px; display:block;">
                <img src="${cardData.revealedImage}" alt="Flashcard Revealed Image" class="flashcard-revealed-image" style="width:100%; max-height:300px; display:none;">
            `;
        }

        let exampleHTML = '';
        if (cardData.example) {
            exampleHTML = `<div class="example" style="display: none;">Example: ${cardData.example}</div>`;
        }

        // Set the innerHTML to include the images (if available), term, definition, and buttons
        flashcardElement.innerHTML = `
            ${imageHTML}  <!-- Two images added here -->
            <div class="definition">${cardData.definition}</div>
            <div class="term" style="display: none;">${cardData.term}</div>
            ${exampleHTML}
            <div class="button-container" style="display: none;">
                <button class="btn btn-success know-it">Know it</button>
                <button class="btn btn-danger dont-know-it">Don't know it</button>
            </div>
        `;

        // Add event listener to toggle images on click
        flashcardElement.addEventListener('click', function(event) {
            if (!event.target.closest('.btn')) {
                handleCardClick(flashcardElement);
            }
        });

        flashcardsContainer.appendChild(flashcardElement);
        flashcards.push(flashcardElement);
    });
}
