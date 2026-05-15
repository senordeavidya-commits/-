import { Card, Level, StaminaChange } from '@/types';

export const calculateStaminaChange = (
  equippedCards: Card[],
  nextLevel: Level
): { 
  changes: StaminaChange[]; 
  total: number;
  totalDelta: number;
  totalGamma: number;
  totalTheta: number;
  totalVega: number;
} => {
  const totalDelta = equippedCards.reduce((sum, card) => sum + card.delta, 0);
  const totalGamma = equippedCards.reduce((sum, card) => sum + card.gamma, 0);
  const totalTheta = equippedCards.reduce((sum, card) => sum + card.theta, 0);
  const totalVega = equippedCards.reduce((sum, card) => sum + card.vega, 0);

  const deltaChange = Math.round(totalDelta * nextLevel.dS);
  const gammaChange = Math.round(0.5 * totalGamma * Math.pow(nextLevel.dS, 2));
  const thetaChange = totalTheta * 1;
  const vegaChange = Math.round(totalVega * nextLevel.dVol);

  const changes: StaminaChange[] = [
    { source: 'Delta结算', amount: deltaChange },
    { source: 'Gamma结算', amount: gammaChange },
    { source: 'Theta流血', amount: thetaChange },
    { source: 'Vega结算', amount: vegaChange },
  ];

  const total = deltaChange + gammaChange + thetaChange + vegaChange;

  return { 
    changes, 
    total,
    totalDelta,
    totalGamma,
    totalTheta,
    totalVega,
  };
};

export const getTotalAttributes = (cards: Card[]) => ({
  delta: cards.reduce((sum, card) => sum + card.delta, 0),
  gamma: cards.reduce((sum, card) => sum + card.gamma, 0),
  theta: cards.reduce((sum, card) => sum + card.theta, 0),
  vega: cards.reduce((sum, card) => sum + card.vega, 0),
});
