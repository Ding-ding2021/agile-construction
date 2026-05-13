---
id: DOC-GOVERNANCE-DOC-GOVERNANCE-
number: GOV-000
domain: governance
category: doc-governance
title: 文档中心（统一入口）
owner: docs-maintainer
status: active
last_updated: 2026-05-12（领域分类重组：新增设计/测试/项目，治理/文档合并）
source_of_truth: true
related_code: []
related_docs: []
---

# 文档中心（统一入口）

> 本文件是仓库文档唯一导航入口（SSOT 索引）。
> 所有 active 文档必须在本页登记。
> 计划类文档的管理详见 [PLAN.md](docs/PLAN.md)。
> 最后索引更新：2026-05-11（新增 `docs/ai/` AI 合约层）

## 文档分层

| 目录             | 领域 | 内容                                 |
| ---------------- | ---- | ------------------------------------ |
| `00-governance`  | 治理 | 规则、标准、流程、框架（含 Harness） |
| `01-product`     | 产品 | 需求、PRD、路线图、调研              |
| `02-design`      | 设计 | 视觉系统、组件规范、交互             |
| `03-development` | 开发 | 架构设计、技术方案、编码、重构       |
| `04-testing`     | 测试 | 测试规范、策略、指南                 |
| `05-project`     | 项目 | 计划、报告、运营指标、发布           |
| `ai/`            | —    | AI 合约层（跨域基础设施）            |
| `99-archive`     | 归档 | 历史归档（不作为执行依据）           |

## Active 文档索引（按领域）

### 治理（00-governance）

- `docs/00-governance/document-governance.md` — `GOV-001` 文档治理规则
- `docs/00-governance/coding-standards.md` — `GOV-002` 编码规范
- `docs/00-governance/code-review-checklist.md` — `GOV-003` Code Review 检查清单
- `docs/00-governance/pr-doc-checklist.md` — `GOV-004` PR 文档检查清单
- `docs/00-governance/agent-squad-protocol.md` — `GOV-005` Squad 小组协作协议
- `docs/00-governance/project-charter.md` — `GOV-006` Project Charter（治理宪法）
- `docs/00-governance/quality-metrics.md` — `GOV-007` 质量指标体系
- `docs/00-governance/mvp-code-quality-plan-v2.md` — `GOV-008` MVP 代码质量方案
- `docs/00-governance/reasoning-language.md` — `GOV-009` 推理语言规范
- `docs/00-governance/component-development-contract.md` — `GOV-010` 组件开发契约
- `docs/00-governance/2026-05-11-knowledge-engine.md` — `GOV-011` 知识引擎规格
- `docs/00-governance/2026-05-11-harness-governance.md` — `GOV-012` Harness 治理
- `docs/00-governance/harness/*.md` — `GOV-013~022` Harness 框架文档
- `docs/00-governance/harness/roles/*.md` — `GOV-023~026` Harness 角色文件

### 产品（01-product）

- `docs/01-product/product-roadmap-v1.2-draft.md` — `PRD-001` 产品路线图 V1.2
- `docs/01-product/project-management-prd.md` — `PRD-002` 项目管理 PRD
- `docs/01-product/task-center-prd.md` — `PRD-003` 任务中心 PRD
- `docs/01-product/personnel-management-prd.md` — `PRD-004` 人员管理 PRD
- `docs/01-product/procurement-management-prd.md` — `PRD-005` 采购管理 PRD
- `docs/01-product/standard-management-prd.md` — `PRD-006` 标准管理 PRD
- `docs/01-product/digital-employee-prd.md` — `PRD-007` 数字员工 PRD
- `docs/01-product/settings-prd.md` — `PRD-008` 设置 PRD
- `docs/01-product/multi-agent-v1-prd.md` — `PRD-009` 多 Agent V1 PRD
- `docs/01-product/workteam-management-prd.md` — `PRD-010` 班组管理 PRD
- `docs/01-product/gantt-benchmark-research.md` — `PRD-011` 甘特图调研
- `docs/01-product/gantt-roadmap.md` — `PRD-012` 甘特图路线图
- `docs/01-product/ai-coding-knowledge-base.md` — `PRD-013` AI 编码知识库

### 设计（02-design）

- `docs/02-design/design-spec-v2-shadcn.md` — `DES-001` 前端设计规范 V2 shadcn
- `docs/02-design/design-checklist.md` — `DES-002` UI 开发检查清单
- `docs/02-design/2026-05-08-project-detail-redesign.md` — `DES-003` 项目详情重设计

### 开发（03-development）

