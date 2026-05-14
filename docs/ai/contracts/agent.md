---
id: AI-AGENT
human_source: docs/02-architecture/agent-architecture.md
status: active
last_synced: 2026-05-14
title: AI 合约：项目经理 Agent 架构
---

# AI 合约：项目经理 Agent 架构

## 实体定义

| 概念     | 对应数据表                                | 说明                                       |
| -------- | ----------------------------------------- | ------------------------------------------ |
| Agent    | 运行时实例（无持久化表）                  | Harness 7 阶段引擎驱动的 AI 执行单元       |
| MCP 工具 | `src-next/agent/mcp/tools/*.ts`           | 封装 local-api 端点为 Agent 可调用的工具   |
| Skill    | `src-next/agent/skills/*.ts`              | Agent 的核心能力函数，通过 MCP 读写数据    |
| 角色配置 | `.trae/agents/agent-project-manager.yaml` | 定义 Agent 角色名、MCP 工具集、Skills 列表 |

## API 骨架（Agent 使用的现有端点）

| 端点                        | 方法 | MCP 工具名               | 说明         |
| --------------------------- | ---- | ------------------------ | ------------ |
| /projects/:code             | GET  | get_project_info         | 项目上下文   |
| /projects/:code/tasks       | GET  | list_project_tasks       | 按条件查任务 |
| /projects/:code/tasks       | POST | create_task              | 创建任务     |
| /projects/:code/tasks/batch | POST | batch_create_tasks       | 批量创建     |
| /projects/:code/tasks/:id   | GET  | get_task_detail          | 任务详情     |
| /projects/:code/tasks/:id   | PUT  | update_task              | 更新任务     |
| /projects/:code/tasks/tree  | GET  | get_task_tree            | 任务树       |
| /tasks/:id/relations        | POST | create_task_relations    | 创建依赖     |
| /standards                  | GET  | search_standards         | 搜索标准     |
| /standards/:id/clauses      | GET  | get_standard_clauses     | 标准条款     |
| /personnel/workers          | GET  | list_available_workers   | 可用人员     |
| /procurement/orders         | POST | create_procurement_order | 创建采购单   |

## Skills 清单

| Skill              | 输入                          | 输出                       | MCP 调用                 |
| ------------------ | ----------------------------- | -------------------------- | ------------------------ |
| project-decomposer | projectCode, templateRef      | ProjectTask 树             | batch_create_tasks       |
| dependency-builder | taskTree, dependencyBlueprint | TaskRelation[]             | create_task_relations    |
| schedule-planner   | taskTree, relations           | startDate/dueDate 推算结果 | update_task              |
| progress-analyzer  | taskList                      | 进度汇总 + SLA 标记        | list_project_tasks       |
| cost-tracker       | taskList, orders              | 工时偏差 + 采购偏差        | list_project_tasks       |
| quality-monitor    | submissions, standards        | 通过率 + 整改统计          | 读 TaskSubmission 数据   |
| team-coordinator   | taskList, workers             | 工作量分布 + 超载预警      | list_available_workers   |
| risk-identifier    | taskList, relations, orders   | 风险项列表（含严重度）     | 读多源数据               |
| material-planner   | templateRef, projectInfo      | 材料清单草案               | search_standards         |
| procurement-syncer | materialList, taskCodes       | 采购单 + 状态跟踪          | create_procurement_order |
| report-writer      | 各 Skill 输出                 | 周报/摘要/通报文本         | 纯读                     |

## 业务规则

| 规则 | 内容                                                                          |
| ---- | ----------------------------------------------------------------------------- |
| R1   | Agent 永远不直接操作数据库，只能通过 MCP 工具调用 API                         |
| R2   | Agent 产物落库后 status="草稿"，人类确认后才生效                              |
| R3   | Agent 不跳过状态机守卫修改任务状态                                            |
| R4   | WBS 导图和 WBS 表格共享同一份 ProjectTask 数据                                |
| R5   | Agent 通过 Harness 7 阶段引擎执行：Align→Plan→Build→Test→Review→Deploy→Evolve |
| R6   | Agent 所有决策和输出记录到 TaskEventLog                                       |
| R7   | 换 Agent = 换角色 yaml + 换 Skills 列表，Harness 和 MCP 不变                  |

## 前端界面

| 界面         | 数据源                         | 关键组件（待建）                    |
| ------------ | ------------------------------ | ----------------------------------- |
| WBS 思维导图 | ProjectTask.parentId           | TaskMindMap（可拖拽树）             |
| WBS 树形表格 | ProjectTask（全字段）          | TaskEditableTable（内联编辑）       |
| 紧前关系图   | TaskRelation                   | DependencyFlowChart（可拖拽连线）   |
| 甘特图       | ProjectTask（时间字段）        | GanttChart（可拖拽日期）            |
| 进度跟踪     | ProjectTask + SLA              | ProgressDashboard（含服务协议标记） |
| 成本控制     | ProjectTask + ProcurementOrder | CostPanel（偏差高亮）               |
| 相关方沟通   | 各 Skill 聚合                  | ReportEditor（富文本 + 发送）       |

## 测试要点

- [ ] project-decomposer：模板→任务树展开正确（含子任务和嵌套）
- [ ] dependency-builder：依赖蓝图映射为正确的 TaskRelation
- [ ] schedule-planner：紧前关系推导的时间线不出现循环依赖
- [ ] risk-identifier：各维度触发条件正确，无误报/漏报
- [ ] Agent 输出落库后，前端视图可以正确渲染
- [ ] 人类修改 Agent 产物后，Agent 可感知变化
- [ ] Agent 不绕过状态机守卫：尝试非法状态变更应被拒绝
- [ ] E2E：触发分解→审阅修改→确认落库→持续监控 完整链路
