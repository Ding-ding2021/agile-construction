---
id: SPEC-SHADCN-MERGE
title: shadcn 前端统一迁移 — 设计文档
owner: docs-maintainer
status: draft
last_updated: 2026-05-06
source_of_truth: true
related_docs:
  - docs/01-product/design-spec-v2-shadcn.md
  - docs/00-governance/coding-standards.md
  - docs/03-engineering/development-guide.md
---

# shadcn 前端统一迁移 — 设计文档

## 背景

项目存在双前端栈：
- **`src/`**（MUI v9）— 200+ 文件，功能完整但标记为维护模式
- **`src-next/`**（shadcn/ui + Tailwind v4）— 80+ 文件，活跃开发但未接入根项目管线

当前分支 `feat/design-system-components` 积累了 13 个提交（vs origin/main），包含设计规范组件实例化、Task Center Phase 3 等。

## 目标

1. 将 `src-next/`（shadcn）内容迁移到 `src/`，与现有 MUI 共存运行
2. 统一数据层为 Zustand + Repository 模式（复用 `src/services/repositories/`）
3. 统一路由为 React Router v7 BrowserRouter
4. 在此过程中逐步梳理各功能模块需求，用 shadcn 重写页面，MUI 暂不删除

## 非目标

- 不改后端（`local-api/`）架构
- 不改数据库 Schema
- 不引入新的状态管理库
- **不移除 MUI** — shadcn 与 MUI 在 `src/` 中共存，MUI 页面按原样运行

---

## 技术架构

### 目标架构

```
┌─────────────────────────────────────────────────────────┐
│  src/  （合并后的单一前端，MUI + shadcn 共存）             │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Components                                     │    │
│  │  ├── ui/             shadcn 组件库（新增）        │    │
│  │  ├── task/           MUI 版任务组件（保留）       │    │
│  │  ├── personnel/      MUI 版人员组件（保留）       │    │
│  │  ├── procurement/    MUI 版采购组件（保留）       │    │
│  │  ├── pages/          shadcn 版页面（新增）        │    │
│  │  └── shared/         共享业务组件                 │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │  State Management（ZuStand + persist）           │    │
│  │  └── src/store/projectStore.ts                   │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Services（Repository 模式）                      │    │
│  │  ├── repositories/   project/task/personnel/...  │    │
│  │  └── api/            client + serverAdapter      │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Domain（纯领域逻辑，MUI/shadcn 共用）             │    │
│  │  ├── projectStatusMachine.ts                     │    │
│  │  └── workItem.ts                                 │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  local-api/ （Node.js + Express + SQLite + Prisma）      │
└─────────────────────────────────────────────────────────┘
```

### 核心决策

| 决策 | 选项 | 理由 |
|------|------|------|
| UI 库 | shadcn/ui + Tailwind v4 | 用户选择，编码规范 §10.2 已定义 |
| 状态管理 | ZuStand + persist（复用） | 减少迁移范围，Repository 层已有大量基础设施 |
| 路由 | React Router v7 BrowserRouter | URL 更干净，与 shadcn 生态一致 |
| 数据获取 | Repository 模式（API 优先 + localStorage 降级） | 现有模式成熟，`src-next/services/api.ts` 适配 |
| 样式 | Tailwind v4 + oklch 色值 | 设计规范 v2 指定 |
| 字体 | Inter（UI 正文） | 移除品牌字体依赖（优设标题黑/阿里巴巴普惠体） |

---

## 数据架构

### 数据流

```
组件（pages/）
  │ 调用
  ▼
自定义 Hooks（hooks/）
  │ 读写
  ▼
ZuStand Store（store/projectStore.ts）
  │ 调用
  ▼
Repository 层（services/repositories/）
  │ fetch / localStorage
  ▼
local-api 后端（Express + Prisma + SQLite）
```

### 数据模型继承

`src/` 中定义的数据模型全部保留，在 `src-next/` 页面中复用：

| 模型 | 路径 | 用途 |
|------|------|------|
| `ProjectItem` | `src/data/projects.ts` | 项目数据模型 |
| `TaskItem` | `src/components/task/taskManagement.types.ts` | 任务数据模型 |
| 状态机 | `src/domain/projectStatusMachine.ts` | 项目状态流转守卫 |
| Repository | `src/services/repositories/*.ts` | 数据 CRUD 抽象 |

### `src-next/services/api.ts` 适配

`src-next/services/api.ts` 当前使用独立 fetch 封装。迁移后改为调用 `src/services/api/client.ts`，通过 Repository 层统一数据入口。

---

## 分阶段实施计划

### 阶段 1：基础设施统一

**目标**：清除双栈痕迹，`src-next/` 内容迁移到 `src/`，根工具链覆盖。

