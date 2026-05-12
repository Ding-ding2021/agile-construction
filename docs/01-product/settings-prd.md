---
id: DOC-01-PRODUCT-SETTINGS-PRD
number: PRD-008
domain: product
category: prd
title: 系统设置需求文档
owner: docs-maintainer
status: active
last_updated: 2026-04-16
source_of_truth: true
related_code: []
related_docs: []
---

# 系统设置需求文档

> **文档版本**：V1.0  
> **文档状态**：草稿中  
> **适用阶段**：V1 / MVP  
> **所属模块**：系统设置  
> **关联文档**：`docs/01-product/product-roadmap.md`、`docs/01-product/multi-agent-v1-prd.md`、`docs/02-architecture/multi-agent-v1-technical-design.md`、`docs/01-product/project-management-prd.md`、`docs/01-product/task-center-prd.md`、`docs/01-product/personnel-management-prd.md`

---

## 1. 模块概述

### 1.1 模块定位

系统设置模块是平台的治理与运行底座，负责统一管理租户级配置、组织级配置、权限与安全策略、通知渠道、字典参数、审计开关和基础集成配置。

在本系统中：

- `项目管理`、`任务中心`、`人员管理`承接业务执行
- `数字员工`承接自动化能力
- `系统设置`提供全局规则、策略和配置能力

系统设置不是“偏技术后台”，而是保障全平台稳定运行和策略一致性的控制中心。

### 1.2 模块目标

V1 重点解决以下问题：

- 配置分散在多模块，口径不一致
- 权限和组织边界缺少统一入口
- 通知与告警策略不可配置
- 审计与安全策略缺少可视化管理
- 参数变更缺乏版本与回溯能力

### 1.3 V1 范围

V1 纳入范围：

- 基础信息设置（平台名称、Logo、时区、语言）
- 组织与租户参数设置
- 菜单与模块开关配置（按组织/角色）
- 角色权限策略（RBAC）
- 通知渠道配置（站内信、短信、邮件、Webhook）
- 字典与参数管理（状态值、阈值、枚举）
- 安全策略（登录策略、密码策略、会话策略）
- 审计日志与操作留痕
- 配置变更历史与回滚（V1 支持关键配置）

V1 不纳入范围：

- 复杂 AB 实验平台
- 全量低代码配置中心
- 跨租户配置市场
- 自动策略推荐引擎

---

## 2. 角色与业务场景

### 2.1 核心角色

#### 平台超级管理员

负责全局策略、组织开通、权限边界与安全策略配置。

#### 组织管理员

负责本组织配置、角色分配、通知策略与字典维护。

#### 安全审计人员

负责操作审计、异常登录排查、策略合规检查。

#### 运维人员

负责通知渠道连通性、Webhook 配置、配置回滚与环境参数维护。

### 2.2 核心业务场景

#### 场景 1：新组织开通

超级管理员创建组织并下发默认配置模板，组织管理员进行二次配置后启用。

#### 场景 2：角色权限调整

组织管理员调整角色菜单权限与数据权限，确保最小权限访问。

#### 场景 3：超时任务告警策略变更

运维或组织管理员调整任务超时通知规则并验证生效。

#### 场景 4：异常操作审计

审计人员按时间、操作人、模块筛选日志，追溯关键配置变更。

#### 场景 5：错误配置回滚

配置发布后出现异常，管理员按版本回滚到上一个稳定配置。

---

## 3. 业务对象定义

### 3.1 配置项 `Setting Item`

核心字段建议：

- `setting_id`
- `setting_key`
- `setting_name`
- `scope_type`（global/org/role/user）
- `scope_id`
- `value_type`（string/number/boolean/json）
- `setting_value`
- `status`（enabled/disabled）
- `version`
- `updated_at`

### 3.2 权限策略 `Permission Policy`

- `policy_id`
- `role_id`
- `resource_code`
- `action_code`（view/create/update/delete/approve）
- `data_scope`（all/org/team/self）
- `effect`（allow/deny）

### 3.3 通知策略 `Notification Rule`

- `rule_id`
- `event_code`
- `channel_type`（inapp/sms/email/webhook）
- `receiver_scope`
- `template_id`
- `enabled`
- `throttle_rule`

### 3.4 审计日志 `Audit Log`

- `log_id`
- `operator_id`
- `module_code`
- `action_type`
- `target_type`
- `target_id`
- `before_value`
- `after_value`
- `ip`
- `created_at`

