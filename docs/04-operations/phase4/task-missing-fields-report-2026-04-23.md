---
title: Task Missing Fields Report 2026 04 23
status: archived
last_updated: 2026-05-05
---

# 任务管理模块缺失字段核查报告

> 日期：2026-04-23
> 核查范围：PRD 5.1-5.7 + 工作包字段 + 阻塞派生字段 + 整改任务字段
> 代码基准：`src/components/task/taskManagement.types.ts` 中的 `TaskItem` 与 `TaskDetail`

---

## 一、字段对照总览

PRD 共定义 **11 + 8 + 8 + 6 + 4 + 5 + 7 = 49 个任务主字段**（不含工作包/关系/日志等子实体），加上工作包 8 个字段、阻塞派生 7 个字段、整改 3 个字段，总计 **67 个字段**。

代码当前实现情况：

- `TaskItem`：约 32 个字段（含展示字段与 PRD 扩展字段）
- `TaskDetail`：额外 14 个字段（继承自 TaskItem）
- **合计缺失约 23 个字段**，另有 **2 个字段数据口径不匹配**

---

## 二、逐层对照详情

### 2.1 基础标识（PRD 5.1）— 缺失 3 个

| PRD 字段           | 代码字段          | 状态 | 说明                                   |
| ------------------ | ----------------- | ---- | -------------------------------------- |
| `task_id`          | `taskId`          | ✅   | —                                      |
| `project_id`       | `projectId`       | ✅   | —                                      |
| `program_id`       | —                 | ❌   | 项目集 ID，V1 如支持多项目集需补       |
| `portfolio_id`     | —                 | ❌   | 项目组合 ID，V1 如支持组合管理需补     |
| `parent_task_id`   | `parentTaskId`    | ✅   | —                                      |
| `task_code`        | `code`            | ✅   | —                                      |
| `task_name`        | `name`            | ✅   | —                                      |
| `task_description` | `taskDescription` | ✅   | —                                      |
| `task_type`        | `taskType`        | ✅   | —                                      |
| `node_level_type`  | `nodeLevelType`   | ✅   | —                                      |
| `business_domain`  | —                 | ❌   | 业务域（如设计/施工/验收），筛选维度用 |

### 2.2 业务属性（PRD 5.2）— 缺失 6 个

| PRD 字段          | 代码字段                    | 状态 | 说明                                                     |
| ----------------- | --------------------------- | ---- | -------------------------------------------------------- |
| `source_type`     | `sourceType` / `originType` | ✅   | —                                                        |
| `priority`        | —                           | ❌   | **优先级（低/中/高/紧急），与 `riskLevel` 是不同的维度** |
| `required_flag`   | —                           | ❌   | 是否必做，影响父任务完成判定                             |
| `milestone_flag`  | —                           | ❌   | 是否里程碑，影响关键路径识别                             |
| `store_id`        | —                           | ❌   | 门店 ID，任务归属核心维度                                |
| `brand_id`        | —                           | ❌   | 品牌 ID，筛选与权限分域用                                |
| `stage_id`        | —                           | ❌   | 项目生命周期阶段 ID，筛选与统计用                        |
| `work_package_id` | `workPackageId`             | ✅   | —                                                        |

### 2.3 执行属性（PRD 5.3）— 缺失 1 个

| PRD 字段           | 代码字段                     | 状态 | 说明                      |
| ------------------ | ---------------------------- | ---- | ------------------------- |
| `owner_role`       | `ownerRole`                  | ✅   | —                         |
| `assignee_type`    | `assigneeType` (TaskDetail)  | ✅   | —                         |
| `assignee_id`      | `assigneeId`                 | ✅   | —                         |
| `planned_start_at` | `plannedStartAt`             | ✅   | —                         |
| `planned_end_at`   | `plannedEndAt`               | ✅   | —                         |
| `actual_start_at`  | `actualStartAt` (TaskDetail) | ✅   | —                         |
| `actual_end_at`    | `actualEndAt` (TaskDetail)   | ✅   | —                         |
| `sla_rule_id`      | —                            | ❌   | SLA 规则 ID，系统配置引用 |

