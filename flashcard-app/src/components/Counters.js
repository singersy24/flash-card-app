import React from 'react';
import styled from 'styled-components';

const CountersContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const CounterItem = styled.div`
  margin: 0 15px;
  text-align: center;

  p {
    margin: 0;
  }

  span {
    color: ${({ theme }) => theme.accent};
    font-weight: bold;
    font-size: 1.2em;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
  padding: 1rem;
  background: ${({ theme }) => theme.surface};
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background};

  h3 {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.text};
    opacity: 0.8;
    margin-bottom: 0.5rem;
  }

  span {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.accent};
  }
`;

function Counters({ totalCards, correctAnswers, incorrectAnswers }) {
  return (
    <CountersContainer>
      <CounterItem>
        <p>Total Cards: <span>{totalCards}</span></p>
      </CounterItem>
      <CounterItem>
        <p>Correct Answers: <span>{correctAnswers}</span></p>
      </CounterItem>
      <CounterItem>
        <p>Incorrect Answers: <span>{incorrectAnswers}</span></p>
      </CounterItem>
    </CountersContainer>
  );
}

export default Counters;