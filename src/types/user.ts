/** User Types */

/** 用户设置 */
export interface UserSettings {
  /** 每日安全上限（g 纯酒精） */
  dailyLimit: number;
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