### 2.4 财务与合同属性（PRD 5.4）— 缺失 3 个

| PRD 字段             | 代码字段        | 状态 | 说明                               |
| -------------------- | --------------- | ---- | ---------------------------------- |
| `cost_account_id`    | `costAccountId` | ✅   | —                                  |
| `outsource_flag`     | —               | ❌   | 是否外包，决定任务是否进入待派单池 |
| `contract_id`        | `contractId`    | ✅   | —                                  |
| `service_id`         | `serviceId`     | ✅   | —                                  |
| `vendor_id`          | —               | ❌   | 供应商 ID，外包任务必填            |
| `settlement_rule_id` | —               | ❌   | 结算规则 ID                        |

### 2.5 标准属性（PRD 5.5）— 缺失 1 个 + 2 个口径不匹配

| PRD 字段                  | 代码字段              | 状态 | 说明                                                       |
| ------------------------- | --------------------- | ---- | ---------------------------------------------------------- |
| `execution_standard_ids`  | `executionStandards`  | ⚠️   | **口径不匹配：PRD 要求存 ID 数组，代码存的是文本内容数组** |
| `acceptance_standard_ids` | `acceptanceStandards` | ⚠️   | **同上，应存标准对象 ID 列表**                             |
| `standard_snapshot_id`    | `standardSnapshotId`  | ✅   | —                                                          |
| `checklist_template_id`   | —                     | ❌   | 清单模板 ID，用于从模板生成检查项                          |

### 2.6 状态属性（PRD 5.6）— 完整 ✅

| PRD 字段         | 代码字段                     | 状态 | 说明 |
| ---------------- | ---------------------------- | ---- | ---- |
| `task_status`    | `status`                     | ✅   | —    |
| `blocked_reason` | `blockedReason` (TaskDetail) | ✅   | —    |
| `risk_level`     | `riskLevel`                  | ✅   | —    |
| `close_reason`   | `closeReason`                | ✅   | —    |
| `reopen_count`   | `reopenCount`                | ✅   | —    |

### 2.7 管理属性（PRD 5.7）— 缺失 1 个

| PRD 字段               | 代码字段                      | 状态 | 说明                                                                              |
| ---------------------- | ----------------------------- | ---- | --------------------------------------------------------------------------------- |
| `tags`                 | —                             | ❌   | 标签数组，用于灵活分组和筛选                                                      |
| `attachments`          | `TaskAttachment[]` (独立接口) | ⚠️   | 有独立接口但非 `TaskItem` 字段；建议 `TaskItem` 增加 `attachmentCount` 或保持独立 |
| `remark`               | `remark` (TaskDetail)         | ✅   | —                                                                                 |
| `created_by`           | `createdBy`                   | ✅   | —                                                                                 |
| `updated_by`           | `updatedBy`                   | ✅   | —                                                                                 |
| `last_operated_by`     | `lastOperatedBy`              | ✅   | —                                                                                 |
| `last_operated_source` | `lastOperatedSource`          | ✅   | —                                                                                 |

### 2.8 工作包字段（PRD 3.1 新增）— 缺失 3 个

| PRD 字段            | 代码字段        | 状态 | 说明                   |
| ------------------- | --------------- | ---- | ---------------------- |
| `work_package_id`   | `workPackageId` | ✅   | —                      |
| `work_package_code` | —               | ❌   | 工作包编码，业财对账用 |
| `work_package_name` | —               | ❌   | 工作包名称，展示用     |
| `cost_account_id`   | `costAccountId` | ✅   | —                      |
| `cost_account_code` | —               | ❌   | 成本账户编码           |
| `cost_account_name` | —               | ❌   | 成本账户名称           |
| `service_id`        | `serviceId`     | ✅   | —                      |
| `contract_id`       | `contractId`    | ✅   | —                      |

### 2.9 阻塞与派生字段（PRD 3.8）— 缺失 7 个

