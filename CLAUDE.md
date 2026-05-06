# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### src/（MUI 版 — 维护模式）

- `npm run dev` — Vite dev server (HMR)
- `npm run dev:local` — Vite + local Express API (port 3100) via concurrently
- `npm run build` — `tsc -b && vite build`
- `npm run lint` — ESLint across entire repo
- `npm test` — Vitest watch mode
- `npm run test:run` — Vitest single run
- `npm run test:coverage` — Vitest with coverage (thresholds: lines 55%, functions 42%, branches 42%)
- `npm run db:seed` — Prisma seed (`prisma/seed.ts`)
- `npx eslint <file>` — single-file ESLint check

### src-next/（shadcn 版 — 活跃开发）

- `cd src-next && npx vite` — 启动 shadcn 版 dev server（port 5175）
- `npx shadcn@latest add <component> -c src-next` — 添加 shadcn 组件
- `npx shadcn@latest add -c src-next -y --all` — 添加所有缺失依赖
- `npx vite build --config src-next/vite.config.ts` — 构建 shadcn 版

### 公共

- Pre-commit: `lint-staged` (ESLint + Prettier on staged files) then `tsc --noEmit`
- Prettier: `--single-quote`, `--no-semi`, `--print-width 100`, `--arrow-parens avoid`

## Architecture

本仓库包含两条独立的开发线，共享 `node_modules`、`prisma/`、`local-api/`。

---

### src/（MUI 版 — 维护模式）

#### Hash routing (no React Router)

All pages are hash-based, managed centrally in `src/config/routes.ts`:

- `src/config/routes.ts` — `readRouteFromHash()` parses `window.location.hash` into a discriminated `AppRoute` union type; `pageComponentRegistry` maps page names to lazy-loaded components
- `src/config/feature-registry.ts` — typed `FeatureConfig[]` declaring all pages with category tags (`simple`/`param`/`callback`/`data`)
- `src/config/navigation.ts` — `goTo*()` helper functions (the only place `window.location.hash` is written)
- `src/components/router/AppRouter.tsx` — renders the active page component based on route

To add a new page: register it in `routes.ts` (FEATURE_REGISTRY + pageComponentRegistry), add navigation helpers in `navigation.ts`, create the component in `src/components/<domain>/`.

#### Layer structure

| Layer        | Location                   | Purpose                                                    |
| ------------ | -------------------------- | ---------------------------------------------------------- |
| Pages        | `src/components/<domain>/` | Page-level components, each a self-contained domain module |
| Domain logic | `src/domain/`              | Pure state machines, status views, work item types         |
| Data         | `src/data/`                | Static/mock data and in-memory stores                      |
| Services     | `src/services/`            | API client, repositories (Prisma CRUD), error handling     |
| Store        | `src/store/`               | Zustand store (project state)                              |
| Config       | `src/config/`              | Routes, navigation, feature registry                       |

#### State management

- **Zustand** (`src/store/projectStore.ts`) for cross-component project state
- Domain state machines in `src/domain/` (e.g., `projectStatusMachine.ts` with `canTransition/allowedTransitions`)
- Repository pattern in `src/services/repositories/` abstracts data access (falls back to mock data when DB is empty)
- Local API (`local-api/`) provides Express-based REST endpoints backed by Prisma/SQLite

#### Design conventions

- All Tailwind color tokens are defined as CSS variables in `src/index.css` under `:root` (prefix `--pm-*`)
- Component CSS co-located as `*.css` files alongside components (not CSS modules)
- MUI 9 + Emotion for component library
- Domain types co-located with components in `*.types.ts` files
- Selector functions in `*.selectors.ts` files for data filtering/sorting

---

### src-next/（shadcn 版 — 活跃开发）

**路由**: React Router v7（BrowserRouter），集中定义在 `src-next/App.tsx`

**技术栈**: shadcn/ui (`style: "base-nova"`) + Tailwind CSS v4 + `@base-ui/react` + Lucide 图标

**目录结构**:

