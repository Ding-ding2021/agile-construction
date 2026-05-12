---
id: DOC-00-COMPONENT-REFACTORING-PLAN
number: DEV-015
domain: development
category: refactor
title: 组件化重构实施计划
owner: docs-maintainer
status: active
last_updated: 2026-04-19
source_of_truth: true
related_code: []
related_docs:
  - docs/00-governance/design-specification.md
  - docs/00-governance/coding-standards.md
  - docs/00-governance/design-checklist.md
  - docs/03-engineering/development-guide.md
---

# 📦 组件化重构实施计划

**版本**: v1.0.0  
**创建日期**: 2026-04-19  
**预计周期**: 10-12 天  
**优先级**: P0（高优先级）  
**影响范围**: 全项目组件层

---

## 📋 目录

1. [背景与问题](#1-背景与问题)
2. [重构目标](#2-重构目标)
3. [组件架构设计](#3-组件架构设计)
4. [实施阶段](#4-实施阶段)
5. [风险控制](#5-风险控制)
6. [验收标准](#6-验收标准)
7. [回滚方案](#7-回滚方案)

---

## 1. 背景与问题

### 1.1 问题汇总

经过对现有代码和设计规范的全面分析，发现以下核心问题：

#### ❌ 问题 1：侧边栏存在 5 套独立实现（违反开发指南 §6.4）

| 文件                                     | 类名前缀   | 导航项数 | isActive 逻辑复杂度   |
| ---------------------------------------- | ---------- | -------- | --------------------- |
| `layout/Sidebar.tsx`                     | `sidebar-` | 13项     | 嵌套三元（~25行）     |
| `personnel/Sidebar.tsx`                  | `pm-`      | 14项     | 逐项 boolean（~15行） |
| `task/TaskSidebar.tsx`                   | `tm-`      | ~12项    | 独立实现              |
| `digital/DigitalEmployeePage.tsx` 内嵌   | `de-`      | 12项     | 嵌套三元（~25行）     |
| `digital/EngineerAssistantPage.tsx` 内嵌 | `de-`      | 14项     | 嵌套三元（~25行）     |

**影响**：

- 新增路由需同步修改 5 个文件
- `navigateByHash` 函数重复 5 次
- `isActive` 逻辑分散，易出现不一致（已发生路由跳转错误）

**规范要求**（开发指南 §6.4）：

> 侧边栏统一使用公共组件，禁止在业务页面中新增 `*-sidebar` 的独立结构和样式副本。

---

#### ❌ 问题 2：统计卡片存在 7+ 套独立实现

| 文件                       | 类名            | 功能支持     |
| -------------------------- | --------------- | ------------ |
| `personnel/StatsCards.tsx` | `pm-stat-card`  | 仅展示       |
| `task/TaskStatsCards.tsx`  | `tm-stat-card`  | 支持点击筛选 |
| `procurement` 内嵌         | `pcm-stat-card` | 仅展示       |
| `digital` 内嵌             | `de-stat-card`  | 仅展示       |
| `customer` 内嵌            | `cm-stat-card`  | 仅展示       |
| `orders` 内嵌              | `om-stat-card`  | 仅展示       |
| `project` 内嵌             | `stat-card`     | 仅展示       |

**影响**：

- 每个页面都有一套统计卡片逻辑
- 功能无法复用（如点击筛选、delta 显示）
- 样式不一致（不同模块使用不同色调系统）

---

#### ❌ 问题 3：页头存在 3 套独立实现

| 文件                                   | 类名        | Props 差异 |
| -------------------------------------- | ----------- | ---------- |
| `layout/Header.tsx`                    | `pm-header` | 简单版本   |
| `layout/UnifiedHeader.tsx`             | `pm-header` | 支持搜索   |
| `digital/DigitalEmployeePage.tsx` 内嵌 | `de-header` | 独立实现   |

**规范要求**（开发指南 §6.4）：

> 页头统一使用 `UnifiedHeader`，通过 `title/subtitle/searchPlaceholder` 传入页面差异。

---

#### ❌ 问题 4：CSS 变量体系未统一使用

`src/index.css` 已定义 `--pm-*` 变量（与设计规范一致），但各模块 CSS 中大量硬编码：

| 模块        | CSS 文件                            | 硬编码示例                      |
| ----------- | ----------------------------------- | ------------------------------- |
| digital     | `digital-employee-page.css` (17KB)  | `#051338`, `rgba(10,35,99,0.9)` |
| procurement | `procurement-management.css` (10KB) | `#051338`, `rgba(10,35,99,0.9)` |
| project     | `project-detail.css` (43KB)         | 大量硬编码色值                  |

**规范要求**（设计规范 §六.2）：

> 提取公共样式到设计系统，使用 CSS 变量定义颜色、间距，避免内联样式。

---

#### ❌ 问题 5：路由配置分散

- 路由 hash 常量定义在 `App.tsx`（~15 个）
- `readRouteFromHash` 路由解析逻辑在 `App.tsx`（~120行）
- `isActive` 逻辑在 5 个侧边栏文件中各有一套
- 新增路由需修改 3+ 处

---

### 1.2 现状量化统计

| 指标                      | 当前状态     |
| ------------------------- | ------------ |
| 侧边栏实现数              | **5 套**     |
| 统计卡片实现数            | **7+ 套**    |
| 页头实现数                | **3 套**     |
| `navigateByHash` 重复次数 | **5 次**     |
| `isActive` 逻辑副本数     | **5 个**     |
| CSS 硬编码色值数          | **~200+ 处** |
| 新增路由需修改文件数      | **5-6 个**   |
| 新增页面开发耗时          | **~4 小时**  |

---

## 2. 重构目标

### 2.1 定量目标

| 指标               | 当前   | 目标         | 改善幅度 |
| ------------------ | ------ | ------------ | -------- |
| 侧边栏实现数       | 5套    | **1套**      | ↓80%     |
| 统计卡片实现数     | 7+套   | **1套**      | ↓85%     |
| 页头实现数         | 3套    | **1套**      | ↓66%     |
| CSS 硬编码色值     | ~200+  | **0**        | ↓100%    |
| 新增路由修改文件数 | 5-6个  | **1个**      | ↓83%     |
| 新增页面开发耗时   | ~4小时 | **~1.5小时** | ↓62%     |
| 组件复用率         | ~20%   | **>60%**     | ↑200%    |

### 2.2 定性目标

1. **遵循设计规范**：所有组件严格遵循 `design-specification.md` 定义的设计系统
2. **遵循代码规范**：符合 `coding-standards.md` 的代码组织与命名规范
3. **单一数据源**：路由配置、导航配置、设计令牌统一管理
4. **组件可测试**：每个通用组件都有对应的测试用例
5. **向后兼容**：重构过程中不影响现有功能

---

## 3. 组件架构设计

### 3.1 新目录结构

```
src/
├── components/
│   ├── shared/                    # 🆕 全局共享组件层
│   │   ├── navigation/
│   │   │   ├── AppSidebar/        # 统一侧边栏
│   │   │   │   ├── AppSidebar.tsx
│   │   │   │   ├── AppSidebar.types.ts
│   │   │   │   ├── AppSidebar.module.css
│   │   │   │   └── index.ts
│   │   │   ├── PageHeader/        # 统一页头
│   │   │   │   ├── PageHeader.tsx
│   │   │   │   ├── PageHeader.types.ts
│   │   │   │   └── index.ts
│   │   │   └── navConfig.ts       # 🆕 导航配置（唯一维护点）
│   │   │
│   │   ├── data-display/
│   │   │   ├── StatCard/          # 统一统计卡片
│   │   │   │   ├── StatCard.tsx
│   │   │   │   ├── StatCard.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── Card/              # 标准卡片容器
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── CardHeader.tsx
│   │   │   │   └── index.ts
│   │   │   └── TabNav/            # 统一标签导航
│   │   │       ├── TabNav.tsx
│   │   │       └── index.ts
│   │   │
│   │   └── forms/
│   │       ├── SearchBox/         # 统一搜索框
│   │       │   ├── SearchBox.tsx
│   │       │   └── index.ts
│   │       └── Button/            # 统一按钮
│   │           ├── Button.tsx
│   │           └── index.ts
│   │
│   ├── layout/                    # 🔄 简化，只保留布局容器
│   │   ├── AppLayout.tsx          # 🆕 应用主布局
│   │   └── index.ts
│   │
│   ├── modules/                   # 🔄 重命名自现有 modules
│   │   ├── project/               # 项目管理模块
│   │   ├── task/                  # 任务管理模块
│   │   ├── personnel/             # 人员管理模块
│   │   ├── procurement/           # 采购管理模块
│   │   ├── digital/               # 数字员工模块
│   │   └── ...
│   │
│   └── [其他保持不变]
│
├── config/                        # 🆕 全局配置
│   ├── routes.ts                  # 🆕 路由配置（唯一维护点）
│   └── theme.ts                   # 🆕 主题配置
│
├── styles/                        # 🆕 样式系统
│   ├── tokens/                    # 设计令牌
│   │   ├── colors.css             # 颜色变量
│   │   ├── spacing.css            # 间距变量
│   │   ├── typography.css         # 字体变量
│   │   └── shadows.css            # 阴影变量
│   └── index.css                  # 统一入口（合并现有 index.css）
│
└── [其他保持不变]
```

### 3.2 核心组件设计

#### 3.2.1 AppSidebar（统一侧边栏）

**职责**：

- 渲染全局导航菜单
- 处理路由跳转
- 管理激活状态

**Props 接口**：

```typescript
interface AppSidebarProps {
  /** 当前路由 hash（由父组件传入） */
  currentHash: string
  /** 导航项配置（默认使用 navConfig） */
  navItems?: NavItem[]
  /** 收起/展开状态 */
  collapsed?: boolean
  /** 收起/展开回调 */
  onCollapseChange?: (collapsed: boolean) => void
}

interface NavItem {
  label: string
  icon: string
  href?: string
  /** 匹配策略：exact=精确匹配，prefix=前缀匹配（含子路由） */
  matchStrategy?: 'exact' | 'prefix'
  /** 是否禁用 */
  disabled?: boolean
}
```

**实现要点**：

```typescript
// isActive 逻辑统一处理
const isItemActive = (href: string, currentHash: string, strategy: 'exact' | 'prefix'): boolean => {
  if (strategy === 'prefix') {
    return currentHash === href || currentHash.startsWith(`${href}/`)
  }
  return currentHash === href
}

// 路由跳转统一处理
const navigateByHash = (targetHash: string): void => {
  if (!targetHash.startsWith('#/')) return
  if (window.location.hash !== targetHash) {
    window.location.hash = targetHash
  } else {
    const baseUrl = `${window.location.pathname}${window.location.search}`
    window.location.assign(`${baseUrl}${targetHash}`)
  }
}
```

---

#### 3.2.2 PageHeader（统一页头）

**职责**：

- 渲染页面标题和副标题
- 提供搜索功能
- 显示用户信息

**Props 接口**：

```typescript
interface PageHeaderProps {
  /** 页面主标题 */
  title: string
  /** 页面副标题 */
  subtitle?: string
  /** 搜索查询值 */
  searchQuery?: string
  /** 搜索变更回调 */
  onSearchChange?: (query: string) => void
  /** 搜索框占位符 */
  searchPlaceholder?: string
  /** 变体：standard（标准）/ dark（深色，适配 digital 模块） */
  variant?: 'standard' | 'dark'
  /** 面包屑导航 */
  breadcrumb?: Array<{ label: string; href?: string }>
  /** 额外内容（右侧） */
  extra?: React.ReactNode
}
```

---

#### 3.2.3 StatCard（统一统计卡片）

**职责**：

- 展示统计数据
- 支持点击交互
- 支持变化趋势显示

**Props 接口**：

```typescript
type StatCardTone = 'blue' | 'green' | 'purple' | 'orange' | 'red'

interface StatCardProps {
  /** 图标文件名（SVG） */
  icon: string
  /** 指标标签 */
  label: string
  /** 指标值 */
  value: string | number
  /** 辅助说明（如"满意度 4.8/5"） */
  subLabel?: string
  /** 变化量（如"+12%"） */
  delta?: string
  /** 变化图标 */
  deltaIcon?: string
  /** 色调 */
  tone: StatCardTone
  /** 是否激活（点击筛选时高亮） */
  active?: boolean
  /** 点击回调 */
  onClick?: () => void
  /** 图标资源路径前缀 */
  assetBase?: string
}
```

---

#### 3.2.4 路由配置集中化

**文件**：`src/config/routes.ts`

```typescript
/** 路由匹配策略 */
export type MatchStrategy = 'exact' | 'prefix'

/** 路由配置接口 */
export interface RouteConfig {
  /** 路由 hash */
  hash: string
  /** 匹配策略 */
  matchStrategy: MatchStrategy
  /** 页面名称（用于 App.tsx 路由解析） */
  pageName: string
}

/** 全局路由配置表（唯一维护点） */
export const ROUTES: Record<string, RouteConfig> = {
  projects: { hash: '#/projects', matchStrategy: 'prefix', pageName: 'projects' },
  tasks: { hash: '#/tasks', matchStrategy: 'prefix', pageName: 'tasks' },
  customers: { hash: '#/customers', matchStrategy: 'prefix', pageName: 'customers' },
  procurement: { hash: '#/procurement', matchStrategy: 'prefix', pageName: 'procurement' },
  contracts: { hash: '#/contracts', matchStrategy: 'prefix', pageName: 'contracts' },
  orders: { hash: '#/orders', matchStrategy: 'prefix', pageName: 'orders' },
  facility: { hash: '#/facility', matchStrategy: 'prefix', pageName: 'facility' },
  resources: { hash: '#/resources', matchStrategy: 'prefix', pageName: 'resources' },
  personnel: { hash: '#/personnel', matchStrategy: 'prefix', pageName: 'personnel' },
  settings: { hash: '#/settings', matchStrategy: 'exact', pageName: 'settings' },
  standards: { hash: '#/standards', matchStrategy: 'prefix', pageName: 'standards' },
  digitalEmployee: {
    hash: '#/digital-employee',
    matchStrategy: 'exact',
    pageName: 'digital-employee',
  },
  engineerAssistant: {
    hash: '#/engineer-assistant',
    matchStrategy: 'exact',
    pageName: 'engineer-assistant',
  },
} as const

/** 导航项配置（由路由配置自动生成） */
export const NAV_ITEMS = [
  { label: '工作台', icon: '47.svg' },
  { label: '数据中心', icon: '48.svg' },
  { label: '项目管理', icon: '49.svg', href: ROUTES.projects.hash },
  { label: '任务管理', icon: '50.svg', href: ROUTES.tasks.hash },
  { label: '客户管理', icon: '51.svg', href: ROUTES.customers.hash },
  { label: '合同结算', icon: '52.svg', href: ROUTES.contracts.hash },
  { label: '采购管理', icon: '53.svg', href: ROUTES.procurement.hash },
  { label: '订单管理', icon: '54.svg', href: ROUTES.orders.hash },
  { label: '设施管理', icon: '55.svg', href: ROUTES.facility.hash },
  { label: '标准管理', icon: '56.svg', href: ROUTES.standards.hash },
  { label: '人员管理', icon: '57.svg', href: ROUTES.personnel.hash },
  { label: '数字员工', icon: '58.svg', href: ROUTES.digitalEmployee.hash },
  { label: '工程师助手', icon: '58.svg', href: ROUTES.engineerAssistant.hash },
  { label: '系统设置', icon: '59.svg', href: ROUTES.settings.hash },
]
```

---

## 4. 实施阶段

### 阶段一：基础设施准备（1-2 天）

#### 任务 1.1：补齐 CSS 设计令牌

**目标**：确保 `src/index.css` 包含设计规范定义的所有 CSS 变量

**执行清单**：

- [ ] 补充 `--pm-radius-*` 变量（5个）
- [ ] 补充 `--pm-shadow-*` 变量（4个）
- [ ] 补充 `--pm-font-*` 变量（6个）
- [ ] 补充 `--pm-primary-light/dark` 变量
- [ ] 补充 `--pm-border-light` 变量
- [ ] 补充 `--pm-gap-*` 变量（5个）
- [ ] 补充 `--pm-margin-*` 变量（5个）
- [ ] 补充功能色 `--pm-blue-light`、`--pm-green-light`、`--pm-purple-light`

**验收标准**：

- `index.css` 包含设计规范 §1.1-1.5 定义的所有变量
- 变量值与设计规范完全一致
- 通过 `npm run lint` 检查

---

#### 任务 1.2：创建全局配置层

**目标**：创建 `src/config/` 目录，集中管理路由配置

**执行清单**：

- [ ] 创建 `src/config/routes.ts`
- [ ] 迁移 `App.tsx` 中的路由 hash 常量到 `routes.ts`
- [ ] 创建 `NAV_ITEMS` 导航配置
- [ ] 创建 `isRouteActive()` 工具函数
- [ ] 创建 `navigateByHash()` 工具函数
- [ ] 更新 `App.tsx` 引用新的路由配置

**验收标准**：

- `routes.ts` 包含所有 13+ 路由配置
- `App.tsx` 的 `readRouteFromHash` 函数引用 `ROUTES` 配置
- 现有路由跳转功能正常

---

#### 任务 1.3：创建共享组件目录

**目标**：建立 `src/components/shared/` 目录结构

**执行清单**：

- [ ] 创建 `src/components/shared/` 目录
- [ ] 创建 `navigation/` 子目录
- [ ] 创建 `data-display/` 子目录
- [ ] 创建 `forms/` 子目录
- [ ] 创建各组件的 `.ts` / `.tsx` / `.css` 文件骨架

---

### 阶段二：核心组件开发（3-4 天）

#### 任务 2.1：开发 AppSidebar 组件

**目标**：创建统一侧边栏组件，替代 5 套独立实现

**执行清单**：

- [ ] 实现 `AppSidebar.tsx` 组件
- [ ] 实现 `AppSidebar.types.ts` 类型定义
- [ ] 实现 `AppSidebar.module.css` 样式（使用 `--pm-*` 变量）
- [ ] 集成 `navConfig.ts` 导航配置
- [ ] 实现 `isActive` 逻辑（引用 `routes.ts`）
- [ ] 实现 `navigateByHash` 跳转逻辑
- [ ] 添加收起/展开功能
- [ ] 编写单元测试

**验收标准**：

- 组件支持所有 14 个导航项
- `isActive` 逻辑与路由配置一致
- 路由跳转功能正常
- 通过视觉回归测试（对比现有侧边栏）

---

#### 任务 2.2：开发 PageHeader 组件

**目标**：创建统一页头组件，替代 3 套独立实现

**执行清单**：

- [ ] 实现 `PageHeader.tsx` 组件
- [ ] 实现 `PageHeader.types.ts` 类型定义
- [ ] 实现 `PageHeader.module.css` 样式
- [ ] 支持 `standard` 和 `dark` 两种变体
- [ ] 支持搜索功能
- [ ] 支持面包屑导航
- [ ] 编写单元测试

**验收标准**：

- 兼容现有 `UnifiedHeader` 的所有功能
- 支持 Digital Employee 的深色主题
- 搜索功能正常
- 通过视觉回归测试

---

#### 任务 2.3：开发 StatCard 组件

**目标**：创建统一统计卡片组件，替代 7+ 套独立实现

**执行清单**：

- [ ] 实现 `StatCard.tsx` 组件
- [ ] 实现 `StatCard.types.ts` 类型定义
- [ ] 实现 `StatCard.module.css` 样式
- [ ] 支持 5 种 tone（blue/green/purple/orange/red）
- [ ] 支持点击交互（active 状态）
- [ ] 支持 delta 显示（变化趋势）
- [ ] 支持 subLabel（辅助说明）
- [ ] 编写单元测试

**验收标准**：

- 组件支持所有现有统计卡片的功能
- 5 种色调正确显示
- 点击交互正常
- 通过视觉回归测试

---

#### 任务 2.4：开发 TabNav 组件

**目标**：创建统一标签导航组件

**执行清单**：

- [ ] 实现 `TabNav.tsx` 组件
- [ ] 实现 `TabNav.types.ts` 类型定义
- [ ] 实现 `TabNav.module.css` 样式
- [ ] 支持图标 + 文字模式
- [ ] 支持激活状态
- [ ] 支持点击切换
- [ ] 编写单元测试

---

### 阶段三：渐进式替换（3-4 天）

#### 任务 3.1：替换侧边栏

**目标**：逐个模块替换旧侧边栏为 `AppSidebar`

**执行顺序**：

1. **personnel 模块**（影响最小）
   - [ ] 更新 `PersonnelPage.tsx` 使用 `AppSidebar`
   - [ ] 删除 `personnel/Sidebar.tsx`
   - [ ] 删除 `personnel` 相关 CSS
   - [ ] 测试 personnel 路由跳转

2. **task 模块**
   - [ ] 更新 `TaskManagementPage.tsx` 使用 `AppSidebar`
   - [ ] 删除 `task/TaskSidebar.tsx`
   - [ ] 测试 task 路由跳转

3. **digital 模块**
   - [ ] 更新 `DigitalEmployeePage.tsx` 使用 `AppSidebar`
   - [ ] 更新 `EngineerAssistantPage.tsx` 使用 `AppSidebar`
   - [ ] 删除内嵌侧边栏代码
   - [ ] 测试 digital 路由跳转

4. **procurement 模块**
   - [ ] 更新 `ProcurementManagementPage.tsx` 使用 `AppSidebar`
   - [ ] 测试 procurement 路由跳转

5. **layout 模块**
   - [ ] 更新 `layout/Sidebar.tsx`（标记为 deprecated）
   - [ ] 保留 1 周后删除

**验收标准**：

- 所有模块侧边栏功能正常
- 路由跳转无错误
- 激活状态正确
- 无遗留的旧侧边栏代码

---

#### 任务 3.2：替换页头

**目标**：逐个模块替换旧页头为 `PageHeader`

**执行顺序**：

1. **project 模块**
   - [ ] 更新 `ProjectManagementPage.tsx` 使用 `PageHeader`
   - [ ] 测试搜索功能

2. **personnel 模块**
   - [ ] 更新 `PersonnelPage.tsx` 使用 `PageHeader`

3. **task 模块**
   - [ ] 更新 `TaskManagementPage.tsx` 使用 `PageHeader`

4. **digital 模块**
   - [ ] 更新 `DigitalEmployeePage.tsx` 使用 `PageHeader`（dark 变体）
   - [ ] 更新 `EngineerAssistantPage.tsx` 使用 `PageHeader`（dark 变体）

5. **其他模块**
   - [ ] procurement / customer / orders / facility / resource / standard

**验收标准**：

- 所有模块页头功能正常
- 搜索功能正常
- dark 变体适配正确

---

#### 任务 3.3：替换统计卡片

**目标**：逐个模块替换旧统计卡片为 `StatCard`

**执行顺序**：

1. **personnel 模块**
   - [ ] 更新 `StatsCards.tsx` 使用 `StatCard`
   - [ ] 验证显示效果

2. **task 模块**
   - [ ] 更新 `TaskStatsCards.tsx` 使用 `StatCard`
   - [ ] 验证点击筛选功能

3. **procurement 模块**
   - [ ] 更新内嵌统计卡片使用 `StatCard`

4. **digital 模块**
   - [ ] 更新内嵌统计卡片使用 `StatCard`

5. **其他模块**
   - [ ] customer / orders / project 等

**验收标准**：

- 所有统计卡片显示正常
- 点击交互功能正常
- 色调系统一致

---

#### 任务 3.4：CSS 变量迁移

**目标**：将各模块硬编码色值迁移到 `--pm-*` 变量

**执行顺序**：

1. **digital 模块**（17KB CSS）
   - [ ] 替换 `#051338` → `var(--pm-bg)`
   - [ ] 替换 `rgba(10,35,99,0.9)` → `var(--pm-sidebar-bg)`
   - [ ] 替换所有文字颜色 → `var(--pm-text-*)`
   - [ ] 替换所有圆角 → `var(--pm-radius-*)`
   - [ ] 替换所有间距 → `var(--pm-spacing-*)`

2. **procurement 模块**（10KB CSS）
   - [ ] 同上迁移流程

3. **project 模块**（43KB CSS）
   - [ ] 同上迁移流程（工作量最大）

4. **其他模块**
   - [ ] task / personnel / customer / orders / facility / resource / standard

**验收标准**：

- 所有 CSS 文件无硬编码色值
- 视觉效果与原设计一致
- 通过视觉回归测试

---

### 阶段四：清理与优化（2 天）

#### 任务 4.1：删除废弃代码

**执行清单**：

- [ ] 删除 `layout/Sidebar.tsx`
- [ ] 删除 `layout/Header.tsx`（如已完全被 `PageHeader` 替代）
- [ ] 删除 `personnel/Sidebar.tsx`
- [ ] 删除 `task/TaskSidebar.tsx`
- [ ] 删除 `personnel/Tabs.tsx`（如已完全被 `TabNav` 替代）
- [ ] 删除 `personnel/StatsCards.tsx`（如已完全被 `StatCard` 替代）
- [ ] 删除 `task/TaskStatsCards.tsx`（如已完全被 `StatCard` 替代）
- [ ] 清理未使用的 CSS 文件

**验收标准**：

- 项目可正常构建
- 无编译错误
- 无 TypeScript 类型错误

---

#### 任务 4.2：性能优化

**执行清单**：

- [ ] 为共享组件添加 `React.memo`
- [ ] 检查并优化 `useMemo` / `useCallback` 使用
- [ ] 验证组件懒加载（`React.lazy`）
- [ ] 检查 bundle 大小变化
- [ ] 优化 CSS 文件大小

---

#### 任务 4.3：文档更新

**执行清单**：

- [ ] 更新 `design-specification.md`（如需要）
- [ ] 更新 `coding-standards.md`（如需要）
- [ ] 更新 `development-guide.md`
- [ ] 创建组件使用文档（README）
- [ ] 更新本计划文档状态为 `active`

---

## 5. 风险控制

### 5.1 风险识别

| 风险                   | 概率 | 影响 | 缓解措施                                |
| ---------------------- | ---- | ---- | --------------------------------------- |
| 组件替换后功能异常     | 中   | 高   | 每个模块替换后立即测试；保留旧代码 1 周 |
| CSS 变量迁移后样式差异 | 中   | 中   | 使用视觉回归测试工具对比                |
| 路由配置迁移后跳转错误 | 低   | 高   | 逐个路由验证；保留防再犯检查清单        |
| 重构周期超出预期       | 中   | 中   | 分阶段实施；每阶段设定明确里程碑        |
| 团队成员不熟悉新组件   | 低   | 中   | 提供组件使用文档和示例                  |

### 5.2 回滚策略

**每个阶段完成后执行**：

1. 提交 Git commit（带明确描述）
2. 执行 `npm run build` 验证构建
3. 执行 `npm run lint` 验证代码质量
4. 手动验证核心功能（路由跳转、搜索、筛选）

**紧急回滚**：

- 如发现严重 bug，回滚到上一个稳定的 Git commit
- 保留旧组件代码 1 周，确认新组件稳定后再删除

---

## 6. 验收标准

### 6.1 功能验收

- [ ] 所有页面侧边栏正常显示和跳转
- [ ] 所有页面页头正常显示
- [ ] 搜索功能正常工作
- [ ] 统计卡片点击筛选功能正常
- [ ] 标签页切换功能正常
- [ ] 路由跳转无错误（验证防再犯检查清单）

### 6.2 代码质量验收

- [ ] `npm run build` 无错误
- [ ] `npm run lint` 无错误
- [ ] TypeScript 类型检查通过
- [ ] 组件单元测试覆盖率 >80%
- [ ] 无 ESLint 警告

### 6.3 设计验收

- [ ] 所有组件使用 `--pm-*` CSS 变量
- [ ] 无硬编码色值、间距值、圆角值
- [ ] 视觉效果与设计规范一致
- [ ] 通过视觉回归测试

### 6.4 性能验收

- [ ] Bundle 大小不增加（或增加 <5%）
- [ ] 首屏加载时间不增加
- [ ] 组件重渲染次数不增加

---

## 7. 回滚方案

### 7.1 Git 分支策略

```
main
├── refactor/shared-components          # 阶段一、二
├── refactor/replace-sidebars           # 阶段三.1
├── refactor/replace-headers            # 阶段三.2
├── refactor/replace-statcards          # 阶段三.3
└── refactor/css-migration              # 阶段三.4
```

### 7.2 回滚步骤

**如需回滚某个阶段**：

1. `git revert <commit-hash>` 撤销该阶段的 commit
2. 验证构建和功能
3. 重新评估问题并调整方案

**完全回滚**：

1. `git checkout main`
2. `git branch -D refactor/*`（删除所有重构分支）
3. 恢复到重构前状态

---

## 8. 附录

### 8.1 相关文件清单

**需要修改的文件**：

- `src/index.css`（补充 CSS 变量）
- `src/App.tsx`（路由解析逻辑）
- `src/components/layout/Sidebar.tsx`（最终删除）
- `src/components/layout/Header.tsx`（最终删除）
- `src/components/layout/UnifiedHeader.tsx`（最终删除）
- `src/components/personnel/Sidebar.tsx`（最终删除）
- `src/components/task/TaskSidebar.tsx`（最终删除）
- `src/components/digital/DigitalEmployeePage.tsx`（移除内嵌侧边栏）
- `src/components/digital/EngineerAssistantPage.tsx`（移除内嵌侧边栏）
- 各模块内嵌统计卡片文件

**需要创建的文件**：

- `src/config/routes.ts`
- `src/components/shared/navigation/AppSidebar/*`
- `src/components/shared/navigation/PageHeader/*`
- `src/components/shared/data-display/StatCard/*`
- `src/components/shared/data-display/TabNav/*`
- `src/components/shared/forms/SearchBox/*`

### 8.2 参考文档

- [设计规范](../00-governance/design-specification.md)
- [代码规范](../00-governance/coding-standards.md)
- [UI 组件开发检查清单](../00-governance/design-checklist.md)
- [开发指南](../03-engineering/development-guide.md)

---

**文档维护**: AI Agent  
**下次评审**: 2026-04-26  
**实施负责人**: [待定]  
**预计开始日期**: [待定]
