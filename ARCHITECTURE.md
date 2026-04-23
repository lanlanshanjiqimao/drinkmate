# DrinkMate 技术架构设计文档

> 本文档定义 DrinkMate（合上圆环饮酒版）Web App 的技术架构、开发规范和实施路线图。
>
> 版本：v1.0 | 创建日期：2026-04-20

---

## 一、技术选型决策

### 1.1 核心技术栈

| 层级 | 技术选择 | 选型理由 |
|------|----------|----------|
| **构建工具** | Vite 5.x | 已配置，极速冷启动，原生 ESM 支持 |
| **前端框架** | React 18.x | 已配置，Concurrent Features，Hooks 成熟生态 |
| **状态管理** | Zustand 4.x | 轻量（~1KB），无需 Provider，TypeScript 友好 |
| **样式方案** | CSS Modules + CSS Variables | 组件级作用域，原生 CSS 变量支持主题 |
| **路由方案** | Wouter | 轻量（~2KB），React Hooks API，无需 Router 组件包裹 |
| **图标方案** | Lucide React | 一致性 SVG 图标，tree-shaking 友好 |

### 1.2 存储与离线能力

| 能力 | 技术选择 | 说明 |
|------|----------|------|
| **本地存储** | localStorage + IndexedDB | 简单配置用 localStorage，大量数据用 IndexedDB |
| **离线能力** | Service Worker (Vite PWA) | 可选 PWA 支持，核心功能离线可用 |
| **数据同步** | 暂不支持（纯本地） | V1.0 阶段纯本地存储，后续考虑云端同步 |

### 1.3 开发工具链

| 工具 | 用途 |
|------|------|
| ESLint 8.x + @antfu/eslint-config | 代码规范 |
| TypeScript 5.x | 类型安全 |
| Vitest | 单元测试（可选） |
| Playwright | E2E 测试（可选） |

---

## 二、项目目录结构

```
drinkmate/
├── public/                     # 静态资源
│   ├── manifest.json           # PWA 配置
│   └── icons/                  # 应用图标
│
├── src/
│   ├── main.tsx                # 应用入口
│   ├── App.tsx                 # 根组件
│   ├── index.css               # 全局样式
│   │
│   ├── components/             # 公共组件
│   │   ├── ui/                 # 基础 UI 组件
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Input/
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/             # 布局组件
│   │   │   ├── AppShell/
│   │   │   ├── Header/
│   │   │   └── BottomNav/
│   │   │
│   │   └── features/           # 业务组件
│   │       ├── DrinkMate/      # 圆环组件
│   │       ├── DrinkForm/      # 饮酒记录表单
│   │       ├── DrinkList/      # 饮酒记录列表
│   │       ├── Calculator/     # 酒精计算器
│   │       └── GuideCard/      # 指导卡片
│   │
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useDrinkStore.ts    # 饮酒数据状态
│   │   ├── useUserStore.ts     # 用户设置状态
│   │   ├── useCalculator.ts    # 计算逻辑
│   │   └── useLocalStorage.ts  # 本地存储
│   │
│   ├── stores/                 # Zustand 状态
│   │   ├── drinkStore.ts
│   │   ├── userStore.ts
│   │   └── index.ts
│   │
│   ├── utils/                  # 工具函数
│   │   ├── calculator.ts     # 酒精计算
│   │   ├── formatter.ts      # 格式化
│   │   ├── constants.ts      # 常量定义
│   │   └── helpers.ts        # 辅助函数
│   │
│   ├── types/                  # TypeScript 类型
│   │   ├── drink.ts
│   │   ├── user.ts
│   │   └── index.ts
│   │
│   └── styles/                 # 样式文件
│       ├── variables.css       # CSS 变量
│       ├── mixins.css          # 混合宏
│       └── themes/             # 主题配置
│
├── index.html                  # HTML 入口
├── vite.config.ts              # Vite 配置
├── tsconfig.json               # TypeScript 配置
├── package.json                # 依赖管理
└── README.md                   # 项目说明
```

