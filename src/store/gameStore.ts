import { create } from 'zustand';
import { Card, Level, ToastMessage, TurnResult } from '@/types';
import { initialCards, generateLevels } from '@/data/mockData';
import { calculateStaminaChange } from '@/utils/calculator';

interface GameStore {
  gameState: 'start' | 'playing' | 'gameover';
  stamina: number;
  maxStamina: number;
  currentStep: number;
  levels: Level[];
  marketCards: Card[];
  equippedCards: Card[];
  maxEquipSlots: number;
  toast: ToastMessage | null;
  hideEquipTutorial: boolean;
  turnResult: TurnResult | null;
  selectedEquippedInstanceId: string | null;
  isTutorial: boolean;
  showTutorialComplete: boolean;
  pendingEquipCard: Card | null;

  setToast: (toast: ToastMessage | null) => void;
  setHideEquipTutorial: (hide: boolean) => void;
  setTurnResult: (result: TurnResult | null) => void;
  setGameState: (state: 'start' | 'playing' | 'gameover') => void;
  setSelectedEquippedInstanceId: (instanceId: string | null) => void;
  setIsTutorial: (isTutorial: boolean) => void;
  setShowTutorialComplete: (show: boolean) => void;
  setPendingEquipCard: (card: Card | null) => void;
  skipTutorial: () => void;
  calculateTurnResult: () => boolean;
  confirmAdvance: () => void;
  equipCard: (card: Card) => boolean;
  unequipCard: (cardId: string) => void;
  resetGame: () => void;
}

const LEVEL_COUNT = 50;

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'start',
  stamina: 1000,
  maxStamina: 1000,
  currentStep: 1,
  levels: generateLevels(LEVEL_COUNT),
  marketCards: [...initialCards],
  equippedCards: [],
  maxEquipSlots: 3,
  toast: null,
  hideEquipTutorial: false,
  turnResult: null,
  selectedEquippedInstanceId: null,
  isTutorial: true,
  showTutorialComplete: false,
  pendingEquipCard: null,

  setToast: (toast) => set({ toast }),
  
  setHideEquipTutorial: (hide) => set({ hideEquipTutorial: hide }),
  
  setTurnResult: (result) => set({ turnResult: result }),
  
  setGameState: (state) => set({ gameState: state }),
  
  setSelectedEquippedInstanceId: (instanceId) => set({ selectedEquippedInstanceId: instanceId }),
  
  setIsTutorial: (isTutorial) => set({ isTutorial }),
  
  setShowTutorialComplete: (show) => set({ showTutorialComplete: show }),
  
  setPendingEquipCard: (card) => set({ pendingEquipCard: card }),
  
  skipTutorial: () => {
    set({
      isTutorial: false,
      currentStep: 4,
      stamina: 1000,
      equippedCards: [],
    });
  },

  calculateTurnResult: () => {
    const { currentStep, levels, equippedCards, stamina, maxStamina } = get();
    
    if (currentStep >= levels.length) {
      return false;
    }

    const nextLevel = levels[currentStep];
    const { changes, total, totalDelta, totalGamma, totalTheta, totalVega } = calculateStaminaChange(equippedCards, nextLevel);

    const newStamina = Math.max(0, Math.min(maxStamina, stamina + total));

    set({
      turnResult: {
        eventText: nextLevel.text,
        dS: nextLevel.dS,
        dVol: nextLevel.dVol,
        changes,
        totalChange: total,
        newStamina,
        totalDelta,
        totalGamma,
        totalTheta,
        totalVega,
      },
    });

    return true;
  },

  confirmAdvance: () => {
    const { turnResult, isTutorial, currentStep } = get();
    
    if (!turnResult) return;

    const newStep = currentStep + 1;
    
    set({
      currentStep: newStep,
      stamina: turnResult.newStamina,
      turnResult: null,
      showTutorialComplete: isTutorial && newStep === 5,
    });
  },

  equipCard: (card) => {
    const { equippedCards, maxEquipSlots, stamina, setToast } = get();

    if (equippedCards.length >= maxEquipSlots) {
      setToast({
        id: Date.now().toString(),
        changes: [{ source: '装备槽已满', amount: 0 }],
        total: 0,
      });
      setTimeout(() => setToast(null), 2000);
      return false;
    }

    if (stamina < card.cost) {
      setToast({
        id: Date.now().toString(),
        changes: [{ source: '体力不足', amount: 0 }],
        total: 0,
      });
      setTimeout(() => setToast(null), 2000);
      return false;
    }

    const newCardInstance = {
      ...card,
      instanceId: `${card.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    set({
      equippedCards: [...equippedCards, newCardInstance],
      stamina: stamina - card.cost,
    });

    return true;
  },

  unequipCard: (instanceId) => {
    const { equippedCards, stamina, maxStamina } = get();
    
    const card = equippedCards.find(c => c.instanceId === instanceId);
    if (!card) return;

    const refund = Math.floor(card.cost * 0.5);

    set({
      equippedCards: equippedCards.filter(c => c.instanceId !== instanceId),
      stamina: Math.min(maxStamina, stamina + refund),
    });
  },

  resetGame: () => {
    set({
      stamina: 1000,
      currentStep: 1,
      levels: generateLevels(LEVEL_COUNT),
      marketCards: [...initialCards],
      equippedCards: [],
      toast: null,
      hideEquipTutorial: false,
      turnResult: null,
      selectedEquippedInstanceId: null,
      isTutorial: true,
      showTutorialComplete: false,
      pendingEquipCard: null,
    });
  },
}));
