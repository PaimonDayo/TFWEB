import { LOCATION_COLORS } from '../constants';

export const getLocationColorClasses = (location: string): string => {
  const normalizedLocation = location.trim();
  
  for (const [key, colorClass] of Object.entries(LOCATION_COLORS)) {
    if (key === 'default') continue;
    if (normalizedLocation.includes(key)) {
      return colorClass;
    }
  }
  
  return LOCATION_COLORS.default;
};

export const getLocationIcon = (location: string): string => {
  const normalizedLocation = location.trim();
  
  if (normalizedLocation.includes('東大') || normalizedLocation.includes('本郷')) {
    return '🏛️';
  }
  if (normalizedLocation.includes('駒場')) {
    return '🏫';
  }
  if (normalizedLocation.includes('織田フィールド')) {
    return '🏃';
  }
  
  return '📍';
};