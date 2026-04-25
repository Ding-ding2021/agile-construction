---
id: DOC-02-ARCHITECTURE-TEMPLATE-DATA-CONTRACT
title: 模板数据契约基线（V1）
owner: docs-maintainer
status: active
last_updated: 2026-04-16
source_of_truth: true
related_code: []
related_docs: []
---

# 模板数据契约基线（V1）

> **文档版本**：V1.0  
> **文档状态**：建议生效（开发基线）  
> **适用模块**：标准管理（任务模板 / 项目模板）、任务中心（任务实例化）、项目管理（项目容器初始化）  
> **依据文档**：`docs/01-product/standard-management-prd.md`、`docs/01-product/task-center-prd.md`、`docs/01-product/project-management-prd.md`、`docs/02-architecture/task-tree-modeling.md`、`docs/02-architecture/structured-standard-library.md`

---

## 1. 目标与边界

### 1.1 目标

统一“项目模板 + 任务模板”在 V1 的结构化契约，确保：

- 模板可发布、可匹配、可追溯
- 任务树可稳定实例化
- 标准包可正确下发到任务
- 版本变更不破坏在途任务

### 1.2 边界

V1 仅覆盖：

- 单项目范围内模板匹配与实例化
- 四层任务结构（项目根 / 阶段 / 工作包 / 执行任务）
- 轻量依赖（`depends_on`，完成后开始）
- 标准包与标准快照链路

V1 不覆盖：

- 跨项目模板联动
- 复杂排程算法
- 多父节点图模型
- 无人工审核自动生效

---

## 2. 模板对象模型

## 2.1 项目模板 `project_template`

用于定义项目容器初始化规则（阶段、里程碑、默认标准上下文、默认任务骨架入口）。

关键字段（建议）：

- `template_id`（唯一）
- `template_code`（可读编码）
- `template_name`
- `template_version`（语义化版本，示例：`1.2.0`）
- `status`（`draft` / `reviewing` / `ready` / `active` / `inactive` / `deprecated`）
- `brand_scope[]`
- `store_type_scope[]`
- `region_scope[]`
- `project_type_scope[]`
- `service_scope[]`
- `default_standard_package_id`
- `phase_blueprint[]`（阶段定义）
- `milestone_blueprint[]`（里程碑定义）
- `task_template_binding[]`（绑定任务模板）
- `priority`
- `effective_from`
- `effective_to`
- `created_by`
- `updated_by`
- `published_at`

## 2.2 任务模板 `task_template`

用于定义任务树节点结构、默认依赖、默认责任角色、标准绑定和 SLA 规则。

关键字段（建议）：

- `task_template_id`（唯一）
- `task_template_code`
- `task_template_name`
- `task_template_version`
- `status`（同上）
- `template_level`（`project_root` / `stage` / `work_package` / `task`）
- `business_domain`
- `task_type`
- `required_flag`
- `milestone_flag`
- `owner_role`
- `assignee_type_default`
- `sla_rule_id`
- `default_execution_standard_ids[]`
- `default_acceptance_standard_ids[]`
- `default_standard_package_id`
- `default_execution_checklist_template_id`
- `default_acceptance_checklist_template_id`
- `dependency_blueprint[]`
- `child_template_refs[]`
- `sort_order`
- `effective_from`
- `effective_to`

---

## 3. 结构蓝图定义

## 3.1 阶段蓝图 `phase_blueprint[]`

建议字段：

- `phase_id`
- `phase_code`
- `phase_name`
- `phase_order`
- `owner_role`
- `planned_offset_start_days`
- `planned_offset_end_days`
- `entry_guard[]`
- `exit_guard[]`

## 3.2 里程碑蓝图 `milestone_blueprint[]`

建议字段：

- `milestone_id`
- `milestone_name`
- `milestone_type`
- `linked_template_codes[]`
- `planned_offset_days`
- `is_key`
- `completion_rule`

## 3.3 依赖蓝图 `dependency_blueprint[]`

建议字段：

- `relation_id`
- `from_template_code`
- `to_template_code`
- `relation_type`（V1 固定 `depends_on`）
- `constraint_type`（V1 固定 `FS`）
- `lag_days`（默认 0）

---

## 4. 关系约束（必须）