| PRD 字段                     | 代码字段 | 状态 | 说明                       |
| ---------------------------- | -------- | ---- | -------------------------- |
| `blocked_reason_code`        | —        | ❌   | 阻塞原因编码（标准化分类） |
| `blocked_source_type`        | —        | ❌   | 阻塞来源类型               |
| `blocked_source_id`          | —        | ❌   | 阻塞来源 ID                |
| `derived_source_task_id`     | —        | ❌   | 派生来源任务 ID            |
| `derived_reason`             | —        | ❌   | 派生原因                   |
| `derived_result_object_type` | —        | ❌   | 派生结果对象类型           |
| `derived_result_object_id`   | —        | ❌   | 派生结果对象 ID            |

### 2.10 整改任务字段（PRD 6.5）— 缺失 3 个

| PRD 字段               | 代码字段 | 状态 | 说明                      |
| ---------------------- | -------- | ---- | ------------------------- |
| `is_rectification`     | —        | ❌   | 标记是否为整改任务        |
| `derived_from_task_id` | —        | ❌   | 指向原任务 ID（整改专用） |
| `rectification_reason` | —        | ❌   | 整改原因描述              |

---

## 三、缺失字段汇总（按优先级）

### P0 — 高优先级（建议本周补齐）

影响主流程、标准绑定或整改闭环的字段：

| 序号 | 字段名                    | PRD 出处  | 补全建议                                                                            |
| ---- | ------------------------- | --------- | ----------------------------------------------------------------------------------- |
| 1    | `priority`                | 5.2       | 新增 `TaskPriority = '低' \| '中' \| '高' \| '紧急'`，与 `riskLevel` 并存           |
| 2    | `execution_standard_ids`  | 5.5       | `executionStandards` 从 `string[]` 改为 `string[]`（ID 列表），文本内容从标准库查询 |
| 3    | `acceptance_standard_ids` | 5.5       | 同上                                                                                |
| 4    | `checklist_template_id`   | 5.5       | 新增字段，用于从模板生成检查项                                                      |
| 5    | `is_rectification`        | 6.5       | 新增 `boolean`，整改任务标记                                                        |
| 6    | `derived_from_task_id`    | 6.5 / 3.8 | 新增 `string`，指向原任务 ID                                                        |
| 7    | `rectification_reason`    | 6.5       | 新增 `string`，整改原因                                                             |

### P1 — 中优先级（建议 2 周内补齐）

影响筛选、展示或业务属性完整性：

| 序号 | 字段名                | PRD 出处 | 补全建议                    |
| ---- | --------------------- | -------- | --------------------------- |
| 8    | `required_flag`       | 5.2      | 新增 `boolean`，是否必做    |
| 9    | `milestone_flag`      | 5.2      | 新增 `boolean`，是否里程碑  |
| 10   | `store_id`            | 5.2      | 新增 `string`，门店 ID      |
| 11   | `brand_id`            | 5.2      | 新增 `string`，品牌 ID      |
| 12   | `stage_id`            | 5.2      | 新增 `string`，阶段 ID      |
| 13   | `outsource_flag`      | 5.4      | 新增 `boolean`，是否外包    |
| 14   | `vendor_id`           | 5.4      | 新增 `string`，供应商 ID    |
| 15   | `settlement_rule_id`  | 5.4      | 新增 `string`，结算规则 ID  |
| 16   | `tags`                | 5.7      | 新增 `string[]`，标签数组   |
| 17   | `work_package_code`   | 3.1      | 新增 `string`，工作包编码   |
| 18   | `work_package_name`   | 3.1      | 新增 `string`，工作包名称   |
| 19   | `cost_account_code`   | 3.1      | 新增 `string`，成本账户编码 |
| 20   | `cost_account_name`   | 3.1      | 新增 `string`，成本账户名称 |
| 21   | `blocked_reason_code` | 3.8      | 新增 `string`，阻塞原因编码 |
| 22   | `blocked_source_type` | 3.8      | 新增 `string`，阻塞来源类型 |
| 23   | `blocked_source_id`   | 3.8      | 新增 `string`，阻塞来源 ID  |
| 24   | `derived_reason`      | 3.8      | 新增 `string`，派生原因     |

### P2 — 低优先级（V1 可延后或用其他方式推导）

