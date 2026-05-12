---
id: AI-TASK-CENTER
human_source: docs/01-product/task-center-prd.md
status: active
last_synced: 2026-05-11
title: AI 合约：任务中心
last_updated: 2026-05-12
---

# AI 合约：任务中心

## 模块定位

执行底座模块 — 任务树、责任分配、状态推进、标准绑定、执行记录、催办协同

## 核心实体

| 实体                  | 字段                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 状态机                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| TASK                  | task_id, project_id, work_package_id, parent_task_id, task_code, task_name, node_level_type(project_root/work_package/task), task_type, source_type(manual/template/agent/derived), priority(low/medium/high/urgent), required_flag, milestone_flag, assignee_type, assignee_id, owner_role, planned_start_at, planned_end_at, actual_start_at, actual_end_at, sla_rule_id, sla_status(normal/warning/overdue), progress(0-100), is_blocked, blocked_reason, risk_level(low/medium/high), standard_binding_status(bound/unbound), standard_snapshot_id, snapshot_status(draft/bound/expired), derived_from_task_id, is_rectification, rectification_reason, close_reason, reopen_count, tags, created_by/at, updated_by/at | 草稿 → 待分配 → 待执行 → 执行中 → 待提交 → 待验收 → 已完成 |
| WORK_PACKAGE          | work_package_id, project_id, cost_account_id, work_package_code, work_package_name, manager_id, status(规划中/执行中/已完成/已暂停), planned_work_hours, actual_work_hours, budget, progress, planned/actual_start/end_at                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | —                                                          |
| COST_ACCOUNT          | cost_account_id, cost_account_code, cost_account_name, budget_amount, actual_amount                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | —                                                          |
| TASK_RELATION         | relation_id, from_task_id, to_task_id, relation_type(parent_child/depends_on/derived_from/relates_to), lag_days, active_flag                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | —                                                          |
| TASK_STANDARD_BINDING | binding_id, task_id, standard_package_id, execution_standard_id, acceptance_standard_id, checklist_template_id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | —                                                          |
| TASK_SNAPSHOT         | snapshot_id, task_id, standard_snapshot_id, snapshot_version, snapshot_data(json), generated_at                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | —                                                          |
| TASK_CHECKLIST        | checklist_id, task_id, item_name, item_type(动作/资料/回执/确认), required_flag, status, evidence_type, sort_order                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | —                                                          |
| TASK_SUBMISSION       | submission_id, task_id, submission_type, submission_desc, attachment_ids, submission_status, submitted_by/at, reviewed_by/at, review_result, review_comment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | —                                                          |
| TASK_REMINDER         | reminder_id, task_id, reminder_type(系统预警/人工催办/自动催办/升级催办), reminder_reason, receiver_type, receiver_id, feedback_summary, closed_flag                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | —                                                          |
| TASK_EVENT_LOG        | log_id, task_id, event_type, event_desc, before_value(json), after_value(json), operator_id, operator_source(user/agent/system)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | —                                                          |
| TASK_ATTACHMENT       | attachment_id, task_id, submission_id, file_name, file_type, mime_type, file_size, url, is_required_evidence, uploaded_by/at, is_deleted                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | —                                                          |
| PERSONNEL (Phase2)    | personnel_id, name, role, department, status, email, phone, is_external, skills(json)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | —                                                          |

## 任务状态机（10 状态）

| 状态   | 说明                        | 负责角色              | 终态? | 可重开? |
| ------ | --------------------------- | --------------------- | ----- | ------- |
| 草稿   | 模板预生成，待确认激活      | 平台项目经理          | 否    | —       |
| 待分配 | 等待分配执行人或进入派单池  | 平台项目经理/调度平台 | 否    | —       |
| 待执行 | 已分配/派单，等待执行方开始 | 资源方                | 否    | —       |
| 执行中 | 执行方已确认开始            | 资源方                | 否    | —       |
| 已暂停 | 人工暂停，可恢复或终止      | 平台项目经理          | 否    | —       |
| 待提交 | 执行完成，等待提交成果      | 资源方                | 否    | —       |
| 待验收 | 已提交，等待验收检查        | 验收/质检角色         | 否    | —       |
| 不通过 | 验收未通过，需整改          | 验收/质检角色         | 否    | —       |
| 已完成 | 验收通过，闭环              | 系统自动              | 是    | 是      |
| 已关闭 | 取消或关闭                  | 平台项目经理          | 是    | 是      |

## 状态转移

1. 主流转：`草稿 → 待分配 → 待执行 → 执行中 → 待提交 → 待验收 → 已完成`
2. 验收整改：`待验收 → 不通过 → 待执行`（整改）／ `不通过 → 执行中`（小修）
3. 暂停恢复：`执行中 ↔ 已暂停`
4. 取消终止：`待分配 → 已关闭` ／ `执行中 → 已关闭` ／ `已暂停 → 已关闭`
5. 驳回回退：`待提交 → 执行中`（提交驳回）
6. 终态重开：`已完成 → 待分配` ／ `已关闭 → 待分配`（reopen_count +1）

