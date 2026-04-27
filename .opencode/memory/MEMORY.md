# OpenCode 长期记忆

> 本文件与 .workbuddy/memory/MEMORY.md 双向同步
> 最后同步: 2026-04-27

## 项目架构关键决策

- **前端**：React + Vite + TypeScript，Hash 路由，单入口多页面架构（`App.tsx` 驱动）
- **V1 后端**：Node.js + Express + SQLite + Prisma（轻量方案）
- **V2 后端**：迁移 PostgreSQL + Redis
- **状态管理**：当前 `App.tsx` 内联状态 + localStorage，目标迁移 Zustand
- **数据持久化**：API 优先（better-sqlite3 + Prisma Schema），localStorage 降级备份

## 代码质量红线（不可违背）

- `src/domain/`、`src/data/` 层禁止 AI 直接修改（人工设计类型和状态机）
- 核心模块必须输出：①完整单元测试 ②文本流程图 ③边界条件清单
- 核心模块状态：DRAFT → STABLE → FROZEN，STABLE 变更需先输出变更申请
- 修改前先 `npm run lint`，每次只改一个任务

## 已知技术债务（持续更新）

- ~~5+ 套侧边栏/头部重复实现~~ → ✅ 已统一为 AppSidebar/PageHeader/StatsCards，旧 Sidebar/Header 文件已删（Wave 1）
- ~~7+ 统计卡片硬编码在各页面~~ → ✅ 已统一为 StatsCards，旧 CSS 类名已清理（Wave 1）
- ~~project-detail.css 96 处硬编码~~ → ✅ **0 处**（2026-04-26 全部替换为 CSS 变量，提交 `3a10ad7`）
- **navigation.ts 已创建**（2026-04-26，提交 `adcaf4f`），App.tsx 已接入
- **组件层 hash 硬编码已全部替换**（2026-04-26，提交 `2c1bfbb`），41 处→0 处
- **AppSidebar localStorage 已封装**（2026-04-26，提交 `1230cb6`），提取为 useSidebarCollapsed hook
- ~~组件层剩余 localStorage 直接调用~~ → ✅ **0 处**（2026-04-26 提取到 repository 层，提交 `54ac199`）
- `taskManagementPage.tsx` 47 个独立 Icon import
- ~~`App.tsx` 路由硬编码~~ → ✅ **已解决**（navigation.ts 创建 + 组件层 hash 41→0，Wave 2）
- lint 现为 **0 errors, 21 warnings**（Wave 1 + 类型修复后）
- ~~build 119 TS errors~~ → ✅ **0 errors**（2026-04-26 修复并提交 `a5e3d80`）
- ~~P1-T4 后端快照模式~~ → ✅ **已完成实体化**（2026-04-26）
  - Prisma Schema 清理快照表，补全实体字段
  - local-api 重构为 better-sqlite3 实体 CRUD（7 组端点）
  - serverAdapter + Repository 切换为 API 优先 + localStorage 降级
  - 自动迁移：load 时检测后端空数据则推送 localStorage 数据
  - `schema.sql` 已删除，Prisma schema 成为唯一 SSOT
  - 旧 /state 端点保留 deprecated 兼容

## 用户工作风格

- 称呼助手为 "Buddy"
- 偏好简单独立的 Python 脚本，避免复杂 Web 部署
- 中英文自然切换，偏好短指令、结构化摘要
- 沟通风格简洁，喜欢 artifact 代码块输出
- 通过 deliver_attachments 工具进行跨客户端文件传递
- 单人 + AI 开发模式，不考虑多人协作时间线

## 当前活跃项目

1. **WorkBuddy** — 多 Agent 建店管理平台（当前主要工程）
2. **News-collector** — 基于 GLM-4 的行业新闻采集
3. **装修标准数据库** — Flask + SQLite 建筑装饰标准

## 当前关注重点

- Pixso MCP（localhost:3667）设计转代码工作流
- AI 设计与 Vibe Coding 工具生态
- 自动化系统质量迭代（根据输出问题反复调优）

## 关键文档索引

