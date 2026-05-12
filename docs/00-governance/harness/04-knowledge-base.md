---
number: GOV-017
domain: governance
category: harness
---

# 知识库

> **⚠️ 已 superseded — 2026-05-11**
> 本文档描述的六层文档结构已被**五层知识架构**替代，新架构定义见：
>
> - `docs/01-product/specs/2026-05-11-knowledge-engine.md`（知识引擎总纲）
> - `docs/ai/README.md`（AI 合约层索引）
> - `docs/ai/knowledge/patterns.md` `decisions.md` `rules.md`（可复用知识）
> - `docs/ai/context/state.md`（项目当前状态）
>
> 本文档保留作为历史参考，其描述的 `docs/knowledge-base/` 目录已全量归档至 `docs/99-archive/knowledge-base/`。

## 概述

71+ 份文档按六层分布，每层按四专业索引。知识库为 Agent 提供项目上下文。

---

## 文档层次

```
docs/
├── 00-governance/          # 治理层 — 规范、协议、编码标准
├── 01-product/             # 产品层 — PRD、设计规范、路线图
├── 02-architecture/        # 架构层 — ADR、状态机、技术设计
├── 03-engineering/         # 工程层 — 开发指南、测试指南、发布
├── 04-operations/          # 运维层 — 回顾、影响评估
├── 99-archive/             # 归档层 — 历史文档
└── knowledge-base/         # 参考层 — 已 superseded 的通用知识
```

---

## 按专业索引

### 产品

| 文档                                            | 核心内容                               |
| ----------------------------------------------- | -------------------------------------- |
| `docs/00-governance/agent-squad-protocol.md`    | Squad 三组协作协议                     |
| `docs/00-governance/project-charter.md`         | 六大原则、工作流、Label 体系、质量关卡 |
| `docs/00-governance/quality-metrics.md`         | AI 开发质量 KPI                        |
| `docs/00-governance/document-governance.md`     | 文档三层体系、SSOT                     |
| `docs/00-governance/reasoning-language.md`      | 推理语言规范                           |
| `docs/01-product/product-roadmap-v1.2-draft.md` | V1.2 产品路线图                        |
| `docs/01-product/project-management-prd.md`     | 项目容器、9 阶段状态                   |
| `docs/01-product/task-center-prd.md`            | 任务树、依赖、SLA                      |
| `docs/01-product/standard-management-prd.md`    | 8 层标准模型                           |
| `docs/01-product/personnel-management-prd.md`   | 组织/角色/技能管理                     |
| `docs/01-product/workteam-management-prd.md`    | 工队档案、班组                         |
| `docs/01-product/procurement-management-prd.md` | 采购协同                               |
| `docs/01-product/digital-employee-prd.md`       | AI Agent 管理                          |
| `docs/01-product/multi-agent-v1-prd.md`         | 7 Agent 协同                           |
| `docs/01-product/settings-prd.md`               | 系统设置                               |
| `docs/01-product/gantt-benchmark-research.md`   | 甘特图对标                             |
| `docs/01-product/ai-coding-knowledge-base.md`   | AI 编程文献                            |
| `docs/04-operations/`                           | 运维评估、复盘                         |

### 设计

| 文档                                                   | 核心内容                      |
| ------------------------------------------------------ | ----------------------------- |
| `docs/00-governance/design-checklist.md`               | UI 组件检查清单               |
| `docs/00-governance/component-implementation-spec.md`  | 组件 Token/间距/圆角标准      |
| `docs/00-governance/component-development-contract.md` | 设计→代码交接契约             |
| `docs/01-product/design-spec-v2-shadcn.md`             | oklch 色值、排版、shadcn 规范 |

### 开发

| 文档                                                      | 核心内容                      |
| --------------------------------------------------------- | ----------------------------- |
| `docs/00-governance/coding-standards.md`                  | ESLint/TS/React/Tailwind 规范 |
| `docs/00-governance/code-review-checklist.md`             | 六维度审查清单                |
| `docs/02-architecture/project-rules.md`                   | 全局规则基线                  |
| `docs/02-architecture/state-machine-design.md`            | 8 类业务状态机                |
| `docs/02-architecture/task-tree-modeling.md`              | 4 层任务树、4 种关系          |
| `docs/02-architecture/template-data-contract.md`          | 模板元模型、蓝图              |
| `docs/02-architecture/structured-standard-library.md`     | 8 层标准库                    |
| `docs/02-architecture/wbs-framework-design.md`            | WBS 四视图                    |
| `docs/02-architecture/task-entity-relationship.md`        | 任务 ERD                      |
| `docs/02-architecture/multi-agent-v1-technical-design.md` | 多 Agent 架构                 |
| `docs/02-architecture/data-layer-decision-record.md`      | ADR-001 数据层                |
| `docs/02-architecture/adr-002-feature-registry.md`        | ADR-002 FeatureRegistry       |
| `docs/02-architecture/routing-state-migration-plan.md`    | 路由重构方案                  |
| `docs/03-engineering/development-plan-v2.0.md`            | 当前开发计划                  |
| `docs/03-engineering/development-guide.md`                | 开发上手全流程                |
| `docs/03-engineering/integration-guide.md`                | 本地联调                      |
| `docs/03-engineering/component-refactoring-plan.md`       | 核心组件重构                  |
| `docs/03-engineering/phase1-handoff.md`                   | Phase 1 交接                  |

### 测试

| 文档                                             | 核心内容                 |
| ------------------------------------------------ | ------------------------ |
| `docs/00-governance/code-review-checklist.md`    | 代码审查                 |
| `docs/00-governance/mvp-code-quality-plan-v2.md` | 全 AI 编码质量           |
| `docs/03-engineering/ai-testing-guide.md`        | AI 驱动测试、Prompt 模板 |
| `docs/03-engineering/regression-checklist.md`    | 60 用例回归清单          |

---

## 知识库参考层（已 superseded）

| 子目录                                           | 文件数 | 关键词                            |
| ------------------------------------------------ | ------ | --------------------------------- |
| `docs/knowledge-base/01-product-development/`    | 7      | 六阶段开发流程                    |
| `docs/knowledge-base/02-technical-architecture/` | 7      | 架构/分层/状态/DDD/性能/部署      |
| `docs/knowledge-base/03-project-specific/`       | 4      | 技术栈/代码模式/开发规范/OpenCode |

---

## 文档状态体系

| 状态         | 含义     | 操作             |
| ------------ | -------- | ---------------- |
| `active`     | 当前生效 | 正常引用         |
| `draft`      | 草稿     | 可参考但非最终   |
| `superseded` | 已被替代 | 保留历史参考     |
| `archived`   | 已归档   | 移入 99-archive/ |
