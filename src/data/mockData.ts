import { Card, Level } from '@/types';

export const initialCards: Card[] = [
  {
    id: 'call',
    name: '认购契约 (Call)',
    cost: 50,
    delta: 50,
    gamma: 10,
    theta: -15,
    vega: 20,
  },
  {
    id: 'put',
    name: '认沽契约 (Put)',
    cost: 50,
    delta: -50,
    gamma: 10,
    theta: -15,
    vega: 20,
  },
  {
    id: 'long_straddle',
    name: '买入跨式 (Long Straddle)',
    cost: 100,
    delta: 0,
    gamma: 20,
    theta: -30,
    vega: 40,
  },
  {
    id: 'short_straddle',
    name: '卖出跨式 (Short Straddle)',
    cost: 0,
    delta: 0,
    gamma: -20,
    theta: 30,
    vega: -40,
  },
];

const scriptedLevels: Level[] = [
  { step: 1, dS: 20, dVol: 0, text: "【教学 1】前方发现单边上涨趋势！快在下方市场买入唯一可见的『认购契约』，然后结束回合。" },
  { step: 2, dS: 0, dVol: 0, text: "【教学 2】市场陷入停滞。如果你不卸下（平仓）刚才的契约，就会被持续扣除时间体力 (Theta)！试试空手走过去，或者买入『认沽契约』防守。" },
  { step: 3, dS: 0, dVol: 40, text: "【教学 3】前方即将发布财报，方向未知但波动极大！买入新解锁的『跨式组合』，见证波动率 (Vega) 带来的暴利吧！" },
  { step: 4, dS: 0, dVol: 0, text: "【横盘死水】陷入极度窄幅震荡。(防范 Theta 损耗)" },
  { step: 5, dS: 0, dVol: 30, text: "【财报发布】悬念揭晓前夕，隐含波动率(IV)极速飙升。" },
  { step: 6, dS: 0, dVol: -30, text: "【靴子落地】一切尘埃落定，波动率崩塌 (Vol Crush)。" },
];

const scenarioTemplates: Omit<Level, 'step'>[] = [
  { dS: 10, dVol: 0, text: "【上涨趋势】多头力量增强，标的稳步上扬" },
  { dS: -10, dVol: 0, text: "【下跌趋势】空头占据优势，标的持续下探" },
  { dS: 0, dVol: 0, text: "【横盘整理】市场陷入僵局，等待方向选择" },
  { dS: 0, dVol: 20, text: "【波动率上升】市场情绪紧张，波动加剧" },
  { dS: 0, dVol: -20, text: "【波动率下降】恐慌情绪消退，回归平静" },
  { dS: 8, dVol: 10, text: "【趋势+波动】上涨伴随波动，风险与机会并存" },
  { dS: -8, dVol: 10, text: "【下跌+波动】恐慌抛售，波动放大" },
  { dS: 5, dVol: -10, text: "【趋势+降波】趋势明确，波动率收敛" },
];

export const generateLevels = (count: number): Level[] => {
  const levels: Level[] = [];
  
  for (let i = 1; i <= count; i++) {
    if (i <= scriptedLevels.length) {
      levels.push(scriptedLevels[i - 1]);
    } else {
      const templateIndex = Math.floor(Math.random() * scenarioTemplates.length);
      const template = scenarioTemplates[templateIndex];
      levels.push({
        step: i,
        dS: template.dS,
        dVol: template.dVol,
        text: template.text,
      });
    }
  }

  return levels;
};