---

## 三、组件架构设计

### 3.1 核心组件关系图

```
┌─────────────────────────────────────────────────────────────┐
│                         App                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   AppShell                          │   │
│  │  ┌─────────────┐  ┌─────────────────────────────┐ │   │
│  │  │   Header    │  │         Main Content          │ │   │
│  │  │  (固定顶部)  │  │  ┌─────────────────────────┐  │ │   │
│  │  └─────────────┘  │  │      DrinkMate          │  │ │   │
│  │                   │  │    (圆环进度组件)        │  │ │   │
│  │  ┌─────────────┐  │  ├─────────────────────────┤  │ │   │
│  │  │ BottomNav   │  │  │     QuickActions        │  │ │   │
│  │  │  (底部导航)  │  │  │  (快捷录入/换算器/指导)  │  │ │   │
│  │  └─────────────┘  │  ├─────────────────────────┤  │ │   │
│  │                   │  │      DrinkList            │  │ │   │
│  │                   │  │    (今日饮酒记录列表)      │  │ │   │
│  │                   │  └─────────────────────────┘  │ │   │
│  │                   └─────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

                          │
                          ▼
              ┌───────────────────────┐
              │    全局状态 (Zustand)  │
              │  ┌─────────────────┐  │
              │  │   drinkStore    │  │
              │  │  - records[]    │  │
              │  │  - todayStats   │  │
              │  └─────────────────┘  │
              │  ┌─────────────────┐  │
              │  │   userStore     │  │
              │  │  - gender       │  │
              │  │  - dailyLimit   │  │
              │  │  - preferences  │  │
              │  └─────────────────┘  │
              └───────────────────────┘
```

### 3.2 关键组件设计

#### DrinkMate 圆环组件

```typescript
// 组件职责：渲染动态圆环进度，响应数据变化
interface DrinkMateProps {
  percentage: number;      // 0-100+ 的进度值
  currentAmount: number;   // 当前摄入量(g)
  dailyLimit: number;    // 每日上限(g)
  size?: number;         // 圆环尺寸
}

// 颜色映射逻辑
const getRingColor = (percentage: number): string => {
  if (percentage <= 50) return '#d4a853 → #b8944a'; // 金色
  if (percentage <= 80) return '#fbbf24 → #f59e0b'; // 琥珀
  if (percentage <= 100) return '#f97316 → #ea580c'; // 橙色
  return '#f87171 → #dc2626'; // 红色
};
```

#### DrinkForm 记录表单

```typescript
// 组件职责：录入新的饮酒记录
interface DrinkFormProps {
  onSubmit: (record: DrinkRecord) => void;
  onCancel: () => void;
}

// 预设值配置
const DRINK_PRESETS: Record<DrinkType, DrinkPreset> = {
  wine: { name: '葡萄酒', abv: 12, volume: 150, icon: '🍷' },
  beer: { name: '啤酒', abv: 4, volume: 500, icon: '🍺' },
  spirit: { name: '白酒', abv: 52, volume: 50, icon: '🥃' },
  cocktail: { name: '鸡尾酒', abv: 15, volume: 100, icon: '🍸' },
  sake: { name: '清酒', abv: 15, volume: 100, icon: '🍶' },
  whiskey: { name: '威士忌', abv: 40, volume: 45, icon: '🥃' },
};
```

---

## 四、状态管理与数据流

### 4.1 Zustand Store 设计

