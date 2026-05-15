'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

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

const AttributeBadge = ({ label, value }: { label: string; value: number }) => (
  <span className={`bg-zinc-800 text-xs px-2 py-0.5 rounded-full ${value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
    {label} {value >= 0 ? '+' : ''}{value}
  </span>
);

const AttributeChange = ({ label, current, expected }: { label: string; current: number; expected: number }) => {
  const change = expected - current;
  const isPositive = expected >= 0;
  
  return (
    <div className="bg-zinc-900/60 rounded-lg p-2 text-center">
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <div className="flex items-center justify-center gap-1 text-sm">
        <span className="text-zinc-400">{current}</span>
        <span className="text-zinc-500">➔</span>
        <span className={isPositive ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
          {expected >= 0 ? '+' : ''}{expected}
        </span>
      </div>
      {change !== 0 && (
        <div className={`text-xs mt-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {change >= 0 ? '+' : ''}{change}
        </div>
      )}
    </div>
  );
};

export const EquipTutorialModal = () => {
  const { 
    pendingEquipCard, 
    setPendingEquipCard, 
    equipCard, 
    setHideEquipTutorial, 
    equippedCards 
  } = useGameStore();
  
  const [hideFuture, setHideFuture] = useState(false);

  if (!pendingEquipCard) return null;

  const card = pendingEquipCard;
  const tutorialSections = getCardTutorialSections(card.id);

  const currentDelta = equippedCards.reduce((sum, c) => sum + c.delta, 0);
  const currentGamma = equippedCards.reduce((sum, c) => sum + c.gamma, 0);
  const currentTheta = equippedCards.reduce((sum, c) => sum + c.theta, 0);
  const currentVega = equippedCards.reduce((sum, c) => sum + c.vega, 0);

  const expectedDelta = currentDelta + card.delta;
  const expectedGamma = currentGamma + card.gamma;
  const expectedTheta = currentTheta + card.theta;
  const expectedVega = currentVega + card.vega;

  const handleClose = () => {
    setPendingEquipCard(null);
  };

  const handleConfirm = () => {
    if (hideFuture) {
      setHideEquipTutorial(true);
    }
    equipCard(card);
    setPendingEquipCard(null);
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div 
        className="bg-zinc-800 border border-zinc-600 rounded-xl p-4 max-w-sm w-full animate-slide-up flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-3">
          <div className="text-blue-400 text-sm font-bold">📚 装备确认</div>
        </div>
        
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-b ${getCardColor(card.id)} flex items-center justify-center`}>
            <span className="text-2xl">{getCardIcon(card.id)}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-base">{card.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded mt-0.5 inline-block ${
              card.cost > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            }`}>
              购买成本: {card.cost > 0 ? '-' : '+'}{Math.abs(card.cost)} 体力
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          <AttributeBadge label="Δ" value={card.delta} />
          <AttributeBadge label="Γ" value={card.gamma} />
          <AttributeBadge label="Θ" value={card.theta} />
          <AttributeBadge label="V" value={card.vega} />
        </div>
        
        <div className="bg-zinc-900/50 rounded-lg border border-zinc-700 p-3 mb-3">
          <div className="text-xs text-blue-400 font-medium mb-2 flex items-center gap-1">
            <span>📊</span>
            <span>装备后属性预测</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <AttributeChange label="Δ Delta" current={currentDelta} expected={expectedDelta} />
            <AttributeChange label="Γ Gamma" current={currentGamma} expected={expectedGamma} />
            <AttributeChange label="Θ Theta" current={currentTheta} expected={expectedTheta} />
            <AttributeChange label="V Vega" current={currentVega} expected={expectedVega} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/20 p-3 flex-1 max-h-[45vh] overflow-y-auto space-y-2">
          {tutorialSections.map((section, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-base mt-0.5 flex-shrink-0">{section.icon}</span>
              <div className="flex-1">
                <div className={`text-xs font-bold mb-0.5 ${section.highlight ? 'text-blue-400' : 'text-white'}`}>
                  {section.title}
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            id="hideTutorial"
            checked={hideFuture}
            onChange={(e) => setHideFuture(e.target.checked)}
            className="w-4 h-4 rounded bg-zinc-700 border-zinc-600 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="hideTutorial" className="text-zinc-400 text-xs">
            不再提示
          </label>
        </div>
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2 bg-zinc-700 text-zinc-300 hover:bg-zinc-600 rounded-lg font-medium transition-colors text-sm"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 bg-blue-500 text-white hover:bg-blue-400 rounded-lg font-medium transition-colors text-sm"
          >
            确认装备
          </button>
        </div>
      </div>
    </div>
  );
};