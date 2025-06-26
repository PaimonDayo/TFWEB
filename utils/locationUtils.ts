import { LOCATION_COLORS } from '../constants';

interface LocationStyle {
  background: string;
  circle: string;
  text: string;
  icon: string;
}

export const getLocationStyle = (location: string): LocationStyle => {
  const normalizedLocation = location.trim().toLowerCase();
  
  // 優先度順でマッチング（より具体的なものから）
  for (const [key, style] of Object.entries(LOCATION_COLORS)) {
    if (key === 'default') continue;
    if (normalizedLocation.includes(key.toLowerCase())) {
      return style;
    }
  }
  
  return LOCATION_COLORS.default;
};

// 後方互換性のために残す
export const getLocationColorClasses = (location: string): string => {
  const style = getLocationStyle(location);
  return style.background;
};

export const getLocationCircleColor = (location: string): string => {
  const style = getLocationStyle(location);
  return style.circle;
};

export const getLocationTextColor = (location: string): string => {
  const style = getLocationStyle(location);
  return style.text;
};

export const getLocationIcon = (location: string): string => {
  const style = getLocationStyle(location);
  return style.icon;
};

// 場所の優先度を判定（より詳細な情報がある場合は優先）
export const getLocationPriority = (location: string): number => {
  const normalizedLocation = location.trim().toLowerCase();
  
  // 具体的な場所名ほど高い優先度
  if (normalizedLocation.includes('織田フィールド')) return 10;
  if (normalizedLocation.includes('補助競技場')) return 9;
  if (normalizedLocation.includes('agf')) return 8;
  if (normalizedLocation.includes('済美山')) return 7;
  if (normalizedLocation.includes('武蔵野')) return 6;
  if (normalizedLocation.includes('府中')) return 5;
  if (normalizedLocation.includes('農学部')) return 4;
  if (normalizedLocation.includes('本郷')) return 3;
  if (normalizedLocation.includes('駒場')) return 2;
  if (normalizedLocation.includes('東大')) return 1;
  
  return 0; // デフォルト
};