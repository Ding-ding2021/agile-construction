---
title: 文档中心（统一入口）
status: active
last_updated: 2026-05-06（第二批归档完成）
---

# 文档中心（统一入口）

> 本文件是仓库文档唯一导航入口（SSOT 索引）。
> 所有 active 文档必须在本页登记。
> 计划类文档的管理详见 [PLAN.md](docs/PLAN.md)。
> 最后索引更新：2026-05-06（覆盖 70 个 .md 文件）

## 文档分层

- `00-governance`：治理规则、设计规范、编码规范
- `01-product`：产品规划与需求文档
- `02-architecture`：架构与技术设计文档
- `03-engineering`：开发、联调、回归、发布文档
- `04-operations`：阶段运营与治理指标文档
- `05-knowledge-base`：领域知识库（产品流程 + 架构专题 + 项目技术栈）
- `99-archive`：历史归档（不作为执行依据）

## Active 文档索引

- `docs/PLAN.md` — 项目计划总览（计划类文档集中管理入口）

### 00-governance（治理规则）

- `docs/00-governance/coding-standards.md` — 编码规范
- `docs/00-governance/component-development-contract.md` — 组件开发合同规范
- `docs/00-governance/design-checklist.md` — 设计检查清单
- `docs/00-governance/document-governance.md` — 文档治理规则
- `docs/00-governance/mvp-code-quality-plan-v2.md` — MVP 代码质量方案（质量红线）
- `docs/00-governance/code-review-checklist.md` — Code Review Checklist
- `docs/00-governance/pr-doc-checklist.md` — PR 文档检查清单

### 01-product（产品规划与需求）

- `docs/01-product/product-roadmap-v1.2-draft.md` — 产品路线图 V1.2（活跃，当前 SSOT）
- `docs/01-product/project-management-prd.md` — 项目管理 PRD
- `docs/01-product/design-spec-v2-shadcn.md` — 前端设计规范 V2 shadcn Neutral Light ⬅ UI 设计 SSOT
- `docs/01-product/task-center-prd.md` — 任务中心 PRD
- `docs/01-product/task-center-erd.md` — 任务中心 ER 图
- `docs/01-product/personnel-management-prd.md` — 人员管理 PRD
- `docs/01-product/procurement-management-prd.md` — 采购管理 PRD
- `docs/01-product/standard-management-prd.md` — 标准管理 PRD
- `docs/01-product/digital-employee-prd.md` — 数字员工 PRD
- `docs/01-product/settings-prd.md` — 设置 PRD
- `docs/01-product/multi-agent-v1-prd.md` — 多 Agent V1 PRD
- `docs/01-product/workteam-management-prd.md` — 班组管理 PRD

### 02-architecture（架构与技术设计）

- `docs/02-architecture/data-layer-decision-record.md` — 数据层策略决策记录（P1-T4）
- `docs/02-architecture/multi-agent-v1-technical-design.md` — 多 Agent V1 技术设计
- `docs/02-architecture/project-rules.md` — 项目规则
- `docs/02-architecture/routing-state-migration-plan.md` — 路由状态迁移方案
- `docs/02-architecture/state-machine-design.md` — 状态机设计
- `docs/02-architecture/structured-standard-library.md` — 结构化标准库
- `docs/02-architecture/task-tree-modeling.md` — 任务树建模
- `docs/02-architecture/template-data-contract.md` — 模板数据契约

### 03-engineering（工程实施）

- `docs/03-engineering/ai-testing-guide.md` — AI 测试指南
- `docs/03-engineering/component-refactoring-plan.md` — 组件重构计划（T1 方案）
- `docs/03-engineering/development-guide.md` — 开发指南
- `docs/03-engineering/development-plan-v1.2.md` — 开发计划 V1.2（6 Phase 33 任务）
- `docs/03-engineering/integration-guide.md` — 集成指南
- `docs/03-engineering/phase1-handoff.md` — Phase 1 交接（冷启动文档）
- `docs/03-engineering/regression-checklist.md` — 回归检查清单
- `docs/03-engineering/phase1.5/phase1.5-tech-debt-plan.md` — Phase 1.5 技术债清理计划
- `docs/03-engineering/release/launch-checklist.md` — 发布检查清单
- `docs/03-engineering/release/feishu-publish-runbook.md` — 飞书发布 Runbook

### 04-operations（阶段运营与治理）

**当前运营：**

- `docs/04-operations/development-issues-summary-2026-05-02.md` — 开发问题汇总

**Phase 4：**

- `docs/04-operations/phase4/phase3-retrospective-and-phase4-proposal-2026-04-16.md` — Phase 3 回顾与 Phase 4 提案
- `docs/04-operations/phase4/roadmap-v1.2-impact-assessment.md` — Roadmap V1.2 影响评估

### 05-knowledge-base（领域知识库）

**产品开发流程：**

- `docs/knowledge-base/01-product-development/01-development-overview.md`
- `docs/knowledge-base/01-product-development/02-requirement-phase.md`
- `docs/knowledge-base/01-product-development/03-design-phase.md`
- `docs/knowledge-base/01-product-development/04-development-phase.md`
- `docs/knowledge-base/01-product-development/05-testing-phase.md`
- `docs/knowledge-base/01-product-development/06-release-phase.md`
- `docs/knowledge-base/01-product-development/07-operation-phase.md`

**技术架构专题：**

