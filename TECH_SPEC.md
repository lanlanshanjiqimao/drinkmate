# DrinkMate 技术方案文档

> 本文档是 DrinkMate 项目的技术总纲，记录整体架构、版本规划和各阶段详细技术方案。
>
> 文档版本：v1.0 | 创建日期：2026-04-20 | 维护人：开发团队

---

## 📋 文档说明

### 使用规范
- 本文档为**只读参考文档**，实际开发以各版本对应的 Implementation Plan 为准
- 任何技术变更需先在本文档中更新方案，再执行代码变更
- 版本迭代时需保留历史方案，新增章节记录新版本

### 版本记录

| 文档版本 | 日期 | 变更内容 | 变更人 |
|---------|------|---------|--------|
| v1.0 | 2026-04-20 | 初始创建，定义 V1.0 MVP 技术方案 | - |

---

## 一、整体技术架构

### 1.1 核心技术栈（全版本通用）

| 层级 | 技术选型 | 版本锁定 | 说明 |
|------|----------|----------|------|
| **构建工具** | Vite | ^5.0.0 | ESM 原生支持，极速 HMR |
| **前端框架** | React | ^18.2.0 | Concurrent Features，Hooks 优先 |
| **类型系统** | TypeScript | ^5.0.0 | 严格模式开启 |
| **状态管理** | Zustand | ^4.4.0 | 轻量，无 Provider 模式 |
| **路由方案** | Wouter | ^3.0.0 | 轻量 Hooks API |
| **样式方案** | CSS Modules + CSS Variables | 原生 | 组件作用域 + 主题系统 |
| **图标方案** | Lucide React | ^0.300.0 | 一致性 SVG 图标 |

### 1.2 存储策略矩阵

| 版本 | 存储方案 | 数据范围 | 说明 |
|------|----------|----------|------|
| **V1.0** | localStorage | 全部数据 | MVP 阶段，简单可靠 |
| **V1.1+** | localStorage + IndexedDB | 配置+历史记录 | 大量数据场景 |
| **V2.0+** | 云端同步 | 多端同步 | 用户系统 + 云存储 |

### 1.3 项目目录结构（全版本通用）

```
src/
├── main.tsx                    # 应用入口
├── App.tsx                     # 根组件
├── index.css                   # 全局样式 + CSS 变量
│
├── components/                 # 组件目录
│   ├── ui/                     # 基础 UI 组件
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   └── index.ts            # 统一导出
│   │
│   ├── layout/                 # 布局组件
│   │   ├── AppShell/           # 应用外壳
│   │   ├── Header/             # 顶部导航
│   │   └── BottomNav/          # 底部导航
│   │
│   └── features/               # 业务功能组件
│       ├── DrinkMate/          # 圆环进度组件
│       ├── DrinkForm/          # 饮酒记录表单
│       ├── DrinkList/          # 饮酒记录列表
│       ├── Calculator/         # 酒精计算器
│       └── GuideCards/         # 指导卡片组
│
├── stores/                     # Zustand 状态管理
│   ├── drinkStore.ts           # 饮酒数据状态
│   ├── userStore.ts            # 用户设置状态
│   └── index.ts                # 统一导出
│
├── hooks/                      # 自定义 React Hooks
│   ├── useDrinkStats.ts        # 饮酒统计数据
│   ├── useCalculator.ts        # 计算逻辑封装
│   ├── useLocalStorage.ts      # localStorage 封装
│   └── useAnimation.ts         # 动画效果封装
│
├── utils/                      # 工具函数
│   ├── calculator.ts           # 酒精计算公式
│   ├── formatter.ts            # 数据格式化
│   ├── constants.ts            # 常量定义
│   └── helpers.ts              # 通用辅助函数
│
├── types/                      # TypeScript 类型定义
│   ├── drink.ts                # 饮酒相关类型
│   ├── user.ts                 # 用户相关类型
│   └── index.ts                # 统一导出
│
└── styles/                     # 样式文件（按需创建）
    ├── mixins.css              # CSS 混合宏
    └── themes/                 # 主题配置（预留）
```

---

## 二、版本规划路线图

### 2.1 版本矩阵

| 版本 | 目标 | 核心功能 | 预计工期 | 存储方案 |
|------|------|----------|----------|----------|
| **V1.0** | MVP | 圆环、记录、计算、指导 | 2-3 周 | localStorage |
| **V1.1** | 体验 | 图表统计、PWA、数据导出 | 1-2 周 | localStorage + IndexedDB |
| **V1.2** | 社交 | 分享、社区、挑战活动 | 2 周 | 云端存储 |
| **V2.0** | 平台 | 多端同步、账号系统 | 待定 | 云服务 |

