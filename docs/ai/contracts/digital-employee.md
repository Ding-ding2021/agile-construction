---
id: AI-DIGITAL-EMPLOYEE
human_source: docs/01-product/digital-employee-prd.md
status: active
last_synced: 2026-05-11
title: AI 合约：数字员工
last_updated: 2026-05-12
---

# AI 合约：数字员工

## 模块定位

管理平台内可执行业务动作的 AI Agent，包括创建配置、能力编排、触发执行、过程可观测、结果回写和人工兜底。

## 核心实体

| 实体                                  | 字段                                                                                                                                                  | 状态机                                      |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Agent `de_agent`                      | agent_code, agent_name, agent_type(1项目经理/2调度/3质检/9通用), version, status, risk_level, owner_id                                                | 1草稿→2已发布→3停用                         |
| AgentCapability `de_agent_capability` | agent_id, prompt_template, tool_whitelist_json, context_scope_json, input_schema_json, output_schema_json, timeout_sec, retry_limit                   | —                                           |
| AgentRun `de_agent_run`               | run_code, agent_id, source_type(1项目/2任务/3系统), trigger_type(1手动/2事件/3定时), run_status, input_digest, output_digest, duration_ms, error_code | 1待执行→2执行中→3待审核→4成功/5失败/6已取消 |
| StepLog `de_agent_run_step_log`       | run_id, step_no, tool_name, step_status(1开始/2成功/3失败), request/response_digest                                                                   | —                                           |
| Approval `de_agent_approval`          | run_id, action_type, approval_status(1待审核/2通过/3拒绝), approver_id, comment                                                                       | —                                           |

## 业务规则

1. 数字员工写操作默认最小权限，未授权工具不得调用
2. 涉及批量变更、状态推进、责任人变更等动作必须走审批
3. 每次执行必须记录输入摘要、输出摘要和操作人/触发源
4. 失败重试上限默认 3 次，超过上限转人工处理
5. 同一业务对象在同一时间窗口内避免并发冲突执行（幂等键约束）
6. 草稿可编辑不可触发，已发布可触发编辑需新版本，停用不可新触发
7. 高风险动作必须进入待审核，审核拒绝进入已取消并保留原因

## 依赖模块

| 模块     | 引用位置                   | 依赖内容                                                |
| -------- | -------------------------- | ------------------------------------------------------- |
| 项目管理 | de_agent_run.source_type=1 | 读取项目阶段、里程碑、风险；回写项目建议与风险备注      |
| 任务中心 | de_agent_run.source_type=2 | 读取任务状态、依赖、SLA、责任人；回写派单/催办/整改建议 |
| 人员管理 | context_scope              | 读取人员技能、可用性、负载；输出候选人推荐              |

## API 骨架

| 方法           | 路径                           | 说明                   |
| -------------- | ------------------------------ | ---------------------- |
| GET/POST       | `/api/agents`                  | 列表/新建数字员工      |
| GET/PUT/DELETE | `/api/agents/:id`              | 详情/编辑/删除         |
| POST           | `/api/agents/:id/publish`      | 发布数字员工           |
| POST           | `/api/agents/:id/disable`      | 停用数字员工           |
| POST           | `/api/agents/:id/trigger`      | 手动触发执行           |
| GET            | `/api/agents/:id/runs`         | 执行记录列表           |
| GET/POST       | `/api/agents/:id/capabilities` | 能力配置               |
| GET            | `/api/runs/:id`                | 执行详情+步骤日志      |
| POST           | `/api/runs/:id/retry`          | 重试执行               |
| GET/POST       | `/api/approvals`               | 审核列表/提交审核      |
| PUT            | `/api/approvals/:id/approve`   | 通过审核               |
| PUT            | `/api/approvals/:id/reject`    | 拒绝审核               |
| GET            | `/api/agents/stats`            | 调用量/成功率/时长统计 |

## 质量门禁

- 权限：按组织与角色控制可见范围与可操作动作
- 审计：所有写操作留痕，日志可追溯不少于 180 天
- 性能：普通触发请求响应 < 2s（不含异步执行完成时长）
- 可用性：失败自动重试 + 人工兜底
- 安全：提示词、密钥、工具权限分级管理
