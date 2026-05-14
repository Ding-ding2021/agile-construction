---
id: AI-SETTINGS
human_source: docs/01-product/settings-prd.md
status: active
last_synced: 2026-05-11
title: AI 合约：系统设置
last_updated: 2026-05-12
---

# AI 合约：系统设置

## 模块定位

平台治理与运行底座，统一管理租户级配置、组织级配置、权限安全策略、通知渠道、字典参数、审计开关和基础集成配置。

## 核心实体

| 实体                        | 字段                                                                                                                                                                        | 状态机                                    |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 配置项 (SettingItem)        | setting_key, setting_name, scope_type(global/org/role/user), scope_id, value_type(string/number/boolean/json), setting_value, status(enabled/disabled), version, updated_at | publish_status: 草稿→待发布→已发布→已回滚 |
| 权限策略 (PermissionPolicy) | policy_id, role_id, resource_code, action_code(view/create/update/delete/approve), data_scope(all/org/team/self), effect(allow/deny)                                        | status: 启用/停用                         |
| 通知规则 (NotifyRule)       | rule_code, event_code, channel_type(inapp/sms/email/webhook), receiver_scope, template_id, enabled, throttle_rule_json                                                      | enabled: true/false                       |
| 审计日志 (AuditLog)         | operator_id, module_code, action_type, target_type, target_id, before_value, after_value, ip, created_at                                                                    | 仅追加，不可修改                          |

## 业务规则

1. 配置分级生效优先级：user > role > org > global
2. 权限策略遵循最小权限原则，deny 优先于 allow
3. 关键配置（权限/安全/通知）发布必须双人确认
4. 所有配置变更必须记录操作人、时间、前后值
5. 配置回滚不得跨越租户边界
6. 草稿可编辑不影响线上，待发布需通过校验，已发布可回滚最近稳定版本
7. 涉及安全与权限配置的发布需二次确认

## 依赖模块

| 模块     | 引用位置                                      | 依赖内容                                                               |
| -------- | --------------------------------------------- | ---------------------------------------------------------------------- |
| 项目管理 | docs/01-product/project-management-prd.md     | 项目状态字典、预警阈值、通知策略                                       |
| 任务中心 | docs/01-product/task-center-prd.md            | 任务状态枚举、SLA 阈值、告警路由                                       |
| 人员管理 | docs/01-product/personnel-management-prd.md   | 角色权限口径、组织边界、账号安全策略                                   |
| 数字员工 | docs/99-archive/product/multi-agent-v1-prd.md | 模块开关、工具权限策略、审批策略（已归档，详见 agent-architecture.md） |

## API 骨架

| 方法 | 路径                       | 说明                      |
| ---- | -------------------------- | ------------------------- |
| GET  | /api/settings              | 配置列表（按 scope 筛选） |
| POST | /api/settings              | 创建配置（草稿）          |
| PUT  | /api/settings/:id          | 更新配置                  |
| POST | /api/settings/:id/publish  | 发布配置（需审批）        |
| POST | /api/settings/:id/rollback | 回滚配置                  |
| GET  | /api/permissions           | 权限策略列表              |
| POST | /api/permissions           | 创建权限策略              |
| GET  | /api/notify-rules          | 通知规则列表              |
| POST | /api/notify-rules          | 创建通知规则              |
| GET  | /api/audit-logs            | 审计日志查询              |
| GET  | /api/dict                  | 字典参数列表              |
| POST | /api/dict                  | 创建字典参数              |

## 质量门禁

- 配置查询接口 P95 < 500ms
- 关键操作全量留痕，可追溯不少于 180 天
- 未授权角色无法访问关键设置
- 敏感字段（Token/密钥）加密存储，明文不可见
- 配置发布前展示影响分析（影响模块、影响角色数）