1. 一个项目模板可绑定多个任务模板（按 `task_template_binding[]`）。
2. 一个任务模板只能有一个直接父模板（单父树）。
3. 任务模板允许多个子模板。
4. 禁止循环依赖与自依赖。
5. 任务模板依赖默认同一项目内生效。
6. 子模板默认继承父模板的标准上下文，可覆盖但必须记录 `override_reason`。

---

## 5. 标准绑定契约

## 5.1 绑定链路

`项目模板 -> 任务模板 -> 任务实例 -> 标准快照`

## 5.2 规则

- 关键执行任务必须具备：
  - `execution_standard_ids` 至少 1 个
  - `acceptance_standard_ids` 至少 1 个
- 任务进入 `待执行` 前必须生成 `standard_snapshot_id`
- 已生成快照的任务，不允许被新模板静默覆盖

## 5.3 冲突优先级

建议顺序：

1. 来源优先级（国家 > 行业 > 地方 > 企业 > 品牌 > 供应商 > 项目补充）
2. 适用范围命中程度（品牌/店型/区域/项目类型）
3. 模板优先级 `priority`
4. 人工确认结果（需留痕）

---

## 6. 版本与生效规则

## 6.1 状态机

模板状态建议统一：

`draft -> reviewing -> ready -> active -> inactive -> deprecated`

## 6.2 生效原则

- `draft/reviewing/ready` 不可参与实例化
- 仅 `active` 可被项目创建流程命中
- 模板修改采用“新版本发布”，禁止覆盖历史版本
- `inactive/deprecated` 不影响历史实例与快照

## 6.3 兼容性策略

- 大版本（`x.0.0`）可不兼容，需迁移说明
- 小版本（`1.x.0`）应保持字段向后兼容
- 补丁版本（`1.2.x`）仅修正规则或文案，不改结构主键

---

## 7. 实例化契约（任务树生成）

## 7.1 输入

- 项目基础信息：`brand/store_type/region/project_type/planned_dates`
- 命中项目模板版本
- 命中任务模板集合
- 命中标准包版本

## 7.2 输出

- `project_instance_id`
- 阶段实例
- 里程碑实例
- 任务树实例（4 层）
- 任务依赖关系
- 默认责任角色与计划时间
- 标准绑定结果

## 7.3 生成模式

`模板结构 + 规则补全 + Agent 建议 + 人工确认`

---

## 8. 对外接口边界（模块协作）

## 8.1 标准管理输出给任务中心

- `project_template_resolved`
- `task_template_resolved[]`
- `standard_package_resolved`
- `validation_warnings[]`

## 8.2 任务中心回写给标准管理（审计）

- `template_instance_created`
- `template_override_applied`
- `standard_snapshot_created`
- `template_mismatch_detected`

## 8.3 项目管理消费字段（只读展示）

- `template_name`
- `template_version`
- `standard_package_id`
- `standard_package_version`
- `snapshot_summary`

---

## 9. 校验清单（开发联调前）

- [ ] 是否定义 `project_template` 与 `task_template` 主键和版本字段
- [ ] 是否限制为单父节点树
- [ ] 是否实现循环依赖校验
- [ ] 是否固化 `depends_on + FS` 的 V1 关系模型
- [ ] 是否保证关键任务双标准绑定
- [ ] 是否在 `待执行` 前生成标准快照
- [ ] 是否禁止非 `active` 模板参与实例化
- [ ] 是否保留覆盖标准的原因字段与审计日志

---

## 10. 实施优先级（建议）

1. **P0**：模板元模型与状态机（项目模板/任务模板/版本）
2. **P0**：任务模板树与依赖校验（单父、无环）
3. **P0**：标准包绑定与快照触发（待执行前）
4. **P1**：模板匹配策略（品牌/店型/区域/项目类型）
5. **P1**：模板覆盖与差异审计
6. **P2**：Agent 辅助补全与低置信度转人工

---

## 11. 结论

V1 先把“模板作为规则源”的主链路跑通：

- 先稳定模板定义，再驱动任务实例化
- 先保证标准可绑定、可快照，再扩展高级排程
- 先控制复杂度，再迭代智能化

这份契约可直接作为标准管理与任务中心的联调基线。
