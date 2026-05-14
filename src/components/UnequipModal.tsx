'use client';

import { useGameStore } from '@/store/gameStore';

export const UnequipModal = () => {
  const { 
    selectedEquippedInstanceId, 
    equippedCards, 
    unequipCard, 
    setSelectedEquippedInstanceId 
  } = useGameStore();

  const card = equippedCards.find(c => c.instanceId === selectedEquippedInstanceId);

  if (!card || !selectedEquippedInstanceId) return null;

  const handleClose = () => {
    setSelectedEquippedInstanceId(null);
  };

  const handleConfirm = () => {
    unequipCard(selectedEquippedInstanceId);
    setSelectedEquippedInstanceId(null);
  };

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div 
        className="bg-zinc-800 rounded-xl w-11/12 max-w-sm p-5 border border-zinc-700 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-white font-bold text-lg">{card.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${
              card.cost > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            }`}>
              成本: {card.cost}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-white text-xl transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-zinc-900/50 rounded-lg p-2 text-center">
            <div className="text-xs text-zinc-500 mb-1">Δ Delta</div>
            <div className={`text-sm font-bold ${card.delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {card.delta >= 0 ? '+' : ''}{card.delta}
            </div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-2 text-center">
            <div className="text-xs text-zinc-500 mb-1">Γ Gamma</div>
            <div className={`text-sm font-bold ${card.gamma >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {card.gamma >= 0 ? '+' : ''}{card.gamma}
            </div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-2 text-center">
            <div className="text-xs text-zinc-500 mb-1">Θ Theta</div>
            <div className={`text-sm font-bold ${card.theta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {card.theta >= 0 ? '+' : ''}{card.theta}
            </div>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-2 text-center">
            <div className="text-xs text-zinc-500 mb-1">V Vega</div>
            <div className={`text-sm font-bold ${card.vega >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {card.vega >= 0 ? '+' : ''}{card.vega}
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-lg p-3 mb-4 border border-zinc-700">
          <p className="text-zinc-300 text-sm text-center font-medium">
            确认平仓？当前将按残值返还 <span className="text-green-400 font-bold text-base">{Math.floor(card.cost * 0.5)}</span> 体力成本。
          </p>
        </div>
        
        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-lg rounded-xl hover:from-red-500 hover:to-rose-500 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          确认平仓 (Unequip)
        </button>
      </div>
    </div>
  );
};