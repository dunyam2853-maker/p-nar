import React from 'react';
import { GameCard } from '../types';
import { CardItem } from './CardItem';

interface GameBoardProps {
  cards: GameCard[];
  onCardClick: (card: GameCard) => void;
  disabled: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({ cards, onCardClick, disabled }) => {
  // Determine optimal responsive grid column layout based on card count
  const getGridColsClass = () => {
    const total = cards.length;
    if (total <= 16) {
      return 'grid-cols-2 sm:grid-cols-4 md:grid-cols-4';
    } else if (total <= 24) {
      return 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6';
    } else {
      return 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8';
    }
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-3 flex-1 flex flex-col justify-center">
      <div
        className={`grid ${getGridColsClass()} gap-2.5 sm:gap-3.5 md:gap-4.5 w-full transition-all duration-300`}
      >
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onClick={() => onCardClick(card)}
            disabled={disabled}
          />
        ))}
      </div>
    </main>
  );
};