### 2.2 功能演进路线图

```
时间线 ──────────────────────────────────────────────────────────────>

V1.0 MVP (Week 1-3)
├── 核心圆环进度展示
├── 饮酒记录 CRUD
├── 酒精换算计算器
├── 科学饮酒指导
└── localStorage 本地存储

V1.1 体验优化 (Week 4-5)
├── 周/月统计图表
├── PWA 离线支持
├── 数据导入/导出
├── 提醒通知
└── IndexedDB 大量数据支持

V1.2 社交功能 (Week 6-7)
├── 生成分享图片
├── 饮酒打卡社区
├── 好友排行榜
├── 挑战活动
└── 云端数据同步

V2.0 平台化 (Future)
├── 多端账号系统
├── 数据云端备份
├── 高级数据分析
└── 第三方集成
```

---

## 三、V1.0 MVP 详细技术方案

> **版本目标：** 实现核心功能闭环，验证产品价值
> **工期预估：** 2-3 周
> **技术约束：** 纯前端实现，localStorage 存储

### 3.1 V1.0 功能清单

| 模块 | 功能点 | 优先级 | 验收标准 |
|------|--------|--------|----------|
| **用户引导** | 性别选择页 | P0 | 首次进入强制选择，影响安全上限计算 |
| **首页** | 圆环进度展示 | P0 | 动态填充，颜色随进度变化 |
| | 快捷操作按钮 | P0 | 一键录入预设饮品 |
| | 今日统计卡片 | P0 | 显示纯酒精、标准杯、热量 |
| | 饮酒记录列表 | P0 | 可删除单条记录 |
| **添加记录** | 饮品类型选择 | P0 | 图标化选择，自动填充默认值 |
| | 自定义输入 | P0 | 名称、容量、酒精度可调 |
| | 记录时间选择 | P1 | 默认可选时间 |
| **计算器** | 酒精换算 | P0 | 输入容量和度数，显示纯酒精等 |
| | 标准杯换算表 | P1 | 常见酒类的参考表 |
| **指导** | 安全饮酒标准 | P0 | 根据性别显示每日上限 |
| | 饮酒建议卡片 | P0 | 动态根据当前进度提示 |
| | 安全提醒 | P0 | 超量警告、禁忌提示 |

### 3.2 V1.0 页面路由设计

```
路由结构（wouter）
==================

/                    # 首页（默认）
                     # - 圆环进度
                     # - 快捷操作
                     # - 今日记录列表

/onboarding          # 首次引导（性别选择）
                     # - 只在首次访问显示

/add                 # 添加记录页
                     # - 表单界面
                     # - 可以是 modal 或独立页面

/calculator          # 酒精计算器
                     # - 换算工具
                     # - 参考表格

/guide               # 科学饮酒指导
                     # - 安全标准
                     # - 动态建议
                     # - 安全提醒

/settings            # 设置页（可选 V1.0）
                     # - 性别修改
                     # - 数据清除
```

### 3.3 V1.0 数据模型

```typescript
// types/drink.ts

/** 饮品类型 */
export type DrinkType = 
  | 'wine'      // 葡萄酒
  | 'beer'      // 啤酒
  | 'spirit'    // 白酒/烈酒
  | 'cocktail'  // 鸡尾酒
  | 'sake'      // 清酒
  | 'whiskey';  // 威士忌

/** 饮酒记录 */
export interface DrinkRecord {
  /** 唯一标识 */
  id: string;
  /** 饮品类型 */
  type: DrinkType;
  /** 饮品名称（如"青岛啤酒"） */
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
  name: string;
  defaultName: string;
  defaultVolume: number;
  defaultAbv: number;
  icon: string;
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
}
```

```typescript
// types/user.ts

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
```

### 3.4 V1.0 存储方案（localStorage）

