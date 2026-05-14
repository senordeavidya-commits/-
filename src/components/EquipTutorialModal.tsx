'use client';

import { useState } from 'react';
import { Card } from '@/types';
import { useGameStore } from '@/store/gameStore';

interface EquipTutorialModalProps {
  card: Card;
  onClose: () => void;
}

const getCardTutorial = (cardId: string): string => {
  switch (cardId) {
    case 'call':
      return '赋予你买入的权利。具有向上的 Delta，能在上涨中获利；正 Gamma 会在单边行情中加速收益。代价是每回合必须支付 Theta 时间价值。';
    case 'put':
      return '赋予你卖出的权利。具有向下的负 Delta，能在下跌中获利。同样带有正 Gamma 和负 Theta，是对冲下行风险的利器。';
    case 'long_straddle':
      return '同时买入 Call 和 Put。无视涨跌方向，极高的正 Vega 让你能在「市场剧烈动荡」中暴利。代价是双倍的 Theta 流血，绝不能在横盘中死扛。';
    case 'short_straddle':
      return '扮演卖方收取保费。享有正 Theta 每回合自动回血。但负 Vega/Gamma 意味着一旦发生剧烈单边波动，将面临毁灭性亏损。';
    default:
      return '这是一张神秘的契约...';
  }
};

const getCardColor = (cardId: string): string => {
  switch (cardId) {
    case 'call': return 'from-green-600 to-emerald-600';
    case 'put': return 'from-red-600 to-rose-600';
    case 'long_straddle': return 'from-purple-600 to-violet-600';
    case 'short_straddle': return 'from-yellow-600 to-amber-600';
    default: return 'from-zinc-600 to-zinc-700';
  }
};

const getCardIcon = (cardId: string): string => {
  switch (cardId) {
    case 'call': return '📈';
    case 'put': return '📉';
    case 'long_straddle': return '⚖️';
    case 'short_straddle': return '💰';
    default: return '📦';
  }
};

export const EquipTutorialModal = ({ card, onClose }: EquipTutorialModalProps) => {
  const { equipCard, setHideEquipTutorial } = useGameStore();
  const [hideFuture, setHideFuture] = useState(false);

  const handleConfirm = () => {
    if (hideFuture) {
      setHideEquipTutorial(true);
    }
    equipCard(card);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-800 border border-zinc-600 rounded-xl p-5 max-w-sm w-full animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className="text-blue-400 text-sm font-bold mb-1">📚 期权知识库</div>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-14 h-14 rounded-lg bg-gradient-to-b ${getCardColor(card.id)} flex items-center justify-center`}>
            <span className="text-3xl">{getCardIcon(card.id)}</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{card.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded ${
              card.cost > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            }`}>
              购买成本: {card.cost} 体力
            </span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-3 mb-4 border border-blue-500/20">
          <div className="flex items-start gap-2">
            <span className="text-yellow-400 text-lg mt-0.5">💡</span>
            <div>
              <div className="text-xs text-blue-300 font-medium mb-1">专业解读</div>
              <p className="text-zinc-200 text-sm leading-relaxed">
                {getCardTutorial(card.id)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="hideTutorial"
            checked={hideFuture}
            onChange={(e) => setHideFuture(e.target.checked)}
            className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="hideTutorial" className="text-zinc-400 text-sm">
            不再提示
          </label>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-zinc-700 text-zinc-300 hover:bg-zinc-600 rounded-lg font-medium transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 bg-blue-500 text-white hover:bg-blue-400 rounded-lg font-medium transition-colors"
          >
            确认装备
          </button>
        </div>
      </div>
    </div>
  );
};