---

## 4. 状态模型

### 4.1 配置状态（setting_status）

- `启用`
- `停用`

### 4.2 配置发布状态（publish_status）

- `草稿`
- `待发布`
- `已发布`
- `已回滚`

### 4.3 状态流转规则（V1）

- 草稿可编辑，不影响线上
- 待发布需通过校验（格式、依赖、冲突）
- 已发布可回滚到最近稳定版本
- 涉及安全与权限配置的发布需二次确认

---

## 5. 功能需求

### 5.1 基础信息设置

功能点：

- 平台名称、Logo、主题色、时区、语言配置
- 配置预览与实时生效（可控范围）
- 配置合法性校验

### 5.2 组织与租户设置

功能点：

- 组织开通、禁用、基础参数配置
- 组织级默认模板应用
- 组织级配置覆盖全局默认值

### 5.3 菜单与模块开关

功能点：

- 按组织/角色配置菜单可见性
- 模块开关（如是否启用数字员工）
- 开关变更影响范围提示

### 5.4 角色权限管理（RBAC）

功能点：

- 角色创建、复制、禁用
- 功能权限配置（按钮级）
- 数据权限配置（全局/组织/团队/个人）
- 权限变更差异对比

### 5.5 通知与模板管理

功能点：

- 事件→渠道→接收人规则配置
- 通知模板管理（变量占位符）
- 发送节流策略（防刷）
- 渠道健康检查（连通性测试）

### 5.6 字典与参数管理

功能点：

- 业务字典维护（状态、类型、枚举）
- 系统阈值参数维护（SLA 预警阈值等）
- 参数依赖校验与冲突提示

### 5.7 安全策略管理

功能点：

- 密码策略（复杂度、有效期）
- 登录策略（失败锁定、IP 白名单）
- 会话策略（超时、并发会话）
- API Token 管理（创建、禁用、过期）

### 5.8 审计与变更中心

功能点：

- 配置变更记录查询（按人、模块、时间）
- 前后值对比
- 关键配置回滚
- 导出审计记录

---

## 6. 关键业务规则

1. 配置分级生效优先级：`user > role > org > global`。
2. 权限策略遵循“最小权限原则”，`deny` 优先于 `allow`。
3. 关键配置（权限、安全、通知）发布必须双人确认（V1 可通过审批人字段实现）。
4. 所有配置变更必须记录操作人、时间、前后值。
5. 配置回滚不得跨越租户边界。

---

## 7. 页面与交互建议（V1）

### 7.1 页面清单

- 系统设置首页（概览）
- 基础信息设置页
- 组织与租户设置页
- 权限与角色设置页
- 通知与模板页
- 字典参数页
- 安全策略页
- 审计日志页

### 7.2 关键交互

- 设置项支持“草稿保存 / 发布生效”双态
- 发布前展示影响分析（影响模块、影响角色数）
- 差异对比弹窗（变更前后 JSON Diff）
- 危险操作二次确认（含风险提示）

---

## 8. 数据统计与监控指标

### 8.1 核心指标

- 配置发布次数
- 配置回滚次数
- 权限变更次数
- 通知送达率
- 安全策略命中次数（如登录锁定）

### 8.2 风险指标

- 配置发布失败次数
- 高风险操作次数
- 未经审核的关键变更次数
- 通知渠道异常率

---

## 9. 非功能性要求

- 权限：严格组织隔离，关键设置仅管理员可见
- 审计：关键操作全量留痕，可追溯不少于 180 天
- 性能：配置查询接口 P95 < 500ms
- 可用性：关键配置支持回滚，发布失败自动阻断
- 安全：敏感配置加密存储（Token、密钥）

---

## 10. 与其他模块接口边界

### 10.1 与项目管理

- 提供项目状态字典、预警阈值、通知策略

### 10.2 与任务中心

- 提供任务状态枚举、SLA 阈值、告警路由

### 10.3 与人员管理

- 提供角色权限口径、组织边界、账号安全策略

### 10.4 与数字员工

- 提供模块开关、工具权限策略、审批策略

---

## 11. 验收标准（V1）

### 11.1 功能验收

- 可完成系统配置新增、编辑、发布、停用、回滚
- 可完成角色权限配置并在业务模块生效
- 可完成通知策略配置并可测试送达
- 可查询审计日志并追溯关键配置变更