```typescript
// stores/drinkStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DrinkRecord {
  id: string;
  type: DrinkType;
  name: string;
  volume: number;      // ml
  abv: number;         // %
  time: string;        // ISO 8601
  pureAlcohol: number; // g
}

interface DrinkState {
  // 数据
  records: DrinkRecord[];
  
  // 计算属性（通过 selector 实现）
  todayRecords: () => DrinkRecord[];
  todayStats: () => {
    totalAlcohol: number;
    standardDrinks: number;
    calories: number;
    percentage: number;
  };
  
  // 操作
  addRecord: (record: Omit<DrinkRecord, 'id' | 'pureAlcohol'>) => void;
  removeRecord: (id: string) => void;
  clearTodayRecords: () => void;
}

export const useDrinkStore = create<DrinkState>()(
  persist(
    (set, get) => ({
      records: [],
      
      todayRecords: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().records.filter(r => r.time.startsWith(today));
      },
      
      todayStats: () => {
        const todayRecs = get().todayRecords();
        const totalAlcohol = todayRecs.reduce((sum, r) => sum + r.pureAlcohol, 0);
        const dailyLimit = useUserStore.getState().dailyLimit;
        
        return {
          totalAlcohol,
          standardDrinks: totalAlcohol / 10,
          calories: totalAlcohol * 7,
          percentage: Math.min((totalAlcohol / dailyLimit) * 100, 999),
        };
      },
      
      addRecord: (data) => {
        const pureAlcohol = data.volume * (data.abv / 100) * 0.8;
        const record: DrinkRecord = {
          ...data,
          id: Date.now().toString(),
          pureAlcohol,
        };
        set(state => ({ records: [...state.records, record] }));
      },
      
      removeRecord: (id) => {
        set(state => ({ records: state.records.filter(r => r.id !== id) }));
      },
      
      clearTodayRecords: () => {
        const today = new Date().toISOString().split('T')[0];
        set(state => ({
          records: state.records.filter(r => !r.time.startsWith(today)),
        }));
      },
    }),
    {
      name: 'drinkring-storage',
      partialize: (state) => ({ records: state.records }),
    }
  )
);
```

### 4.2 用户设置 Store

```typescript
// stores/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Gender = 'male' | 'female';

interface UserState {
  // 用户设置
  gender: Gender;
  dailyLimit: number;
  hasCompletedOnboarding: boolean;
  
  // 偏好设置
  preferences: {
    showCalories: boolean;
    showStandardDrinks: boolean;
    defaultDrinkType: string;
    reminderEnabled: boolean;
  };
  
  // 操作
  setGender: (gender: Gender) => void;
  completeOnboarding: () => void;
  updatePreferences: (prefs: Partial<UserState['preferences']>) => void;
  resetSettings: () => void;
}

const DEFAULT_DAILY_LIMITS: Record<Gender, number> = {
  male: 25,    // 25g 纯酒精
  female: 15,  // 15g 纯酒精
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      gender: 'male',
      dailyLimit: DEFAULT_DAILY_LIMITS.male,
      hasCompletedOnboarding: false,
      
      preferences: {
        showCalories: true,
        showStandardDrinks: true,
        defaultDrinkType: 'beer',
        reminderEnabled: false,
      },
      
      setGender: (gender) => set({
        gender,
        dailyLimit: DEFAULT_DAILY_LIMITS[gender],
      }),
      
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      
      updatePreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs },
      })),
      
      resetSettings: () => set({
        gender: 'male',
        dailyLimit: DEFAULT_DAILY_LIMITS.male,
        hasCompletedOnboarding: false,
        preferences: {
          showCalories: true,
          showStandardDrinks: true,
          defaultDrinkType: 'beer',
          reminderEnabled: false,
        },
      }),
    }),
    {
      name: 'drinkring-user',
    }
  )
);
```

---

## 五、开发实施路线图

### 5.1 Phase 1: 核心 MVP（2-3 周）

**目标：** 可运行的核心功能

| 任务 | 优先级 | 预估时间 |
|------|--------|----------|
| 项目初始化 + 依赖安装 | P0 | 2h |
| 全局样式 + CSS 变量系统 | P0 | 4h |
| DrinkMate 圆环组件 | P0 | 8h |
| 饮酒记录表单 | P0 | 6h |
| Zustand Store 实现 | P0 | 4h |
| 本地存储持久化 | P0 | 2h |
| 用户引导流程 | P1 | 4h |