- `docs/knowledge-base/02-technical-architecture/01-architecture-overview.md`
- `docs/knowledge-base/02-technical-architecture/02-layered-architecture.md`
- `docs/knowledge-base/02-technical-architecture/03-state-management.md`
- `docs/knowledge-base/02-technical-architecture/04-domain-driven-design.md`
- `docs/knowledge-base/02-technical-architecture/05-performance-optimization.md`
- `docs/knowledge-base/02-technical-architecture/06-testing-strategy.md`
- `docs/knowledge-base/02-technical-architecture/07-deployment-architecture.md`

**项目特定知识：**

- `docs/knowledge-base/03-project-specific/01-current-tech-stack.md`
- `docs/knowledge-base/03-project-specific/02-code-patterns.md`
- `docs/knowledge-base/03-project-specific/03-development-standards.md`
- `docs/knowledge-base/03-project-specific/04-opencode-platform-reference.md` — OpenCode 模式与代理体系参考

### 99-archive（历史归档）

- `docs/99-archive/文档索引.md` — 旧版中文文档索引（已废弃，由本 README 替代）
- `docs/99-archive/product-roadmap.md` — 产品规划 V1.0（已归档，被 V1.2 替代）
- `docs/99-archive/product-roadmap-v2.md` — 产品规划 V2.3（已归档，被 V1.2 替代）
- `docs/99-archive/design-specification.md` — 设计规范 MUI 版（已废弃，由 shadcn V2 替代）
- `docs/99-archive/component-system-proposal-mui.md` — MUI 组件系统提案（已归档）
- `docs/99-archive/gradient-token-migration-plan.md` — 渐变 Token 迁移方案（已归档）
- `docs/99-archive/commercialization-roadmap-2026-04-25.md` — 商业化路线图（已归档，内容纳入 V1.2）
- `docs/99-archive/four-page-optimization-plan.md` — 四页面优化方案（已归档，MUI 旧栈）
- `docs/99-archive/gantt-component-analysis.md` — 甘特图组件分析（已归档，MUI 旧栈）
- `docs/99-archive/market-trend-analysis-2026-04-25.md` — 市场趋势分析（已归档）
- `docs/99-archive/project-detail-layout-diagnosis.md` — 项目详情布局诊断（已归档，MUI 旧栈）
- `docs/99-archive/ui-ux-improvement-proposal-2026-04-24.md` — UI/UX 改进提案（已归档，MUI 旧栈）
- `docs/99-archive/view-components-evaluation.md` — 视图组件评估（已归档）
- `docs/99-archive/visual-audit-report-2026-04-25.md` — 视觉审计报告（已归档，MUI 旧栈）
- `docs/99-archive/DESIGN_SPECIFICATION_v2.0_original.md` — 设计规范 V2.0 原始完整版（已归档）
- `docs/99-archive/phase1/` — Phase 1 评估与治理文档（已归档）
  - `development-progress-assessment-2026-04-25.md` — P1-P1.5 进度评估
  - `p1-p1.5-fix-plan-2026-04-25.md` — P1-P1.5 修复计划
- `docs/99-archive/phase3/` — Phase 3 评估与治理文档（已归档）
  - `cloudbase-e2e-checklist.md` — CloudBase E2E 检查清单
  - `collaboration-matrix.md` — 协作矩阵
  - `local-backend-feasibility.md` — 本地后端可行性
  - `weekly-governance-metrics.md` — 周度治理指标
  - `document-governance-audit-2026-04-16.md` — 文档治理审计
- `docs/99-archive/phase4/` — Phase 4 一次性评估报告（已归档）
  - `development-progress-assessment-2026-04-23.md` — Phase 4 进度评估
  - `page-issues-audit-2026-04-25.md` — 页面问题审计
  - `phase15-assessment-2026-04-25.md` — Phase 1.5 评估
  - `task-center-prd-evaluation-report.md` — 任务中心 PRD 评估
  - `task-management-assessment-2026-04-23.md` — 任务管理评估
  - `task-missing-fields-report-2026-04-23.md` — 任务缺失字段报告
  - `task-simplification-proposal-2026-04-23.md` — 任务简化提案
- `docs/99-archive/legacy-chinese/` — 10 篇中文原始文档（已迁移到 `docs/` 英文版）
  - `产品规划文档.md` → `99-archive/product-roadmap.md`
  - `任务中心需求文档.md` → `01-product/task-center-prd.md`
  - `任务树建模说明.md` → `02-architecture/task-tree-modeling.md`
  - `多Agent建店管理平台_V1_PRD.md` → `01-product/multi-agent-v1-prd.md`
  - `多Agent建店管理平台_V1_技术方案.md` → `02-architecture/multi-agent-v1-technical-design.md`
  - `标准库结构化说明.md` → `02-architecture/structured-standard-library.md`
  - `标准管理需求文档.md` → `01-product/standard-management-prd.md`
  - `状态机设计说明.md` → `02-architecture/state-machine-design.md`
  - `采购管理需求文档.md` → `01-product/procurement-management-prd.md`
  - `项目管理需求文档.md` → `01-product/project-management-prd.md`

## 维护要求

- 根目录不再新增业务文档 `.md`
- **新增/修改 active 文档必须同步更新本索引** ⚠️ 此为强制规则
- 所有文档引用统一使用 `docs/...` 路径
- 每季度执行一次索引完整性审计（参照本次审计方法论）
