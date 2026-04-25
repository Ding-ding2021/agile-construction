---
id: DOC-01-PRODUCT-DIGITAL-EMPLOYEE-PRD
title: 数字员工需求文档
owner: docs-maintainer
status: active
last_updated: 2026-04-16
source_of_truth: true
related_code: []
related_docs: []
---

# 数字员工需求文档

> **文档版本**：V1.0  
> **文档状态**：草稿中  
> **适用阶段**：V1 / MVP  
> **所属模块**：数字员工（Agent）  
> **关联文档**：`docs/01-product/product-roadmap.md`、`docs/01-product/multi-agent-v1-prd.md`、`docs/02-architecture/multi-agent-v1-technical-design.md`、`docs/01-product/task-center-prd.md`、`docs/01-product/project-management-prd.md`、`docs/01-product/personnel-management-prd.md`

---

## 1. 模块概述

### 1.1 模块定位

数字员工模块用于管理平台内可执行业务动作的 AI Agent，包括：创建配置、能力编排、触发执行、过程可观测、结果回写和人工兜底。

在本系统中：

- `项目管理`负责项目容器与阶段目标
- `任务中心`负责执行链路与状态流转
- `人员管理`负责真人角色与组织能力
- `数字员工`负责自动化辅助决策与任务执行

数字员工不是聊天入口，而是可配置、可治理、可审计的业务执行单元。

### 1.2 模块目标

V1 重点解决以下问题：

- Agent 能力分散，缺乏统一注册与治理
- 触发方式不统一（人工/事件/定时）
- 执行过程不可见，失败难定位
- 结果回写标准不一致，难以闭环
- 风险动作缺少审批与人工确认

### 1.3 V1 范围

V1 纳入范围：

- 数字员工目录管理（上架/下架/版本）
- 能力配置（提示词、工具白名单、上下文范围）
- 触发机制（手动触发、事件触发、定时触发）
- 任务执行编排（串行步骤、条件分支、重试策略）
- 执行日志与可观测（输入摘要、输出摘要、耗时、状态）
- 人工审核与兜底（高风险动作需确认）
- 结果回写到项目/任务/人员模块
- 成本与调用量基础统计

V1 不纳入范围：

- 全自动跨模块闭环且无人工确认
- 多模型动态竞价调度
- 跨租户共享 Agent 市场
- 复杂低代码流程编辑器

---

## 2. 角色与业务场景

### 2.1 核心角色

#### 平台管理员

负责数字员工模板配置、权限控制、发布与停用。

#### 项目经理

在项目阶段中触发数字员工生成计划、识别风险、补齐任务建议。

#### 调度运营

使用调度类数字员工做人岗匹配、改派建议、SLA 预警。

#### 审核人员

对高风险动作进行审批（如批量改派、批量状态变更）。

### 2.2 核心业务场景

#### 场景 1：项目初始化自动建议

项目创建后触发“项目经理 Agent”，生成阶段任务建议、关键里程碑和风险提示。

#### 场景 2：待派单池智能推荐

任务进入待分配后触发“调度 Agent”，基于技能、地理、负载给出候选人排序。

#### 场景 3：延期风险巡检

定时触发巡检 Agent，对即将超期任务生成预警清单并推送负责人。

#### 场景 4：验收问题整改建议

验收不通过时触发整改建议 Agent，输出整改步骤、责任建议和复验条件。

---

## 3. 业务对象定义

### 3.1 数字员工 `Agent`

核心字段建议：

- `agent_id`
- `agent_code`
- `agent_name`
- `agent_type`（项目经理/调度/质检/通用）
- `version`
- `status`（草稿/已发布/停用）
- `trigger_mode`（manual/event/schedule）
- `risk_level`（low/medium/high）
- `owner_id`
- `created_at`
- `updated_at`

### 3.2 能力配置 `Agent Capability`

- `capability_id`
- `agent_id`
- `prompt_template`
- `tool_whitelist`
- `context_scope`
- `input_schema`
- `output_schema`
- `timeout_sec`
- `retry_policy`

### 3.3 执行实例 `Agent Run`

- `run_id`
- `agent_id`
- `source_type`（project/task/system）
- `source_id`
- `trigger_type`（manual/event/schedule）
- `run_status`（pending/running/success/failed/cancelled）
- `started_at`
- `ended_at`
- `duration_ms`
- `error_code`
- `error_message`

