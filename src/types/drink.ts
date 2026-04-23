/** Drink Types */

/** 饮品类型枚举 */
export type DrinkType =
  | 'wine'
  | 'beer'
  | 'spirit'
  | 'cocktail'
  | 'sake'
  | 'whiskey';

/** 饮酒记录 */
export interface DrinkRecord {
  /** 唯一标识 */
  id: string;
  /** 饮品类型 */
  type: DrinkType;
  /** 饮品名称 */
  name: string;
  /** 容量（ml） */
  volume: number;
  /** 酒精度（%） */
  abv: number;
  /** 饮酒时间（ISO 8601） */
  timestamp: string;
  /** 纯酒精量（g）- 计算得出 */
  pureAlcohol: number;
}

/** 饮品预设配置 */
export interface DrinkPreset {
  type: DrinkType;
  icon: string;
  defaultName: string;
  defaultVolume: number;
  defaultAbv: number;
  color: string;
}

/** 今日统计数据 */
export interface TodayStats {
  /** 总纯酒精（g） */
  totalAlcohol: number;
  /** 标准杯数（1杯=10g） */
  standardDrinks: number;
  /** 热量（kcal） */
  calories: number;
  /** 相对于上限的百分比 */
  percentage: number;
  /** 记录数量 */
  recordCount: number;
  /** 是否超量 */
  isOverLimit: boolean;
  /** 圆环颜色 */
  ringColor: string;
}

/** 计算输入参数 */
export interface CalculatorInput {
  volume: number;
  abv: number;
}

/** 计算结果 */
export interface CalculatorResult {
  pureAlcohol: number;
  standardDrinks: number;
  calories: number;
}
