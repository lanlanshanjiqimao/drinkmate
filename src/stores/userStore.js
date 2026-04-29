import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../utils/constants';

const defaultPreferences = {
  showCalories: true,
  showStandardDrinks: true,
  defaultDrinkType: 'beer',
  reminderEnabled: false,
};

const defaultState = {
  dailyLimit: 50,
  preferences: { ...defaultPreferences },
};

export const useUserStore = create(
  persist(
    (set, get) => ({
      ...defaultState,

      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        }));
      },

      resetSettings: () => {
        set({ ...defaultState });
      },

      importUserData: (data) => {
        set((state) => ({
          ...state,
          ...data,
          preferences: {
            ...state.preferences,
            ...data.preferences,
          },
        }));
      },
    }),
    {
      name: STORAGE_KEYS.USER_SETTINGS,
    }
  )
);
