---
id: DOC-GOVERNANCE-HARNESS-
number: GOV-000
domain: governance
category: harness
title: 架构决策记录
owner: docs-maintainer
status: active
last_updated: 2026-05-11
source_of_truth: true
related_code: []
related_docs: []
---

# 架构决策记录

> 从 MEMORY.md 提取的关键架构决策。每个决策记录：日期、决策、替代方案、后果。
> 由提炼任务自动追加，不要手动编辑。

## 决策索引

| 日期 | 决策 | 状态 |
| ---- | ---- | ---- |

---

## 2026-05-11：三层文档架构

**决策**：确立三层文档架构——人类文档层（docs/）、AI 合约层（docs/ai/）、记忆进化层（memory/）。每份人类文档变更后通过 `document-sync` 技能自动同步 AI 合约。

**约束**：AI 合约 ≤ 200 行、纯表格/清单、零叙事段落。CLAUDE.md 废弃，AGENTS.md 为唯一入口。

---

## 2026-05-11：知识引擎自驱动飞轮

**决策**：采用 `opencode run` 嵌入 GitHub Actions cron 实现全自动知识提炼。H9 每日提炼、H10 每周精炼、H11 每月审计。零人工指令。

**来源**：`docs/01-product/specs/2026-05-11-knowledge-engine.md`

---

## 2026-05-07：甘特图 SVG 自绘

**决策**：甘特图采用 SVG 自绘替代 @svar-ui/react-gantt 避免 MUI 依赖冲突；网络图基于 React Flow + dagre；三视图通过 selectedId 共享实现联动。

**替代方案**：@svar-ui/react-gantt（已弃用，MUI 依赖冲突）

---

## 2026-05-07：开发计划 V2.0

**决策**：V2.0 发布，V1.2 标记 superseded。功能模块调整：资产 → 工队管理。Phase 2 以 WBS 阶段 2 为首项。

---

## 2026-05-06：shadcn 主栈

**决策**：shadcn 设为主栈（dev/build 默认入口），MUI 退为 dev:legacy/build:legacy。

**后果**：MUI 旧栈 3 份 draft 文档归档至 99-archive。

---

## 2026-05-06：Squad 三组模式

**决策**：Pre-dev Squad（评估组）→ 开发交付者 → Post-dev Squad（验收组）。评估/验收均需全票通过。按 L1/L2/L3 三级风险分级调度。v4-pro 分配给推理型角色，v4-flash 分配给检查型角色。

---

## 2026-05-06：WBSNode 独立模型

**决策**：WBSNode 独立模型（不耦合 ProjectTask/WorkPackage），状态枚举用英文（pending/in_progress/completed/blocked），项目编码前缀动态传递。

---

## 2026-05-01：项目管理体系

**决策**：GitHub Issues + Projects 作为任务状态追踪中枢，保留 WorkBuddy 日志系统。

**三层体系**：状态追踪（Issues+Projects）→ 执行记录（memory/）→ 知识沉淀（docs/）

---

## 2026-04-29：状态机重构

**决策**：项目状态从 9 个线性状态重构为 5 个 PMBOK 状态（启动→计划→执行→收尾→归档），两级状态层级（父状态 + 可配置子状态/里程碑），子状态与里程碑联动。

**替代方案**：旧 9 状态模型（已废弃）。

---

## 2026-04-26：数据层策略

**决策**：数据持久化采用 API 优先（better-sqlite3 + Prisma Schema），localStorage 降级备份。Prisma schema 成为唯一 SSOT，删除 schema.sql。

**替代方案**：快照模式（已删除全部快照相关代码）。

---

## 基础架构决策（早期）

- 前端：React + Vite + TypeScript，Hash 路由，单入口多页面架构
- V1 后端：Node.js + Express + SQLite + Prisma
- V2 后端：PostgreSQL + Redis（战略目标）
- `src/domain/`、`src/data/` 层禁止 AI 直接修改