### 3.4 审核与确认 `Approval`

- `approval_id`
- `run_id`
- `action_type`
- `approval_status`（pending/approved/rejected）
- `approver_id`
- `comment`
- `approved_at`

---

## 4. 状态模型

### 4.1 数字员工状态（agent_status）

- `草稿`
- `已发布`
- `停用`

流转规则：

- 草稿可编辑，不可触发
- 已发布可触发，编辑需生成新版本
- 停用不可新触发，历史运行可追溯

### 4.2 执行状态（run_status）

- `待执行`
- `执行中`
- `待审核`
- `成功`
- `失败`
- `已取消`

流转规则：

- 高风险动作必须进入`待审核`
- 超时/工具错误进入`失败`，可按策略重试
- 审核拒绝进入`已取消`并保留原因

---

## 5. 功能需求

### 5.1 数字员工目录

功能点：

- 列表展示：名称、类型、版本、状态、负责人、最近调用时间
- 搜索：名称/编码/负责人
- 筛选：类型、状态、风险等级、触发方式
- 操作：新建、复制、发布、停用、查看运行记录

### 5.2 配置中心

功能点：

- 提示词模板配置（系统指令、业务指令、输出约束）
- 工具白名单配置（仅允许授权工具）
- 上下文范围配置（项目、任务、人员）
- 输入/输出 Schema 校验
- 超时与重试策略配置

约束：

- 发布前必须通过 Schema 校验
- 高风险配置变更需二次确认

### 5.3 触发与编排

功能点：

- 手动触发：页面按钮触发并传入上下文
- 事件触发：状态变更事件触发（如任务转待分配）
- 定时触发：按 Cron 表达式执行巡检
- 编排能力：步骤串行、条件分支、失败重试、人工审批闸口

### 5.4 执行监控

功能点：

- 运行看板：成功率、平均耗时、失败率
- 运行明细：输入摘要、输出摘要、工具调用链、错误栈
- 失败重放：同参重试/参数修正重试
- 结果追踪：回写对象链接（项目/任务/人员）

### 5.5 审核与风控

功能点：

- 风险动作识别（批量更新、跨模块写操作）
- 审批流：提交审核、通过/拒绝、意见记录
- 可回滚策略：关键写操作支持撤销入口（V1 可选人工回滚）

---

## 6. 关键业务规则

1. 数字员工写操作默认最小权限，未授权工具不得调用。
2. 涉及批量变更、状态推进、责任人变更等动作必须走审批。
3. 每次执行必须记录输入摘要、输出摘要和操作人/触发源。
4. 失败重试上限默认 3 次，超过上限转人工处理。
5. 同一业务对象在同一时间窗口内避免并发冲突执行（幂等键约束）。

---

## 7. 页面与交互建议（V1）

### 7.1 页面清单

- 数字员工列表页
- 数字员工配置页
- 运行监控页
- 审核中心页

### 7.2 列表页关键交互

- 统计卡：今日调用、成功率、失败数、待审核数
- 快捷过滤：仅看失败、仅看高风险、仅看停用
- 行内操作：触发、查看日志、复制版本、发布/停用

### 7.3 运行详情关键交互

- 时间线展示：触发 → 推理 → 工具调用 → 输出 → 回写
- 错误高亮：错误码、错误步骤、建议处理动作
- 一键重试：支持原参数重试和修改参数重试

---

## 8. 数据统计与监控指标

### 8.1 核心指标

- 总调用量 / 成功调用量 / 失败调用量
- 平均响应时长 / P95 时长
- 审核通过率
- 自动完成率（无需人工干预占比）

### 8.2 风险指标

- 高风险动作触发次数
- 审核拒绝次数
- 连续失败任务数
- 回写冲突次数

---

## 9. 非功能性要求

- 权限：按组织与角色控制可见范围与可操作动作
- 审计：所有写操作留痕，日志可追溯不少于 180 天
- 性能：普通触发请求响应 < 2s（不含异步执行完成时长）
- 可用性：失败自动重试 + 人工兜底
- 安全：提示词、密钥、工具权限分级管理

---

