/** User Store - Zustand Store for User Settings */

import { create } from 'zustand';

// 简化版，移除TypeScript类型和持久化
const defaultPreferences = {
  showCalories: true,
  showStandardDrinks: true,
  defaultDrinkType: 'beer',
  reminderEnabled: false,
};

const defaultState = {
  gender: 'male',
  dailyLimit: 25,
  hasCompletedOnboarding: false,
  preferences: { ...defaultPreferences },
};

export const useUserStore = create(
  (set, get) => ({
    ...defaultState,

    setGender: (gender) => {
      const dailyLimit = gender === 'male' ? 25 : 15;
      set({
        gender,
        dailyLimit,
      });
    },

    completeOnboarding: () => {
      set({ hasCompletedOnboarding: true });
    },

    updatePreferences: (prefs) => {
      set((state) => ({
        preferences: { ...state.preferences, ...prefs },
      }));
    },

    resetSettings: () => {
      set({
        ...defaultState,
        hasCompletedOnboarding: get().hasCompletedOnboarding,
      });
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
  })
);
