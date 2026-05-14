'use client';

import { useGameStore } from '@/store/gameStore';

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

export const EquipmentBar = () => {
  const { equippedCards, maxEquipSlots, setSelectedEquippedInstanceId } = useGameStore();

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-800 px-4 py-3">
      <div className="flex justify-center gap-3">
        {Array.from({ length: maxEquipSlots }).map((_, index) => {
          const card = equippedCards[index];
          
          return (
            <button
              key={index}
              onClick={() => card?.instanceId && setSelectedEquippedInstanceId(card.instanceId)}
              className={`
                relative w-16 h-20 rounded-lg border-2 transition-all duration-300
                ${card 
                  ? `bg-gradient-to-b ${getCardColor(card.name)} border-zinc-600 hover:border-zinc-400 hover:scale-105 shadow-lg` 
                  : 'bg-zinc-800 border-zinc-700 border-dashed'
                }
              `}
            >
              {card ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-2xl">{getCardIcon(card.name)}</span>
                  <span className="text-xs text-white/90 mt-1 truncate max-w-full px-1">
                    {card.name.slice(0, 2)}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                  <span className="text-xl">+</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};