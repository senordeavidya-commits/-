'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Card } from '@/types';
import { EquipTutorialModal } from './EquipTutorialModal';
import { useFilteredMarketCards } from '@/hooks/useFilteredMarketCards';

const getCardColor = (cardName: string): string => {
  if (cardName.includes('认购')) return 'from-green-600 to-emerald-600';
  if (cardName.includes('认沽')) return 'from-red-600 to-rose-600';
  if (cardName.includes('买入跨式')) return 'from-purple-600 to-violet-600';
  if (cardName.includes('卖出跨式')) return 'from-yellow-600 to-amber-600';
  return 'from-zinc-600 to-zinc-700';
};

const getCardIcon = (cardName: string): string => {
  if (cardName.includes('认购')) return '📈';
  if (cardName.includes('认沽')) return '📉';
  if (cardName.includes('买入跨式')) return '⚖️';
  if (cardName.includes('卖出跨式')) return '💰';
  return '📦';
};

const getTrendIndicator = (card: Card): { icon: string; label: string } => {
  if (card.delta > 0) return { icon: '📈', label: '看多' };
  if (card.delta < 0) return { icon: '📉', label: '看空' };
  return { icon: '⚖️', label: '中性' };
};

interface CardViewProps {
  card: Card;
  onClick: () => void;
  disabled: boolean;
}

const CardView = ({ card, onClick, disabled }: CardViewProps) => {
  const trend = getTrendIndicator(card);
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-20 h-28 rounded-xl bg-gradient-to-b ${getCardColor(card.name)}
        border-2 transition-all duration-300 transform
        ${disabled 
          ? 'border-zinc-700 opacity-50 cursor-not-allowed' 
          : 'border-zinc-600 hover:border-zinc-400 hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-xl'
        }
      `}
    >
      <div className="absolute top-1 right-1 bg-black/50 rounded-full px-1.5 py-0.5">
        <span className="text-xs text-white">{card.cost}</span>
      </div>
      
      <div className="flex flex-col items-center justify-center h-full">
        <span className="text-2xl mb-1">{getCardIcon(card.name)}</span>
        <span className="text-xs text-white/90 text-center px-1 leading-tight">
          {card.name}
        </span>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs">{trend.icon}</span>
          <span className="text-xs text-white/70">{trend.label}</span>
        </div>
      </div>
    </button>
  );
};

export const DeckAndControls = () => {
  const marketCards = useFilteredMarketCards();
  const { 
    equippedCards, 
    maxEquipSlots, 
    stamina, 
    equipCard,
    hideEquipTutorial,
    calculateTurnResult,
    currentStep,
    levels
  } = useGameStore();

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const canAdvance = currentStep < levels.length && stamina > 0;

  const handleCardClick = (card: Card) => {
    if (equippedCards.length >= maxEquipSlots) return;
    if (stamina < card.cost) return;
    
    if (hideEquipTutorial) {
      equipCard(card);
    } else {
      setSelectedCard(card);
    }
  };

  const isCardDisabled = (card: Card) => {
    return equippedCards.length >= maxEquipSlots || stamina < card.cost;
  };

  const handleEndTurn = () => {
    calculateTurnResult();
  };

  return (
    <>
      <div className="bg-zinc-950/90 backdrop-blur-sm border-t border-zinc-800 px-4 py-4">
        <div className="flex justify-center mb-3">
          <button
            onClick={handleEndTurn}
            disabled={!canAdvance}
            className={`
              px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300
              ${canAdvance
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 active:scale-95 shadow-lg'
                : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
              }
            `}
          >
            ⏭️ 结束回合
          </button>
        </div>
        
        <div className="flex justify-center gap-2 overflow-x-auto pb-2">
          {marketCards.map((card) => (
            <CardView
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card)}
              disabled={isCardDisabled(card)}
            />
          ))}
        </div>
        
        <div className="text-center text-xs text-zinc-500 mt-2">
          点击卡牌购买装备 | 装备槽: {equippedCards.length}/{maxEquipSlots}
        </div>
      </div>
      
      {selectedCard && (
        <EquipTutorialModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  );
};
