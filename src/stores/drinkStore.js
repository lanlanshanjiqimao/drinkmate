/** Drink Store - Zustand Store for Drink Records */

import { create } from 'zustand';

// 极简版drinkStore，移除所有TypeScript类型和外部依赖
export const useDrinkStore = create(
  (set, get) => ({
    records: [],

    getTodayRecords: () => {
      return get().records;
    },

    getTodayStats: () => {
      const todayRecords = get().getTodayRecords();
      const totalAlcohol = todayRecords.reduce(
        (sum, record) => sum + record.pureAlcohol,
        0
      );
      const dailyLimit = 25;
      const percentage = Math.min((totalAlcohol / dailyLimit) * 100, 100);

      // 极简实现getRingColor
      let color = '#d4a853', status = 'safe';
      if (percentage > 80) { color = '#f87171'; status = 'danger'; }
      else if (percentage > 60) { color = '#f97316'; status = 'critical'; }
      else if (percentage > 40) { color = '#fbbf24'; status = 'warning'; }

      return {
        totalAlcohol,
        standardDrinks: totalAlcohol / 14,
        calories: totalAlcohol * 7,
        percentage,
        recordCount: todayRecords.length,
        isOverLimit: percentage > 100,
        ringColor: color,
        status,
      };
    },

    addRecord: (data) => {
      // 极简实现calculatePureAlcohol
      const pureAlcohol = data.volume * data.abv * 0.8 / 100;
      const record = {
        ...data,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        pureAlcohol,
      };
      set((state) => ({
        records: [...state.records, record],
      }));
    },

    removeRecord: (id) => {
      set((state) => ({
        records: state.records.filter((record) => record.id !== id),
      }));
    },

    clearTodayRecords: () => {
      set({ records: [] });
    },

    getAllRecords: () => {
      return get().records;
    },

    importRecords: (records) => {
      set({ records });
    },
  })
);
