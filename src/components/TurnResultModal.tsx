'use client';

import { useGameStore } from '@/store/gameStore';

const getChangeLabel = (source: string): string => {
  switch (source) {
    case 'Delta结算': return 'Delta 敞口损益';
    case 'Gamma结算': return 'Gamma 凸性损益';
    case 'Theta流血': return 'Theta 时间损耗';
    case 'Vega结算': return 'Vega 波动率溢价';
    default: return source;
  }
};

const generateAnalysis = (changes: { source: string; amount: number }[], total: number): string => {
  const absChanges = changes.map(c => ({ ...c, abs: Math.abs(c.amount) }));
  const maxChange = absChanges.reduce((a, b) => a.abs > b.abs ? a : b);
  
  if (maxChange.source === 'Delta结算') {
    if (maxChange.amount > 0 && total > 0) {
      return '🎯 方向判断准确！Delta 敞口为你带来了丰厚的基础利润。';
    } else if (maxChange.amount < 0 && total < 0) {
      return '❌ 方向判断失误！Delta 敞口导致了主要亏损。';
    } else if (maxChange.amount > 0 && total < 0) {
      return '⚠️ Delta 敞口虽有盈利，但被其他因素吞噬。';
    } else {
      return '📊 Delta 敞口贡献有限，继续观察市场动向。';
    }
  }
  
  if (maxChange.source === 'Gamma结算') {
    if (maxChange.amount > 0) {
      return '🚀 非线性爆发！标的的剧烈移动触发了 Gamma 效应，利润加速放大！';
    } else {
      return '💥 Gamma 反噬！市场剧烈波动导致了巨大亏损。';
    }
  }
  
  if (maxChange.source === 'Theta流血') {
    if (maxChange.amount < 0 && Math.abs(maxChange.amount) > 20) {
      return '⏳ 陷入泥沼...行情停滞不前，沉重的时间损耗 (Theta) 正在慢慢拖垮你。';
    } else if (maxChange.amount > 0) {
      return '💰 坐收渔利！时间价值正在为你自动回血。';
    } else {
      return '⏰ 时间流逝中，Theta 损耗在可控范围内。';
    }
  }
  
  if (maxChange.source === 'Vega结算') {
    if (maxChange.amount > 0) {
      return '📈 波动率红利！IV 的上升为你带来了额外收益。';
    } else if (maxChange.amount < 0 && Math.abs(maxChange.amount) > 20) {
      return '💀 惨遭 Vol Crush 反噬！即使方向正确，波动率的骤然崩塌也让你损失惨重。';
    } else {
      return '📉 波动率有所回落，Vega 小幅承压。';
    }
  }
  
  return '📊 本回合结算完成。';
};

interface PnLItemProps {
  label: string;
  formula: string;
  amount: number;
}

const PnLItem = ({ label, formula, amount }: PnLItemProps) => {
  const isNonZero = amount !== 0;
  const isPositive = amount >= 0;
  
  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-1">
        <span className={isNonZero ? 'text-zinc-300' : 'text-zinc-600'}>{label}</span>
        <span className={`font-medium ${
          isNonZero 
            ? (isPositive ? 'text-green-400' : 'text-red-400') 
            : 'text-zinc-600'
        }`}>
          {isPositive && isNonZero ? '+' : ''}{amount}
        </span>
      </div>
      <div className="text-xs text-zinc-500 font-mono pl-2">
        └ {formula}
      </div>
    </div>
  );
};

