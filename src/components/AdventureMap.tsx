'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Level } from '@/types';

const getEventEmoji = (text: string): string => {
  if (text.includes('逼空') || text.includes('拉升')) return '📈';
  if (text.includes('恐慌') || text.includes('砸盘')) return '📉';
  if (text.includes('横盘') || text.includes('震荡')) return '🔄';
  if (text.includes('财报') || text.includes('飙升')) return '📊';
  if (text.includes('靴子落地') || text.includes('崩塌')) return '💥';
  if (text.includes('开盘')) return '🚀';
  return '❓';
};

interface RoadNodeProps {
  level: Level;
  isCurrent: boolean;
  onClick: () => void;
}

const RoadNode = ({ level, isCurrent, onClick }: RoadNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative z-10 flex items-center justify-center
          w-12 h-12 rounded-full cursor-pointer
          transition-all duration-300 transform
          ${isCurrent 
            ? 'bg-blue-500 ring-2 ring-blue-300 ring-opacity-50 animate-pulse' 
            : 'bg-zinc-700 hover:bg-zinc-600 hover:scale-110'
          }
        `}
      >
        {isCurrent ? (
          <span className="text-2xl">🧙</span>
        ) : (
          <span className="text-xl">{getEventEmoji(level.text)}</span>
        )}
      </div>
      
      {isHovered && !isCurrent && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20 w-48 bg-zinc-800 border border-zinc-600 rounded-lg p-3 shadow-xl animate-fade-in">
          <div className="text-white font-medium text-sm mb-1">{level.text}</div>
          <div className="text-xs text-zinc-400 space-y-0.5">
            <div>标的变动: <span className={level.dS >= 0 ? 'text-green-400' : 'text-red-400'}>{level.dS >= 0 ? '+' : ''}{level.dS}</span></div>
            <div>波动率: <span className={level.dVol >= 0 ? 'text-green-400' : 'text-red-400'}>{level.dVol >= 0 ? '+' : ''}{level.dVol}</span></div>
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-zinc-800" />
        </div>
      )}
    </div>
  );
};

export const AdventureMap = () => {
  const { currentStep, levels } = useGameStore();
  
  const visibleLevels = levels.slice(
    Math.max(0, currentStep - 2),
    currentStep + 5
  );

  const handleNodeClick = (level: Level) => {
    console.log('Clicked node:', level);
  };

  return (
    <div className="relative flex-1 bg-gradient-to-t from-zinc-950 to-zinc-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative h-full flex flex-col items-center justify-start pt-8 px-4">
        <div className="absolute left-1/2 -translate-x-1/2 w-1 bg-gradient-to-t from-zinc-800 to-zinc-700 h-full" />
        
        <div className="space-y-8 flex flex-col-reverse">
          {visibleLevels.map((level, index) => {
            const isCurrent = level.step === currentStep;
            const distanceFactor = index;
            
            return (
              <div
                key={level.step}
                className={`transition-all duration-500 ${
                  isCurrent ? 'opacity-100 scale-100' : 'opacity-80'
                }`}
                style={{
                  transform: `scale(${1 - distanceFactor * 0.08})`,
                  opacity: Math.max(0.3, 1 - distanceFactor * 0.12),
                }}
              >
                <RoadNode
                  level={level}
                  isCurrent={isCurrent}
                  onClick={() => handleNodeClick(level)}
                />
                {!isCurrent && (
                  <div className="text-center mt-1">
                    <span className="text-xs text-zinc-500">第{level.step}格</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none" />
    </div>
  );
};
