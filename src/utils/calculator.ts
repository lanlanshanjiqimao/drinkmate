/** Calculator - Alcohol Calculation Utilities */

import { ALCOHOL_DENSITY, STANDARD_DRINK_GRAMS, CALORIES_PER_GRAM } from './constants';
import type { CalculatorInput, CalculatorResult } from '../types';

/**
 * Calculate pure alcohol in grams
 * Formula: volume(ml) × alcoholContent(%) × density(0.8)
 */
export const calculatePureAlcohol = (volume: number, abv: number): number => {
  return volume * (abv / 100) * ALCOHOL_DENSITY;
};

/**
 * Calculate standard drinks
 * 1 standard drink = 10g pure alcohol (China standard)
 */
export const calculateStandardDrinks = (pureAlcohol: number): number => {
  return pureAlcohol / STANDARD_DRINK_GRAMS;
};

/**
 * Calculate calories from alcohol
 * 1g alcohol = 7 kcal
 */
export const calculateCalories = (pureAlcohol: number): number => {
  return pureAlcohol * CALORIES_PER_GRAM;
};

/**
 * Full calculation from input
 */
export const calculateFromInput = (input: CalculatorInput): CalculatorResult => {
  const pureAlcohol = calculatePureAlcohol(input.volume, input.abv);
  return {
    pureAlcohol,
    standardDrinks: calculateStandardDrinks(pureAlcohol),
    calories: calculateCalories(pureAlcohol),
  };
};

/**
 * Calculate percentage of daily limit
 */
export const calculatePercentage = (current: number, limit: number): number => {
  if (limit <= 0) return 0;
  return (current / limit) * 100;
};

/**
 * Get ring color based on percentage
 */
export const getRingColor = (percentage: number): { color: string; glow: string; status: string } => {
  if (percentage <= 50) {
    return {
      color: 'var(--ring-gold)',
      glow: 'var(--ring-gold-glow)',
      status: 'safe',
    };
  }
  if (percentage <= 80) {
    return {
      color: 'var(--ring-amber)',
      glow: 'var(--ring-amber-glow)',
      status: 'warning',
    };
  }
  if (percentage <= 100) {
    return {
      color: 'var(--ring-orange)',
      glow: 'var(--ring-orange-glow)',
      status: 'critical',
    };
  }
  return {
    color: 'var(--ring-red)',
    glow: 'var(--ring-red-glow)',
    status: 'danger',
  };
};

/**
 * Format number with fixed decimal places
 */
export const formatNumber = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Reference table for common drinks
 */
export const DRINK_REFERENCE_TABLE = [
  { type: 'wine', name: '葡萄酒', abv: 12, volume: 150, drinks: 1.4 },
  { type: 'beer', name: '啤酒', abv: 4, volume: 250, drinks: 0.8 },
  { type: 'spirit', name: '白酒', abv: 52, volume: 25, drinks: 1.0 },
  { type: 'cocktail', name: '鸡尾酒', abv: 15, volume: 70, drinks: 0.7 },
  { type: 'sake', name: '清酒', abv: 15, volume: 70, drinks: 0.7 },
  { type: 'whiskey', name: '威士忌', abv: 40, volume: 30, drinks: 0.9 },
] as const;