```typescript
// utils/storage.ts

/** localStorage 键名常量 */
export const STORAGE_KEYS = {
  /** 饮酒记录 */
  RECORDS: 'drinkring_records',
  /** 用户设置 */
  USER_SETTINGS: 'drinkring_user_settings',
  /** 用户偏好 */
  USER_PREFERENCES: 'drinkring_user_preferences',
  /** 应用版本（用于数据迁移） */
  APP_VERSION: 'drinkring_version',
} as const;

/** 应用当前版本 */
export const APP_VERSION = '1.0.0';

/** 存储工具类 */
export class Storage {
  /** 获取数据 */
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.error(`Storage get error for key "${key}":`, error);
      return defaultValue;
    }
  }

  /** 保存数据 */
  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Storage set error for key "${key}":`, error);
      // TODO: 处理存储空间不足的情况
    }
  }

  /** 删除数据 */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Storage remove error for key "${key}":`, error);
    }
  }

  /** 清空所有应用数据 */
  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      Storage.remove(key);
    });
  }
}

/** 数据迁移工具 */
export class Migration {
  /** 检查并执行迁移 */
  static checkAndMigrate(): void {
    const currentVersion = Storage.get<string>(
      STORAGE_KEYS.APP_VERSION,
      '0.0.0'
    );

    if (currentVersion === APP_VERSION) {
      return; // 已是最新，无需迁移
    }

    // 执行版本间迁移
    if (currentVersion < '1.0.0') {
      Migration.migrateToV1_0_0();
    }

    // 更新版本号
    Storage.set(STORAGE_KEYS.APP_VERSION, APP_VERSION);
  }

  /** 迁移到 V1.0.0 */
  private static migrateToV1_0_0(): void {
    // V1.0.0 初始版本，无需从旧版本迁移
    console.log('Migration: Initializing V1.0.0 data structure');
  }
}
```

### 3.5 V1.0 开发任务清单

#### Week 1: 基础架构 + 核心组件

| 任务 | 预估时间 | 优先级 | 验收标准 |
|------|----------|--------|----------|
| 安装依赖 (zustand, wouter, lucide-react) | 0.5h | P0 | 无冲突安装完成 |
| 配置 CSS 变量系统 | 2h | P0 | 所有设计 token 可用 |
| 实现 Storage/Migration 工具 | 2h | P0 | 数据读写、版本迁移正常 |
| 实现 drinkStore | 3h | P0 | 增删改查、计算属性正确 |
| 实现 userStore | 2h | P0 | 设置持久化、计算上限 |
| 开发 DrinkMate 圆环组件 | 4h | P0 | 动画流畅、颜色渐变正确 |
| 开发 DrinkForm 表单 | 4h | P0 | 预设填充、自定义输入 |
| 开发 DrinkList 列表 | 2h | P0 | 显示、删除功能 |

#### Week 2: 页面整合 + 功能完善

| 任务 | 预估时间 | 优先级 | 验收标准 |
|------|----------|--------|----------|
| 开发首页（整合圆环、列表、快捷操作） | 4h | P0 | 布局正确、交互流畅 |
| 开发 Onboarding 引导页 | 2h | P0 | 首次进入强制显示 |
| 开发 Calculator 计算器页面 | 3h | P0 | 换算准确、表格展示 |
| 开发 Guide 指导页面 | 3h | P0 | 动态建议、安全提醒 |
| 配置路由（wouter） | 2h | P0 | 页面跳转正常 |
| 实现 AppShell 布局 | 2h | P0 | 底部导航、页面切换 |

#### Week 3: 测试优化 + 发布准备

| 任务 | 预估时间 | 优先级 | 验收标准 |
|------|----------|--------|----------|
| 移动端适配测试 | 3h | P0 | iOS/Android 主流机型正常 |
| 动画性能优化 | 2h | P1 | 60fps，无明显卡顿 |
| 边界情况处理 | 2h | P1 | 空状态、超限状态处理 |
| 代码清理 + 注释 | 2h | P2 | 关键逻辑有注释 |
| 构建测试 | 1h | P0 | vite build 无错误 |
| 部署准备 | 2h | P1 | 静态资源可部署 |

---

## 四、V1.1+ 技术预案

> 以下内容为后续版本的技术预研，**不代表当前开发计划**

### 4.1 V1.1 技术方向

**目标：** 体验优化，数据规模扩大

| 技术点 | 方案 | 原因 |
|--------|------|------|
| 大量数据存储 | IndexedDB | localStorage 5MB 限制 |
| 统计图表 | Recharts | React 生态成熟方案 |
| PWA 支持 | Vite PWA Plugin | 离线访问、添加到主屏 |
| 数据迁移 | 版本化迁移工具 | V1.0 → V1.1 数据格式兼容 |

### 4.2 V1.2 技术方向

**目标：** 社交功能，云端同步

| 技术点 | 方案 | 说明 |
|--------|------|------|
| 后端服务 | 云开发/Serverless | 低成本启动 |
| 图片生成 | html2canvas | 分享图片生成 |
| 实时数据 | WebSocket/SSE | 排行榜实时更新 |
| 认证系统 | OAuth 2.0 | 微信/手机号登录 |

### 4.3 V2.0 技术方向

**目标：** 平台化，多客户端