| 任务 | 内容 | 文件变更估算 |
|------|------|-------------|
| 1.1 清理冗余 | 删除 `@/` 空壳目录（已由 shadcn 覆盖） | -10 文件 |
| 1.2 新增依赖 | 将 `src-next/package.json` 中 shadcn/Tailwind 相关依赖合并到根 `package.json` | 1 文件 |
| 1.3 迁移 shadcn | `src-next/components/ui/` → `src/components/ui/` | +30 文件 |
| 1.4 迁移样式 | `src-next/index.css` + Tailwind 配置 → `src/` | 2 文件 |
| 1.5 适配字体 | 新增 Inter 字体，保留品牌字体 | 1 文件 |
| 1.6 路由重配 | BrowserRouter 替换 Hash 路由 | 2 文件 |
| 1.7 构建配置 | 更新 `vite.config.ts`、`tsconfig`、`eslint` | 3 文件 |
| 1.8 拆除 src-next | 删除 `src-next/` 目录（内容已迁移） | — |
| 1.9 AGENTS.md | 更新架构速查表，标注 MUI + shadcn 共存状态 | 1 文件 |

### 阶段 2：数据层对接

**目标**：`src-next/` 自定义 hooks 对接 ZuStand + Repository。

| 任务 | 内容 |
|------|------|
| 2.1 适配 `useTaskDetail` | 从独立 fetch 切换到 Repository |  
| 2.2 适配任务 CRUD | 对接 `taskRepository.ts` |
| 2.3 类型对齐 | 确保 `src-next/types/task.ts` 与 `src/` 类型定义一致 |
| 2.4 移除 Redux | 替换 `react-redux` 依赖为 ZuStand |

### 阶段 3：Tasks 模块迁移

**目标**：Task Center（看板/树/日历/详情）完整迁移到 shadcn。

| 任务 | 内容 |
|------|------|
| 3.1 TaskListPage | 从 `src-next/pages/tasks/` 迁移 |
| 3.2 KanbanView | 看板组件 + @dnd-kit 拖拽 |
| 3.3 TaskTreeView | 子树展开组件 |
| 3.4 TaskDetailPage | 详情 Sheet + Tabs 组件 |
| 3.5 CalendarView | 日历视图 |
| 3.6 需求梳理 | 逐组件验证功能完整性，对比 MUI 版功能清单 |

### 阶段 4：Dashboard 迁移

**目标**：首页仪表盘迁移到 shadcn。

| 任务 | 内容 |
|------|------|
| 4.1 DashboardPage | 统计卡片 + 图表（Recharts） |
| 4.2 数据接入 | 对接 Repository 获取聚合数据 |

### 阶段 5：Settings 模块迁移

**目标**：主题/品牌设置页迁移。

| 任务 | 内容 |
|------|------|
| 5.1 SettingsPage | 主题色、字体、Logo 设置 |
| 5.2 ThemeColorSection | oklch 色板选择器 |
| 5.3 NavSettings / LogoSettings | 导航和品牌标识配置 |

### 阶段 6：Projects 模块重构

**目标**：项目管理模块用 shadcn 重写（`src-next/` 当前无此模块，需新建）。

| 任务 | 内容 |
|------|------|
| 6.1 ProjectListPage | 项目列表 + 筛选 + 排序 |
| 6.2 ProjectKanbanView | 状态看板 |
| 6.3 ProjectDetailPage | 项目详情 + 阶段/里程碑 |
| 6.4 CreateProjectModal | 新建项目表单 |

### 阶段 7：其余模块

**目标**：Procurement、Personnel、Orders、Resource 等剩余模块迁移。

此阶段作为后续独立 PR 追加，不在本次分支中完成。

### 阶段 8：MUI 逐步退役（延后执行）

**目标**：在各模块 shadcn 版本稳定运行后，逐步移除对应 MUI 页面组件。

> 此阶段在当前分支中不执行，待全站 shadcn 覆盖率达标后作为独立 PR 处理。

| 任务 | 内容 |
|------|------|
| 8.1 删除 MUI 页面组件 | 按模块逐一移除，确保 shadcn 替代品已稳定 |
| 8.2 清理 CSS 变量 | 移除 `--pm-*` 品牌变量 |
| 8.3 移除 MUI 依赖 | 从 `package.json` 移除 `@mui/*`、`@emotion/*` |
| 8.4 确认功能对齐 | 逐模块确认无功能退化 |
| 8.5 全量验证 | `npm run test:run` + `npm run lint` + `npm run build` |

---

## 风险与缓解

| 风险 | 缓解 |
|------|------|
| MUI 与 shadcn 样式冲突 | Tailwind preflight 与 MUI CssBaseline 隔离，MUI 页面维持原样不引入 Tailwind class |
| shadcn 表单模式与现有 Zod 校验不一致 | 使用 shadcn Form + React Hook Form + Zod 标准模式 |
| @dnd-kit 拖拽行为与现有交互不一致 | 保留现有 drag activation distance 配置 |
| CSS 变量体系切换导致视觉断层 | 每阶段截图对比，确保视觉基线 |
| `tsc -b` 因类型路径变更而失败 | 每阶段末跑 `tsc --noEmit` 提前发现 |

---

## 验收标准

- [ ] `npm run build` 通过（无类型错误）
- [ ] `npm run lint` 通过（ESLint 零警告）
- [ ] `npm run test:run` 通过（单元测试全绿）
- [ ] 浏览器手动验证：项目/任务/标准/采购 四大入口跳转正常
- [ ] `src/components/ui/` 已包含 shadcn 组件库
- [ ] 路由已切换为 BrowserRouter
- [ ] `src-next/` 目录已删除，内容已迁移至 `src/`
- [ ] MUI 页面组件保留可用，不受 shadcn 迁移影响
- [ ] AGENTS.md 架构速查表已更新
