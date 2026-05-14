'use client';

import { useGameStore } from '@/store/gameStore';

export const StartScreen = () => {
  const { setGameState } = useGameStore();

  const handleStart = () => {
    setGameState('playing');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
            期权大陆
          </h1>
          <h2 className="text-2xl font-semibold text-zinc-300">
            风险与对冲的试炼
          </h2>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl">📊</span>
            <span className="text-3xl">⚖️</span>
            <span className="text-3xl">📈</span>
          </div>
          
          <p className="text-zinc-300 text-base leading-relaxed">
            在这个充满迷雾的量化世界里，方向不是唯一的答案。
          </p>
          
          <p className="text-zinc-400 text-sm leading-relaxed">
            你将掌握 Delta 的利刃、构建 Vega 的护盾，在时间的流逝 (Theta) 中寻找生机。
          </p>
          
          <p className="text-zinc-500 text-sm italic">
            准备好面对市场的无常了吗？
          </p>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-purple-500 hover:to-blue-500 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          开始冒险
        </button>

        <div className="flex justify-center gap-6 text-xs text-zinc-600">
          <div className="flex items-center gap-1">
            <span>📈</span>
            <span>Delta</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⚡</span>
            <span>Gamma</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⏳</span>
            <span>Theta</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📊</span>
            <span>Vega</span>
          </div>
        </div>
      </div>
    </div>
  );
};