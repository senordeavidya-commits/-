export interface Card {
  id: string;
  instanceId?: string;
  name: string;
  cost: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

export interface Level {
  step: number;
  dS: number;
  dVol: number;
  text: string;
}

export interface StaminaChange {
  source: string;
  amount: number;
}

export interface ToastMessage {
  id: string;
  changes: StaminaChange[];
  total: number;
}

export interface TurnResult {
  eventText: string;
  dS: number;
  dVol: number;
  changes: StaminaChange[];
  totalChange: number;
  newStamina: number;
}

export interface GameState {
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
}