| 序号 | 字段名                       | PRD 出处 | 延后理由                                   |
| ---- | ---------------------------- | -------- | ------------------------------------------ |
| 25   | `program_id`                 | 5.1      | V1 无项目集管理                            |
| 26   | `portfolio_id`               | 5.1      | V1 无项目组合管理                          |
| 27   | `business_domain`            | 5.1      | 可用 `taskType` 或 `sourceType` 近似表达   |
| 28   | `sla_rule_id`                | 5.3      | SLA 规则为系统配置，任务层通常只存计算结果 |
| 29   | `derived_result_object_type` | 3.8      | 整改任务 V1 基础闭环可先不追溯结果对象     |
| 30   | `derived_result_object_id`   | 3.8      | 同上                                       |

---

## 四、口径不匹配问题（需修正）

### 问题 1：`executionStandards` / `acceptanceStandards` 存的是文本而非 ID

**现状**：

```typescript
// TaskDetail
declare executionStandards: string[]; // ["标准1内容", "标准2内容"]
declare acceptanceStandards: string[];
```

**PRD 要求**：

```typescript
// 应存标准对象 ID 列表
executionStandardIds: string[]; // ["STD-001", "STD-002"]
acceptanceStandardIds: string[];
```

**影响**：

- 无法追溯标准来源和版本
- 标准更新后无法判断任务绑定的是哪个版本
- 无法生成标准快照（快照需要引用具体标准 ID + 版本）

**建议修正**：

1. `TaskDetail` 中 `executionStandards` → 改名为 `executionStandardIds`（`string[]`）
2. `TaskDetail` 中 `acceptanceStandards` → 改名为 `acceptanceStandardIds`（`string[]`）
3. 文本内容在详情页从标准库服务实时查询展示
4. 标准快照生成时基于 `executionStandardIds` + `acceptanceStandardIds` + 当前版本号固化

---

## 五、补充建议

### 5.1 `TaskItem` 与 `TaskDetail` 字段分层问题

当前部分字段仅在 `TaskDetail` 中可用，列表视图无法展示：

- `actualStartAt` / `actualEndAt`
- `remark`
- `blockedReason`

建议：

- `actualStartAt` / `actualEndAt` → 上提到 `TaskItem`，列表时间列可展示为"计划 04/20~04/25 | 实际 04/21~--"
- `remark` → 保持仅在 Detail 中，列表不需要
- `blockedReason` → 上提到 `TaskItem`（或保持 Detail，列表用 `isBlocked` 徽标表达）

### 5.2 投影字段与主数据字段边界

当前 `TaskItem` 中混有多个**计算投影字段**：

- `statusTone`（由 status 推导）
- `slaStatus` / `slaTone`（由时间 + slaRule 推导）
- `riskTone`（由 riskLevel 推导）
- `predecessorStatus`（由 task_relation 推导）
- `standardBindingStatus`（由 standardSnapshotId 推导）
- `snapshotStatus`（由 standardSnapshotId 推导）
- `isBlocked`（由 blockedReason 推导）

建议：

- 保留这些投影字段（便于列表展示），但明确标注为 `derived`（计算属性）
- 或在类型定义中分离 `TaskItemBase`（纯数据）和 `TaskItemView`（含投影）

---

## 六、快速补全清单（代码修改点）

如决定补齐全部 P0 + P1 字段（24 个），需修改的文件：

| 文件                          | 修改内容                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `taskManagement.types.ts`     | `TaskItem` 新增 24 个字段；`TaskDetail` 修正 `executionStandards` → `executionStandardIds` |
| `taskManagement.data.ts`      | mock 数据补充新字段                                                                        |
| `TaskListView.tsx`            | 列表展示列评估是否增加 `priority`、`milestone_flag` 徽标                                   |
| `TaskDetailPage.tsx`          | 详情页增加新字段展示区（优先级、必做标记、里程碑标记、标签等）                             |
| `taskStateMachine.guards.ts`  | 整改相关守卫需读取 `is_rectification`、`derived_from_task_id`                              |
| `taskManagement.selectors.ts` | 筛选条件增加 `priority`、`required_flag`、`milestone_flag`、`tags` 等维度                  |

---

_报告生成完毕。如需我直接执行某优先级的字段补全（修改 types + mock + 相关组件），请告知。_
