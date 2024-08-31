body {
    transition: background-color 0.3s, color 0.3s;
    margin-bottom: 80px; /* Ensure space for bottom buttons on mobile */
}

.flashcard {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin: 10px auto; /* Center the flashcard horizontally */
    padding: 15px; /* Adjust padding for better readability */
    width: 90%;
    max-width: 400px; /* Slightly smaller for better fit on mobile */
    text-align: center;
    transition: all 0.3s;
    font-size: 1.2em; /* Slightly larger font size */
    display: none; /* Initially hide all flashcards */
}

.term {
    font-weight: bold;
    font-size: 1.4em; /* Increase term size for visibility */
    margin-top: 15px;
    display: none; /* Initially hide the term */
}

.definition {
    margin-bottom: 15px;
    font-size: 1.2em; /* Slightly increase font size for definition */
    line-height: 1.4;
}

.button-container {
    display: flex; /* Display buttons side by side */
    justify-content: space-between; /* Ensure buttons are side by side */
    margin-top: 15px;
    gap: 10px; /* Add space between the buttons */
}

.button-container .btn {
    flex: 1;
    padding: 15px 0; /* Increase padding for easier tapping */
    font-size: 1.1em; /* Increase font size */
    border-radius: 5px; /* Make buttons rounded */
    margin: 0; /* Remove margin to align buttons properly */
    text-align: center;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button-container .btn-success {
    background-color: #28a745; /* Green for success */
    color: #fff;
}

.button-container .btn-danger {
    background-color: #dc3545; /* Red for danger */
    color: #fff;
}

.button-container .btn:hover {
    opacity: 0.9; /* Slightly darken on hover */
}

.button-container .btn:active {
    opacity: 0.8; /* Darken further on click */
}

.reveal-button {
    display: block;
    width: 80%; /* Increase width for better visibility */
    margin: 15px auto; /* Center the button */
    padding: 12px; /* Adjust padding for easier tapping */
    font-size: 1.1em; /* Adjust font size */
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px; /* Rounded corners for consistency */
    cursor: pointer;
}

.reveal-button:hover {
    background-color: #0056b3;
}

/* Media query for mobile devices */
@media (max-width: 600px) {
    #button-container {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-around;
        padding: 12px 10px;
        background-color: #f8f9fa; /* Light background to ensure visibility */
        border-top: 1px solid #ddd; /* Subtle border to separate from content */
        z-index: 1000;
    }

    .dark-mode #button-container {
        background-color: #444; /* Dark background for the bottom container in dark mode */
        border-top: 1px solid #333; /* Darker border in dark mode */
    }

    .dark-mode-toggle, .reset-button {
        margin: 0 5px;
        flex: 1;
        text-align: center;
    }

    body {
        margin-bottom: 90px; /* Ensure sufficient space for the button bar */
    }

    /* Adjust flashcard size for landscape mode */
    .flashcard {
        max-width: 100%; /* Adjust the flashcard width for better mobile view */
        margin-top: 5px;
        margin-bottom: 5px;
    }
}

/* For larger screens (desktop), keep the buttons at the top */
@media (min-width: 601px) {
    #button-container {
        position: static;
        display: block;
    }

    .flashcard {
        max-width: 450px; /* Adjust card size for larger screens */
    }

    .reveal-button {
        width: 150px; /* Set a fixed width for the button */
    }
}
