# DrinkMate V1.0 功能规格说明书

> 本文档明确定义 V1.0 MVP 版本的功能范围、实现细节和验收标准。
>
> 版本：v1.0.0 | 日期：2026-04-21

---

## 一、功能范围概览

### V1.0 目标
实现**纯前端、单用户、本地存储**的饮酒记录应用，核心闭环：
```
记录饮酒 → 圆环反馈 → 健康提示 → 历史查看
```

### 功能清单

| 模块 | 功能点 | 优先级 | 状态 |
|------|--------|--------|------|
| **用户引导** | 首次进入性别选择 | P0 | 待开发 |
| **首页** | 圆环进度展示 | P0 | 待开发 |
| | 快捷录入按钮 | P0 | 待开发 |
| | 今日统计卡片 | P0 | 待开发 |
| | 今日记录列表 | P0 | 待开发 |
| **添加记录** | 饮品预设选择 | P0 | 待开发 |
| | 自定义表单 | P0 | 待开发 |
| **计算器** | 酒精换算工具 | P1 | 待开发 |
| **指导页** | 安全饮酒标准 | P1 | 待开发 |
| | 动态提示卡片 | P1 | 待开发 |
| **设置** | 性别修改 | P2 | 待开发 |
| | 数据清除 | P2 | 待开发 |

---

## 二、页面结构

### 路由设计

```
/                    # 首页（圆环 + 统计 + 列表）
/onboarding          # 首次引导（性别选择）
/add                 # 添加记录页
/calculator          # 酒精计算器
/guide               # 科学饮酒指导
/settings            # 设置页
```

### 页面详细说明

#### 1. 首页 (/) - 核心页面
```
┌─────────────────────────────┐
│      DrinkMate  2026/4/21   │  ← Header (固定)
├─────────────────────────────┤
│                             │
│         ┌─────┐             │
│        /  50%  \            │  ← 圆环区域
│       │  进度  │            │     (可交互)
│        \       /            │
│         └─────┘             │
│                             │
├─────────────────────────────┤
│  12.5g │ 1.3杯 │ 88kcal    │  ← 统计卡片 (3列)
├─────────────────────────────┤
│  快速录入: [🍷][🍺][🥃][🍸]  │  ← 快捷操作
├─────────────────────────────┤
│  今日记录                   │
│  ┌─────────────────────┐    │
│  │ 🍺 青岛啤酒    16g  │    │  ← 记录列表
│  │ 🍷 红酒        14g  │    │     (可滚动)
│  └─────────────────────┘    │
├─────────────────────────────┤
│  [🏠]  [🧮]  [📖]  [⚙️]   │  ← 底部导航 (固定)
└─────────────────────────────┘
```

#### 2. 添加记录页 (/add)
```
┌─────────────────────────────┐
│  ←  添加记录                 │
├─────────────────────────────┤
│  选择饮品类型:               │
│  ┌────┬────┬────┬────┐     │
│  │ 🍷 │ 🍺 │ 🥃 │ 🍸 │     │  ← 图标选择
│  │葡萄酒│啤酒│白酒│鸡尾酒│     │
│  └────┴────┴────┴────┘     │
│                              │
│  饮品名称                    │
│  ┌─────────────────────┐     │
│  │ 青岛啤酒            │     │  ← 根据类型自动填充
│  └─────────────────────┘     │
│                              │
│  容量 (ml)      酒精度 (%)   │
│  ┌──────────┐  ┌──────────┐  │
│  │   500    │  │   4.0    │  │  ← 可调整
│  └──────────┘  └──────────┘  │
│                              │
│  饮酒时间                    │
│  ┌─────────────────────┐     │
│  │ 2026-04-21 14:30    │     │
│  └─────────────────────┘     │
│                              │
│  预计摄入: 16g 纯酒精        │  ← 实时计算
│                              │
├─────────────────────────────┤
│      [    添加记录    ]      │  ← 主按钮
└─────────────────────────────┘
```

---

## 三、数据模型

### 核心类型定义

```typescript
// 饮酒记录
interface DrinkRecord {
  id: string;           // 唯一ID
  type: DrinkType;      // 饮品类型
  name: string;         // 饮品名称
  volume: number;       // 容量 ml
  abv: number;          // 酒精度 %
  timestamp: string;    // ISO时间
  pureAlcohol: number;  // 纯酒精 g (计算)
}

// 用户设置
interface UserState {
  gender: 'male' | 'female';
  dailyLimit: number;      // 男25g/女15g
  hasCompletedOnboarding: boolean;
  preferences: {
    showCalories: boolean;
    showStandardDrinks: boolean;
    defaultDrinkType: string;
    reminderEnabled: boolean;
  };
}

// 今日统计
interface TodayStats {
  totalAlcohol: number;     // 总酒精(g)
  standardDrinks: number;   // 标准杯
  calories: number;         // 热量(kcal)
  percentage: number;       // 进度百分比
  recordCount: number;    // 记录数
  isOverLimit: boolean;   // 是否超量
  ringColor: string;      // 圆环颜色
  status: string;         // 状态(safe/warning/...)
}
```