## 守卫条件

| 转移            | 守卫条件                                                            |
| --------------- | ------------------------------------------------------------------- |
| 待分配 → 待执行 | 已分配责任角色/执行人；前置依赖满足；执行标准已绑定；标准快照已生成 |
| 待执行 → 执行中 | 执行主体已确认开始；无阻塞前置任务                                  |
| 执行中 → 待提交 | 执行动作完成；必传资料已提交或已明确不适用                          |
| 待提交 → 待验收 | 提交结果完整；验收标准已绑定；检查项已生成或具备生成条件            |
| 待验收 → 已完成 | 检查项通过；不存在未关闭缺陷                                        |
| 待验收 → 不通过 | 存在关键不合格项；必传资料缺失；关键阈值未满足                      |

## 业务规则

1. **层级规则**：项目(project_root) → 工作包(work_package) → 任务(task)；子任务通过 parent_task_id 自引用，不独立为层级；阶段(stage_id)为属性不入树
2. **成本归集**：所有任务成本归集到所属 work_package_id，成本核算主键 cost_account_id，wp 与 ca 1:1 强约束
3. **继承规则**：子任务默认继承父任务的项目/品牌/门店/阶段/标签/默认标准包/责任角色；子任务可覆盖执行人/计划时间/优先级/标准绑定/附件要求
4. **汇总规则**：父任务进度按必做子任务完成率计算；存在未完成必做子任务时父任务不得完成；父任务完成时间取最后一个必做子任务完成时间
5. **标准绑定**：关键任务至少绑定一个执行标准和一个验收标准；进入执行前必须生成标准快照；已生成快照任务保持原口径
6. **前置依赖**：仅支持 FS(Finish-to-Start)；前置任务未完成后置不可进入执行中；前置任务关闭时需人工确认
7. **派生任务**：派生任务必须保留来源关系；原任务与派生任务状态独立维护；任务表 is_rectification + derived_from_task_id 记录整改链路
8. **阻塞 vs 暂停**：is_blocked 是标记，任务状态不变；已暂停是独立状态需显式恢复
9. **终态重开**：已完成/已关闭可重开到待分配；每次重开 reopen_count +1
10. **审计**：所有关键操作写入 TASK_EVENT_LOG，仅追加不允许物理删除

## 依赖模块

| 模块      | 引用位置                                                    | 依赖内容                     |
| --------- | ----------------------------------------------------------- | ---------------------------- |
| 项目管理  | task.project_id                                             | 项目容器                     |
| 标准管理  | TASK_STANDARD_BINDING, TASK_SNAPSHOT, object_ids            | 执行标准、验收标准、标准快照 |
| 工单/采购 | task_relates_to                                             | 任务与采购/资产/结果对象关联 |
| 合同服务  | task.contract_id, task.service_id, SERVICE_WORK_PACKAGE_REL | 外包任务合同与服务绑定       |

## API 骨架

| 方法  | 路径                         | 说明                                                               |
| ----- | ---------------------------- | ------------------------------------------------------------------ |
| GET   | /api/tasks                   | 任务列表（筛选项：project/brand/store/stage/status/assignee/risk） |
| POST  | /api/tasks                   | 创建任务                                                           |
| GET   | /api/tasks/:id               | 任务详情                                                           |
| PATCH | /api/tasks/:id               | 更新任务字段                                                       |
| POST  | /api/tasks/:id/transition    | 状态流转                                                           |
| GET   | /api/tasks/:id/relations     | 任务关系                                                           |
| POST  | /api/tasks/:id/assign        | 分配执行人                                                         |
| POST  | /api/tasks/:id/dispatch      | 发起派单                                                           |
| POST  | /api/tasks/:id/submit        | 提交结果                                                           |
| POST  | /api/tasks/:id/remind        | 催办                                                               |
| GET   | /api/tasks/:id/logs          | 操作审计日志                                                       |
| POST  | /api/tasks/generate          | 模板实例化生成任务树                                               |
| GET   | /api/task-center/stats       | 统计（待分配/执行中/超时/阻塞数）                                  |
| GET   | /api/dispatch-pool           | 待派单任务池                                                       |
| POST  | /api/dispatch-pool/recommend | 资源推荐                                                           |
| POST  | /api/derived-tasks           | 派生任务（整改/补传等）                                            |

## 关键禁止规则

1. 需验收任务不得跳过"待验收"直接完成
2. 前置未完成任务禁止直接开工
3. 标准未绑定任务不可进入执行态
4. 已完成/已关闭任务默认只读
5. 禁止自依赖和循环依赖
6. 禁止跨品牌读取无权限数据

## 质量门禁

- 任务状态流转必须与状态机口径一致
- 父子任务汇总结果必须正确
- 标准绑定完整率 ≥ 95%
- 必传资料完整率 ≥ 95%
- 首次验收通过率 ≥ 70%
- 超 SLA 任务占比 ≤ 10%
- 派单失败和整改派生链路可追溯
- Agent 失败可转人工兜底
- 关键字段修改记录变更原因和操作来源
- 所有异常保留来源、处理人、处理结论