```
src-next/
├── main.tsx                  # 入口
├── App.tsx                   # 路由定义 + 全局 Provider
├── index.css                 # Tailwind v4 + shadcn CSS 变量（oklch）
├── components.json           # shadcn 配置（baseColor: neutral）
├── vite.config.ts            # Vite 配置（@ 别名, /api 代理）
├── lib/
│   └── utils.ts              # cn() — clsx + tailwind-merge
├── hooks/                    # 自定义 Hooks（use-mobile, useTaskDetail 等）
├── types/                    # TypeScript 类型定义
├── services/                 # API 服务层（src-next/services/api.ts）
├── data/                     # Mock 数据
├── components/
│   ├── ui/                   # 34+ shadcn 组件（button, card, dialog, sheet, sidebar 等）
│   ├── layout/               # AppShell, Sidebar
│   ├── app-sidebar.tsx       # 应用侧边栏导航
│   ├── site-header.tsx       # 页面顶部栏
│   ├── section-cards.tsx     # 指标卡片
│   ├── chart-area-interactive.tsx  # 交互式图表
│   └── data-table.tsx        # 数据表格（@tanstack/react-table）
└── pages/
    ├── dashboard/            # DashboardPage
    ├── tasks/                # TaskListPage, TaskDetailPage, TaskDetailSheet
    └── ...                   # projects, personnel, settings（建设中）
```

**设计规范**: 详见 `docs/01-product/design-spec-v2-shadcn.md`

#### 路由

| 路径 | 组件 | 状态 |
|------|------|------|
| `/dashboard` | DashboardPage | 骨架完成，数据待替换 |
| `/tasks` | TaskListPage + TaskDetailSheet | 完成 |
| `/tasks/:code` | TaskDetailPage | 完成 |
| `/projects` | (建设中) | — |
| `/standards` | (建设中) | — |
| `/personnel` | (建设中) | — |
| `/settings` | SettingsPage | Phase 3 |
| `/settings/:tab` | SettingsPage | Phase 3 |

#### 多色主题体系

使用 `next-themes` + CSS 变量实现正交组合：

```
亮/暗模式  ←  next-themes (.dark class)
  ×
色板       ←  data-theme 属性
  ├── neutral (当前默认)
  ├── blue
  ├── green
  └── slate
```

色板变量在 `src-next/index.css` 中通过 `:root[data-theme="xxx"]` 和 `.dark[data-theme="xxx"]` 切换。

#### 权限模型（Phase 4）

RBAC 三层模型：`用户 → 角色 → 权限`，权限格式 `资源:操作`。提供：

- `PermissionGuard` — 路由级守卫
- `<Acl perm="xxx">` — 组件级控制
- `usePermission('xxx')` — Hook 级别判断

#### 图标规范

使用 `lucide-react`，通过 `src-next/components/ui/icon.tsx` 适配层统一管理，默认 16px。后续可全局替换图标库。

#### 文档与记忆治理

| 层 | 位置 | 职责 |
|----|------|------|
| 永久规则 | `CLAUDE.md` | 架构、命令、不可变规则 |
| 当前状态 | `memory/MEMORY.md` | 活跃 Phase、债务、决策 |
| 增量日志 | `memory/YYYY-MM-DD.md` | 每日开发记录 |
| 完整文档 | `docs/` | 规范、PRD、架构、指南 |

详见 `docs/00-governance/document-governance.md`

#### Skills 治理

所有 AI 技能集中存放在 `.agents/skills/`，各工具通过符号链接引用：

```
.agents/skills/<skill-name>/SKILL.md    ← 唯一源
.claude/skills/<skill-name>             → symlink → ../../.agents/skills/<skill-name>
```

仅保留指向有效目标的链接。定期检查：`find . -type l ! -exec test -e {} \; -print`

---

### 共享层

- `node_modules/` — 两版共享依赖（src-next 从父目录 resolve）
- `prisma/` — 数据库 Schema 和迁移
- `local-api/` — Express REST API（port 3100）
- `src/store/` — Zustand 状态管理
- `src/domain/` — 纯领域逻辑（状态机等可复用）

---

### Docs

- `docs/README.md` is the single entry point index (84+ markdown files)
- Architecture decisions: `docs/02-architecture/`
- Coding standards: `docs/00-governance/coding-standards.md`
- Project management: `docs/00-governance/project-management-guide.md`
- Comments follow engineering pattern: only for key logic, boundary conditions, complex state flows (Chinese comments for maintainability)

## Shadcn 组件开发工作流

`src-next/` 所有新组件遵循三阶段开发流程：

### 阶段 1：调研 — shadcn MCP 工具

优先使用已集成的 MCP 工具搜索官方 registry，避免重复造轮子：

| MCP 工具 | 用途 | 使用时机 |
|----------|------|----------|
| `search_items_in_registries` | 搜索组件 | 不确定是否存在时 |
| `view_items_in_registries` | 查看组件源码 | 评估是否满足需求 |
| `get_item_examples_from_registries` | 查看使用示例 | 了解组件用法 |
| `get_add_command_for_items` | 生成 CLI 添加命令 | 确定要添加后 |
| `get_audit_checklist` | 添加后检查清单 | 组件添加完成后 |