- `docs/03-development/data-layer-decision-record.md` — `DEV-001` 数据层决策记录
- `docs/03-development/multi-agent-v1-technical-design.md` — `DEV-002` 多 Agent 技术设计
- `docs/03-development/state-machine-design.md` — `DEV-003` 状态机设计
- `docs/03-development/structured-standard-library.md` — `DEV-004` 结构化标准库
- `docs/03-development/task-tree-modeling.md` — `DEV-005` 任务树建模
- `docs/03-development/wbs-framework-design.md` — `DEV-006` WBS 框架设计
- `docs/03-development/template-data-contract.md` — `DEV-007` 模板数据契约
- `docs/03-development/routing-state-migration-plan.md` — `DEV-008` 路由状态迁移方案
- `docs/03-development/adr-002-feature-registry.md` — `DEV-009` ADR 特性注册表
- `docs/03-development/task-entity-relationship.md` — `DEV-010` 任务实体关系
- `docs/03-development/task-center-erd.md` — `DEV-011` 任务中心 ER 图
- `docs/03-development/development-guide.md` — `DEV-012` 开发指南
- `docs/03-development/integration-guide.md` — `DEV-013` 集成指南
- `docs/03-development/phase1-handoff.md` — `DEV-014` Phase 1 交接
- `docs/03-development/component-refactoring-plan.md` — `DEV-015` 组件重构计划
- `docs/03-development/component-implementation-spec.md` — `DEV-016` 组件实现规范

### 测试（04-testing）

- `docs/04-testing/testing-standards.md` — `TST-001` 测试规范
- `docs/04-testing/ai-testing-guide.md` — `TST-002` AI 测试指南
- `docs/04-testing/regression-checklist.md` — `TST-003` 回归检查清单

### 项目（05-project）

- `docs/05-project/project-rules.md` — `PRJ-001` 项目规则
- `docs/05-project/development-plan-v2.0.md` — `PRJ-002` 开发计划 V2.0
- `docs/05-project/DASHBOARD.md` — `PRJ-003` 质量仪表盘
- `docs/05-project/log.md` — `PRJ-004` Wiki 操作日志
- `docs/05-project/roadmap-v1.2-impact-assessment.md` — `PRJ-005` V1.2 影响评估
- `docs/05-project/launch-checklist.md` — `PRJ-006` 发布检查清单
- `docs/05-project/feishu-publish-runbook.md` — `PRJ-007` 飞书发布 Runbook
- `docs/05-project/phase1.5-tech-debt-plan.md` — `PRJ-008` Phase 1.5 技术债清理

### AI 合约层（docs/ai/）

> 面向 AI Agent 的结构化知识库。由 `document-sync` + 提炼任务自动维护，参见 `docs/ai/README.md`。

**合约：** `docs/ai/contracts/` — 模块合约（每模块一个文件，≤200 行）
**知识：** `docs/ai/knowledge/` — 可复用模式 + 决策记录 + 规则
**上下文：** `docs/ai/context/state.md` — 当前项目状态

### 99-archive（历史归档）

> `docs/99-archive/` 下所有已标记 `archived` 状态的文档。不作为执行依据。

- `docs/99-archive/development-plan-v1.2.md` — `ARC-001` 开发计划 V1.2（已归档，由 V2.0 替代）
- `docs/99-archive/2026-05-07-P2-T1.md` — `ARC-002` P2-T1 实现计划（Phase 2 已完成）
- `docs/99-archive/2026-05-07-calendar-system.md` — `ARC-003` 日历系统计划（已集成）
- `docs/99-archive/2026-05-07-gantt-enhance.md` — `ARC-004` 甘特图增强计划（已集成）
- `docs/99-archive/2026-05-07-wbs-phase1-implementation.md` — `ARC-060` WBS Phase1 实现（已完成）
- `docs/99-archive/2026-05-07-squad-eval-45-47.md` — `ARC-006` Squad 评估报告（已关闭）
- `docs/99-archive/development-issues-summary-2026-05-02.md` — `ARC-007` 开发问题汇总（已关闭）
- `docs/99-archive/phase3-retrospective-and-phase4-proposal-2026-04-16.md` — `ARC-008` Phase 3 回顾（已关闭）
- `docs/99-archive/文档索引.md` — `ARC-059` 旧版中文文档索引（已废弃，由本 README 替代）
- `docs/99-archive/design-specification.md` — `ARC-005` 设计规范 MUI 版（已废弃，由 shadcn V2 替代）
- `docs/99-archive/product-roadmap.md` — `ARC-054` 产品规划 V1.0（已归档，被 V1.2 替代）
- `docs/99-archive/product-roadmap-v2.md` — `ARC-053` 产品规划 V2.3（已归档，被 V1.2 替代）
- `docs/99-archive/phase1/` — Phase 1 评估与治理文档（`ARC-039~040`）
- `docs/99-archive/phase3/` — Phase 3 评估与治理文档（`ARC-041~045`）
- `docs/99-archive/phase4/` — Phase 4 一次性评估报告（`ARC-046~052`）
- `docs/99-archive/knowledge-base/` — 知识库（`ARC-009~027`）
- `docs/99-archive/legacy-chinese/` — 中文原始文档（`ARC-028~037`）
- 其他独立归档文档（`ARC-038, ARC-055~060`）

## 维护要求

- 根目录不再新增业务文档 `.md`
- **新增/修改 active 文档必须同步更新本索引** ⚠️ 此为强制规则
- 所有文档引用统一使用 `docs/...` 路径
- 每季度执行一次索引完整性审计（参照本次审计方法论）
