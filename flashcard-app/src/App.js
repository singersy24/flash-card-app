import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, GlobalStyle } from './theme';
import ButtonGroup from './components/ButtonGroup';
import Counters from './components/Counters';
import FlashcardContainer from './components/FlashcardContainer';
import './styles/styles.css';
import { AppContainer, MainContent, Sidebar } from './components/Layout';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentSection, setCurrentSection] = useState('ch-one-study-guide.json');
  const [totalCards, setTotalCards] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSectionChange = (section) => {
    console.log('Changing section to:', section);
    setCurrentSection(section);
  };

  const handleReset = () => {
    console.log('Reset button clicked');
    console.log('Current state before reset:', {
      currentSection,
      totalCards,
      correctAnswers,
      incorrectAnswers
    });

    // Force a reload by changing section to empty and back
    setCurrentSection('');
    setTimeout(() => {
      setCurrentSection('ch-one-study-guide.json');
    }, 0);

    setTotalCards(0);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);

    console.log('Reset state applied');
  };

  const handleStatsUpdate = (total, correct, incorrect) => {
    setTotalCards(total);
    setCorrectAnswers(correct);
    setIncorrectAnswers(incorrect);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <AppContainer>
        <Sidebar>
          <ButtonGroup
            onToggleDarkMode={handleToggleDarkMode}
            onSectionChange={handleSectionChange}
            onReset={handleReset}
          />
        </Sidebar>
        <MainContent>
          <h1>Anatomy Flashcards</h1>
          <Counters 
            totalCards={totalCards}
            correctAnswers={correctAnswers}
            incorrectAnswers={incorrectAnswers}
          />
          <FlashcardContainer 
            currentSection={currentSection}
            onStatsUpdate={handleStatsUpdate}
          />
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;