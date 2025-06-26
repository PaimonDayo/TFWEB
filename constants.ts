
export const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID || '1utxuwDZsrLZ5cTq8uIPRdOmMvlE9O1IbE1ymsIey3Uo';
export const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
export const DATA_YEAR = parseInt(import.meta.env.VITE_DATA_YEAR || '2025', 10);

// UI Constants
export const UI_CONSTANTS = {
  SKELETON_COUNT: 3,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  WEATHER_TIMEOUT: 5000,
} as const;

// Enhanced location color mapping with circle colors
export const LOCATION_COLORS = {
  // 大学キャンパス
  '東大': {
    background: 'bg-red-50 border-red-200',
    circle: 'bg-red-500',
    text: 'text-red-700',
    icon: '🏛️'
  },
  '駒場': {
    background: 'bg-blue-50 border-blue-200', 
    circle: 'bg-blue-500',
    text: 'text-blue-700',
    icon: '🏫'
  },
  '本郷': {
    background: 'bg-green-50 border-green-200',
    circle: 'bg-green-500', 
    text: 'text-green-700',
    icon: '🏢'
  },
  '農学部': {
    background: 'bg-yellow-50 border-yellow-200',
    circle: 'bg-yellow-500',
    text: 'text-yellow-700',
    icon: '🌾'
  },
  
  // 専用競技場・フィールド
  '織田フィールド': {
    background: 'bg-purple-50 border-purple-200',
    circle: 'bg-purple-500',
    text: 'text-purple-700', 
    icon: '🏃'
  },
  '織田': {
    background: 'bg-purple-50 border-purple-200',
    circle: 'bg-purple-500',
    text: 'text-purple-700',
    icon: '🏃'
  },
  '補助競技場': {
    background: 'bg-emerald-50 border-emerald-200',
    circle: 'bg-emerald-500',
    text: 'text-emerald-700',
    icon: '🏟️'
  },
  '補助': {
    background: 'bg-emerald-50 border-emerald-200', 
    circle: 'bg-emerald-500',
    text: 'text-emerald-700',
    icon: '🏟️'
  },
  
  // 外部施設・他大学
  '府中': {
    background: 'bg-indigo-50 border-indigo-200',
    circle: 'bg-indigo-500',
    text: 'text-indigo-700',
    icon: '🏃‍♂️'
  },
  '武蔵野': {
    background: 'bg-teal-50 border-teal-200',
    circle: 'bg-teal-500', 
    text: 'text-teal-700',
    icon: '🌲'
  },
  '済美山': {
    background: 'bg-orange-50 border-orange-200',
    circle: 'bg-orange-500',
    text: 'text-orange-700',
    icon: '⛰️'
  },
  'AGF': {
    background: 'bg-amber-50 border-amber-200',
    circle: 'bg-amber-500',
    text: 'text-amber-700',
    icon: '🏟️'
  },
  
  // 練習タイプ別
  'トラック': {
    background: 'bg-rose-50 border-rose-200',
    circle: 'bg-rose-500',
    text: 'text-rose-700',
    icon: '🏁'
  },
  'ロード': {
    background: 'bg-violet-50 border-violet-200',
    circle: 'bg-violet-500',
    text: 'text-violet-700',
    icon: '🛣️'
  },
  '競歩': {
    background: 'bg-cyan-50 border-cyan-200',
    circle: 'bg-cyan-500',
    text: 'text-cyan-700',
    icon: '🚶‍♂️'
  },
  
  // 試合・イベント
  '東工戦': {
    background: 'bg-pink-50 border-pink-200',
    circle: 'bg-pink-500',
    text: 'text-pink-700',
    icon: '🏆'
  },
  '外大': {
    background: 'bg-lime-50 border-lime-200',
    circle: 'bg-lime-500',
    text: 'text-lime-700',
    icon: '🎯'
  },
  '試合': {
    background: 'bg-red-50 border-red-200',
    circle: 'bg-red-600',
    text: 'text-red-700',
    icon: '🏅'
  },
  '大会': {
    background: 'bg-red-50 border-red-200',
    circle: 'bg-red-600', 
    text: 'text-red-700',
    icon: '🏅'
  },
  
  // その他・調整
  '調整': {
    background: 'bg-slate-50 border-slate-200',
    circle: 'bg-slate-400',
    text: 'text-slate-700',
    icon: '⚖️'
  },
  '休み': {
    background: 'bg-gray-50 border-gray-200',
    circle: 'bg-gray-400',
    text: 'text-gray-700',
    icon: '😴'
  },
  'オフ': {
    background: 'bg-gray-50 border-gray-200',
    circle: 'bg-gray-400',
    text: 'text-gray-700',
    icon: '😴'
  },
  
  // デフォルト
  default: {
    background: 'bg-gray-50 border-gray-200',
    circle: 'bg-gray-400',
    text: 'text-gray-700',
    icon: '📍'
  }
} as const;
