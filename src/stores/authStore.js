import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../utils/constants';
import { setGetCurrentUser } from '../utils/userStorage';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      users: {},

      register: (username, password) => {
        const { users } = get();
        if (!username.trim()) {
          return { success: false, error: '用户名不能为空' };
        }
        if (!password.trim()) {
          return { success: false, error: '密码不能为空' };
        }
        if (users[username]) {
          return { success: false, error: '用户名已存在' };
        }
        set({
          users: { ...users, [username]: password },
          currentUser: username,
        });
        return { success: true };
      },

      login: (username, password) => {
        const { users } = get();
        if (!users[username]) {
          return { success: false, error: '用户不存在' };
        }
        if (users[username] !== password) {
          return { success: false, error: '密码错误' };
        }
        set({ currentUser: username });
        return { success: true };
      },

      logout: () => {
        set({ currentUser: null });
      },

      deleteUser: (username) => {
        const { users, currentUser } = get();
        const newUsers = { ...users };
        delete newUsers[username];
        Object.values(STORAGE_KEYS).forEach((baseKey) => {
          if (baseKey !== STORAGE_KEYS.AUTH) {
            localStorage.removeItem(`${baseKey}_${username}`);
          }
        });
        set({
          users: newUsers,
          currentUser: currentUser === username ? null : currentUser,
        });
      },

      migratePreAccountData: (username) => {
        const flagKey = 'drinkmate_migrated_v1';
        if (localStorage.getItem(flagKey)) return;

        [STORAGE_KEYS.RECORDS, STORAGE_KEYS.USER_SETTINGS].forEach((baseKey) => {
          const oldData = localStorage.getItem(baseKey);
          if (oldData) {
            localStorage.setItem(`${baseKey}_${username}`, oldData);
            localStorage.removeItem(baseKey);
          }
        });
        localStorage.setItem(flagKey, 'true');
      },
    }),
    {
      name: STORAGE_KEYS.AUTH,
    }
  )
);

setGetCurrentUser(() => useAuthStore.getState().currentUser);
