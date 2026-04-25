---
name: phase1-foundation-cleanup-planA
overview: 执行 Phase 1 底座收尾（方案A）：P1-T1 共享组件补齐 → P1-T2 剩余模块 CSS 硬编码清零 → P1-T7 项目详情 8 PMBOK 标签基础框架。
todos:
  - id: p1-t1-sidebar
    content: 补齐 AppSidebar 收起/展开交互与 collapsed 样式
    status: completed
  - id: p1-t1-header
    content: 补齐 PageHeader 面包屑与 dark 变体
    status: completed
  - id: p1-t1-statcard
    content: 补齐 StatCard delta 趋势、active 状态与点击筛选
    status: completed
  - id: p1-t1-tabnav
    content: 新增 TabNav 组件并接入 shared 导出
    status: completed
  - id: p1-t1-replace
    content: Use [subagent:code-explorer] 扫描并替换 personnel/task/procurement 等模块存量独立实现
    status: completed
    dependencies:
      - p1-t1-sidebar
      - p1-t1-header
      - p1-t1-statcard
      - p1-t1-tabnav
  - id: p1-t2-scan
    content: Use [subagent:code-explorer] 扫描 task/personnel/digital/procurement 等模块 CSS 硬编码色值
    status: completed
    dependencies:
      - p1-t1-replace
  - id: p1-t2-replace
    content: 自动化替换各模块 CSS 硬编码色值为 CSS 变量并验证 lint/build
    status: completed
    dependencies:
      - p1-t2-scan
  - id: p1-t7-tabs
    content: 搭建 8 个 PMBOK 标签组件壳子与独立数据加载
    status: completed
    dependencies:
      - p1-t1-tabnav
  - id: p1-t7-route
    content: 修改项目详情路由与工具函数支持领域标识
    status: completed
    dependencies:
      - p1-t7-tabs
---

## 产品概述

执行 development-plan-v1.2 中 Phase 1 的"方案A"——底座收尾优先，包含三个核心任务：P1-T1 共享组件补齐与存量替换、P1-T2 剩余模块 CSS 变量替换、P1-T7 项目详情页 PMBOK 8 标签基础框架。

## 核心功能

- P1-T1：补齐 AppSidebar 收起/展开交互与样式、PageHeader 面包屑与 dark 变体、StatCard delta 趋势与 active 状态；新增 TabNav 组件；按 personnel → task → digital → procurement → project → 其他顺序替换存量独立实现；删除废弃 Sidebar/StatsCards 文件
- P1-T2：在 project 模块已完成的基础上，清零 task、personnel、digital、procurement、standard、facility、contracts、customer、orders、resource 等模块 CSS/TSX 中的硬编码色值，统一使用 CSS 变量
- P1-T7：将项目详情页从 6 生命周期标签重构为 8 PMBOK 领域标签壳子（项目概览、范围与任务、进度管理、成本与采购、质量与验收、资源与人员、风险与沟通、设置与 Agent），修改路由与工具函数，标签切换独立加载数据

## Tech Stack Selection

- 前端框架：React 18.3 + TypeScript + Vite
- 样式系统：CSS 变量（`--pm-*`）+ 模块级 CSS 文件
- 状态管理：Zustand（已接入）
- 路由：Hash Router（保持现状）
- UI 组件：MUI v9（theme.ts 暗色玻璃态主题）
- 后端：Node.js + Express + SQLite + Prisma（已就绪）

## Implementation Approach

### 总体策略

按"组件 → CSS → 标签框架"的依赖顺序串行推进。P1-T1 完成后方可启动 P1-T2（避免组件替换与 CSS 重构冲突）；P1-T7 依赖 P1-T1 的 TabNav 组件。

### P1-T1 共享组件补齐

- AppSidebar：已有 `collapsed` prop，需补全 `.collapsed` 状态下的 CSS 样式（图标居中、文字隐藏/折叠、宽度收缩），补充收起/展开的过渡动画
- PageHeader：补全面包屑导航渲染逻辑（基于路由层级自动推导），新增 `variant` 属性支持 `dark` 变体（用于深色背景页头）
- StatCard：delta 区域支持趋势图标（上升/下降箭头）和趋势色调（正绿负红），active 状态增加边框/背景高亮，onClick 支持点击筛选回调
- TabNav：全新组件，支持水平标签栏、active 指示器、路由同步、disabled/隐藏状态，为项目详情 8 标签和后续工作台提供复用基础

### P1-T2 CSS 变量替换

- 在 `src/index.css` 已有的 `--pm-*` 变量基础上，为各模块新增缺失的语义化变量（如 `--pm-task-bg-*`、`--pm-procurement-border-*` 等）
- 编写 Python 自动化脚本扫描各模块 CSS/TSX 中的硬编码色值，批量生成变量定义和替换规则
- 保留 `index.css` 作为唯一变量定义源，各模块 CSS 只允许使用 `var()` 引用
- 验收标准：全局搜索 `#`、`rgba(`、`rgb(` 在 `.css` 文件中仅出现在 `index.css` 的变量定义区

### P1-T7 8 标签基础框架

