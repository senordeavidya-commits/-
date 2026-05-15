'use client';

import { useGameStore } from '@/store/gameStore';

export const TutorialCompleteModal = () => {
  const { showTutorialComplete, setIsTutorial, setShowTutorialComplete } = useGameStore();

  if (!showTutorialComplete) return null;

  const handleConfirm = () => {
    setIsTutorial(false);
    setShowTutorialComplete(false);
  };

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleConfirm}
    >
      <div 
        className="bg-zinc-800 rounded-2xl w-11/12 max-w-sm p-6 border border-zinc-600 shadow-2xl text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-white mb-3">训练结束！</h2>
        <p className="text-zinc-300 text-sm mb-6">
          你已掌握所有基础策略。前方迷雾重重，真实的市场博弈现在开始！
        </p>
        <button
          onClick={handleConfirm}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl hover:from-green-500 hover:to-emerald-500 active:scale-95 transition-all duration-300 shadow-lg"
        >
          开始实战
        </button>
      </div>
    </div>
  );
};