### 阶段 2：原型验证 — web-artifacts-builder（可选）

对于复杂组件或组合布局，可先用 web-artifacts-builder 在 claude.ai 中快速搭建原型验证。

**web-artifacts-builder** 是 Anthropic 官方开源技能，技术栈与 `src-next/` 一致（React + TypeScript + Vite + Parcel + Tailwind + shadcn/ui），预装 40+ shadcn 组件。

```bash
# 初始化原型项目
bash scripts/init-artifact.sh <prototype-name>

# 编辑源码开发原型 → 验证视觉和交互 → 确认后移植

# 打包为单 HTML（仅用于分享）
bash scripts/bundle-artifact.sh
```

> ⚠ 原型仅在 artifact 环境运行，确认设计后仍需通过 shadcn CLI 添加到 `src-next/`。

### 阶段 3：添加到项目 — shadcn CLI + 后处理

```bash
# 1. 添加组件（使用 components.json 配置）
npx shadcn@latest add <component> -c src-next --yes

# 2. 修复自引用 bug（base-nova 风格已知问题）
#    检查文件是否导入了自身
grep "from \"@/components/ui/<filename>\"" src-next/components/ui/<filename>.tsx
#    若有自引用，改为从 @base-ui/react 导入：
#    错误: import { X } from "@/components/ui/x"
#    正确: import { X } from "@base-ui/react/x"

# 3. 验证编译
npx vite build --config src-next/vite.config.ts
```

---

## Project Management

Issues are tracked via GitHub Issues + Projects. See `docs/00-governance/project-management-guide.md` for full workflow.

### Issue Interaction (via gh CLI)

```bash
# List open issues for current phase
gh issue list --label "phase:1-foundation" --state open

# View issue details
gh issue view <number>

# Create a new feature issue
gh issue create --title "[Feature] XXX" --label "type:feature,phase:2-standards" --project "敏捷建店管理平台"

# Add progress comment
gh issue comment <number> --body "Progress: implementation done, build/lint pass"

# Close issue (after human verification)
gh issue close <number> --comment "Verified. build/lint/test pass."

# Reopen
gh issue reopen <number>
```

### Python Scripts

- `scripts/gh-setup.py --init` — 初始化 labels, milestones, issues
- `scripts/gh-sync.py` — 查看今日工作日志 / 同步 Issue 状态
- `scripts/gh-release.py --milestone "Phase X"` — 创建发布
- `scripts/plan-issues.json` — 33 个开发任务的 JSON 数据源

### Workflow

1. Human picks task → moves Issue to "In Progress"
2. AI implements → runs build/lint/test → writes daily log → commits
3. AI moves Issue to "In Review", human verifies
4. Human closes Issue → moves to "Done"

<<<<<<< Updated upstream
## 记忆与日志自动化

**每次完成任务时必须自动记录到 `.workbuddy/memory/YYYY-MM-DD.md`：**

- 每完成一个独立任务（bug 修复、功能开发、重构、文档更新），自动追加一条日志
- 日志格式：`## 任务标题` + `- **时间**: HH:MM:SS` + 修改内容/验证结果
- 有架构决策或技术债务变化时，同时更新 `.workbuddy/memory/MEMORY.md`
- 与 `verification-before-completion` 技能联动：验证通过后自动写日志
=======
### 开发路线图

```
Phase 3 (当前): 视图设置 + 系统设置
  ├── P0: 日历月/周/日切换、ThemeProvider 集成
  ├── P0: 多色主题切换、系统设置页面
  ├── P1: 字体/界面设置、视图设置持久化
  └── P1: 可替换图标组件、看板密度

Phase 4: 权限管理（RBAC 基础框架）
  ├── 角色定义、权限分配
  ├── 用户-角色绑定
  └── 路由级/组件级权限守卫

Phase 5: 项目管理（核心上游）
  ├── 项目列表、项目详情
  └── WBS + Gantt 图

Phase 6: 标准管理（任务/标准/项目强关联）
  ├── 标准模板库
  └── 标准实例化（绑定任务）

Phase 7: 人员管理
Phase 8: Dashboard 真实数据接入
Phase 9+: 合同、采购、订单、客户、设施、资源、数字员工
```
>>>>>>> Stashed changes