- 在 `components/project/tabs/` 下新建 8 个标签组件，每个组件先提供加载状态、空态和基础占位布局
- 修改 `App.tsx` 中项目详情路由解析逻辑，支持 `#/projects/:code/:tab` 的领域标识
- 修改 `buildProjectDetailTabHash` 和 `isProjectDetailTab`，映射生命周期标识 → 领域标识
- 标签数据独立加载：每个标签激活时通过 `useEffect` 请求对应 API（或 localStorage fallback），避免一次性全量加载
- 权限控制：V1 先硬编码可见标签集合，V1.5 接入权限系统

### Performance & Reliability

- CSS 变量替换使用自动化脚本减少人工遗漏，替换后执行 `npm run lint` + `npm run build` 验证
- 标签框架采用懒加载模式，未激活标签不渲染内容，降低首屏 DOM 压力
- 组件替换遵循"先并行共存 → 验证稳定 → 删除旧代码"策略，避免一次性大面积替换导致回归困难

### Architecture Design

- 共享组件层：`components/shared/` 作为唯一共享组件来源，新增 `TabNav` 导出
- 导航层：`AppSidebar` + `PageHeader` + `TabNav` 覆盖全项目导航/页头/标签需求
- 样式层：`index.css` 作为单一变量定义源，各模块 CSS 零硬编码
- 项目详情层：`components/project/tabs/` 按 PMBOK 领域组织，与状态机正交

### Key Code Structures

```typescript
// TabNav 组件接口（新增）
interface TabNavItem {
  id: string
  label: string
  href?: string
  disabled?: boolean
  hidden?: boolean
  badge?: number
}
interface TabNavProps {
  tabs: TabNavItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
}

// 项目详情标签标识（修改）
type ProjectDetailTab =
  | 'overview' // 项目概览
  | 'scope' // 范围与任务
  | 'schedule' // 进度管理
  | 'cost' // 成本与采购
  | 'quality' // 质量与验收
  | 'resources' // 资源与人员
  | 'risk' // 风险与沟通
  | 'settings' // 设置与 Agent
```

## Directory Structure

```
src/
├── components/shared/
│   ├── navigation/AppSidebar/index.tsx          # [MODIFY] 补全 collapsed 状态样式
│   ├── navigation/PageHeader/index.tsx          # [MODIFY] 新增面包屑、dark 变体
│   ├── navigation/TabNav/                       # [NEW] 新增 TabNav 组件目录
│   │   ├── index.tsx
│   │   └── TabNav.css
│   ├── data-display/StatCard/index.tsx          # [MODIFY] 补全 delta 趋势、active 状态
│   └── index.ts                                 # [MODIFY] 导出 TabNav
├── components/project/
│   ├── tabs/                                    # [NEW] 8 个标签组件目录
│   │   ├── ProjectOverviewTab.tsx
│   │   ├── ProjectScopeTab.tsx
│   │   ├── ProjectScheduleTab.tsx
│   │   ├── ProjectCostTab.tsx
│   │   ├── ProjectQualityTab.tsx
│   │   ├── ProjectResourcesTab.tsx
│   │   ├── ProjectRiskTab.tsx
│   │   └── ProjectSettingsTab.tsx
│   ├── projectTabs.shared.ts                    # [MODIFY] 标签工具函数
│   └── project-detail.css                       # [已有] project 模块已变量化
├── components/task/                             # [MODIFY] 替换 TaskSidebar/StatsCards
├── components/personnel/                        # [MODIFY] 替换 Sidebar/StatsCards
├── components/digital/                          # [MODIFY] CSS 变量替换
├── components/procurement/                      # [MODIFY] CSS 变量替换 + 组件替换
├── components/standard/                         # [MODIFY] CSS 变量替换
├── components/facility/                         # [MODIFY] CSS 变量替换
├── components/customer/                         # [MODIFY] CSS 变量替换
├── components/orders/                           # [MODIFY] CSS 变量替换
├── components/resource/                         # [MODIFY] CSS 变量替换
├── components/contracts/                        # [MODIFY] CSS 变量替换
├── App.tsx                                      # [MODIFY] 项目详情路由 + 标签分发
├── config/routes.ts                             # [MODIFY] 新增/调整路由配置
└── index.css                                    # [MODIFY] 新增各模块 CSS 变量
```

## Implementation Notes

- **Grounded**：复用现有 `AppSidebar`、`StatCard`、`PageHeader` 的 props 设计和命名规范，新增 `TabNav` 参照现有导航组件风格
- **AI 编码红线**：`src/domain/`、`src/data/` 层禁止直接修改；状态机定义文件人工维护
- **Blast radius control**：P1-T1 组件替换时保留旧代码 1 个迭代周期，确认稳定后删除；P1-T2 每次只处理一个模块 CSS，替换后立即 `npm run lint`
- **CSS 变量命名**：沿用现有 `--pm-{模块}-{属性}` 前缀规范，新增变量按模块分组排列在 `index.css` 中
- **标签路由兼容**：`#/projects/:code/:tab` 的领域标识与旧生命周期标识做映射兼容，避免外部书签失效

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 在 P1-T1 组件替换阶段扫描全项目中的 Sidebar、StatsCards、Header 独立实现位置，确认替换目标和废弃文件清单；在 P1-T2 CSS 替换阶段扫描各模块 CSS/TSX 硬编码色值分布
- Expected outcome: 输出精确的替换文件清单和硬编码色值统计报告，确保无遗漏
