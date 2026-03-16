
export enum Theme {
  CLASSIC = 'classic',
  CYBER = 'cyber',
  CHINESE = 'chinese',
  SPACE = 'space'
}

export enum Language {
  ZH = 'zh',
  EN = 'en',
  VI = 'vi'
}

export type DrawMode = 'auto' | 'manual';
export type BgMode = 'cover' | 'contain' | 'stretch';

export type ResetMode = 'soft' | 'hard' | 'factory';

export interface Participant {
  id: string;
  staffId: string;
  name: string;
  department: string;
  pool: 'general' | 'elite';
  weight: number;
}

export interface Prize {
  id: string;
  name: string;
  tier: string;
  total: number;
  remain: number;
  pool: 'general' | 'elite';
  batchSize: number;
  image?: string;
}

export interface Winner {
  id: string;
  participantId: string;
  participantName: string;
  staffId: string;
  department: string;
  prizeId: string;
  prizeName: string;
  tier: string;
  time: string;
}

export interface ResetRecord {
  id: string;
  mode: ResetMode;
  timestamp: string;
  stats: {
    participantsBefore: number;
    winnersBefore: number;
    prizesBefore: number;
  };
}

// ----- New: Removal Audit Record -----
export interface AuditRecord {
  id: string;
  timestamp: string;
  winnerName: string;
  staffId: string;
  prizeName: string;
  tier: string;
}

export interface LotteryState {
  participants: Participant[];
  prizes: Prize[];
  winners: Winner[];
  theme: Theme;
  currentPrizeId: string | null;
  appTitle?: string;
  customBg?: string;
  bgMode?: BgMode;
  language?: Language;
  drawMode?: DrawMode;
  companyLogo?: string;
  resetHistory?: ResetRecord[];
  auditLog?: AuditRecord[]; // Added audit tracking
}
