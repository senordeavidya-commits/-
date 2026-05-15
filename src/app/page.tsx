'use client';

import { useGameStore } from '@/store/gameStore';
import { StartScreen } from '@/components/StartScreen';
import { StatusBar } from '@/components/StatusBar';
import { AdventureMap } from '@/components/AdventureMap';
import { EquipmentBar } from '@/components/EquipmentBar';
import { DeckAndControls } from '@/components/DeckAndControls';
import { Toast } from '@/components/Toast';
import { TurnResultModal } from '@/components/TurnResultModal';
import { UnequipModal } from '@/components/UnequipModal';
import { TutorialCompleteModal } from '@/components/TutorialCompleteModal';

export default function Home() {
  const { gameState } = useGameStore();

  if (gameState === 'start') {
    return <StartScreen />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col max-w-md mx-auto relative">
      <StatusBar />
      <AdventureMap />
      <EquipmentBar />
      <DeckAndControls />
      <Toast />
      <TurnResultModal />
      <UnequipModal />
      <TutorialCompleteModal />
    </div>
  );
}
