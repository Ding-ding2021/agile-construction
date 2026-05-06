---
id: DOC-PLAN
title: 项目计划总览
owner: docs-maintainer
status: active
last_updated: 2026-05-06
source_of_truth: true
related_docs:
  - docs/README.md
  - docs/01-product/product-roadmap-v1.2-draft.md
  - docs/01-product/design-spec-v2-shadcn.md
  - docs/03-engineering/development-plan-v1.2.md
---

# 项目计划总览

> 本文件是项目计划的集中管理入口，替代散落在各处的计划片段。
> 所有计划相关变更应更新本文件，而非新建文档。

---

## 当前状态

| 维度 | 状态 |
|------|------|
| 当前阶段 | Phase 1.5 — 底座收官（进行中） |
| UI 主栈 | shadcn/ui Neutral Light（`src-next/`，npm workspace 接入） |
| UI 副栈 | MUI v9 + Emotion（`src/`，维护模式，仅修 bug） |
| 默认构建入口 | `npm run dev` → shadcn，`npm run dev:legacy` → MUI |
| 开发计划 | V1.2（draft，待 shadcn 测试通过后升版 V2.0） |
| 产品路线图 | V1.2（draft，当前工作基线） |
| 数据层 | local-api + Prisma + SQLite |

---

## 活跃计划文档

| 文档 | 状态 | 说明 |
|------|------|------|
| [产品路线图 V1.2](docs/01-product/product-roadmap-v1.2-draft.md) | active | 当前产品规划基线（SSOT） |
| [前端设计规范 V2 — shadcn](docs/01-product/design-spec-v2-shadcn.md) | active | 当前 UI 设计规范 |
| [开发计划 V1.2](docs/03-engineering/development-plan-v1.2.md) | active | 工程任务分解（MUI 旧栈，待升版 V2.0） |
| [设计规范（MUI）](docs/00-governance/design-specification.md) | deprecated | 已被 shadcn V2 替代 |
| [文档治理规范](docs/00-governance/document-governance.md) | active | 文档管理规则 |
| [编码规范](docs/00-governance/coding-standards.md) | active | 代码风格与质量规则 |

---

## 关键决策记录

| 日期 | 决策 | 影响 |
|------|------|------|
| 2026-04-24 | 产品路线图从 V2.3 回退为 V1.2 | 聚焦品牌方内部管理系统，暂缓加盟模式 |
| 2026-04-24 | UI 方向从 MUI v9 切换为 shadcn Neutral Light | src-next/ 成为新 UI 基线 |
| 2026-05-06 | 项目计划文档集中管理 | 本文件（PLAN.md）作为计划总览 SSOT |
| 2026-05-06 | 开发策略：新功能在 src-next/ 开发，src/ 只维护不新增 | 后续所有开发在 shadcn 上进行 |
| 2026-05-06 | shadcn npm workspace 接入完成，设为默认构建入口 | `npm run dev` 启动 shadcn，MUI 退为 `dev:legacy` |

---

## 待办工作

- [x] src-next/ npm workspace 接入（`workspaces: ["src-next"]`）
- [x] `@/` 空壳目录清除
- [x] dev/build 默认入口切换为 shadcn
- [ ] src-next/ 测试基础设施搭建（vitest + testing library）
- [ ] shadcn 测试通过后升版开发计划 V2.0
- [ ] 按优先级将 src/ 功能迁移到 src-next/（从项目管理和标准管理开始）

---

## 相关外部产物

- `scripts/plan-issues.json` — 43 个开发任务的 JSON 分解（GitHub Issues 待导入）
- `.workbuddy/memory/` — 每日工作日志
- `memory/patterns/shadcn-workflow.md` — shadcn 工作流指南
