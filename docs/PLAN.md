---
id: DOC-PLAN
number: PRJ-000
domain: project
category: plan
title: 项目计划总览
owner: docs-maintainer
status: active
last_updated: 2026-05-12
source_of_truth: true
related_code: []
related_docs:
  - docs/README.md
  - docs/01-product/product-roadmap-v1.2-draft.md
  - docs/01-product/design-spec-v2-shadcn.md
  - docs/05-project/development-plan-v2.0.md
---

# 项目计划总览

> 本文件是项目计划的集中管理入口，替代散落在各处的计划片段。
> 所有计划相关变更应更新本文件，而非新建文档。

---

## 当前状态

| 维度         | 状态                                                       |
| ------------ | ---------------------------------------------------------- |
| 当前阶段     | Phase 6 — Agent 与工作台（待开发）                         |
| UI 主栈      | shadcn/ui Neutral Light（`src-next/`，npm workspace 接入） |
| UI 副栈      | MUI v9 + Emotion（`src/`，维护模式，仅修 bug）             |
| 默认构建入口 | `npm run dev` → shadcn，`npm run dev:legacy` → MUI         |
| 开发计划     | V2.1（Phase 1~5 已完成，Phase 6 Agent 为下一阶段目标）     |
| 产品路线图   | V1.2（active，当前工作基线）                               |
| 数据层       | local-api + Prisma + SQLite                                |

## 阶段状态

| Phase                     | 状态      | 说明                                   |
| ------------------------- | --------- | -------------------------------------- |
| Phase 1（底座搭建）       | ✅ 完成   |                                        |
| Phase 1.5（底座收官）     | ✅ 完成   |                                        |
| Phase 2（WBS 三视图）     | ✅ 完成   | 甘特图/网络图/树视图 + 项目详情 8 标签 |
| Phase 3（模板中心）       | ✅ 完成   | 项目模板/任务模板 CRUD + 实例化        |
| Phase 4（采购管理）       | ✅ 完成   | 采购订单/供应商管理/任务联动           |
| Phase 5（工队管理）       | ✅ 完成   | 工队档案/班组/资质证照/部分派单联动    |
| Phase 6（Agent 与工作台） | 🔜 待开发 | 为下一阶段目标                         |
| Phase 7（联调与闭环验证） | ⏳ 待定   | 依赖 Phase 6                           |

---

## 活跃计划文档

| 文档                                                                 | 状态       | 说明                                                 |
| -------------------------------------------------------------------- | ---------- | ---------------------------------------------------- |
| [产品路线图 V1.2](docs/01-product/product-roadmap-v1.2-draft.md)     | active     | 当前产品规划基线（SSOT）                             |
| [前端设计规范 V2 — shadcn](docs/01-product/design-spec-v2-shadcn.md) | active     | 当前 UI 设计规范                                     |
| [WBS 框架设计](docs/03-development/wbs-framework-design.md)          | draft      | 四视图集成方案（树/甘特/网络图/思维导图）            |
| [开发计划 V2.1](docs/05-project/development-plan-v2.0.md)            | active     | 工程任务分解，Phase 1~5 已完成，Phase 6 Agent 待开发 |
| [开发计划 V1.2](docs/99-archive/development-plan-v1.2.md)            | superseded | 已由 V2.0 替代，保留历史参考                         |
| [设计规范（MUI）](docs/00-governance/design-specification.md)        | deprecated | 已被 shadcn V2 替代                                  |
| [文档治理规范](docs/00-governance/document-governance.md)            | active     | 文档管理规则                                         |
| [编码规范](docs/00-governance/coding-standards.md)                   | active     | 代码风格与质量规则                                   |

---

## 关键决策记录

| 日期       | 决策                                                 | 影响                                                 |
| ---------- | ---------------------------------------------------- | ---------------------------------------------------- |
| 2026-04-24 | 产品路线图从 V2.3 回退为 V1.2                        | 聚焦品牌方内部管理系统，暂缓加盟模式                 |
| 2026-04-24 | UI 方向从 MUI v9 切换为 shadcn Neutral Light         | src-next/ 成为新 UI 基线                             |
| 2026-05-06 | 项目计划文档集中管理                                 | 本文件（PLAN.md）作为计划总览 SSOT                   |
| 2026-05-06 | 开发策略：新功能在 src-next/ 开发，src/ 只维护不新增 | 后续所有开发在 shadcn 上进行                         |
| 2026-05-06 | shadcn npm workspace 接入完成，设为默认构建入口      | `npm run dev` 启动 shadcn，MUI 退为 `dev:legacy`     |
| 2026-05-07 | Phase 2~6 MUI 旧计划关闭，待 V2.0 重新规划           | 旧 P2-T1~T9 已关闭，新 Phase 2 从 WBS 框架开始       |
| 2026-05-07 | 确定 WBS 框架四视图方案（树/甘特/网络图/思维导图）   | 分阶段交付，对应新 Phase 2 范围与任务+进度管理标签   |
| 2026-05-07 | 开发计划 V2.0 发布，V1.2 标记为 superseded           | 新开发计划基于 shadcn 架构，Phase 2 重新排序         |
| 2026-05-07 | 产品功能模块调整：资产 → 工队管理                    | 8 P0 模块：工作台/项目/任务/标准/采购/工队/人员/设置 |
| 2026-05-12 | 文档对齐：开发计划 V2.0 → V2.1，PLAN.md 更新         | Phase 2~5 标记为已完成，Phase 6 Agent 为下一阶段目标 |

---

## 待办工作

- [x] src-next/ npm workspace 接入（`workspaces: ["src-next"]`）
- [x] `@/` 空壳目录清除
- [x] dev/build 默认入口切换为 shadcn
- [x] src-next/ 测试基础设施搭建（vitest + testing library，8 文件 31 用例通过）
- [x] WBS 框架设计（四视图方案文档完成）
- [x] WBS 框架阶段 1 实施（树视图核心，含 Sheet/连接线/E2E）
- [x] [#47](https://github.com/Ding-ding2021/agile-construction/issues/47) 升版开发计划 V2.0（基于当前 shadcn 架构，替代 V1.2 MUI 旧计划）
- [x] [#45](https://github.com/Ding-ding2021/agile-construction/issues/45) 项目列表页 src→src-next 迁移（范围收缩：仅项目管理列表页，不含 8 标签和标准管理）
- [x] 迁移模块测试覆盖 ≥ 模块阈值（覆盖率作为迁移验收条件，而非独立 Issue）
- [x] Phase 2~5 全模块实现（WBS 三视图/8 标签/标准管理/模板中心/采购/工队）
- [x] 开发计划 V2.0 → V2.1 文档对齐
- [ ] Phase 6 Agent 与工作台需求分析与实现

---

## 相关外部产物

- `scripts/plan-issues.json` — 43 个开发任务的 JSON 分解（基于 MUI 旧计划，已关闭并替换为 #45/#47）
- `memory/` — 每日工作日志
- `memory/patterns/shadcn-workflow.md` — shadcn 工作流指南
