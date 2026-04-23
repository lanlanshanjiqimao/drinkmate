/** Constants - Global Constants */

/** App Version */
export const APP_VERSION = '1.0.0';

/** Daily Limits (grams of pure alcohol) */
export const DAILY_LIMITS = {
  male: 25,
  female: 15,
} as const;

/** Alcohol Density (g/ml) */
export const ALCOHOL_DENSITY = 0.8;

/** Standard Drink Size (grams of pure alcohol) */
export const STANDARD_DRINK_GRAMS = 10;

/** Calories per gram of alcohol */
export const CALORIES_PER_GRAM = 7;

/** Storage Keys */
export const STORAGE_KEYS = {
  RECORDS: 'drinkmate_records_v1',
  USER_SETTINGS: 'drinkmate_user_settings_v1',
  USER_PREFERENCES: 'drinkmate_user_preferences_v1',
  APP_VERSION: 'drinkmate_version',
} as const;

/** Drink Presets */
export const DRINK_PRESETS = [
  {
    type: 'wine' as const,
    icon: '🍷',
    defaultName: '葡萄酒',
    defaultVolume: 150,
    defaultAbv: 12,
    color: '#8b3a5d',
  },
  {
    type: 'beer' as const,
    icon: '🍺',
    defaultName: '啤酒',
    defaultVolume: 500,
    defaultAbv: 4,
    color: '#e8a838',
  },
  {
    type: 'spirit' as const,
    icon: '🥃',
    defaultName: '白酒',
    defaultVolume: 50,
    defaultAbv: 52,
    color: '#4a90d9',
  },
  {
    type: 'cocktail' as const,
    icon: '🍸',
    defaultName: '鸡尾酒',
    defaultVolume: 100,
    defaultAbv: 15,
    color: '#ec4899',
  },
  {
    type: 'sake' as const,
    icon: '🍶',
    defaultName: '清酒',
    defaultVolume: 100,
    defaultAbv: 15,
    color: '#f5deb3',
  },
  {
    type: 'whiskey' as const,
    icon: '🥃',
    defaultName: '威士忌',
    defaultVolume: 45,
    defaultAbv: 40,
    color: '#cd853f',
  },
];

/** Guide Card Contents */
export const GUIDE_CARDS = {
  moderation: {
    title: '🟢 适度标准',
    content: `男性每日 ≤ 25g 纯酒精 (约 2.5 标准杯)
女性每日 ≤ 15g 纯酒精 (约 1.5 标准杯)

每周建议至少有 2-3 天完全不饮酒，
给肝脏足够的代谢和恢复时间。`,
  },
  timing: {
    title: '🟡 饮酒时机',
    content: `✓ 饮酒前先吃些食物，减缓酒精吸收
✓ 边吃边喝，控制饮酒速度
✗ 避免空腹饮酒
✗ 不与碳酸饮料混饮（加速吸收）
✓ 饮酒后多喝水，促进代谢`,
  },
  safety: {
    title: '🔴 安全提醒',
    content: `⚠️ 服用药物期间绝对禁酒
   （尤其抗生素、镇静剂、降糖药）

⚠️ 备孕、怀孕、哺乳期完全禁酒

🚫 酒后绝对禁止驾车
   （即使"感觉清醒"也可能超标）`,
  },
};

/** Dynamic Tips by Progress */
export const DYNAMIC_TIPS = [
  { max: 0, message: '今日尚未饮酒，保持清醒也是好选择' },
  { max: 50, message: '适量范围，继续保持' },
  { max: 80, message: '接近上限，请注意控制' },
  { max: 100, message: '即将达到上限，建议停止' },
  { max: Infinity, message: '已超安全上限，请立即停止饮酒' },
];
