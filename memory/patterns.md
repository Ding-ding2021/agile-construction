# 模式识别记录

## 2026-05-15 Schema Drift 模式：SQL 硬编码列名 vs Prisma 模型

**模式**：`projectAggregator.ts` 中多处 SQL 查询使用硬编码列名（`risk_level`, `settlement_status`, `cl.status`），但这些列名在 Prisma schema 中已更名或不存在。

**根因**：聚合器的 SQL 查询与 Prisma schema 定义之间存在手动映射关系，当 schema 变更时，SQL 没有同步更新。

**检测方法**：使用 `npx vitest run` 发现聚合器 SQL 错误（`no such column`）。

**修复模式**：将 SQL 列名修正为 schema 实际定义的字段。对于不存在对应列的字段，使用 `NULL as alias`。

**建议改进**：

- 考虑为聚合器 SQL 添加集成测试（已被本阶段覆盖）
- 所有复杂 SQL 查询应建立列名清单，随 schema 变更同步维护
- 长期方案：使用 Prisma Client 替代裸 SQL（消除手动列名映射）

## 2026-05-15 角色职责分离模式

**模式**：前端代码由设计师（苏染）编写，后端代码由开发者（陈锋）编写，测试代码由测试工程师（周严）编写。每个角色只写自己专业领域的代码，不越界。

**适用场景**：

- 所有涉及前端的 Build 任务
- 所有涉及测试框架的任务
- 需要明确代码归属的场景

## 2026-05-15 Pre-dev Squad + Post-dev Squad 全流程模式

**模式**：L3 任务走完整 Harness 七阶段流水线，包括 Pre-dev Squad 评估（4 角色）、Build、Test、Post-dev Squad 验收（4 角色）、增量重审（仅派问题角色）。

**适用场景**：

- 所有 L2/L3 任务
- 跨多文件的架构变更
- 涉及数据模型变更的任务
