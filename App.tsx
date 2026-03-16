import React, { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import * as XLSX from 'xlsx';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import {
  Trophy, Users, Settings, Download, RotateCcw,
  Image as ImageIcon, RefreshCcw, Globe, Layers,
  PlayCircle, StopCircle, Hash, Upload, Palette, CheckCircle2,
  Plus, Minus, Volume2, VolumeX, Building, ChevronDown, Monitor, Layout,
  Trash2, Loader2, Package, ShoppingBag, Gift, MousePointerClick, Zap, Database,
  CheckCircle, AlertCircle, Image, Camera, Star, ChevronUp, Sparkles, FileJson,
  AlertTriangle, ShieldCheck, History, Info, X, Music, Play, Pause, HelpCircle
} from 'lucide-react';

import { Theme, Participant, Prize, Winner, LotteryState, DrawMode, ResetMode, ResetRecord, AuditRecord } from './types';
import { THEME_STYLES, DEFAULT_PRIZES } from './constants';
import UserGuide from './src/components/UserGuide';

const STORAGE_KEY = 'lottery_v18_i18n';
const AUDIO_SETTINGS_KEY = 'lottery_audio_settings';

const DEFAULT_AUDIO_OPTIONS = {
  background: [
    { name: "无背景音乐", url: null },
    { name: "盛典背景音乐 (Default)", url: "/music/musicOfBackground.mp3" },
    { name: "欢快节奏", url: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3" },
  ],
  drawing: [
    { name: "抽奖过程音 (Default)", url: "/music/musicOfDraw.mp3" },
    { name: "紧张心跳", url: "https://assets.mixkit.co/sfx/preview/mixkit-fast-heartbeat-2503.mp3" },
    { name: "电子滚动", url: "/music/musicOfRolling.mp3" },
  ],
  winner: [
    { name: "金牌时刻 (Default)", url: "/music/musicOfDraw.mp3" },
    { name: "胜利大奖", url: "/music/musicOfDraw1.mp3" },
    { name: "欢呼喝彩", url: "https://assets.mixkit.co/sfx/preview/mixkit-human-group-cheering-444.mp3" },
  ]
};

interface LotteryDisplayCardProps {
  participant: Partial<Participant>;
  isWinner?: boolean;
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  prizeImage?: string;
}

const SIZE_STYLES = {
  large: {
    card: 'h-[380px] min-h-[380px] p-6',
    imageBox: 'h-32 w-32',
    idBox: 'h-10 text-xs',
    nameBox: 'py-3 text-3xl md:text-4xl lg:text-5xl font-black leading-tight',
    deptBox: 'h-12 text-sm'
  },
  medium: {
    card: 'h-[300px] min-h-[300px] p-5',
    imageBox: 'h-24 w-24',
    idBox: 'h-8 text-xs',
    nameBox: 'py-2 text-2xl md:text-3xl font-black leading-tight',
    deptBox: 'h-10 text-sm'
  },
  'medium-small': {  // 新增：介于 medium 和 small 之间
    card: 'h-[220px] min-h-[220px] p-4',
    imageBox: 'h-20 w-20',
    idBox: 'h-7 text-[10px]',
    nameBox: 'py-1.5 text-xl md:text-2xl font-black leading-tight',
    deptBox: 'h-8 text-xs'
  },
  small: {
    card: 'h-[180px] min-h-[180px] p-3',
    imageBox: 'h-16 w-16',
    idBox: 'h-6 text-[9px]',
    nameBox: 'py-1 text-lg md:text-xl font-black leading-tight',
    deptBox: 'h-7 text-[10px]'
  },
  xsmall: {  // 极小模式，适合 15+ 人
    card: 'h-[140px] min-h-[140px] p-2.5',
    imageBox: 'h-12 w-12',
    idBox: 'h-5 text-[8px]',
    nameBox: 'py-0.5 text-base md:text-lg font-black leading-snug',
    deptBox: 'h-6 text-[9px]'
  }
} as const;

const LotteryDisplayCard = memo<LotteryDisplayCardProps>(({
  participant,
  isWinner = false,
  size = 'medium',
  prizeImage // 参数保留但不再使用
}) => {
  if (!participant || !participant.name) return null;

  const layout = useMemo(() => SIZE_STYLES[size] || SIZE_STYLES.medium, [size]);

  const handleCopyId = useCallback(() => {
    if (participant.staffId) {
      navigator.clipboard.writeText(participant.staffId);
      // 可在此加轻提示
    }
  }, [participant.staffId]);

  return (
    <div
      className={`
        relative overflow-hidden w-full flex flex-col items-center justify-between
        ${isWinner
          ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-[0_0_60px_rgba(245,158,11,0.8)] text-amber-950 ring-4 ring-amber-300/70 animate-pulse-slow'
          : 'bg-white/15 backdrop-blur-xl border border-white/25 text-white'}
        font-black text-center rounded-3xl shadow-2xl transition-all duration-500 hover:scale-[1.02]
        ${layout.card}
      `}
    >
      {/* 光晕扫射动画（仅中奖时） */}
      {isWinner && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
      )}

      {/* 工号 - 可点击复制 */}
      <div className="mb-4 z-30 mt-8"> {/* 增加顶部间距补偿图片移除后的空白 */}
        <button
          onClick={handleCopyId}
          className={`
            px-5 py-1.5 rounded-full font-mono font-semibold tracking-widest text-sm shadow-inner transition-colors
            ${isWinner ? 'bg-amber-800/50 text-amber-100 border-amber-300/70 hover:bg-amber-800/70' : 'bg-black/60 text-blue-200 border-white/40 hover:bg-black/80'}
          `}
          title="点击复制工号"
        >
          ID: {participant.staffId || '—'}
        </button>
      </div>

      {/* 姓名 */}
      <div className={`flex-1 flex items-center justify-center px-6 py-2 z-10 w-full ${layout.nameBox}`}>
        <span
          className={`
            break-words text-center leading-tight drop-shadow-2xl font-extrabold
            ${size === 'large' ? 'text-5xl md:text-6xl' : size === 'medium' ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'}
            line-clamp-3
          `}
          title={participant.name}
        >
          {participant.name}
        </span>
      </div>

      {/* 部门 - 彩色标签 */}
      <div className="pb-6 pt-2 z-10 w-full flex justify-center">
        <span className={`
          flex items-center gap-2 px-6 py-2 rounded-full font-bold tracking-wide text-base md:text-lg shadow-lg
          ${isWinner
            ? 'bg-amber-800/70 text-amber-100 border-2 border-amber-300/60'
            : 'bg-black/70 text-gray-100 border border-white/30'}
        `}>
          <Building size={18} className="opacity-80" />
          {participant.department || '—'}
        </span>
      </div>
    </div>
  );
});



const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  const getInitialState = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  }, []);

  const saved = useMemo(() => getInitialState(), [getInitialState]);

  const [participants, setParticipants] = useState<Participant[]>(saved.participants || []);
  const [prizes, setPrizes] = useState<Prize[]>(saved.prizes || []);
  const [winners, setWinners] = useState<Winner[]>(saved.winners || []);
  const [theme, setTheme] = useState<Theme>(saved.theme || Theme.CLASSIC);
  const [appTitle, setAppTitle] = useState(saved.appTitle || t('appTitle'));
  const [companyLogo, setCompanyLogo] = useState<string | null>(saved.companyLogo || null);
  const [isMuted, setIsMuted] = useState(false);
  const [drawMode, setDrawMode] = useState<DrawMode>(saved.drawMode || 'manual');
  const [isDrawing, setIsDrawing] = useState(false);
  const [rollingParticipants, setRollingParticipants] = useState<Partial<Participant>[]>([]);
  const [selectedPrizeId, setSelectedPrizeId] = useState<string | null>(saved.currentPrizeId || null);
  const [showConfig, setShowConfig] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetHistory, setResetHistory] = useState<ResetRecord[]>(saved.resetHistory || []);
  const [auditLog, setAuditLog] = useState<AuditRecord[]>(saved.auditLog || []);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    danger?: boolean;
  } | null>(null);

  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [removeWinnerInfo, setRemoveWinnerInfo] = useState<{
    id: string;
    name: string;
    prizeId: string;
    prizeName: string;
  } | null>(null);

  // 在 showCustomConfirm 函数里
  const showCustomConfirm = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    danger: boolean = false,
    actionKey: string = 'confirmExecute'  // 新增第五个参数，默认 'confirmExecute'
  ) => {
    setConfirmConfig({
      title,
      message,
      onConfirm,
      danger,
      actionKey  // 保存到 config 里
    });
    setShowConfirmModal(true);
  }, []);

  const [audioState, setAudioState] = useState({
    bg: { index: 0, customUrl: null as string | null },
    draw: { index: 0, customUrl: null as string | null },
    winner: { index: 0, customUrl: null as string | null }
  });

  const drawIntervalRef = useRef<number | null>(null);
  const drawingAudioRef = useRef<HTMLAudioElement | null>(null);
  const winnerAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const appRootRef = useRef<HTMLDivElement>(null);
  const winnersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedAudio = localStorage.getItem(AUDIO_SETTINGS_KEY);
    if (savedAudio) {
      try {
        const parsed = JSON.parse(savedAudio);
        setAudioState(prev => ({
          bg: { ...prev.bg, ...parsed.bg },
          draw: { ...prev.draw, ...parsed.draw },
          winner: { ...prev.winner, ...parsed.winner }
        }));
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(audioState));
  }, [audioState]);

  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
      bgAudioRef.current = null;
    }
    const { index, customUrl } = audioState.bg;
    const url = customUrl || DEFAULT_AUDIO_OPTIONS.background[index]?.url;
    if (!url || isMuted) return;
    bgAudioRef.current = new Audio(url);
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.25;
    const playBgm = () => bgAudioRef.current?.play().catch(() => { });
    document.addEventListener('click', playBgm, { once: true });
    playBgm();
    return () => document.removeEventListener('click', playBgm);
  }, [audioState.bg, isMuted]);

  useEffect(() => {
    if (bgAudioRef.current) {
      if (isDrawing) bgAudioRef.current.volume = 0.08;
      else if (rollingParticipants.length > 0 && !isDrawing) bgAudioRef.current.volume = 0.15;
      else bgAudioRef.current.volume = 0.25;
    }
  }, [isDrawing, rollingParticipants.length]);

  useEffect(() => {
    const state: LotteryState = { participants, prizes, winners, theme, currentPrizeId: selectedPrizeId, appTitle, companyLogo, drawMode, resetHistory, auditLog };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [participants, prizes, winners, theme, selectedPrizeId, appTitle, companyLogo, drawMode, resetHistory, auditLog]);

  const eligiblePool = useMemo(() => {
    const prize = prizes.find(p => p.id === selectedPrizeId);
    if (!prize) return [];
    const winnerIds = new Set(winners.map(w => w.participantId));
    return participants.filter(p => p.pool === prize.pool && !winnerIds.has(p.id));
  }, [participants, prizes, winners, selectedPrizeId]);

  const selectedPrize = useMemo(() => prizes.find(p => p.id === selectedPrizeId), [prizes, selectedPrizeId]);

  const showToast = useCallback(({ type, titleKey, messageKey, values = {} }: any) => {
    const toast = document.createElement('div');
    const borderClass = type === 'success' ? 'border-green-500' : type === 'warning' ? 'border-orange-500' : 'border-red-500';
    toast.className = `fixed top-24 right-8 z-[400] max-w-md w-full bg-white border-l-8 ${borderClass} rounded-2xl p-6 shadow-2xl animate-snap-in toast text-slate-800`;
    toast.innerHTML = `<div class="flex items-start gap-4"><div class="font-black">${t(titleKey)}</div><div class="flex-1 text-xs text-slate-500">${t(messageKey, values)}</div></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }, [t]);

  const smartReset = useCallback((mode: ResetMode) => {
    let titleKey = '';
    let messageKey = '';

    if (mode === 'soft') {
      titleKey = 'softReset';
      messageKey = 'resetSoftContent';
    } else if (mode === 'hard') {
      titleKey = 'hardReset';
      messageKey = 'resetHardContent';
    } else {
      titleKey = 'eraseAll';
      messageKey = 'resetFactoryContent';
    }

    const title = t(titleKey);
    const message = t(messageKey);

    showCustomConfirm(
      title,
      message,
      () => {
        setIsResetting(true);
        try {
          if (mode === 'soft') {
            setWinners([]);
            setPrizes(prev => prev.map(p => ({ ...p, remain: p.total })));
          } else if (mode === 'hard') {
            setWinners([]);
            setParticipants([]);
            setPrizes(prev => prev.map(p => ({ ...p, remain: p.total })));
          } else {
            setWinners([]);
            setParticipants([]);
            setPrizes([]);
            setAppTitle(t('appTitle') || '2025 Company Annual Gala Lottery');
            setCompanyLogo(null);
            localStorage.removeItem(STORAGE_KEY);
          }

          setRollingParticipants([]);
          showToast({
            type: 'success',
            titleKey: 'resetSuccess',
            messageKey: 'systemResetComplete'
          });
        } catch (e) {
          console.error('重置失败:', e);
          showToast({
            type: 'error',
            titleKey: 'error',
            messageKey: '重置失败，请检查控制台'
          });
        } finally {
          setIsResetting(false);
        }
      },
      mode === 'factory',                           // danger: true → 红色按钮
      mode !== 'factory' ? 'confirmExecute' : 'eraseConfirm'  // ← 这里加的第五个参数
    );
  }, [t, showToast, showCustomConfirm]);

  const stopDraw = useCallback(() => {
    if (drawIntervalRef.current) clearInterval(drawIntervalRef.current);
    if (drawingAudioRef.current) {
      drawingAudioRef.current.pause();
      drawingAudioRef.current.currentTime = 0;
    }

    const prize = prizes.find(p => p.id === selectedPrizeId);
    if (!prize) return;

    const targetBatchSize = Math.min(prize.batchSize || 1, prize.remain, eligiblePool.length);
    if (targetBatchSize <= 0) {
      setIsDrawing(false);
      if (eligiblePool.length === 0) {
        showToast({
          type: 'warning',
          titleKey: 'warning',
          messageKey: 'noEligibleParticipants'
        });
      }
      return;
    }

    // ────────────── 部门配额计算（后台隐藏） ──────────────
    const deptAvailable = new Map<string, number>();
    eligiblePool.forEach(p => {
      const dept = p.department || '未知部门';
      deptAvailable.set(dept, (deptAvailable.get(dept) || 0) + 1);
    });

    const totalAvailable = eligiblePool.length;
    const deptTargetQuota = new Map<string, number>();
    let remainingToAllocate = targetBatchSize;

    deptAvailable.forEach((count, dept) => {
      if (totalAvailable > 0) {
        const proportion = count / totalAvailable;
        let suggested = Math.round(proportion * targetBatchSize);
        suggested = Math.max(0, Math.min(suggested, count));
        deptTargetQuota.set(dept, suggested);
        remainingToAllocate -= suggested;
      }
    });

    while (remainingToAllocate > 0) {
      const possibleDepts = Array.from(deptTargetQuota.keys()).filter(dept => {
        const suggested = deptTargetQuota.get(dept) || 0;
        const alreadyWon = winners.filter(w =>
          w.prizeId === prize.id && w.department === dept
        ).length;
        return alreadyWon < suggested;
      });
      if (possibleDepts.length === 0) break;
      const luckyDept = possibleDepts[Math.floor(Math.random() * possibleDepts.length)];
      deptTargetQuota.set(luckyDept, (deptTargetQuota.get(luckyDept) || 0) + 1);
      remainingToAllocate--;
    }

    // ────────────── 抽奖开始 ──────────────
    const batchWinners: Winner[] = [];
    let currentPool = [...eligiblePool];

    // 部门已中奖计数：从全局 winners 加载初始值
    const deptWon = new Map<string, number>();
    winners
      .filter(w => w.prizeId === prize.id)
      .forEach(w => {
        const dept = w.department || '未知部门';
        deptWon.set(dept, (deptWon.get(dept) || 0) + 1);
      });

    while (batchWinners.length < targetBatchSize && currentPool.length > 0) {
      let availablePool = currentPool.filter(p => {
        const dept = p.department || '未知部门';
        const target = (deptTargetQuota.get(dept) || 0) + 1; // 宽松
        const current = deptWon.get(dept) || 0;
        return current < target;
      });

      if (availablePool.length === 0) {
        // console.warn(`[${prize.name}] 部门配额已满，使用全池继续`);
        availablePool = [...currentPool];
      }

      const maxWeight = Math.max(...availablePool.map(p => p.weight || 1), 1);
      const normalizedWeights = availablePool.map(p => (p.weight || 1) / maxWeight);

      let totalWeight = normalizedWeights.reduce((sum, w) => sum + w, 0);
      let random = Math.random() * totalWeight;

      let selected = null;
      let cumulative = 0;
      for (let i = 0; i < availablePool.length; i++) {
        cumulative += normalizedWeights[i];
        if (random < cumulative) {
          selected = availablePool[i];
          break;
        }
      }

      if (!selected) {
        selected = availablePool[Math.floor(Math.random() * availablePool.length)];
      }

      batchWinners.push({
        id: `w-${Date.now()}-${batchWinners.length}-${Math.random().toString(36).slice(2, 8)}`,
        participantId: selected.id,
        participantName: selected.name,
        staffId: selected.staffId,
        department: selected.department,
        prizeId: prize.id,
        prizeName: prize.name,
        tier: prize.tier,
        time: new Date().toLocaleTimeString()
      });

      // 更新部门计数
      const dept = selected.department || '未知部门';
      deptWon.set(dept, (deptWon.get(dept) || 0) + 1);

      const idx = currentPool.indexOf(selected);
      currentPool.splice(idx, 1);
    }

    // ────────────── 后续处理 ──────────────
    if (!isMuted) {
      const { index, customUrl } = audioState.winner;
      const url = customUrl || DEFAULT_AUDIO_OPTIONS.winner[index]?.url;
      if (url) {
        const a = new Audio(url);
        a.volume = 1.0;
        a.play().catch(() => { });
      }
    }

    setWinners(prev => [...prev, ...batchWinners]);
    setPrizes(prev => prev.map(p =>
      p.id === prize.id ? { ...p, remain: p.remain - batchWinners.length } : p
    ));
    setRollingParticipants(batchWinners.map(w => ({
      name: w.participantName,
      staffId: w.staffId,
      department: w.department,
      id: w.participantId
    })));
    setIsDrawing(false);

    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });

    showToast({
      type: 'success',
      titleKey: 'drawSuccess',
      messageKey: 'winnersDrawn',
      values: { count: batchWinners.length }
    });
  }, [eligiblePool, selectedPrizeId, prizes, winners, isMuted, audioState.winner, showToast]);

  const startDraw = useCallback(() => {
    if (!selectedPrizeId || isDrawing || eligiblePool.length === 0) return;
    const prize = prizes.find(p => p.id === selectedPrizeId);
    if (!prize || prize.remain <= 0) { showToast({ type: 'warning', titleKey: 'warning', messageKey: 'prizeFullyDrawn' }); return; }

    setIsDrawing(true);
    if (!isMuted) {
      const { index, customUrl } = audioState.draw;
      const url = customUrl || DEFAULT_AUDIO_OPTIONS.drawing[index]?.url;
      if (url) { drawingAudioRef.current = new Audio(url); drawingAudioRef.current.loop = true; drawingAudioRef.current.play().catch(() => { }); }
    }

    const batchSize = Math.min(prize.batchSize || 1, prize.remain, eligiblePool.length);
    let count = 0;
    drawIntervalRef.current = window.setInterval(() => {
      const randoms = Array.from({ length: batchSize }, () => {
        const p = eligiblePool[Math.floor(Math.random() * eligiblePool.length)];
        return { name: p.name, staffId: p.staffId, department: p.department, id: p.id };
      });
      setRollingParticipants(randoms);
      if (drawMode === 'auto' && count++ > 30) stopDraw();
    }, 70);
  }, [selectedPrizeId, isDrawing, eligiblePool, prizes, drawMode, isMuted, audioState.draw, stopDraw, showToast]);

  const handleEmployeeImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const normalize = (str: string) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target?.result, { type: 'binary' });
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        const colMap = {
          staffId: headers.find(h => ['mã sf', 'employee code', 'mã nhân viên', '工号', 'id'].some(k => normalize(h).includes(normalize(k)))),
          name: headers.find(h => ['tên', 'họ tên', '姓名', 'name'].some(k => normalize(h).includes(normalize(k)))),
          dept: headers.find(h => ['bộ phận', 'phòng ban', '部门', 'bo phan'].some(k => normalize(h).includes(normalize(k)))),
          weight: headers.find(h =>
            ['weight', '权重', 'trọng số', 'số lần', 'priority', 'ưu tiên'].some(k => normalize(h).includes(normalize(k)))
          ),
          pool: headers.find(h => ['giải', 'giải thưởng', '奖池', 'pool', 'nhóm', '奖池'].some(k => normalize(h).includes(normalize(k)))),
        };

        const imported = data.map((row: any, i) => {
          // 奖池列（E列）取值，默认 '全员' → 'general'
          let poolRaw = String(row[colMap.pool || ''] || row[headers[4]] || '全员').trim();
          let pool: 'general' | 'elite' = 'general';

          const poolText = poolRaw.toLowerCase();
          if (poolText.includes('精英') || poolText.includes('cao cấp') || poolText.includes('vip') || poolText.includes('elite') || poolText.includes('高管')) {
            pool = 'elite';
          } else if (poolText.includes('全员') || poolText.includes('tất cả') || poolText.includes('普通') || poolText.includes('general')) {
            pool = 'general';
          }

          // 解析权重：如果有列则取值，否则默认 1；取整并防止负数/0
          let weight = 1;
          if (colMap.weight && row[colMap.weight] !== undefined) {
            const raw = Number(row[colMap.weight]);
            weight = isNaN(raw) || raw <= 0 ? 1 : Math.floor(raw);  // 防止小数、负数、0
          }

          return {
            id: `emp-${Date.now()}-${i}`,
            staffId: String(row[colMap.staffId || ''] || row['A'] || '').trim(),
            name: String(row[colMap.name || ''] || row['B'] || '').trim(),
            department: String(row[colMap.dept || ''] || row['C'] || '').trim() || t('unassigned'),
            pool,
            weight,
          };
        }).filter(p => p.name && p.staffId);

        setParticipants(imported);

        // 打印分布（非常重要！）
        const poolStats = imported.reduce((acc, p) => {
          acc[p.pool] = (acc[p.pool] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        console.log('员工奖池分布：', poolStats);

        showToast({ type: 'success', titleKey: 'success', messageKey: 'importedParticipants', values: { count: imported.length } });
      } catch (err) {
        console.error(err);
        showToast({ type: 'error', titleKey: 'error', messageKey: 'importFailed' });
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handlePrizeImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/g, '');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target?.result, { type: 'binary' });
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        const colMap = {
          tier: headers.find(h => ['hạng', '等级', 'level'].some(k => normalize(h).includes(normalize(k)))),
          name: headers.find(h => ['sản phẩm', '产品', '奖品', '品名'].some(k => normalize(h).includes(normalize(k)))) || headers[2],
          total: headers.find(h => ['số lượng', '数量', 'total'].some(k => normalize(h).includes(normalize(k)))),
          pool: headers.find(h => ['giải', '奖池', 'pool', 'nhóm'].some(k => normalize(h).includes(normalize(k)))),
        };

        const imported = data.map((row: any, i) => {
          let poolRaw = String(row[colMap.pool || ''] || '全员').trim().toLowerCase();
          let pool: 'general' | 'elite' = 'general';

          if (poolRaw.includes('精英') || poolRaw.includes('elite') || poolRaw.includes('vip') || poolRaw.includes('cao cấp')) {
            pool = 'elite';
          } else if (poolRaw.includes('全员') || poolRaw.includes('tất cả') || poolRaw.includes('普通') || poolRaw.includes('general')) {
            pool = 'general';
          }

          return {
            id: `prize-${Date.now()}-${i}`,
            tier: String(row[colMap.tier || ''] || row['A'] || '奖项').trim(),
            name: String(row[colMap.name || ''] || row['B'] || row['C'] || '').trim(),
            total: Number(row[colMap.total || ''] || row['D'] || 1),
            remain: Number(row[colMap.total || ''] || row['D'] || 1),
            pool,
            batchSize: 1,
          };
        }).filter(p => p.name && p.total > 0);

        setPrizes(imported);

        console.log('奖项奖池分布：', imported.map(p => `${p.tier} - ${p.name} → ${p.pool}`));

        if (imported.length > 0) setSelectedPrizeId(imported[0].id);

        showToast({ type: 'success', titleKey: 'success', messageKey: 'importedAwards', values: { count: imported.length } });
      } catch (err) {
        console.error(err);
        showToast({ type: 'error', titleKey: 'error', messageKey: 'importFailed' });
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Fix: Implemented missing handleAudioUpload function to support custom sound effects
  const handleAudioUpload = useCallback((key: 'bg' | 'draw' | 'winner', file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const url = evt.target?.result as string;
      setAudioState(prev => ({
        ...prev,
        [key]: { ...prev[key], customUrl: url }
      }));
      showToast({ type: 'success', titleKey: 'success', messageKey: 'importSuccess' });
    };
    reader.readAsDataURL(file);
  }, [showToast]);

  const captureFullApp = useCallback(async () => {
    try {
      showToast({ type: 'info', titleKey: 'processing', messageKey: '正在生成完整截图（包含所有中奖记录）...' });

      // 1. 临时隐藏配置面板（如果打开）
      const configModal = document.querySelector('.fixed.inset-0.z-\\[150\\]');
      if (configModal) (configModal as HTMLElement).style.display = 'none';

      // 等待渲染稳定
      await new Promise(r => setTimeout(r, 300));

      // 2. 先截取荣耀墙完整内容（强制计算其 scrollHeight）
      if (winnersRef.current && winners.length > 0) {
        // 临时移除 overflow 限制，让 html2canvas 捕获全部高度
        const originalStyle = winnersRef.current.style.overflowY;
        const originalHeight = winnersRef.current.style.height;
        winnersRef.current.style.overflowY = 'visible';
        winnersRef.current.style.height = 'auto';

        // 3. 截取整个 body（不含荣耀墙滚动部分会被完整捕获）
        const fullBodyCanvas = await html2canvas(document.body, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          windowWidth: document.documentElement.scrollWidth,
          windowHeight: document.documentElement.scrollHeight,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0
        });

        // 恢复原样式
        winnersRef.current.style.overflowY = originalStyle;
        winnersRef.current.style.height = originalHeight;

        // 恢复配置面板
        if (configModal) (configModal as HTMLElement).style.display = '';

        // 下载 body 完整截图（已包含所有可见 + 滚动内容高度调整后通常完整）
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T-]/g, '');
        link.download = `${appTitle}_完整截图_${timestamp}.png`;
        link.href = fullBodyCanvas.toDataURL('image/png');
        link.click();
      } else {
        // 如果没有中奖记录，直接截取当前 body
        const fullBodyCanvas = await html2canvas(document.body, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          windowWidth: document.documentElement.scrollWidth,
          windowHeight: document.documentElement.scrollHeight,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0
        });

        // 恢复配置面板
        if (configModal) (configModal as HTMLElement).style.display = '';

        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T-]/g, '');
        link.download = `${appTitle}_完整截图_${timestamp}.png`;
        link.href = fullBodyCanvas.toDataURL('image/png');
        link.click();
      }

      showToast({
        type: 'success',
        titleKey: 'success',
        messageKey: '完整界面已截图并下载（包含所有中奖记录）'
      });
    } catch (err) {
      console.error('截图失败:', err);
      showToast({ type: 'error', titleKey: 'error', messageKey: '截图失败，请检查控制台或重试' });
    }
  }, [appTitle, showToast, winners.length]);

  const handleRemoveWinner = useCallback((winnerId: string, winnerName: string, prizeId: string) => {
    const winner = winners.find(w => w.id === winnerId);
    if (!winner) return;

    // 使用自定义弹窗
    setRemoveWinnerInfo({
      id: winnerId,
      name: winnerName,
      prizeId,
      prizeName: winner.prizeName || '未知奖项'
    });
    setShowRemoveConfirm(true);
  }, [winners]);

  const renderMainAreaContent = () => {
    const currentPrizeImage = selectedPrize?.image;
    if (isDrawing && rollingParticipants.length > 0) {
      return (
        <div className={`grid gap-6 w-full max-w-6xl mx-auto transition-all duration-500 ${rollingParticipants.length > 8 ? 'grid-cols-4' : rollingParticipants.length > 4 ? 'grid-cols-3' : rollingParticipants.length > 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {rollingParticipants.map((p, i) => (
            <LotteryDisplayCard
              key={i}
              participant={p}
              size={
                rollingParticipants.length > 16 ? 'xsmall'          // 17+ 人 → 极小
                  : rollingParticipants.length > 12 ? 'small'          // 13–16 人 → 小
                    : rollingParticipants.length > 8 ? 'medium-small'    // 9–12 人 → 中小
                      : rollingParticipants.length > 4 ? 'medium'          // 5–8 人 → 中
                        : 'large'                                            // ≤4 人 → 大
              }
              prizeImage={currentPrizeImage}
            />
          ))}
        </div>
      );
    }
    if (rollingParticipants.length > 0 && !isDrawing) {
      return (
        <div className="flex flex-col items-center w-full relative">
          <button onClick={() => setRollingParticipants([])} className="absolute top-6 right-6 z-30 bg-red-600/80 hover:bg-red-700 text-white rounded-full p-3 shadow-lg transition-all transform hover:scale-110"><X size={28} /></button>
          <h2 className="text-5xl md:text-7xl font-black text-yellow-400 mb-12 animate-bounce flex items-center gap-4 italic drop-shadow-xl">🎉 {t('justWon')} 🎉</h2>
          <div className="grid gap-12 w-full max-w-7xl mx-auto overflow-y-auto max-h-[600px] custom-scrollbar p-6">
            {rollingParticipants.map((p, i) => (
              <LotteryDisplayCard key={i} participant={p} isWinner={true} size={
                rollingParticipants.length > 8 ? 'small'          // 9+ 人用 small
                  : rollingParticipants.length > 3 ? 'medium'       // 4–8 人用 medium
                    : 'large'                                         // 1–3 人用 large
              } prizeImage={currentPrizeImage} />
            ))}
          </div>
          {/* <p className="mt-12 text-2xl text-yellow-300/60 font-black italic tracking-widest uppercase">{t('closeInstruction')}</p> */}
        </div>
      );
    }
    return (
      <div className="text-center animate-float flex flex-col items-center">
        {/* 用奖品图片替换 Sparkles 图标 */}
        {selectedPrize?.image ? (
          <img
            src={selectedPrize.image}
            alt="prize"
            className="w-40 h-40 mx-auto mb-8 object-contain animate-float opacity-70"
          />
        ) : (
          // 如果没有图片，可以显示一个默认图标（可选）
          <Sparkles size={160} className="text-yellow-400/10 mb-8 mx-auto" />
        )}
        <h2 className="text-6xl font-black text-white/5 uppercase tracking-[0.5em] italic">{t('ready')}</h2>
        {selectedPrize && (
          <p className="text-2xl text-yellow-400 mt-6 font-black italic tracking-widest bg-yellow-400/10 px-8 py-3 rounded-full border border-yellow-400/20 backdrop-blur-md">
            {selectedPrize.name} {selectedPrize.remain === 0 ? t('allDrawn') : t('selectAward')}
          </p>
        )}
      </div>
    );
  };

  return (
    <div ref={appRootRef} className={`flex flex-col h-screen overflow-hidden theme-transition ${THEME_STYLES[theme]}`}>
      <header className="flex-none p-4 md:p-6 flex items-center justify-between bg-black/40 backdrop-blur-3xl border-b border-white/5 z-50 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-400 p-2 rounded-2xl w-14 h-14 flex items-center justify-center border-2 border-white/20 shadow-xl overflow-hidden">
            {companyLogo ? <img src={companyLogo} className="w-full h-full object-contain" /> : <Trophy className="text-red-700 w-7 h-7" />}
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-widest italic text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-700 drop-shadow-xl truncate px-6">{appTitle}</h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {['zh', 'en', 'vi'].map(lang => (
              <button key={lang} onClick={() => changeLanguage(lang)} className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${i18n.language.startsWith(lang) ? 'bg-yellow-400 text-black' : 'text-white/40'}`}>
                {lang === 'zh' ? '中' : lang.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-2xl transition-all shadow-xl ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>{isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}</button>
          <button onClick={() => setShowGuide(true)} className="p-4 bg-white/10 rounded-2xl text-white border border-white/10 shadow-xl hover:bg-white/20"><HelpCircle size={22} /></button>
          <button onClick={() => setShowConfig(true)} className="p-4 bg-white/10 rounded-2xl text-white border border-white/10 shadow-xl hover:bg-white/20"><Settings size={22} /></button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 flex flex-col">
        <div className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          <div className="lg:col-span-8 flex flex-col gap-8 h-full">
            <div className="relative bg-black/40 rounded-[4rem] border-2 border-white/10 flex flex-col items-center justify-center p-6 md:p-12 min-h-[600px] flex-1 shadow-2xl backdrop-blur-3xl overflow-hidden">
              {selectedPrize && (
                <div className="absolute top-10 left-10 z-30 bg-white/5 backdrop-blur-3xl border border-white/20 p-6 rounded-[3rem] shadow-2xl flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-3xl flex items-center justify-center overflow-hidden border-2 border-white/10">
                    {selectedPrize.image ? <img src={selectedPrize.image} className="w-full h-full object-cover" /> : <Gift className="text-red-700 w-10 h-10 opacity-60" />}
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[11px] font-black uppercase tracking-widest text-yellow-400">{selectedPrize.tier}</div>
                    <div className="text-2xl font-black text-white italic">{selectedPrize.name}</div>
                  </div>
                </div>
              )}
              <div className="w-full flex-1 flex flex-col items-center justify-center z-10 py-8">  {/* ← py-16 → py-8，给中奖更多空间 */}
                {renderMainAreaContent()}
              </div>
              <div className="mt-4 flex flex-col items-center gap-8 z-30 w-full pb-8">  {/* gap-10 → gap-8，整体更紧凑 */}
                {/* 模式切换按钮保持不变 */}
                {isDrawing && drawMode === 'manual' ? (
                  <button onClick={stopDraw} className="px-20 py-8 rounded-full text-2xl md:text-5xl font-black bg-red-600 text-white shadow-2xl animate-pulse active:scale-95">
                    {t('stopDraw')}
                  </button>
                ) : (
                  <button
                    onClick={startDraw}
                    disabled={isDrawing || !selectedPrizeId || eligiblePool.length === 0 || selectedPrize?.remain === 0}
                    className="px-16 py-6 rounded-full text-2xl md:text-4xl font-black transition-all active:scale-95 bg-white text-slate-900 shadow-xl hover:scale-105 hover:bg-yellow-400 disabled:opacity-40 disabled:grayscale"
                  >
                    {isDrawing ? t('drawing') : t('startDraw')}
                  </button>
                )}
              </div>
            </div>

            <div className="w-full bg-black/30 p-8 rounded-[4rem] border border-white/5 backdrop-blur-3xl overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {prizes.map(p => (
                  <div
                    key={p.id}
                    onClick={() => { if (p.remain > 0) { setSelectedPrizeId(p.id); setRollingParticipants([]); } }}
                    className={`
                      group relative flex flex-col items-center justify-between p-6 rounded-3xl transition-all duration-300
                      min-h-[260px] border-2 backdrop-blur-sm cursor-pointer
                      ${selectedPrizeId === p.id
                        ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-400 scale-[1.03] shadow-2xl shadow-yellow-500/30'
                        : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-black/50'}
                      ${p.remain === 0 ? 'opacity-50 grayscale pointer-events-none' : ''}
                    `}
                    title={p.name}
                  >
                    {/* 图片区 */}
                    <div className="w-32 h-32 mb-4 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl bg-gradient-to-br from-slate-800 to-black flex items-center justify-center">
                      {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <Gift className="w-16 h-16 text-yellow-400/50" />}
                    </div>

                    {/* 等级 */}
                    <div className="text-sm font-black uppercase tracking-wider text-yellow-400/90 mb-2">
                      {p.tier}
                    </div>

                    {/* 品名 - 核心显示区，强制多行 */}
                    <div className="flex-1 w-full flex items-center justify-center text-center px-3">
                      <div className="text-lg md:text-xl font-black leading-tight line-clamp-3 break-words text-white group-hover:text-yellow-200 transition-colors italic">
                        {p.name || t('unnamedPrize')}
                      </div>
                    </div>

                    {/* 库存 */}
                    <div className="w-full mt-4">
                      <div className="flex justify-between text-xs font-bold opacity-80 mb-1.5 px-1">
                        <span className="text-emerald-300">{t('remaining')}: {p.remain}</span>
                        <span>/ {p.total}</span>
                      </div>
                      <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 rounded-full ${p.remain === 0 ? 'bg-red-600' : 'bg-gradient-to-r from-yellow-400 to-amber-500'
                            }`}
                          style={{ width: `${p.total > 0 ? (p.remain / p.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* 单轮人数 */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/70 px-3 py-1.5 rounded-full text-[10px] font-bold">
                      <button onClick={(e) => { e.stopPropagation(); setPrizes(prev => prev.map(x => x.id === p.id ? { ...x, batchSize: Math.max(1, x.batchSize - 1) } : x)); }} className="text-white/80 hover:text-white">-</button>
                      <span>{p.batchSize || 1}</span>
                      <button onClick={(e) => { e.stopPropagation(); setPrizes(prev => prev.map(x => x.id === p.id ? { ...x, batchSize: (x.batchSize || 1) + 1 } : x)); }} className="text-white/80 hover:text-white">+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-black/40 rounded-[4rem] p-8 border border-white/10 flex flex-col gap-10 backdrop-blur-3xl shadow-2xl h-full lg:sticky lg:top-8 max-h-[calc(100vh-120px)] overflow-hidden">
            <h2 className="text-4xl font-black italic flex items-center justify-between border-b border-white/10 pb-8"><span>{t('gloryWall')}</span><span className="text-xs bg-yellow-400 text-black px-6 py-2 rounded-full font-black uppercase">{t('winnersCount', { count: winners.length })}</span></h2>
            <div ref={winnersRef} className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-4">
              {winners.length === 0 ? (
                <div className="py-48 text-center opacity-10 flex flex-col items-center">
                  <Users size={120} className="mb-8" />
                  <p className="font-black tracking-widest uppercase text-3xl italic">{t('waitingForDraw')}</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {/* 高级奖项 - 单列 */}
                  {winners.some(w => ['特别奖', '特等奖', '一等奖'].includes(w.tier)) && (
                    <div className="mb-8 border-b border-white/5 pb-8">
                      <h3 className="text-xl font-black text-yellow-400 mb-6 uppercase flex items-center gap-3">
                        <Star size={24} /> {t('topPrizes')}
                      </h3>
                      <div className="grid grid-cols-1 gap-6">
                        {winners.filter(w => ['特别奖', '特等奖', '一等奖'].includes(w.tier)).map(w => (
                          <div
                            key={w.id}
                            className="relative p-6 rounded-3xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 text-black border-4 border-yellow-200 shadow-2xl animate-snap-in hover:scale-[1.02] transition-transform"
                          >
                            <button
                              onClick={() => handleRemoveWinner(w.id, w.participantName, w.prizeId)}
                              className="absolute top-3 right-3 p-2.5 rounded-full bg-red-600/80 text-white hover:bg-red-700 transition-colors shadow-lg"
                              title="删除此中奖记录"
                            >
                              <Trash2 size={18} />
                            </button>
                            <div className="text-sm font-black italic mb-1 opacity-80 uppercase">{w.tier}</div>
                            <div className="text-2xl font-black italic mb-4 leading-tight">{w.prizeName}</div>
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-2xl bg-black/20 flex items-center justify-center text-3xl font-black shadow-inner">
                                {w.participantName.charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-2xl font-black truncate">{w.participantName}</div>
                                <div className="text-sm font-mono opacity-80">ID: {w.staffId || '—'}</div>
                                <div className="text-sm font-mono opacity-80 truncate flex items-center gap-1">
                                  <Building size={14} /> {w.department || '—'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 其他奖项 - 单列 */}
                  <div className="grid grid-cols-1 gap-5 pb-8">
                    {winners.filter(w => !['特别奖', '特等奖', '一等奖'].includes(w.tier)).slice().reverse().map((w, idx) => (
                      <div
                        key={w.id}
                        className={`
              relative p-5 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] animate-snap-in
              ${idx === 0
                            ? 'bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-950 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)]'
                            : 'bg-white/30 backdrop-blur-sm border-white/40 text-white hover:bg-white/40'}
            `}
                      >
                        <button
                          onClick={() => handleRemoveWinner(w.id, w.participantName, w.prizeId)}
                          className="absolute top-2 right-2 p-2 rounded-full bg-red-600/70 hover:bg-red-700 text-white transition-colors shadow-md z-10"
                          title="删除"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="flex items-start gap-3">
                          <div className={`
                flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg
                ${idx === 0 ? 'bg-amber-500 text-amber-950' : 'bg-white/30 text-white'}
              `}>
                            {w.participantName.charAt(0)}
                          </div>

                          <div className="flex-1 min-w-0 pr-5">
                            <div className="text-xl font-extrabold truncate">{w.participantName}</div>
                            <div className="text-xs font-mono opacity-80 mt-1">ID: {w.staffId || '—'}</div>
                            <div className="text-xs font-mono opacity-80 truncate flex items-center gap-1">
                              <Building size={12} /> {w.department || '—'}
                            </div>
                            <div className="text-sm font-bold italic truncate mt-2 text-yellow-200">{w.prizeName}</div>
                          </div>
                        </div>

                        <div className="mt-2 text-[10px] font-black uppercase tracking-wider opacity-70">{w.tier}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
              <button onClick={() => { if (winners.length > 0) { const data = winners.map(w => ({ '奖项': w.tier, '品名': w.prizeName, '中奖人': w.participantName, '工号': w.staffId, '部门': w.department, '时间': w.time })); const ws = XLSX.utils.json_to_sheet(data); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Winners"); XLSX.writeFile(wb, `Winners_Export.xlsx`); } }} disabled={winners.length === 0} title={winners.length === 0 ? t('noWinnersYetTooltip') : ""} className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-[2.5rem] flex items-center justify-center gap-3 font-black shadow-2xl hover:scale-[1.02] disabled:opacity-40 transition-all"><Download size={26} /><span className="font-bold text-base uppercase tracking-widest">{t('exportWinners')}</span></button>
              <button
                onClick={captureFullApp}
                disabled={winners.length === 0}
                className="w-full py-5 rounded-[2.5rem] flex items-center justify-center gap-3 font-black shadow-2xl transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-40 hover:scale-[1.02] active:scale-95"
              >
                <ImageIcon size={26} />
                <span className="font-bold text-base uppercase tracking-widest">
                  {t('generatePoster')} / {t('captureFullApp')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {showConfig && (
        <div className="fixed inset-0 z-[150] bg-black/98 flex items-center justify-center p-6 backdrop-blur-xl animate-fade-in overflow-y-auto">
          <div className="bg-white text-slate-800 w-full max-w-6xl my-auto rounded-[5rem] p-12 md:p-16 shadow-2xl relative border-4 border-slate-100">
            <button onClick={() => setShowConfig(false)} className="absolute top-12 right-12 text-slate-300 hover:text-red-500 text-6xl font-light">&times;</button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-12">
                <section className="space-y-8">
                  <h3 className="text-sm font-black text-blue-600 uppercase border-l-[6px] border-blue-600 pl-6">{t('identityBranding')}</h3>
                  <div className="space-y-3"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('eventMainTitle')}</label><input type="text" value={appTitle} onChange={(e) => setAppTitle(e.target.value)} className="w-full bg-slate-50 border-4 border-slate-50 rounded-3xl px-8 py-5 font-black text-xl italic focus:border-blue-500 outline-none" /></div>
                  <div className="h-32 bg-slate-50 border-4 border-dashed border-slate-100 rounded-3xl flex items-center justify-center relative group overflow-hidden">
                    {companyLogo ? <><img src={companyLogo} className="h-full object-contain p-4" /><div className="absolute inset-0 bg-black/80 text-white flex items-center justify-center font-black cursor-pointer opacity-0 group-hover:opacity-100" onClick={() => setCompanyLogo(null)}>{t('removeAsset')}</div></> : <div className="flex flex-col items-center opacity-40"><Upload size={40} className="mb-2" /><span className="text-[11px] font-black uppercase">{t('uploadBrandLogo')}</span></div>}
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setCompanyLogo(r.result as string); r.readAsDataURL(f); } }} />
                  </div>
                </section>
                <section className="space-y-8">
                  <h3 className="text-sm font-black text-indigo-600 uppercase border-l-[6px] border-indigo-600 pl-6">{t('audioSettings')}</h3>
                  {(['bg', 'draw', 'winner'] as const).map((key) => (
                    <div key={key} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2 mb-3"><Music size={14} />{t(`${key}Music`)}</label>
                      <div className="flex items-center gap-4">
                        <select value={audioState[key].index} onChange={(e) => setAudioState(prev => ({ ...prev, [key]: { ...prev[key], index: Number(e.target.value), customUrl: null } }))} className="flex-1 p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-indigo-500">
                          {DEFAULT_AUDIO_OPTIONS[key === 'bg' ? 'background' : key === 'draw' ? 'drawing' : 'winner'].map((opt, i) => (<option key={i} value={i}>{opt.name}</option>))}
                        </select>
                        <div className="relative group"><button className="p-4 bg-indigo-600 text-white rounded-2xl"><Upload size={18} /></button><input type="file" accept="audio/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files?.[0] && handleAudioUpload(key, e.target.files[0])} /></div>
                        <button onClick={() => { const url = audioState[key].customUrl || DEFAULT_AUDIO_OPTIONS[key === 'bg' ? 'background' : key === 'draw' ? 'drawing' : 'winner'][audioState[key].index].url; if (url) { const a = new Audio(url); a.volume = 0.5; a.play(); setTimeout(() => { a.pause(); a.currentTime = 0; }, 4000); } }} className="p-4 bg-slate-200 text-slate-600 rounded-2xl"><Play size={18} /></button>
                      </div>
                    </div>
                  ))}
                </section>
                {/* 加在 identityBranding 或 audioSettings 下面 */}
                <section className="space-y-8">
                  <h3 className="text-sm font-black text-purple-600 uppercase border-l-[6px] border-purple-600 pl-6">
                    {t('themeSettings')}  {/* 翻译：主题设置 */}
                  </h3>
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2 mb-4">
                      <Palette size={14} /> {t('selectTheme')}  {/* 选择主题 */}
                    </label>

                    {/* 按钮组风格，更直观 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { value: Theme.CLASSIC, label: t('themeClassic'), color: 'bg-red-600 text-white' },
                        { value: Theme.CYBER, label: t('themeCyber'), color: 'bg-purple-900 text-cyan-300' },
                        { value: Theme.CHINESE, label: t('themeChinese'), color: 'bg-amber-100 text-amber-800' },
                        { value: Theme.SPACE, label: t('themeSpace'), color: 'bg-indigo-900 text-blue-200' },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setTheme(item.value)}
                          className={`p-4 rounded-xl font-black text-sm transition-all transform hover:scale-105 active:scale-95 shadow-md ${theme === item.value
                            ? 'ring-4 ring-purple-400 ring-offset-2 ' + item.color
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                            }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
                <section className="space-y-8">
                  <h3 className="text-sm font-black text-green-600 uppercase border-l-[6px] border-green-600 pl-6">{t('dataManagement')}</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="relative p-8 bg-blue-50 rounded-3xl border-2 border-blue-100 flex flex-col items-center gap-2 cursor-pointer hover:bg-blue-100"><Database className="text-blue-600" size={32} /><span className="text-xs font-black uppercase">{t('importStaff')}</span><input type="file" accept=".xlsx,.xls,.csv" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleEmployeeImport} /></div>
                    <div className="relative p-8 bg-emerald-50 rounded-3xl border-2 border-emerald-100 flex flex-col items-center gap-2 cursor-pointer hover:bg-emerald-100"><Trophy className="text-emerald-600" size={32} /><span className="text-xs font-black uppercase">{t('importAwards')}</span><input type="file" accept=".xlsx,.xls,.csv" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePrizeImport} /></div>
                  </div>
                </section>
                {/* 新增：抽奖模式设置 */}
                <section className="space-y-8">
                  <h3 className="text-sm font-black text-teal-600 uppercase border-l-[6px] border-teal-600 pl-6">
                    {t('drawModeSettings')} {/* 翻译：抽奖模式设置 */}
                  </h3>
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2 mb-4">
                      <Zap size={14} /> {t('drawMode')} {/* 抽奖模式 */}
                    </label>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {drawMode === 'auto' ? t('autoDraw') : t('manualDraw')}
                        {/* 示例翻译：自动抽奖 / 手动抽奖 */}
                      </span>

                      {/* Toggle 开关 */}
                      <button
                        type="button"
                        onClick={() => setDrawMode(drawMode === 'auto' ? 'manual' : 'auto')}
                        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
          ${drawMode === 'auto' ? 'bg-teal-600' : 'bg-gray-300'}
        `}
                      >
                        <span
                          aria-hidden="true"
                          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${drawMode === 'auto' ? 'translate-x-5' : 'translate-x-0'}
          `}
                        />
                      </button>
                    </div>

                    {/* 小提示 */}
                    <p className="mt-3 text-xs text-slate-500">
                      {drawMode === 'auto'
                        ? t('autoDrawDesc')  // 自动模式：滚动约30次后自动停止
                        : t('manualDrawDesc') // 手动模式：需点击“停止抽奖”出结果
                      }
                    </p>
                  </div>
                </section>
              </div>
              <div className="flex flex-col gap-10">
                <h3 className="text-sm font-black text-orange-600 uppercase border-l-[6px] border-orange-600 pl-6 italic">{t('awardInventory')}</h3>
                <div className="flex-1 overflow-y-auto max-h-[550px] custom-scrollbar space-y-5 pr-4 p-8 bg-slate-50 rounded-[3rem]">
                  {prizes.length === 0 ? <div className="py-20 text-center opacity-20"><ShoppingBag size={48} className="mx-auto" /></div> : prizes.map(p => (
                    <div key={p.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm flex items-center gap-8 group">
                      <div className="relative w-32 h-32 bg-slate-100 rounded-[2.5rem] flex items-center justify-center overflow-hidden border-4 border-slate-200 group-hover:border-indigo-400 transition-all cursor-pointer">
                        {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <div className="text-slate-300 text-center flex flex-col items-center"><Camera size={44} /><div className="text-[10px] mt-1 font-black">{t('clickToUpload')}</div></div>}
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setPrizes(prev => prev.map(x => x.id === p.id ? { ...x, image: r.result as string } : x)); r.readAsDataURL(f); } }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-blue-500 uppercase tracking-widest italic">{p.tier}</div>
                        <div className="text-2xl font-black text-slate-900 truncate leading-tight italic">{p.name}</div>
                        <div className="text-[11px] font-black text-slate-400 mt-3 flex items-center gap-4"><span className="bg-slate-100 px-3 py-1 rounded-full">{t('stock')}: {p.total}</span><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{t('remaining')}: {p.remain}</span></div>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-[2rem] border border-slate-100 shadow-inner">
                          <button onClick={() => setPrizes(prev => prev.map(x => x.id === p.id ? { ...x, batchSize: Math.max(1, x.batchSize - 1) } : x))} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"><Minus size={18} /></button>
                          <span className="text-2xl font-black w-10 text-center">{p.batchSize}</span>
                          <button onClick={() => setPrizes(prev => prev.map(x => x.id === p.id ? { ...x, batchSize: x.batchSize + 1 } : x))} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"><Plus size={18} /></button>
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase italic">{t('batchSizeLabel')}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => smartReset('soft')}
                    disabled={isResetting}
                    className="p-6 bg-green-50 border-2 border-green-100 rounded-3xl transition-all flex flex-col items-center gap-2 hover:bg-green-100 hover:scale-105 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResetting ? <Loader2 className="w-6 h-6 text-green-600 animate-spin" /> : <RotateCcw className="w-6 h-6 text-green-600" />}
                    <span className="text-[10px] font-black uppercase">{t('softReset')}</span>
                  </button>

                  <button
                    onClick={() => smartReset('hard')}
                    disabled={isResetting}
                    className="p-6 bg-orange-50 border-2 border-orange-100 rounded-3xl transition-all flex flex-col items-center gap-2 hover:bg-orange-100 hover:scale-105 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResetting ? <Loader2 className="w-6 h-6 text-orange-600 animate-spin" /> : <Package className="w-6 h-6 text-orange-600" />}
                    <span className="text-[10px] font-black uppercase">{t('hardReset')}</span>
                  </button>

                  <button
                    onClick={() => smartReset('factory')}
                    disabled={isResetting}
                    className="p-6 bg-red-50 border-2 border-red-100 rounded-3xl transition-all flex flex-col items-center gap-2 hover:bg-red-100 hover:scale-105 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResetting ? <Loader2 className="w-6 h-6 text-red-600 animate-spin" /> : <Trash2 className="w-6 h-6 text-red-600" />}
                    <span className="text-[10px] font-black uppercase text-red-700">{t('eraseAll')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRemoveConfirm && removeWinnerInfo && (
        <div className="fixed inset-0 z-[210] bg-black/70 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-red-500">
            <h3 className="text-2xl font-black text-red-600 mb-6 flex items-center gap-3">
              <AlertTriangle size={28} /> {t('confirmRemoveWinnerTitle')}
            </h3>
            <p className="text-slate-700 mb-8 leading-relaxed whitespace-pre-line">
              {/* 用 Trans 渲染带 HTML 的翻译 */}
              <Trans
                i18nKey="confirmRemoveWinnerMessage"
                values={{
                  name: removeWinnerInfo.name,
                  prizeName: removeWinnerInfo.prizeName
                }}
                components={{ strong: <strong />, br: <br /> }}
              />
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowRemoveConfirm(false);
                  setRemoveWinnerInfo(null);
                }}
                className="flex-1 py-4 bg-slate-200 rounded-xl font-black hover:bg-slate-300 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => {
                  setShowRemoveConfirm(false);
                  setRemoveWinnerInfo(null);

                  // 执行删除逻辑（不变）
                  setWinners(prev => prev.filter(w => w.id !== removeWinnerInfo.id));
                  setPrizes(prev => prev.map(p =>
                    p.id === removeWinnerInfo.prizeId
                      ? { ...p, remain: Math.min(p.total, p.remain + 1) }
                      : p
                  ));

                  const winner = winners.find(w => w.id === removeWinnerInfo.id);
                  const newAudit: AuditRecord = {
                    id: `audit-${Date.now()}`,
                    timestamp: new Date().toLocaleString(),
                    winnerName: removeWinnerInfo.name,
                    staffId: winner?.staffId || '',
                    prizeName: removeWinnerInfo.prizeName,
                    tier: winner?.tier || ''
                  };
                  setAuditLog(prev => [newAudit, ...prev]);

                  showToast({
                    type: 'success',
                    titleKey: 'success',
                    messageKey: 'winnerRemoved',
                    values: { name: removeWinnerInfo.name }
                  });
                }}
                className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black shadow-lg transition-colors"
              >
                {t('confirmDelete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && confirmConfig && (
        <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4">
          <div className={`bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 ${confirmConfig.danger ? 'border-red-500' : 'border-yellow-500'
            }`}>
            <h3 className={`text-2xl font-black mb-6 ${confirmConfig.danger ? 'text-red-600' : 'text-yellow-600'}`}>
              {confirmConfig.title}   {/* 已通过 t() 翻译 */}
            </h3>
            <p className="text-slate-700 mb-8 leading-relaxed whitespace-pre-line">
              {confirmConfig.message} {/* 已通过 t() 翻译 */}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmConfig(null);
                }}
                className="flex-1 py-4 bg-slate-200 rounded-xl font-black hover:bg-slate-300 transition-colors"
              >
                {t('cancel')}   {/* ← 这里用 t('cancel')，会根据语言自动变：取消 / Cancel / Hủy */}
              </button>

              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmConfig(null);
                  confirmConfig.onConfirm();
                }}
                className={`flex-1 py-4 rounded-xl font-black text-white shadow-lg transition-colors ${confirmConfig.danger
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-yellow-500 hover:bg-yellow-600'
                  }`}
              >
                {t(confirmConfig.actionKey || 'confirmExecute')}  {/* ← 这里用 actionKey 动态取翻译 */}
              </button>
            </div>
          </div>
        </div>
      )}

      {showGuide && <UserGuide onClose={() => setShowGuide(false)} />}

      <style>{`
        @keyframes snap-in { from { opacity: 0; transform: scale(0.9) translateY(40px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-snap-in { animation: snap-in 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        body { margin: 0; padding: 0; height: 100vh; overflow: hidden; background: #000; font-family: 'Noto Serif SC', serif; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        
        /* 新增 shimmer 动画 */
        @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-15deg); }
            50% { transform: translateX(100%) skewX(-15deg); }
            100% { transform: translateX(100%) skewX(-15deg); }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }

        /* 新增 pulse-slow 动画 */
        @keyframes pulse-slow {
            0%, 100% { opacity: 0.9; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
          }
          .animate-pulse-slow {
            animation: pulse-slow 5s ease-in-out infinite;
          }  
      `}</style>
    </div>
  );
};

export default App;