| 技术点 | 方案 | 说明 |
|--------|------|------|
| 跨端方案 | React Native / Expo | iOS/Android 原生体验 |
| 数据同步 | CRDT / OT | 多端数据一致性 |
| 后端架构 |微服务/容器化 | 可扩展架构 |
| 数据安全 |端到端加密 | 隐私保护 |

---

## 五、技术决策记录（ADR）

### ADR-001: 状态管理选择 Zustand

**背景：** 需要轻量、易用的状态管理方案

**考虑选项：**
- Redux Toolkit: 生态成熟，但模板代码多
- Zustand: 轻量，无 Provider，TypeScript 友好
- Jotai: 原子化，适合复杂派生状态
- Context + useReducer: 原生，但性能差

**决策：** 选择 Zustand

**原因：**
1. 包体积极小（~1KB）
2. 无需 Provider 包裹，减少组件层级
3. TypeScript 支持开箱即用
4. 中间件生态丰富（persist 等）

**影响：** 团队需学习 Zustand API（简单）

---

### ADR-002: V1.0 存储使用 localStorage

**背景：** V1.0 为 MVP 阶段，需要简单可靠的存储方案

**考虑选项：**
- localStorage: 同步 API，简单易用，5MB 限制
- IndexedDB: 容量大，异步 API，复杂
- sessionStorage: 会话级，不适合持久化
- cookies: 容量小，每次请求携带

**决策：** 选择 localStorage

**原因：**
1. V1.0 数据量小（记录条数 < 1000）
2. 同步 API，代码简单，无需 async/await
3. 用户可方便地导入/导出/清除数据
4. 满足 MVP 验证需求

**限制：**
1. 5MB 容量上限（V1.0 足够）
2. 仅支持字符串（需 JSON 序列化）

**升级路径：** V1.1 迁移到 IndexedDB，提供数据迁移工具

**影响：** 后续版本需考虑数据迁移方案

---

### ADR-003: 样式方案使用 CSS Modules + CSS Variables

**背景：** 需要组件级样式隔离和主题能力

**考虑选项：**
- Tailwind CSS: 工具类，开发快，但类名冗长
- styled-components: CSS-in-JS，运行时开销
- CSS Modules: 原生，编译时处理，类型安全
- Vanilla Extract: 类型安全 CSS，但生态小

**决策：** 选择 CSS Modules + CSS Variables

**原因：**
1. CSS Modules 提供组件级样式隔离，无命名冲突
2. CSS Variables 支持运行时主题切换（深色模式预留）
3. 零运行时开销，原生浏览器支持
4. 与 TypeScript 配合良好（css-modules-typescript-loader）
5. 无需额外学习成本（标准 CSS）

**架构：**
- `index.css`: 全局样式 + CSS 变量定义
- `*.module.css`: 组件级样式
- CSS 变量分层：色彩/间距/圆角/字体

**影响：** 团队需遵循 CSS Modules 规范

---

## 六、附录

### 附录 A: 命名规范

#### 文件命名

| 类型 | 命名方式 | 示例 |
|------|----------|------|
| 组件文件 | PascalCase | `DrinkMate.tsx` |
| 样式文件 | camelCase + .module.css | `drinkRing.module.css` |
| 工具文件 | camelCase | `calculator.ts` |
| 类型文件 | camelCase | `drink.ts` |
| 常量文件 | UPPER_SNAKE_CASE | `constants.ts` |

#### 代码命名

| 类型 | 命名方式 | 示例 |
|------|----------|------|
| 组件 | PascalCase | `DrinkMate` |
| Hooks | camelCase + use 前缀 | `useDrinkStats` |
| 类型/接口 | PascalCase | `DrinkRecord` |
| 枚举 | PascalCase | `DrinkType` |
| 常量 | UPPER_SNAKE_CASE | `DAILY_LIMIT_MALE` |
| 变量/函数 | camelCase | `calculateAlcohol` |
| 布尔变量 | is/has/should 前缀 | `isLoading` |
| 事件处理 | handle 前缀 | `handleSubmit` |
| 异步函数 | 动词 + 名词 | `fetchRecords` |

### 附录 B: 项目脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist node_modules/.vite"
  }
}
```

### 附录 C: 依赖清单

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.0",
    "wouter": "^3.0.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

---

**文档结束**

---

> 💡 **使用提示：**
> - 本文档为技术总纲，实际开发前请根据当前版本创建对应的 Implementation Plan
> - 任何技术变更需先在本文档更新，再执行代码变更
> - V1.0 开发请参考「三、V1.0 MVP 详细技术方案」章节
