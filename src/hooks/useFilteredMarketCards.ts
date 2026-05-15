'use client';

import { useGameStore } from '@/store/gameStore';

export const useFilteredMarketCards = () => {
  const { marketCards, isTutorial, currentStep } = useGameStore();

  if (!isTutorial) {
    return marketCards;
  }

  switch (currentStep) {
    case 1:
      return marketCards.filter(card => card.id === 'call');
    case 2:
      return marketCards.filter(card => card.id === 'call' || card.id === 'put');
    case 3:
      return marketCards;
    default:
      return marketCards;
  }
};