---

## 四、组件拆分

### 组件树

```
App
├── AppShell (布局外壳)
│   ├── Header (顶部标题栏)
│   ├── BottomNav (底部导航)
│   └── Main (主内容区)
│
├── Pages (页面)
│   ├── HomePage (首页)
│   │   ├── DrinkRing (圆环组件)
│   │   ├── StatsCard (统计卡片)
│   │   ├── QuickActions (快捷操作)
│   │   └── DrinkList (记录列表)
│   │
│   ├── AddPage (添加页)
│   │   ├── DrinkTypeSelector (类型选择)
│   │   ├── DrinkForm (表单)
│   │   └── LivePreview (实时预览)
│   │
│   ├── CalculatorPage (计算器)
│   └── GuidePage (指导页)
│
└── Shared (共享组件)
    ├── Button
    ├── Card
    ├── Input
    └── Icon
```

### 核心组件说明

| 组件 | 文件 | 职责 | 复杂度 |
|------|------|------|--------|
| DrinkRing | `features/DrinkRing/index.tsx` | 圆环进度动画 | ⭐⭐⭐ |
| StatsCard | `features/StatsCard/index.tsx` | 统计数字展示 | ⭐⭐ |
| DrinkList | `features/DrinkList/index.tsx` | 记录列表 | ⭐⭐ |
| DrinkForm | `features/DrinkForm/index.tsx` | 添加表单 | ⭐⭐⭐ |
| BottomNav | `layout/BottomNav/index.tsx` | 底部导航 | ⭐ |

---

## 五、存储策略

### V1.0 存储设计（localStorage）

```
┌─────────────────────────────────────────┐
│           localStorage                │
├─────────────────────────────────────────┤
│                                         │
│  Key: drinkmate_records_v1              │
│  Value: [                              │
│    {                                    │
│      "id": "123456789",                 │
│      "type": "beer",                    │
│      "name": "青岛啤酒",                 │
│      "volume": 500,                     │
│      "abv": 4,                          │
│      "timestamp": "2026-04-21T14:30:00Z",│
│      "pureAlcohol": 16                  │
│    }                                    │
│  ]                                      │
│                                         │
│  Key: drinkmate_user_settings_v1        │
│  Value: {                               │
│    "gender": "male",                    │
│    "dailyLimit": 25,                    │
│    "hasCompletedOnboarding": true       │
│  }                                      │
│                                         │
│  Key: drinkmate_user_preferences_v1     │
│  Value: {                               │
│    "showCalories": true,                │
│    "showStandardDrinks": true,          │
│    "defaultDrinkType": "beer",          │
│    "reminderEnabled": false             │
│  }                                      │
│                                         │
└─────────────────────────────────────────┘
```

### 数据版本控制

```typescript
// 存储版本管理
const STORAGE_VERSION = 'v1';

// 迁移策略
interface Migration {
  version: string;
  migrate: (data: unknown) => unknown;
}

// 如果未来需要升级存储格式
const migrations: Migration[] = [
  {
    version: 'v2',
    migrate: (v1Data) => {
      // 转换逻辑
      return v2Data;
    }
  }
];
```

---

## 六、开发计划

### 开发顺序（推荐）

```
Week 1: 基础架构 + 核心组件
├── Day 1-2: 项目初始化、全局样式、布局组件
├── Day 3-4: DrinkRing 圆环组件
├── Day 5-6: Store 架构、数据持久化
└── Day 7: 首页整合

Week 2: 功能页面
├── Day 8-9: 添加记录页
├── Day 10-11: 计算器页、指导页
├── Day 12-13: 路由、导航、动画
└── Day 14: 测试、优化、修复

Week 3: 优化完善
├── Day 15-17: 移动端适配、性能优化
├── Day 18-19: 边界情况处理、错误处理
└── Day 20-21: 文档、部署准备
```

### 验收标准

| 功能 | 验收标准 |
|------|----------|
| 圆环 | 动画流畅、颜色随进度变化、完成时有反馈 |
| 记录 | 添加后实时更新圆环和列表、删除有确认 |
| 存储 | 刷新后数据不丢失、localStorage 可导出 |
| 响应 | 移动端触摸友好、无横向滚动、适配 iPhone SE |

---

**这是 DrinkMate V1.0 的完整架构设计。需要我：**
1. 开始实现代码（建议从 DrinkRing 圆环组件开始）
2. 详细讲解某个部分（如 Store 设计或动画实现）
3. 调整或补充某些设计