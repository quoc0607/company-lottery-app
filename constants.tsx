
import { Theme } from './types';

export const THEME_STYLES: Record<Theme, string> = {
  [Theme.CLASSIC]: 'bg-gradient-to-br from-red-800 to-red-600 text-yellow-400 font-serif',
  [Theme.CYBER]: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-cyan-400 font-mono',
  [Theme.CHINESE]: 'bg-[#f5efe6] text-[#8b4513] font-[Ma Shan Zheng]',
  [Theme.SPACE]: 'bg-gradient-to-br from-black via-blue-900 to-indigo-900 text-blue-200 font-sans'
};

export const DEFAULT_PRIZES = [
  { id: 'p0', name: '比亚迪 海豹', tier: '特等奖', total: 1, remain: 1, pool: 'elite' as const, batchSize: 1 },
  { id: 'p1', name: 'iPhone 16 Pro', tier: '一等奖', total: 3, remain: 3, pool: 'elite' as const, batchSize: 1 },
  { id: 'p2', name: 'MacBook Air', tier: '二等奖', total: 5, remain: 5, pool: 'elite' as const, batchSize: 1 },
  { id: 'p3', name: 'iPad mini', tier: '三等奖', total: 10, remain: 10, pool: 'elite' as const, batchSize: 2 },
  { id: 'p4', name: '京东卡 1000元', tier: '四等奖', total: 20, remain: 20, pool: 'general' as const, batchSize: 5 },
  { id: 'p5', name: '阳光普照礼盒', tier: '五等奖', total: 50, remain: 50, pool: 'general' as const, batchSize: 10 },
];
