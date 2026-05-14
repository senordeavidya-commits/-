'use client';

import { useGameStore } from '@/store/gameStore';
import { getTotalAttributes } from '@/utils/calculator';
import { useState, useEffect } from 'react';

export const StatusBar = () => {
  const { stamina, maxStamina, equippedCards, setToast } = useGameStore();
  const [displayStamina, setDisplayStamina] = useState(stamina);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  const attributes = getTotalAttributes(equippedCards);
  
  const staminaPercent = (displayStamina / maxStamina) * 100;
  
  useEffect(() => {
    const start = displayStamina;
    const end = stamina;
    const duration = 500;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayStamina(Math.round(start + (end - start) * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [stamina]);

  const getStaminaColor = () => {
    if (staminaPercent >= 60) return 'bg-gradient-to-r from-green-500 to-green-400';
    if (staminaPercent >= 30) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
    return 'bg-gradient-to-r from-red-500 to-red-400';
  };

  const tooltips: Record<string, string> = {
    delta: 'Delta (Δ): 方向偏好。正数看涨，负数看跌。',
    gamma: 'Gamma (Γ): 爆发力。顺势加速盈利，逆势加速亏损。',
    theta: 'Theta (Θ): 时间损耗。负数代表每回合持续流血。',
    vega: 'Vega (V): 波动率抗性。应对天气剧变的护盾或弱点。',
  };

  const handleBadgeClick = (type: string) => {
    const tooltipText = tooltips[type];
    if (tooltipText) {
      setToast({
        id: `tooltip-${type}`,
        changes: [{ source: tooltipText, amount: 0 }],
        total: 0,
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const AttributeBadge = ({ label, value, tooltip, type }: { label: string; value: number; tooltip: string; type: string }) => (
    <div className="relative group cursor-help">
      <div 
        className="flex items-center gap-1 bg-zinc-800/80 px-2 py-1 rounded-full active:scale-95 transition-transform"
        onClick={() => handleBadgeClick(type)}
        onTouchStart={() => handleBadgeClick(type)}
      >
        <span className="text-xs text-zinc-400">{label}</span>
        <span className={`text-xs font-bold ${value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {value >= 0 ? '+' : ''}{value}
        </span>
      </div>
      <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-56 p-3 bg-zinc-800 border border-zinc-600 text-zinc-300 text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[999] shadow-2xl pointer-events-none whitespace-pre-wrap">
        {tooltip}
      </div>
    </div>
  );

  return (
    <header className="relative z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800 px-4 py-3">
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-zinc-400 text-xs">体力</span>
          <span className="text-white font-bold text-sm">
            {displayStamina}/{maxStamina}
          </span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full ${getStaminaColor()} transition-all duration-500 ease-out`}
            style={{ width: `${staminaPercent}%` }}
          />
        </div>
      </div>
      
      <div className="flex gap-2 flex-wrap justify-center">
        <AttributeBadge 
          label="Δ" 
          value={attributes.delta} 
          tooltip="Delta (Δ): 方向偏好。正数看涨，负数看跌。"
          type="delta"
        />
        <AttributeBadge 
          label="Γ" 
          value={attributes.gamma} 
          tooltip="Gamma (Γ): 爆发力。顺势加速盈利，逆势加速亏损。"
          type="gamma"
        />
        <AttributeBadge 
          label="Θ" 
          value={attributes.theta} 
          tooltip="Theta (Θ): 时间损耗。负数代表每回合持续流血。"
          type="theta"
        />
        <AttributeBadge 
          label="V" 
          value={attributes.vega} 
          tooltip="Vega (V): 波动率抗性。应对天气剧变的护盾或弱点。"
          type="vega"
        />
      </div>
    </header>
  );
};