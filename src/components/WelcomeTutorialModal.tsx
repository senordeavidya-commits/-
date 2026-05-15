'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export const WelcomeTutorialModal = () => {
  const { gameState, isTutorial, currentStep, setToast } = useGameStore();
  const [showModal, setShowModal] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (gameState === 'playing' && isTutorial && currentStep === 1 && !hasShown) {
      setShowModal(true);
      setHasShown(true);
    }
  }, [gameState, isTutorial, currentStep, hasShown]);

  const handleClose = () => {
    setShowModal(false);
    setToast({
      id: 'welcome-tip',
      changes: [{ source: '点击前方路标查看未来事件', amount: 0 }],
      total: 0,
    });
    setTimeout(() => setToast(null), 3000);
  };

  if (!showModal) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-zinc-800 border border-zinc-600 rounded-xl p-5 max-w-sm w-full animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className="text-4xl mb-3">🎒</div>
          <h2 className="text-xl font-bold text-white">欢迎来到新手训练营</h2>
        </div>
        
        <div className="bg-zinc-900/50 rounded-lg p-4 mb-4">
          <p className="text-zinc-300 text-sm leading-relaxed text-center">
            期权交易的核心是【提前预判】。你现在的当前位置是第 1 格，请点击前方的路标查看未来会发生什么，并在市场中购买对应卡牌做好准备。去试试吧！
          </p>
        </div>
        
        <button
          onClick={handleClose}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-500 hover:to-purple-500 active:scale-95 transition-all duration-300 shadow-lg"
        >
          我准备好了
        </button>
      </div>
    </div>
  );
};