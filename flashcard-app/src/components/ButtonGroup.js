import React from 'react';
import styled from 'styled-components';

const ButtonGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 767px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const StyledButton = styled.button`
  background: ${({ active, theme }) => (active ? theme.accent : theme.surface)};
  color: ${({ active, theme }) => (active ? theme.surface : theme.text)};
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.shadow};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.hoverShadow};
  }

  @media (max-width: 767px) {
    width: auto;
    flex: 1 1 auto;
    min-width: 100px;
    max-width: 200px;
  }
`;

function ButtonGroup({ onSectionChange, onReset, onToggleDarkMode }) {
  const sections = [
    { label: 'Ch 1 Study Guide', value: 'ch-one-study-guide.json' },
    { label: 'Ch 8', value: 'flashcards-ch-eight.json' },
    { label: 'Ch 9', value: 'flashcards-ch-nine.json' },
    { label: 'Ch 10', value: 'flashcards-ch-ten.json' },
    { label: 'Sg 3', value: 'flashcards-sg-three.json' },
    { label: 'Lab 11', value: 'flashcards-lab-eleven.json' },
    { label: 'Lab 12', value: 'flashcards-lab-twelve.json' },
  ];

  return (
    <ButtonGroupContainer>
      <StyledButton onClick={onToggleDarkMode}>
        Toggle Dark Mode
      </StyledButton>
      <StyledButton onClick={onReset}>
        Reset
      </StyledButton>
      {sections.map((section) => (
        <StyledButton
          key={section.value}
          onClick={() => onSectionChange(section.value)}
        >
          {section.label}
        </StyledButton>
      ))}
    </ButtonGroupContainer>
  );
}

export default ButtonGroup;