## 10. 与其他模块接口边界

### 10.1 与项目管理

- 读取项目阶段、里程碑、风险信息
- 回写项目建议与风险备注

### 10.2 与任务中心

- 读取任务状态、依赖、SLA、责任人信息
- 回写派单建议、催办建议、整改建议

### 10.3 与人员管理

- 读取人员技能、可用性、负载
- 输出候选人推荐及原因解释

---

## 11. 验收标准（V1）

### 11.1 功能验收

- 可完成数字员工创建、发布、停用和版本切换
- 支持手动/事件/定时三种触发
- 执行过程可追踪，失败可定位并可重试
- 高风险动作可进入审核并可拦截

### 11.2 数据一致性验收

- 执行日志与业务回写结果可关联追溯
- 同一对象并发触发不产生重复写入

### 11.3 风险控制验收

- 未授权工具调用被拦截
- 审核拒绝后不发生写操作
- 重试超限可转人工处理

---

## 12. 里程碑建议

- **M1**：数字员工目录 + 配置中心（手动触发）
- **M2**：事件/定时触发 + 执行监控
- **M3**：审核风控 + 跨模块回写
- **M4**：联调验收 + 指标口径对齐

---

## 13. 字段级数据字典（V1）

### 13.1 `de_agent`（数字员工主表）

| 字段名      | 类型             | 必填 | 默认值                                              | 索引 | 说明                        |
| ----------- | ---------------- | ---- | --------------------------------------------------- | ---- | --------------------------- |
| id          | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT                                      | PK   | 主键                        |
| agent_code  | VARCHAR(32)      | 是   | -                                                   | UK   | 数字员工编码                |
| agent_name  | VARCHAR(128)     | 是   | -                                                   | IDX  | 名称                        |
| agent_type  | TINYINT UNSIGNED | 是   | 1                                                   | IDX  | 1项目经理/2调度/3质检/9通用 |
| version     | VARCHAR(32)      | 是   | 'v1'                                                | IDX  | 版本号                      |
| status      | TINYINT UNSIGNED | 是   | 1                                                   | IDX  | 1草稿/2已发布/3停用         |
| risk_level  | TINYINT UNSIGNED | 是   | 1                                                   | IDX  | 1低/2中/3高                 |
| owner_id    | VARCHAR(64)      | 是   | -                                                   | IDX  | 负责人                      |
| description | VARCHAR(500)     | 否   | NULL                                                | -    | 描述                        |
| created_at  | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3)                                | -    | 创建时间                    |
| updated_at  | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) | -    | 更新时间                    |

### 13.2 `de_agent_capability`（能力配置）

| 字段名              | 类型             | 必填 | 默认值                                              | 索引 | 说明        |
| ------------------- | ---------------- | ---- | --------------------------------------------------- | ---- | ----------- |
| id                  | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT                                      | PK   | 主键        |
| agent_id            | BIGINT UNSIGNED  | 是   | -                                                   | IDX  | 关联 Agent  |
| prompt_template     | MEDIUMTEXT       | 是   | -                                                   | -    | 提示词模板  |
| tool_whitelist_json | JSON             | 是   | -                                                   | -    | 工具白名单  |
| context_scope_json  | JSON             | 否   | NULL                                                | -    | 上下文范围  |
| input_schema_json   | JSON             | 否   | NULL                                                | -    | 输入 Schema |
| output_schema_json  | JSON             | 否   | NULL                                                | -    | 输出 Schema |
| timeout_sec         | INT UNSIGNED     | 是   | 60                                                  | -    | 超时秒数    |
| retry_limit         | TINYINT UNSIGNED | 是   | 2                                                   | -    | 重试次数    |
| created_at          | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3)                                | -    | 创建时间    |
| updated_at          | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) | -    | 更新时间    |

### 13.3 `de_agent_run`（执行实例）