### 11.2 数据一致性验收

- 配置发布后各模块读取口径一致
- 回滚后配置值恢复正确且可追溯

### 11.3 风险控制验收

- 未授权角色无法访问关键设置
- 关键配置无审批不得发布
- 敏感字段明文不可见

---

## 12. 里程碑建议

- **M1**：基础信息 + 组织设置 + 字典参数
- **M2**：角色权限 + 菜单开关 + 通知模板
- **M3**：安全策略 + 审计日志 + 关键配置回滚
- **M4**：跨模块联调 + 验收上线

---

## 13. 字段级数据字典（V1）

### 13.1 系统配置主表 `ss_setting`

| 字段名         | 类型             | 必填 | 默认值                                              | 索引                                        | 说明                          |
| -------------- | ---------------- | ---- | --------------------------------------------------- | ------------------------------------------- | ----------------------------- |
| id             | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT                                      | PK                                          | 主键                          |
| setting_key    | VARCHAR(128)     | 是   | -                                                   | UK(scope_type,scope_id,setting_key,version) | 配置键                        |
| setting_name   | VARCHAR(128)     | 是   | -                                                   | IDX                                         | 配置名称                      |
| scope_type     | TINYINT UNSIGNED | 是   | 1                                                   | IDX                                         | 1全局/2组织/3角色/4用户       |
| scope_id       | VARCHAR(64)      | 是   | '0'                                                 | IDX                                         | 作用域ID                      |
| value_type     | TINYINT UNSIGNED | 是   | 1                                                   | IDX                                         | 1字符串/2数字/3布尔/4JSON     |
| setting_value  | MEDIUMTEXT       | 是   | -                                                   | -                                           | 配置值                        |
| status         | TINYINT UNSIGNED | 是   | 1                                                   | IDX                                         | 1启用/2停用                   |
| publish_status | TINYINT UNSIGNED | 是   | 1                                                   | IDX                                         | 1草稿/2待发布/3已发布/4已回滚 |
| version        | VARCHAR(32)      | 是   | 'v1'                                                | IDX                                         | 版本号                        |
| remark         | VARCHAR(500)     | 否   | NULL                                                | -                                           | 备注                          |
| created_by     | VARCHAR(64)      | 是   | 'system'                                            | -                                           | 创建人                        |
| created_at     | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3)                                | IDX                                         | 创建时间                      |
| updated_by     | VARCHAR(64)      | 是   | 'system'                                            | -                                           | 更新人                        |
| updated_at     | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) | -                                           | 更新时间                      |

### 13.2 权限策略表 `ss_permission_policy`

| 字段名        | 类型             | 必填 | 默认值                                              | 索引 | 说明                    |
| ------------- | ---------------- | ---- | --------------------------------------------------- | ---- | ----------------------- |
| id            | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT                                      | PK   | 主键                    |
| role_id       | BIGINT UNSIGNED  | 是   | -                                                   | IDX  | 角色ID                  |
| resource_code | VARCHAR(128)     | 是   | -                                                   | IDX  | 资源编码                |
| action_code   | VARCHAR(64)      | 是   | -                                                   | IDX  | 行为编码                |
| data_scope    | TINYINT UNSIGNED | 是   | 4                                                   | IDX  | 1全局/2组织/3团队/4个人 |
| effect        | TINYINT UNSIGNED | 是   | 1                                                   | IDX  | 1允许/2拒绝             |
| status        | TINYINT UNSIGNED | 是   | 1                                                   | IDX  | 1启用/2停用             |
| created_at    | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3)                                | -    | 创建时间                |
| updated_at    | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) | -    | 更新时间                |

### 13.3 通知规则表 `ss_notify_rule`

| 字段名             | 类型             | 必填 | 默认值                                              | 索引 | 说明                         |
| ------------------ | ---------------- | ---- | --------------------------------------------------- | ---- | ---------------------------- |
| id                 | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT                                      | PK   | 主键                         |
| rule_code          | VARCHAR(64)      | 是   | -                                                   | UK   | 规则编码                     |
| event_code         | VARCHAR(64)      | 是   | -                                                   | IDX  | 事件编码                     |
| channel_type       | TINYINT UNSIGNED | 是   | 1                                                   | IDX  | 1站内信/2短信/3邮件/4Webhook |
| receiver_scope     | TINYINT UNSIGNED | 是   | 1                                                   | IDX  | 1角色/2组织/3用户            |
| receiver_value     | VARCHAR(255)     | 是   | -                                                   | -    | 接收范围值                   |
| template_id        | BIGINT UNSIGNED  | 否   | NULL                                                | IDX  | 模板ID                       |
| throttle_rule_json | JSON             | 否   | NULL                                                | -    | 节流策略                     |
| enabled            | TINYINT(1)       | 是   | 1                                                   | IDX  | 是否启用                     |
| created_at         | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3)                                | -    | 创建时间                     |
| updated_at         | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) | -    | 更新时间                     |