| 文档                 | 路径                                                                      | 用途            |
| -------------------- | ------------------------------------------------------------------------- | --------------- |
| 开发计划 V1.2        | `docs/03-engineering/development-plan-v1.2.md`                            | 6 Phase 33 任务 |
| Phase 1 交接         | `docs/03-engineering/phase1-handoff.md`                                   | 新会话冷启动    |
| 组件重构计划         | `docs/03-engineering/component-refactoring-plan.md`                       | T1 详细方案     |
| Roadmap V1.2         | `docs/01-product/product-roadmap-v1.2-draft.md`                           | 产品路线图      |
| 状态机设计           | `docs/02-architecture/state-machine-design.md`                            | 状态机规范      |
| PRD                  | `docs/01-product/project-management-prd.md`                               | 项目管理需求    |
| 代码质量方案         | `docs/00-governance/mvp-code-quality-plan-v2.md`                          | 质量门禁        |
| 进度评估             | `docs/04-operations/phase4/development-progress-assessment-2026-04-23.md` | 当前代码基线    |
| **P1-P1.5 评估报告** | `docs/04-operations/phase1/development-progress-assessment-2026-04-25.md` | 逐项评估+证据   |
| **P1-P1.5 修复计划** | `docs/04-operations/phase1/p1-p1.5-fix-plan-2026-04-25.md`                | 修复执行指南    |

## P1-P1.5 修复计划概要（2026-04-25）

**总体完成度**: P1 ~65% / P1.5 ~40%，存在 4 项阻塞性缺口
**修复总预估**: 2.5~4 天

### 波次划分

- **Wave 0**（✅ 已完成）：数据层策略决策 — 最终选择实体表方案（选项 B），已完成迁移
- **Wave 1**（✅ 已完成）：lint 清零 + 3 个旧 Sidebar 删除 + 旧 CSS 类名清理 + ProjectDetailPage 布局对齐
- **Wave 2**（✅ 已完成）：project-detail.css 硬编码清零 + navigation.ts 创建 + 组件层 localStorage 清理
- **Wave 3**（⏳ 延后）：CSS Token 压缩 + 渐变清零 + ProjectCard + MUI 封装

### 进入 Phase 2 底线标准

1. ✅ lint 零 error
2. ✅ 旧 Sidebar 删除
3. ✅ 旧统计卡片 CSS 清理
4. ✅ project-detail.css 硬编码 0 处（≤ 20 超标完成）
5. ✅ 数据策略决策：实体表方案，已完成 Prisma + better-sqlite3 迁移

### 待决策项

- **无** — 全部决策已闭合

## 2026-04-27 更新

- Introduced new tokens and updated related CSS to rely on the design system tokens for colors and opacities. Ensures consistent theming and easier theming tweaks in the future.
- Missing tokens were added as needed; ensure all future hard-coded color values are migrated to tokens.

## 2026-04-27 更新

- Created a centralized color token set and migrated project-gantt.css to consume design tokens. Added missing tokens in src/index.css to satisfy all new references. Verified build passes.

## 2026-04-27 更新

- Design-system extension by adding new gradient tokens for Gantt and WBS visuals. Kept in :root and adjacent to existing gradient tokens to maintain token locality and ease of maintenance.
- None

## 2026-04-27 更新

- **W1-T1 Token 压缩完成**: `:root` 中 `--pm-*` Token 从 336（重复计数）→ 75 unique（≤80 目标达成）。实际 git HEAD 原始只有 80 个唯一 Token，之前 336 的计数来自重复行和后添加的未引用 Token。75 个 Token 全部由实际代码引用验证。
- 发现 ~130 个预存无效引用（如 `--pm-surface`, `--pm-slate-*`, `--pm-azure-*` 等），这些 Token 从未在 `:root` 中定义，属于更早阶段遗留问题。
- gantt.css 通过局部作用域变量（`--gantt-tone`, `--gantt-tone-soft`）自给自足，9 处本地 hex/rgba 是组件内部语义变量，保持不动。
- Build 0 errors ✅ | Lint 0 errors / 21 warnings ✅
