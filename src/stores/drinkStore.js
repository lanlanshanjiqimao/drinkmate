import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS, DAILY_LIMIT } from '../utils/constants';
import { getRingColor } from '../utils/calculator';
import { createUserStorage } from '../utils/userStorage';

export const DEFAULT_DRINK_DATA = { records: [] };

export const useDrinkStore = create(
  persist(
    (set, get) => ({
      ...DEFAULT_DRINK_DATA,

      getTodayRecords: () => {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const endOfDay = startOfDay + 86400000;
        return get().records.filter((record) => {
          const ts = new Date(record.timestamp).getTime();
          return ts >= startOfDay && ts < endOfDay;
        });
      },

      getTodayStats: (dailyLimit = DAILY_LIMIT) => {
        const todayRecords = get().getTodayRecords();
        const totalAlcohol = todayRecords.reduce(
          (sum, record) => sum + record.pureAlcohol,
          0
        );
        const percentage = (totalAlcohol / dailyLimit) * 100;
        const { color, glow, status } = getRingColor(percentage);

        return {
          totalAlcohol,
          standardDrinks: totalAlcohol / 10,
          calories: totalAlcohol * 7,
          percentage,
          recordCount: todayRecords.length,
          isOverLimit: percentage > 100,
          ringColor: color,
          ringGlow: glow,
          status,
        };
      },

      addRecord: (data) => {
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
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const endOfDay = startOfDay + 86400000;
        set((state) => ({
          records: state.records.filter((record) => {
            const ts = new Date(record.timestamp).getTime();
            return ts < startOfDay || ts >= endOfDay;
          }),
        }));
      },

      getAllRecords: () => {
        return get().records;
      },

      importRecords: (records) => {
        set({ records });
      },
    }),
    {
      name: STORAGE_KEYS.RECORDS,
      storage: createUserStorage(),
      skipHydration: true,
      merge: (persistedState, currentState) => {
        if (persistedState) {
          return { ...currentState, ...persistedState };
        }
        return { ...currentState, ...DEFAULT_DRINK_DATA };
      },
    }
  )
);