### 5.2 Phase 2: 体验优化（1-2 周）

**目标：** 完整的用户体验

| 任务 | 优先级 |
|------|--------|
| 酒精换算器页面 | P1 |
| 科学饮酒指导页面 | P1 |
| 历史记录查看 | P1 |
| 动画效果优化 | P2 |
| 移动端适配完善 | P1 |

### 5.3 Phase 3: 进阶功能（可选）

| 任务 | 说明 |
|------|------|
| PWA 支持 | 离线访问、添加到主屏 |
| 数据导出 | CSV/JSON 导出 |
| 周/月统计图表 | 趋势分析 |
| 社交分享 | 生成分享图片 |

---

## 六、关键技术实现细节

### 6.1 圆环进度动画

```typescript
// components/features/DrinkMate/RingProgress.tsx
import { useEffect, useRef } from 'react';
import styles from './RingProgress.module.css';

interface RingProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export const RingProgress: React.FC<RingProgressProps> = ({
  percentage,
  size = 280,
  strokeWidth = 16,
}) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = `${offset}`;
    }
  }, [offset]);

  const getColor = () => {
    if (percentage <= 50) return 'var(--ring-gold)';
    if (percentage <= 80) return 'var(--ring-amber)';
    if (percentage <= 100) return 'var(--ring-orange)';
    return 'var(--ring-red)';
  };

  return (
    <svg width={size} height={size} className={styles.ring}>
      {/* 背景圆环 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--ring-bg)"
        strokeWidth={strokeWidth}
      />
      {/* 进度圆环 */}
      <circle
        ref={circleRef}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={getColor()}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};
```

### 6.2 CSS 变量系统

```css
/* styles/variables.css */
:root {
  /* 背景色 */
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-card: #1a1a24;
  --bg-elevated: #22222e;

  /* 强调色 - 圆环 */
  --ring-gold: #d4a853;
  --ring-gold-dark: #b8944a;
  --ring-amber: #fbbf24;
  --ring-amber-dark: #f59e0b;
  --ring-orange: #f97316;
  --ring-orange-dark: #ea580c;
  --ring-red: #f87171;
  --ring-red-dark: #dc2626;
  --ring-bg: rgba(255, 255, 255, 0.08);

  /* 品牌色 */
  --accent-wine: #8b3a5d;
  --accent-beer: #e8a838;
  --accent-spirit: #4a90d9;

  /* 文字色 */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-tertiary: rgba(255, 255, 255, 0.4);

  /* 状态色 */
  --success: #4ade80;
  --warning: #fbbf24;
  --danger: #f87171;
  --info: #60a5fa;

  /* 间距 */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

---

## 七、性能与优化策略

### 7.1 渲染优化

- **React.memo**: 纯展示组件使用 memo 包裹
- **useMemo/useCallback**: 复杂计算和事件处理函数缓存
- **懒加载**: 非首屏组件使用 React.lazy + Suspense

### 7.2 存储优化

- **分片存储**: 大量历史记录使用 IndexedDB，配置用 localStorage
- **数据压缩**: 存储前使用 LZ-string 压缩
- **定期清理**: 自动清理 90 天前的记录

### 7.3 加载优化

- **资源预加载**: 关键字体和图标预加载
- **骨架屏**: 数据加载时显示骨架屏
- **渐进式加载**: 先展示缓存数据，再刷新

---

## 八、总结

本文档定义了 DrinkMate 的完整技术架构：

1. **技术栈**: React 18 + Vite + Zustand + CSS Modules
2. **存储**: localStorage + IndexedDB，纯本地优先
3. **架构**: 组件化设计，状态集中管理
4. **实施**: 分 3 个阶段，MVP 2-3 周完成

下一步行动：
1. 安装依赖并初始化项目
2. 配置全局样式系统
3. 实现 DrinkMate 圆环组件
4. 搭建 Zustand Store 架构
