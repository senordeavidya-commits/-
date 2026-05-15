'use client';

import { useGameStore } from '@/store/gameStore';

export const useFilteredMarketCards = () => {
  const { marketCards, isTutorial, currentStep } = useGameStore();

  if (!isTutorial || currentStep >= 4) {
    return marketCards;
  }

  switch (currentStep) {
    case 1:
      return marketCards.filter(card => card.id === 'call');
    case 2:
      return marketCards.filter(card => card.id === 'call' || card.id === 'put');
    case 3:
      return marketCards.filter(card => 
        card.id === 'call' || card.id === 'put' || card.id === 'long_straddle'
      );
    default:
      return marketCards;
  }
};