export const TurnResultModal = () => {
  const { turnResult, confirmAdvance, stamina, maxStamina } = useGameStore();

  if (!turnResult) return null;

  const staminaPercent = (turnResult.newStamina / maxStamina) * 100;
  const analysis = generateAnalysis(turnResult.changes, turnResult.totalChange);

  const getStaminaColor = () => {
    if (staminaPercent >= 60) return 'bg-green-500';
    if (staminaPercent >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPnLItems = () => {
    const items: PnLItemProps[] = [];
    
    turnResult.changes.forEach(change => {
      let label = '';
      let formula = '';
      
      switch (change.source) {
        case 'Delta结算':
          label = 'Delta 敞口损益';
          formula = `${turnResult.totalDelta} (Δ) × ${turnResult.dS} (dS) = ${change.amount}`;
          break;
        case 'Gamma结算':
          label = 'Gamma 凸性损益';
          formula = `0.5 × ${turnResult.totalGamma} (Γ) × ${turnResult.dS}² = ${change.amount}`;
          break;
        case 'Theta流血':
          label = 'Theta 时间损耗';
          formula = `${turnResult.totalTheta} (Θ) × 1 回合 = ${change.amount}`;
          break;
        case 'Vega结算':
          label = 'Vega 波动率溢价';
          formula = `${turnResult.totalVega} (V) × ${turnResult.dVol} (dVol) = ${change.amount}`;
          break;
        default:
          label = change.source;
          formula = `= ${change.amount}`;
      }
      
      items.push({ label, formula, amount: change.amount });
    });
    
    return items;
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={confirmAdvance}
    >
      <div 
        className="bg-zinc-800 border border-zinc-600 rounded-xl p-5 max-w-sm w-full animate-slide-up max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className="text-yellow-400 text-lg font-bold mb-1">📊 本回合战报</div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-lg p-3 mb-3">
          <div className="text-zinc-400 text-xs mb-1">遭遇事件</div>
          <div className="text-white text-sm">{turnResult.eventText}</div>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-zinc-400">标的变动: <span className={turnResult.dS >= 0 ? 'text-green-400' : 'text-red-400'}>{turnResult.dS >= 0 ? '+' : ''}{turnResult.dS}</span></span>
            <span className="text-zinc-400">波动率: <span className={turnResult.dVol >= 0 ? 'text-green-400' : 'text-red-400'}>{turnResult.dVol >= 0 ? '+' : ''}{turnResult.dVol}</span></span>
          </div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-lg p-3 mb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-zinc-400 text-xs">当前面板属性</span>
            <div className="flex gap-2">
              <span className={`text-xs ${turnResult.totalDelta !== 0 ? 'text-green-400' : 'text-zinc-600'}`}>Δ {turnResult.totalDelta}</span>
              <span className={`text-xs ${turnResult.totalGamma !== 0 ? 'text-green-400' : 'text-zinc-600'}`}>Γ {turnResult.totalGamma}</span>
              <span className={`text-xs ${turnResult.totalTheta !== 0 ? 'text-red-400' : 'text-zinc-600'}`}>Θ {turnResult.totalTheta}</span>
              <span className={`text-xs ${turnResult.totalVega !== 0 ? 'text-green-400' : 'text-zinc-600'}`}>V {turnResult.totalVega}</span>
            </div>
          </div>
          
          <div className="text-zinc-400 text-xs mb-2">PnL 归因分析（泰勒展开）</div>
          <div className="space-y-0 border-t border-zinc-700">
            {getPnLItems().map((item, index) => (
              <PnLItem key={index} {...item} />
            ))}
            <div className="border-t border-zinc-700 pt-2 mt-2 flex justify-between font-medium">
              <span className="text-zinc-300">本回合总计</span>
              <span className={turnResult.totalChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                {turnResult.totalChange >= 0 ? '+' : ''}{turnResult.totalChange}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-lg p-3 mb-3 border border-amber-500/20">
          <div className="flex items-start gap-2">
            <span className="text-amber-400 text-lg mt-0.5">💬</span>
            <p className="text-zinc-200 text-sm leading-relaxed">
              {analysis}
            </p>
          </div>
        </div>
        
        <div className="bg-zinc-900/50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-zinc-400 text-sm">体力剩余</span>
            <span className="text-white font-bold">{turnResult.newStamina} / {maxStamina}</span>
          </div>
          <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getStaminaColor()} transition-all duration-500`}
              style={{ width: `${staminaPercent}%` }}
            />
          </div>
        </div>
        
        <button
          onClick={confirmAdvance}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 rounded-lg font-bold transition-all"
        >
          继续前进
        </button>
      </div>
    </div>
  );
};