### 13.4 审计日志表 `ss_audit_log`

| 字段名        | 类型            | 必填 | 默认值               | 索引 | 说明       |
| ------------- | --------------- | ---- | -------------------- | ---- | ---------- |
| id            | BIGINT UNSIGNED | 是   | AUTO_INCREMENT       | PK   | 主键       |
| operator_id   | VARCHAR(64)     | 是   | -                    | IDX  | 操作人     |
| operator_name | VARCHAR(64)     | 否   | NULL                 | -    | 操作人名称 |
| module_code   | VARCHAR(64)     | 是   | -                    | IDX  | 模块编码   |
| action_type   | VARCHAR(64)     | 是   | -                    | IDX  | 操作类型   |
| target_type   | VARCHAR(64)     | 否   | NULL                 | IDX  | 目标类型   |
| target_id     | VARCHAR(64)     | 否   | NULL                 | IDX  | 目标ID     |
| before_value  | MEDIUMTEXT      | 否   | NULL                 | -    | 变更前     |
| after_value   | MEDIUMTEXT      | 否   | NULL                 | -    | 变更后     |
| request_id    | VARCHAR(64)     | 否   | NULL                 | IDX  | 请求ID     |
| ip            | VARCHAR(64)     | 否   | NULL                 | IDX  | 来源IP     |
| user_agent    | VARCHAR(255)    | 否   | NULL                 | -    | 终端信息   |
| created_at    | DATETIME(3)     | 是   | CURRENT_TIMESTAMP(3) | IDX  | 操作时间   |

### 13.5 配置发布记录表 `ss_setting_publish`

| 字段名                   | 类型             | 必填 | 默认值               | 索引 | 说明              |
| ------------------------ | ---------------- | ---- | -------------------- | ---- | ----------------- |
| id                       | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT       | PK   | 主键              |
| publish_code             | VARCHAR(64)      | 是   | -                    | UK   | 发布单号          |
| scope_type               | TINYINT UNSIGNED | 是   | 1                    | IDX  | 作用域类型        |
| scope_id                 | VARCHAR(64)      | 是   | '0'                  | IDX  | 作用域ID          |
| change_summary           | VARCHAR(500)     | 否   | NULL                 | -    | 变更摘要          |
| risk_level               | TINYINT UNSIGNED | 是   | 1                    | IDX  | 1低/2中/3高       |
| approval_status          | TINYINT UNSIGNED | 是   | 1                    | IDX  | 1待审/2通过/3拒绝 |
| publisher_id             | VARCHAR(64)      | 是   | -                    | IDX  | 发布人            |
| approver_id              | VARCHAR(64)      | 否   | NULL                 | IDX  | 审批人            |
| published_at             | DATETIME(3)      | 否   | NULL                 | IDX  | 发布时间          |
| rollback_from_publish_id | BIGINT UNSIGNED  | 否   | NULL                 | IDX  | 回滚来源发布ID    |
| created_at               | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) | -    | 创建时间          |

### 13.6 推荐索引补充

- `ss_setting`：`idx_scope_key_status(scope_type, scope_id, setting_key, status)`
- `ss_permission_policy`：`idx_role_resource_action(role_id, resource_code, action_code)`
- `ss_notify_rule`：`idx_event_channel_enabled(event_code, channel_type, enabled)`
- `ss_audit_log`：`idx_module_time(module_code, created_at)`

### 13.7 枚举口径（建议）

- `scope_type`：1全局、2组织、3角色、4用户
- `value_type`：1字符串、2数字、3布尔、4JSON
- `status`：1启用、2停用
- `publish_status`：1草稿、2待发布、3已发布、4已回滚
- `channel_type`：1站内信、2短信、3邮件、4Webhook
- `effect`：1允许、2拒绝
- `approval_status`：1待审、2通过、3拒绝
