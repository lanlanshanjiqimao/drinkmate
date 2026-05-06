import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../utils/constants';
import { createUserStorage } from '../utils/userStorage';

const defaultPreferences = {
  showCalories: true,
  showStandardDrinks: true,
  defaultDrinkType: 'beer',
  reminderEnabled: false,
};

export const DEFAULT_USER_DATA = {
  dailyLimit: 50,
  preferences: { ...defaultPreferences },
};

export const useUserStore = create(
  persist(
    (set, get) => ({
      ...DEFAULT_USER_DATA,

      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        }));
      },

      resetSettings: () => {
        set({ ...DEFAULT_USER_DATA });
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
      storage: createUserStorage(),
      skipHydration: true,
      merge: (persistedState, currentState) => {
        if (persistedState) {
          return { ...currentState, ...persistedState };
        }
        return { ...currentState, ...DEFAULT_USER_DATA };
      },
    }
  )
);
