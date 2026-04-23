/** User Types */

/** 性别类型 */
export type Gender = 'male' | 'female';

/** 用户设置 */
export interface UserSettings {
  /** 性别 */
  gender: Gender;
  /** 每日安全上限（g 纯酒精） */
  dailyLimit: number;
  /** 是否已完成首次引导 */
  hasCompletedOnboarding: boolean;
}

/** 用户偏好 */
export interface UserPreferences {
  /** 是否显示热量 */
  showCalories: boolean;
  /** 是否显示标准杯 */
  showStandardDrinks: boolean;
  /** 默认饮品类型 */
  defaultDrinkType: string;
  /** 是否开启提醒 */
  reminderEnabled: boolean;
}

/** 完整用户状态 */
export interface UserState extends UserSettings {
  preferences: UserPreferences;
}