| 字段名        | 类型             | 必填 | 默认值               | 索引 | 说明                                        |
| ------------- | ---------------- | ---- | -------------------- | ---- | ------------------------------------------- |
| id            | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT       | PK   | 主键                                        |
| run_code      | VARCHAR(40)      | 是   | -                    | UK   | 执行编号                                    |
| agent_id      | BIGINT UNSIGNED  | 是   | -                    | IDX  | Agent ID                                    |
| source_type   | TINYINT UNSIGNED | 是   | 1                    | IDX  | 1项目/2任务/3系统                           |
| source_id     | BIGINT UNSIGNED  | 否   | NULL                 | IDX  | 来源ID                                      |
| trigger_type  | TINYINT UNSIGNED | 是   | 1                    | IDX  | 1手动/2事件/3定时                           |
| trigger_by    | VARCHAR(64)      | 否   | NULL                 | IDX  | 触发人/触发器                               |
| run_status    | TINYINT UNSIGNED | 是   | 1                    | IDX  | 1待执行/2执行中/3待审核/4成功/5失败/6已取消 |
| input_digest  | VARCHAR(500)     | 否   | NULL                 | -    | 输入摘要                                    |
| output_digest | VARCHAR(500)     | 否   | NULL                 | -    | 输出摘要                                    |
| duration_ms   | INT UNSIGNED     | 否   | NULL                 | -    | 耗时                                        |
| error_code    | VARCHAR(64)      | 否   | NULL                 | IDX  | 错误码                                      |
| error_message | VARCHAR(1000)    | 否   | NULL                 | -    | 错误信息                                    |
| started_at    | DATETIME(3)      | 否   | NULL                 | IDX  | 开始时间                                    |
| ended_at      | DATETIME(3)      | 否   | NULL                 | IDX  | 结束时间                                    |
| created_at    | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) | -    | 创建时间                                    |

### 13.4 `de_agent_run_step_log`（步骤日志）

| 字段名          | 类型             | 必填 | 默认值               | 索引                | 说明              |
| --------------- | ---------------- | ---- | -------------------- | ------------------- | ----------------- |
| id              | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT       | PK                  | 主键              |
| run_id          | BIGINT UNSIGNED  | 是   | -                    | IDX                 | 执行实例ID        |
| step_no         | INT UNSIGNED     | 是   | -                    | IDX(run_id,step_no) | 步骤序号          |
| step_name       | VARCHAR(128)     | 是   | -                    | -                   | 步骤名称          |
| tool_name       | VARCHAR(128)     | 否   | NULL                 | -                   | 调用工具          |
| step_status     | TINYINT UNSIGNED | 是   | 1                    | IDX                 | 1开始/2成功/3失败 |
| request_digest  | VARCHAR(500)     | 否   | NULL                 | -                   | 请求摘要          |
| response_digest | VARCHAR(500)     | 否   | NULL                 | -                   | 响应摘要          |
| error_message   | VARCHAR(1000)    | 否   | NULL                 | -                   | 错误信息          |
| created_at      | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) | -                   | 创建时间          |

### 13.5 `de_agent_approval`（审核记录）

| 字段名          | 类型             | 必填 | 默认值               | 索引 | 说明                |
| --------------- | ---------------- | ---- | -------------------- | ---- | ------------------- |
| id              | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT       | PK   | 主键                |
| run_id          | BIGINT UNSIGNED  | 是   | -                    | IDX  | 执行实例ID          |
| action_type     | VARCHAR(64)      | 是   | -                    | IDX  | 动作类型            |
| approval_status | TINYINT UNSIGNED | 是   | 1                    | IDX  | 1待审核/2通过/3拒绝 |
| approver_id     | VARCHAR(64)      | 否   | NULL                 | IDX  | 审核人              |
| comment         | VARCHAR(500)     | 否   | NULL                 | -    | 审核意见            |
| approved_at     | DATETIME(3)      | 否   | NULL                 | -    | 审核时间            |
| created_at      | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) | -    | 创建时间            |

### 13.6 推荐索引补充

- `de_agent_run`：`idx_agent_status_time(agent_id, run_status, created_at)`
- `de_agent_run`：`idx_source(source_type, source_id, created_at)`
- `de_agent_approval`：`idx_status_created(approval_status, created_at)`

### 13.7 枚举口径（建议）

- `agent_type`：1项目经理、2调度、3质检、9通用
- `status`（agent）：1草稿、2已发布、3停用
- `trigger_type`：1手动、2事件、3定时
- `run_status`：1待执行、2执行中、3待审核、4成功、5失败、6已取消
- `approval_status`：1待审核、2通过、3拒绝
