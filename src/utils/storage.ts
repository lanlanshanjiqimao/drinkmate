/** Storage - localStorage Management Utilities */

import { STORAGE_KEYS, APP_VERSION } from './constants';
import { useDrinkStore } from '../stores/drinkStore';
import { useUserStore } from '../stores/userStore';

/** Storage error class */
export class StorageError extends Error {
  constructor(
    message: string,
    public key: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/** Get data from localStorage */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Storage get error for key "${key}":`, error);
    return defaultValue;
  }
}

/** Save data to localStorage */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded:', error);
      throw new StorageError(
        '存储空间不足，请清理部分数据后重试',
        key,
        error
      );
    }
    console.error(`Storage set error for key "${key}":`, error);
    throw new StorageError(
      '数据保存失败，请重试',
      key,
      error instanceof Error ? error : undefined
    );
  }
}

/** Remove item from localStorage */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Storage remove error for key "${key}":`, error);
  }
}

/** Clear all app data from localStorage */
export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    removeStorageItem(key);
  });
}

/** Export data as JSON string */
export function exportData(): string {
  const drinkState = useDrinkStore.getState();
  const userState = useUserStore.getState();
  const data = {
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    records: drinkState.records,
    settings: {
      dailyLimit: userState.dailyLimit,
      preferences: userState.preferences,
    },
  };
  return JSON.stringify(data, null, 2);
}

/** Import data from JSON string */
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);

    if (!data.records || !Array.isArray(data.records)) {
      throw new Error('Invalid data format: records missing');
    }

    useDrinkStore.getState().importRecords(data.records);

    if (data.settings) {
      useUserStore.getState().importUserData(data.settings);
    }

    return true;
  } catch (error) {
    console.error('Import failed:', error);
    return false;
  }
}

/** Get storage usage info */
export function getStorageInfo(): { used: number; total: number; percentage: number } {
  let used = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        used += key.length + value.length;
      }
    }
  }

  // Estimate total (5MB is the typical limit)
  const total = 5 * 1024 * 1024;
  const percentage = (used / total) * 100;

  return { used, total, percentage };
}
