/** Formatter - Data Formatting Utilities */

import type { DrinkType } from '../types';

/** Format volume with unit */
export const formatVolume = (volume: number): string => {
  return `${volume}ml`;
};

/** Format ABV with % */
export const formatAbv = (abv: number): string => {
  return `${abv}%`;
};

/** Format pure alcohol with unit */
export const formatPureAlcohol = (grams: number, decimals: number = 1): string => {
  return `${grams.toFixed(decimals)}g`;
};

/** Format standard drinks */
export const formatStandardDrinks = (drinks: number, decimals: number = 1): string => {
  return `${drinks.toFixed(decimals)}杯`;
};

/** Format calories */
export const formatCalories = (calories: number): string => {
  return `${Math.round(calories)}kcal`;
};

/** Format percentage */
export const formatPercent = (percent: number, decimals: number = 0): string => {
  return `${percent.toFixed(decimals)}%`;
};

/** Get drink type icon */
export const getDrinkIcon = (type: DrinkType): string => {
  const icons: Record<DrinkType, string> = {
    wine: '🍷',
    beer: '🍺',
    spirit: '🥃',
    cocktail: '🍸',
    sake: '🍶',
    whiskey: '🥃',
  };
  return icons[type];
};

/** Get drink type label */
export const getDrinkLabel = (type: DrinkType): string => {
  const labels: Record<DrinkType, string> = {
    wine: '葡萄酒',
    beer: '啤酒',
    spirit: '白酒',
    cocktail: '鸡尾酒',
    sake: '清酒',
    whiskey: '威士忌',
  };
  return labels[type];
};

/** Format time to HH:mm */
export const formatTime = (timestamp: string | Date): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/** Format time to readable string */
export const formatTimeAgo = (timestamp: string | Date): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  return date.toLocaleDateString('zh-CN');
};

/** Format date to short format */
export const formatShortDate = (timestamp: string | Date): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });
};
