# 长期记忆

## 项目架构关键决策

- **前端**：React + Vite + TypeScript，Hash 路由，单入口多页面架构（`App.tsx` 驱动）
- **V1 后端**：Node.js + Express + SQLite + Prisma（轻量方案）
- **V2 后端**：迁移 PostgreSQL + Redis
- **状态管理**：当前 `App.tsx` 内联状态 + localStorage，目标迁移 Zustand
- **数据持久化**：`pm-projects-state-v1` / `pm-project-logs-v1` 存 localStorage（演示阶段）

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
- `App.tsx` 路由硬编码 → **已大幅简化**（配置驱动），但 `navigation.ts` 缺失
- ~~lint 164 errors~~ → ✅ **0 errors, 19 warnings**（Wave 1 + 类型修复后）
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

- **Wave 0**（10 分钟）：数据层策略决策 — 建议 V1 保持快照模式，实体化延后到 Phase 3
- **Wave 1**（1~2 小时）：lint 清零 + 3 个旧 Sidebar 删除 + 旧 CSS 类名清理 + ProjectDetailPage 布局对齐
- **Wave 2**（1~2 天）：project-detail.css 硬编码清零 + navigation.ts 创建 + 组件层 localStorage 清理
- **Wave 3**（2~3 天，可延后）：CSS Token 压缩 + 渐变清零 + ProjectCard + MUI 封装

### 进入 Phase 2 底线标准

1. lint 零 error
2. 旧 Sidebar 删除
3. 旧统计卡片 CSS 清理
4. project-detail.css 硬编码 ≤ 20 处
5. 数据策略决策明确

### 待决策项

- **P1-T4 数据策略**：快照模式（选项 A，建议）vs 实体表（选项 B，2~3 天）
