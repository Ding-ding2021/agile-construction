# Draft: Prometheus 模式

## Requirements (confirmed)

- Prometheus 作为整个任务的计划与调度核心，负责定义任务的执行路径、选择合适的模式（Direct/Explore/Librarian/Oracle），并产出可执行的工作计划。
- 该 draft 用于清晰化 Prometheus 的工作约束、触发条件、产出物及验收标准。

## Technical Decisions

- Prometheus 的核心职责是“计划优先、风险最小化、可证伪的执行路径”。
- 它不会直接修改业务代码，除非在计划阶段明确作为待执行的直接任务被落地。
- 触发模式的决定基于任务的复杂度、跨文件需求以及是否需要外部信息检索。
- Prometheus 产出单一计划文件（.sisyphus/plans/{name}.md），所有执行由后续 Wave/Agent 执行。

## Research Findings

- 从对话历史看，Prometheus 角色定位为执行前的全局规划者，确保每一步都可落地与可度量。
- 需要时会组合调用 Explore/Librarian/Oracle 等子代理，确保计划的完整性与可验证性。

## Open Questions

- 是否需要为 Prometheus 增设自动化的“Plan Health Check”钩子以在计划阶段自动触发 Momus 审核？
- Prometheus 是否应输出一个“风险清单”和“验收准则清单”作为 Plan 的附录？

## Scope Boundaries

- IN: 需求解释、任务分解、执行路径设计、Plan 文件输出、验收策略。
- OUT: 直接修改业务代码、部署配置、环境搭建等。

## Work Objectives

- Core Objective: 以决策完备的计划支撑后续执行，确保实现零认知判断的工作交付。
- Deliverables: .sisyphus/plans/prometheus-mode.md（计划输出模板），以及相应的草稿/草案更新。
- Definition of Done: Plan 文件中每个任务具备明确的执行步骤、可验证的验收条件、QA 场景与证据路径。
- Must Have: 统一的 Plan 结构、清晰的 Waves/任务依赖、Agent 配置描述。
- Must NOT Have: 直接执行业务代码、跳过计划阶段、省略 QA 场景。

## Verification Strategy

- ZERO HUMAN INTERVENTION 验证：Plan 包含自动化的验收条件和 QA 情景，且能被 Momus/Oracle 复核。
- Evidence: .sisyphus/evidence/task-prometheus.{ext}（待填充）

## Execution Strategy

- Plan 所有任务以单一 Plan 文件组织，分阶段分波次执行。
- Wave 1: 基础规划任务（定义模式、输出模板、引用标准）。
- Wave 2: 针对子任务的模式分配与依赖梳理。

## Final Review

- 当前 Draft 供审核通过后，将转化为正式 Plan 并提交给 Momus 审核。

## Next Action

- 是否将此 Draft 转为正式 Plan？需要我继续推进并生成 .sisyphus/plans/prometheus-mode.md 作为正式 Plan。
