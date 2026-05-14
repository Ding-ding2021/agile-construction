---
id: AI-PRODUCT-PLANNING
human_source: docs/01-product/product-planning-v1.md
status: active
last_synced: 2026-05-13
---

# AI 合约：产品规划

## 模块定位

数字营建项目的最高层产品规划文档，定义 V1 三大核心能力和两阶段战略方向。

## 核心实体

| 实体  | 字段                                             | 状态机                           |
| ----- | ------------------------------------------------ | -------------------------------- |
| 项目  | id, name, status(聚合推导), brand, template_id   | 无独立状态机，状态从任务聚合推导 |
| 任务  | id, title, status, assignee, std_ref, project_id | 草稿→待分配→执行中→待验收→已完成 |
| 标准  | id, name, category, rules[], templates[]         | -                                |
| Agent | id, type, config, enabled                        | -                                |

## 状态推导规则

| 项目聚合标签 | 触发条件（任务聚合推导）               |
| ------------ | -------------------------------------- |
| 待立项       | 项目刚创建，尚未生成任务模板           |
| 待执行       | 所有任务为`待分配`或`草稿`             |
| 执行中       | 存在`执行中`或`待验收`的任务           |
| 待验收       | 所有执行类任务已完成，存在`待验收`任务 |
| 整改中       | 存在验收结果为`不通过`的任务           |
| 可归档       | 所有任务为`已完成`或`已关闭`           |

## 业务规则

1. 项目没有独立状态机，项目概览中的状态标签从任务聚合实时计算
2. 项目不设人工操作的"状态按钮"
3. 业务变化在任务层吸收，不修改项目模型
4. 标准库驱动任务生成，模板匹配→任务树创建
5. 所有 AI 输出必须经过人工确认才可生效
6. 关键动作和 Agent 决策必须全程留痕可审计

## 核心模块依赖

| 模块     | 依赖关系                               |
| -------- | -------------------------------------- |
| 项目管理 | 项目容器，依赖任务中心的状态聚合能力   |
| 任务中心 | 任务状态机实现、任务树结构、标准库绑定 |
| 标准管理 | 标准库为任务生成提供模板和条款         |
| 人员管理 | 项目成员、工队分配、角色权限           |
| 采购管理 | 采购申请、订单管理，与任务关联         |
| AI Agent | 在受控流程节点提供辅助建议             |

## V1 模块清单

- 项目管理（L3: `project-management-prd.md`）
- 任务中心（L3: `task-center-prd.md`）
- 人员管理（L3: `personnel-management-prd.md`）
- 采购管理（L3: `procurement-management-prd.md`）
- 标准管理（L3: `docs/99-archive/product/standard-management-prd.md`，已归档，详见架构文档 `standard-management-architecture.md`）
- AI Agent（L3: `docs/99-archive/product/multi-agent-v1-prd.md`，已归档，详见架构文档 `agent-architecture.md` / `digital-employee-prd.md`）
- 系统设置（L3: `settings-prd.md`）

## 设计原则

1. 任务原子化：任务是最小执行单元和状态单元
2. 任务驱动项目：项目是容器，进度取决于任务执行速度
3. 标准先行：先沉淀标准，再做自动化和智能化
4. AI 辅助 + 人工兜底：Agent 建议，人工确认
5. 架构预留：V1 设计预留 V2 平台化扩展点
