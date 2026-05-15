'use client';

import { useState } from 'react';
import { Card } from '@/types';
import { useGameStore } from '@/store/gameStore';

interface EquipTutorialModalProps {
  card: Card;
  onClose: () => void;
}

interface TutorialSection {
  title: string;
  icon: string;
  content: string;
  highlight?: boolean;
}

const getCardTutorialSections = (cardId: string): TutorialSection[] => {
  switch (cardId) {
    case 'call':
      return [
        {
          title: '💡 本质是什么？',
          icon: '💡',
          content: '赋予你在未来以「固定的低价」买入资产的特权。当市场价格大涨时，你可以用这个便宜的固定价格买入，从而赚取巨大的差价。',
          highlight: true,
        },
        {
          title: '📈 Delta (方向)',
          icon: '📈',
          content: '代表你看好「上涨」。只要标的涨了，你的契约就会跟着升值。',
        },
        {
          title: '🚀 Gamma (爆发)',
          icon: '🚀',
          content: '它是你的利润加速器。行情涨得越多，你赚钱的速度就越快（复利爆发）。',
        },
        {
          title: '⏳ Theta (代价)',
          icon: '⏳',
          content: '天下没有免费的特权。只要你把这张牌带在身上，每回合都会被扣除一定的体力作为「时间折旧费」。',
        },
      ];
    case 'put':
      return [
        {
          title: '💡 本质是什么？',
          icon: '💡',
          content: '赋予你在未来以「固定的高价」强行卖出资产的特权。当市场价格大跌、别人都在亏钱时，你可以按原先的高价卖出，从而在暴跌中大赚一笔。',
          highlight: true,
        },
        {
          title: '📉 Delta (方向)',
          icon: '📉',
          content: '代表你看好「下跌」。标的跌得越惨，你的契约越值钱。',
        },
        {
          title: '🚀 Gamma (爆发)',
          icon: '🚀',
          content: '利润加速器。跌势越猛，利润放大得越快。',
        },
        {
          title: '⏳ Theta (代价)',
          icon: '⏳',
          content: '同样，持有这种保护特权，每走一步都要扣除一定的「时间折旧费」。',
        },
      ];
    case 'long_straddle':
      return [
        {
          title: '💡 本质是什么？',
          icon: '💡',
          content: '同时买入「认购」和「认沽」。你不再需要头疼猜涨还是猜跌，只要市场发生剧烈的单边波动（无论上下），你都能赚钱。',
          highlight: true,
        },
        {
          title: '🌪️ Vega (波动率)',
          icon: '🌪️',
          content: '这是你的核心武器。市场越恐慌、天气越恶劣（如财报发布前夕），这套组合就越值钱。',
        },
        {
          title: '🩸 致命弱点 (Theta)',
          icon: '🩸',
          content: '极高的维护成本。因为同时持有了两份契约，如果市场陷入横盘死水，你每回合将承受双倍的时间流血。',
        },
      ];
    case 'short_straddle':
      return [
        {
          title: '💡 本质是什么？',
          icon: '💡',
          content: '你化身成了「保险公司」。你赌市场会「风平浪静，毫无波澜」。',
          highlight: true,
        },
        {
          title: '💰 Theta (收益)',
          icon: '💰',
          content: '你成为了时间的朋友。只要市场不乱动，你每回合都能稳稳收取买方交纳的「时间保费」（体力回血）。',
        },
        {
          title: '💣 致命风险 (负Gamma/Vega)',
          icon: '💣',
          content: '一旦遇到单边暴涨暴跌，或极端恶劣天气，你作为卖方必须承担无限的赔付责任，极易瞬间爆仓！',
        },
      ];
    default:
      return [
        {
          title: '💡 神秘契约',
          icon: '📦',
          content: '这是一张神秘的契约...',
        },
      ];
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

  const tutorialSections = getCardTutorialSections(card.id);

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
        className="bg-zinc-800 border border-zinc-600 rounded-xl p-5 max-w-sm w-full animate-slide-up flex flex-col"
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
        
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/20 p-4 mb-4 flex-1 max-h-[60vh] overflow-y-auto space-y-3">
          {tutorialSections.map((section, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-lg mt-0.5 flex-shrink-0">{section.icon}</span>
              <div className="flex-1">
                <div className={`text-sm font-bold mb-1 ${section.highlight ? 'text-blue-400' : 'text-white'}`}>
                  {section.title}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
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