---
title: Phase 1 交接文档
number: DEV-014
domain: development
category: guide
status: active
last_updated: 2026-05-05
---

# Phase 1 冷启动交接文档

> 生成时间：2026-04-24
> 前置阅读：`docs/03-engineering/development-plan-v1.2.md`

## 当前进度

- ✅ Roadmap V1.2 已制定
- ✅ Phase 1~6 工程任务已拆解（33 个任务）
- ✅ 代码基线已扫描（组件重复、CSS 魔法值、路由硬编码等问题已定位）
- ⏳ Phase 1 尚未开始执行

## Phase 1 目标

清偿技术债务 + 搭建工程底座，**不新增业务功能**。

## 7 个任务（按依赖排序）

| ID    | 任务                   | 状态      | 依赖     | 说明                                                                                                                                               |
| ----- | ---------------------- | --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1-T1 | 共享组件补齐与存量替换 | 🔴 未开始 | 无       | `shared/` 目录已有 `StatCard`、`PageHeader`、`Icon`、`AppShell` 等骨架，需补齐 API 并替换 `personnel/StatsCards.tsx`、`digital/*.tsx` 等硬编码组件 |
| P1-T2 | CSS 变量体系统一       | 🔴 未开始 | 无       | 提取 design-spec 颜色/圆角/阴影为 CSS 变量，消灭各文件魔法值                                                                                       |
| P1-T3 | 路由配置集中化         | 🔴 未开始 | 无       | 将 `App.tsx` 中硬编码 hash 路由抽离到配置表或 `src/router/`                                                                                        |
| P1-T4 | 本地后端 Schema 实体化 | 🔴 未开始 | 无       | `local-api/store/schema.sql` 已存在，需引入 Prisma + SQLite，替换快照模式                                                                          |
| P1-T5 | 状态机 Hook 真实化     | 🔴 未开始 | P1-T4    | `enterStatusHooks` 从字符串数组改为动作函数，状态进入触发真实业务                                                                                  |
| P1-T6 | TypeScript 严格模式    | 🔴 未开始 | P1-T1~T3 | `tsconfig.json` 开启 strict，修复类型错误                                                                                                          |
| P1-T7 | 状态管理 Zustand 化    | 🔴 未开始 | P1-T5~T6 | 将 `App.tsx` 中 `projectsState` / `projectStatusLogs` 迁移到 Zustand store                                                                         |

## 已知代码债务清单（已定位）

### 组件重复（T1 要消灭的）

- `src/components/personnel/StatsCards.tsx` —— 内联实现，应替换为 `shared/data-display/StatsCards`
- `src/components/digital/DigitalEmployeePage.tsx` —— 顶部统计卡片区硬编码
- `src/components/project/ProjectManagementPage.tsx` —— 类似硬编码 StatsCards
- `src/components/procurement/ProcurementManagementPage.tsx` —— 硬编码统计区
- `src/components/task/TaskManagementPage.tsx` —— 硬编码 Icon 导入（47 个独立 import）

### CSS 魔法值（T2 要消灭的）

- `border-radius: 12px` / `16px` / `24px` 分散在各组件
- 颜色值如 `#6B7280`、`#374151` 直接写死
- 阴影值重复

### 路由硬编码（T3 要消灭的）

- `App.tsx` 中 `readRouteFromHash` 与大量 `if/else` 判断路由

## 建议起手顺序

1. **先执行 P1-T1**（影响面最大，其他任务可能依赖组件）
2. **同步可执行 P1-T2**（CSS 变量相对独立）
3. **P1-T3 稍后**（涉及 App.tsx 核心逻辑，需确认路由表设计）
4. **P1-T4 可与 T1/T2 并行**（后端目录独立）

## 关键约束（必须遵守）

- `src/domain/`、`src/data/` 层**禁止 AI 直接修改**（代码质量保证方案规定）
- 修改前先 `npm run lint` 确保不引入新错误
- 每次只改一个任务，改完验证再推进

## 启动检查清单

新会话开始时：

1. [ ] 读取本文档
2. [ ] 读取 `docs/03-engineering/development-plan-v1.2.md`（完整计划）
3. [ ] 读取 `docs/03-engineering/component-refactoring-plan.md`（T1 详细方案）
4. [ ] 确认用户想从哪个任务开始
5. [ ] 执行前先看目标文件的当前内容（**禁止循环读取同一文件**）
