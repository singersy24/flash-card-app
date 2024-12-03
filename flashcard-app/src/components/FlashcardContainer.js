import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SwipeInstructions = styled.div`
  text-align: center;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

function FlashcardContainer({ currentSection, onStatsUpdate }) {
  const [flashcardsData, setFlashcardsData] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [missedCards, setMissedCards] = useState([]);
  const [reviewingMissedCards, setReviewingMissedCards] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);

  useEffect(() => {
    console.log('FlashcardContainer: currentSection changed to:', currentSection);
    if (!currentSection) {
      console.log('Empty section detected, resetting state');
      setFlashcardsData([]);
      setCurrentCardIndex(0);
      setCorrectAnswers(0);
      setIncorrectAnswers(0);
      setMissedCards([]);
      setReviewingMissedCards(false);
      setCardRevealed(false);
      return;
    }
    console.log('Loading flashcards for section:', currentSection);
    loadFlashcards(currentSection);
  }, [currentSection]);

  useEffect(() => {
    // Update parent component with stats whenever they change
    onStatsUpdate(
      flashcardsData.length,
      correctAnswers,
      incorrectAnswers
    );
  }, [flashcardsData.length, correctAnswers, incorrectAnswers, onStatsUpdate]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const loadFlashcards = async (section) => {
    console.log('loadFlashcards called with section:', section);
    try {
      const response = await fetch(`/data/${section}`);
      console.log('Fetch response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Loaded flashcards count:', data.length);
      
      const shuffledData = shuffleArray(data);
      console.log('Data shuffled, first card:', shuffledData[0]);
      
      setFlashcardsData(shuffledData);
      setCurrentCardIndex(0);
      setCorrectAnswers(0);
      setIncorrectAnswers(0);
      setMissedCards([]);
      setReviewingMissedCards(false);
      setCardRevealed(false);
      
      console.log('State reset complete');
    } catch (error) {
      console.error('Error in loadFlashcards:', error);
    }
  };

  const handleSectionChange = (section) => {
    loadFlashcards(section);
  };

  const handleKnowIt = () => {
    setCorrectAnswers(correctAnswers + 1);
    setCurrentCardIndex(currentCardIndex + 1);
    setCardRevealed(false);
  };

  const handleDontKnowIt = () => {
    setIncorrectAnswers(incorrectAnswers + 1);
    setMissedCards([...missedCards, flashcardsData[currentCardIndex]]);
    setCurrentCardIndex(currentCardIndex + 1);
    setCardRevealed(false);
  };

  const handleCardClick = () => {
    if (!cardRevealed) {
      setCardRevealed(true);
    }
  };

  return (
    <Container>
      <SwipeInstructions>
        After revealing the answer, swipe right if you know it, left if you don't.
      </SwipeInstructions>
      {flashcardsData.length === 0 ? (
        <div>Loading flashcards...</div>
      ) : currentCardIndex >= flashcardsData.length ? (
        <div>All cards completed! Click Reset to start over.</div>
      ) : (
        <Flashcard
          data={flashcardsData[currentCardIndex]}
          onKnowIt={handleKnowIt}
          onDontKnowIt={handleDontKnowIt}
          onCardClick={handleCardClick}
          cardRevealed={cardRevealed}
        />
      )}
    </Container>
  );
}

export default FlashcardContainer;