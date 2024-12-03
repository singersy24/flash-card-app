import React from 'react';
import { useSwipeable } from 'react-swipeable';
import styled from 'styled-components';

const FlashcardContainer = styled.div`
  background: ${({ theme }) => theme.surface};
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.border};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.hoverShadow};
  }
`;

const Term = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.5rem 0;
  color: ${({ theme }) => theme.accent};
  opacity: ${({ revealed }) => (revealed ? 1 : 0)};
  transform: translateY(${({ revealed }) => (revealed ? 0 : '10px')});
  transition: all 0.3s ease;
`;

const Definition = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  opacity: ${({ revealed }) => (revealed ? 1 : 0)};
  transform: translateY(${({ revealed }) => (revealed ? 0 : '10px')});
  transition: all 0.3s ease;
`;

const ActionButton = styled.button`
  background: ${({ correct, theme }) => (correct ? theme.accent : theme.secondary)};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.3s;

  &:hover {
    background: ${({ correct, theme }) => (correct ? theme.secondary : theme.accent)};
  }
`;

const SwipeableCard = styled(FlashcardContainer)`
  touch-action: pan-y;
  position: relative;
  
  &::after {
    content: '${props => props.showHint ? (props.swipeDirection === 'left' ? '← Don\'t Know' : 'Know →') : ''}';
    position: absolute;
    top: 50%;
    left: ${props => props.swipeDirection === 'left' ? '20px' : 'auto'};
    right: ${props => props.swipeDirection === 'right' ? '20px' : 'auto'};
    transform: translateY(-50%);
    opacity: ${props => props.swipeAmount ? props.swipeAmount / 100 : 0};
    color: ${props => props.swipeDirection === 'right' ? '#22c55e' : '#ef4444'};
    font-size: 1.2rem;
    pointer-events: none;
  }
`;

function Flashcard({ data, onKnowIt, onDontKnowIt, onCardClick, cardRevealed }) {
  const [swipeDirection, setSwipeDirection] = React.useState(null);
  const [swipeAmount, setSwipeAmount] = React.useState(0);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      const amount = Math.abs(eventData.deltaX);
      setSwipeAmount(Math.min(amount, 100));
      setSwipeDirection(eventData.deltaX > 0 ? 'right' : 'left');
    },
    onSwipeLeft: () => {
      if (cardRevealed) onDontKnowIt();
    },
    onSwipeRight: () => {
      if (cardRevealed) onKnowIt();
    },
    onSwipeEnd: () => {
      setSwipeAmount(0);
      setSwipeDirection(null);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
    trackTouch: true,
    delta: 10,
    swipeThreshold: 40,
  });

  if (!data) return null;

  return (
    <SwipeableCard 
      {...handlers}
      onClick={onCardClick}
      showHint={cardRevealed}
      swipeDirection={swipeDirection}
      swipeAmount={swipeAmount}
      style={{
        transform: `translateX(${swipeAmount * (swipeDirection === 'right' ? 1 : -1)}px)`,
        transition: swipeAmount ? 'none' : 'all 0.3s ease'
      }}
    >
      <Definition>{data.definition}</Definition>
      <Term revealed={cardRevealed}>{data.term}</Term>
      <ButtonContainer revealed={cardRevealed}>
        <ActionButton
          correct
          onClick={(e) => {
            e.stopPropagation();
            onKnowIt();
          }}
        >
          Know it
        </ActionButton>
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onDontKnowIt();
          }}
        >
          Don't know it
        </ActionButton>
      </ButtonContainer>
    </SwipeableCard>
  );
}

export default Flashcard;