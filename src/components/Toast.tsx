'use client';

import { useGameStore } from '@/store/gameStore';

export const Toast = () => {
  const { toast } = useGameStore();

  if (!toast) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="bg-zinc-800/95 backdrop-blur-sm rounded-xl p-4 border border-zinc-600 shadow-2xl max-w-sm mx-4 animate-float-up">
        <div className="text-center mb-3">
          <div className={`text-2xl font-bold ${toast.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {toast.total >= 0 ? '+' : ''}{toast.total}
          </div>
          <div className="text-zinc-400 text-sm">体力变化</div>
        </div>
        <div className="space-y-1">
          {toast.changes.map((change, index) => (
            <div
              key={index}
              className="flex justify-between text-sm px-2 py-1 bg-zinc-900/50 rounded"
            >
              <span className="text-zinc-300">{change.source}</span>
              <span className={change.amount >= 0 ? 'text-green-400' : 'text-red-400'}>
                {change.amount >= 0 ? '+' : ''}{change.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
