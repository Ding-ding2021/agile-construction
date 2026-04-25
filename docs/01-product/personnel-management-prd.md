---
id: DOC-01-PRODUCT-PERSONNEL-MANAGEMENT-PRD
title: 人员管理需求文档
owner: docs-maintainer
status: active
last_updated: 2026-04-16
source_of_truth: true
related_code: []
related_docs: []
---

# 人员管理需求文档

> **文档版本**：V1.0  
> **文档状态**：草稿中  
> **适用阶段**：V1 / MVP  
> **所属模块**：人员管理  
> **关联文档**：`docs/01-product/product-roadmap.md`、`docs/01-product/project-management-prd.md`、`docs/01-product/task-center-prd.md`、`docs/02-architecture/state-machine-design.md`、`docs/01-product/multi-agent-v1-prd.md`

---

## 1. 模块概述

### 1.1 模块定位

人员管理模块是三端协作的组织与角色底座，负责统一管理“人、组织、角色、技能、可用性、协同关系”。

在本系统中：

- `项目管理`负责项目容器与总体进度
- `任务中心`负责任务执行流转
- `人员管理`负责谁可以做、谁正在做、谁最适合做

人员管理并非简单通讯录，而是支撑“分配-执行-验收-结算”全链路的人效与协同基础模块。

### 1.2 模块目标

V1 重点解决以下问题：

- 人员信息分散，跨端口径不一致
- 角色职责不清，任务分配经常错配
- 可用性（在岗/请假/忙碌）缺乏统一视图
- 技能标签和资质信息难以用于调度推荐
- 协作与替补关系缺失，导致任务阻塞
- 人员状态变化无法沉淀为可追溯记录

### 1.3 V1 范围

V1 纳入范围：

- 组织与团队管理（品牌方/平台/资源方）
- 人员档案管理
- 角色与岗位管理
- 技能与资质标签管理
- 人员可用性管理（在岗/忙碌/请假/离线）
- 人员与项目/任务关联关系
- 协作关系（上级、协同人、替补人）
- 人员查询、筛选、批量操作
- 人员状态变更记录与基础审计

V1 不纳入范围：

- 复杂排班引擎与自动轮班
- 跨公司薪酬绩效核算
- 智能工时预测模型
- 多维 KPI BI 大屏（仅保留基础统计）

---

## 2. 角色与业务场景

### 2.1 核心角色

#### 平台管理员

负责组织开通、人员录入、角色配置、资质审核、禁用启用。

#### 品牌方管理员

负责品牌侧项目相关人员维护、项目负责人指派、协同人配置。

#### 调度运营

关注资源可用性、技能匹配、人员负载，完成派单前的人选确认。

#### 资源方负责人

维护执行团队成员、技能标签、在岗状态、替补关系。

#### 项目经理

在项目内配置成员、查看人员风险（超负荷、缺资质、离岗）。

### 2.2 核心业务场景

#### 场景 1：新成员入驻

管理员录入成员基础信息、组织归属、角色、技能、资质与可用状态，成员可被调度与分配。

#### 场景 2：项目组建

项目经理从人员池选择项目负责人、执行人、协同人，形成项目团队快照。

#### 场景 3：任务分配前校验

调度运营在派单时查看人员是否在岗、是否具备必要技能/资质、当前负载是否超限。

#### 场景 4：人员变更与替补

成员请假或离岗时，系统支持替补人切换并保留变更记录。

#### 场景 5：风险识别

系统识别“关键任务无人可接”“关键岗位资质过期”“负载超阈值”等风险并提示。

---

## 3. 业务对象定义

### 3.1 人员 Person

核心字段建议：

- `person_id`
- `person_code`
- `name`
- `mobile`
- `email`
- `avatar`
- `org_id`
- `team_id`
- `role_ids`
- `title`
- `employment_type`（内部/外包/供应商）
- `status`（在岗/请假/离岗/禁用）
- `availability_status`（可分配/忙碌/不可分配）
- `work_city`
- `created_at`
- `updated_at`

### 3.2 组织 Organization

- `org_id`
- `org_type`（品牌方/平台/资源方）
- `org_name`
- `org_code`
- `status`

### 3.3 团队 Team

- `team_id`
- `org_id`
- `team_name`
- `team_leader_id`
- `service_scope`
- `status`

### 3.4 角色 Role

- `role_id`
- `role_code`
- `role_name`
- `role_scope`（品牌/平台/资源方/全局）
- `description`

### 3.5 技能与资质 Skill / Certification

- `skill_id`
- `skill_name`
- `skill_level`（初级/中级/高级）
- `cert_id`
- `cert_name`
- `cert_expire_at`
- `cert_status`（有效/即将到期/已过期）

### 3.6 关联关系 Assignment Relation

- `relation_id`
- `source_type`（project/task）
- `source_id`
- `person_id`
- `relation_role`（负责人/执行人/协同人/替补人）
- `start_at`
- `end_at`
- `status`

---

## 4. 状态模型

### 4.1 人员状态（person_status）

- `在岗`
- `请假`
- `离岗`
- `禁用`

### 4.2 可分配状态（availability_status）

- `可分配`
- `忙碌`
- `不可分配`

### 4.3 状态流转规则（V1）

- 离岗/禁用人员不可被新增分配
- 请假人员可保留历史任务，不可新分配关键任务
- 资质过期人员不可承接需资质校验任务
- 人员状态变更需记录操作人和原因

---

## 5. 功能需求

### 5.1 人员列表

**目标**：统一查看并快速定位可用人员。

功能点：

- 列表展示：姓名、组织、团队、角色、状态、可分配状态、技能摘要、当前任务数
- 搜索：姓名/手机号/工号
- 筛选：组织、团队、角色、状态、技能、城市
- 排序：负载、最近活跃、风险等级
- 批量操作：启用、禁用、标签维护

### 5.2 人员详情

功能点：

- 基本信息
- 角色与岗位信息
- 技能与资质信息
- 项目参与记录
- 当前任务负载
- 状态变更记录

### 5.3 新增/编辑人员

功能点：

- 新增人员档案
- 组织与团队归属
- 角色配置
- 技能标签维护
- 资质文件与有效期维护
- 启用/禁用

约束：

- 手机号唯一（同组织内）
- 必填字段校验（姓名、组织、角色）
- 关键角色需至少 1 人在岗（防止全量禁用）

### 5.4 角色管理

功能点：

- 角色定义与说明
- 角色范围（品牌/平台/资源方）
- 人员与角色绑定
- 角色使用统计（关联人数）

### 5.5 技能与资质管理

功能点：

- 技能字典维护
- 资质类型维护
- 人员技能等级维护
- 资质有效期预警（7/30 天）

### 5.6 可用性与负载管理

功能点：

- 手动切换可分配状态
- 自动负载计算（任务数、关键任务数）
- 超阈值预警（可配置阈值）
- 请假/离岗期间禁止新分配

### 5.7 人员关联管理（项目/任务）

功能点：

- 在项目详情中配置项目成员
- 在任务分配前选择执行人/协同人
- 替补人设置与一键替换
- 关联变更日志

---

## 6. 关键业务规则

1. 人员删除策略：V1 采用逻辑删除（禁用），不物理删除。
2. 已关联项目/任务的人员不可直接移除历史记录。
3. 任务分配时必须校验人员状态 + 可分配状态 + 必要资质。
4. 替补切换必须保留原责任人、切换时间、切换原因。
5. 组织管理员仅可操作本组织人员数据。

---

## 7. 页面与交互建议（V1）

### 7.1 页面清单

- 人员管理列表页
- 人员详情页
- 新增/编辑人员抽屉
- 角色管理页
- 技能资质管理页

### 7.2 列表页关键交互

- 统计卡：在岗人数、可分配人数、资质即将到期人数、超负载人数
- 快捷筛选：仅看可分配 / 仅看关键岗位 / 仅看高负载
- 行内操作：查看详情、编辑、状态切换、设置替补

### 7.3 详情页关键交互

- 标签页：基础信息 / 技能资质 / 项目任务 / 操作日志
- 右侧风险提示：资质过期、负载超阈值、关键岗位空缺

---

## 8. 数据统计与监控指标

### 8.1 核心指标

- 总人数 / 在岗率 / 可分配率
- 人员平均负载（任务数）
- 关键岗位覆盖率
- 资质有效率
- 替补切换次数

### 8.2 预警指标

- 资质 7 天内到期人数
- 高负载人员数
- 不可分配但仍被分配的异常次数

---

## 9. 非功能性要求

- 权限：按组织边界隔离（V1）
- 审计：关键操作需记录（状态切换、角色变更、替补切换）
- 性能：列表查询响应 < 2s（万级数据下分页）
- 可用性：关键操作支持二次确认与失败重试

---

## 10. 与其他模块接口边界

### 10.1 与项目管理

- 项目成员池读取人员列表
- 项目负责人变更写回人员关联记录

### 10.2 与任务中心

- 任务分配时读取人员可用性、技能、资质
- 任务状态变化回写人员负载

### 10.3 与调度能力

- 人员画像作为推荐输入（城市/技能/负载/资质）

---

## 11. 验收标准（V1）

### 11.1 功能验收

- 可完成人员新增、编辑、禁用、查询、筛选
- 可完成角色绑定、技能资质维护
- 可在项目/任务中完成人员关联与替补设置
- 分配前校验规则生效

### 11.2 数据一致性验收

- 人员状态变化后，项目/任务侧可见一致
- 关联记录、变更日志完整可追溯

### 11.3 风险控制验收

- 资质过期预警可触发
- 超负载预警可触发
- 禁用人员无法新增分配

---

## 12. 里程碑建议

- **M1**：人员列表 + 详情 + 新增编辑
- **M2**：角色管理 + 技能资质 + 状态管理
- **M3**：项目/任务关联 + 替补机制 + 风险预警
- **M4**：联调验收 + 数据口径对齐

---

## 13. 字段级数据字典（V1，可直接用于后端建表）

### 13.1 通用约束

- 字符集：`utf8mb4`
- 主键：`BIGINT UNSIGNED AUTO_INCREMENT`（业务编码字段保留唯一索引）
- 时间字段：`DATETIME(3)`，统一使用北京时间
- 逻辑删除：`is_deleted TINYINT(1)` + `deleted_at DATETIME(3)`
- 审计字段：`created_by`、`updated_by`、`created_at`、`updated_at`

### 13.2 人员主表 `pm_person`

| 字段名              | 类型             | 必填 | 默认值                                              | 索引              | 说明                                |
| ------------------- | ---------------- | ---- | --------------------------------------------------- | ----------------- | ----------------------------------- |
| id                  | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT                                      | PK                | 主键                                |
| person_code         | VARCHAR(32)      | 是   | -                                                   | UK                | 人员编码（如 P-2026-0001）          |
| name                | VARCHAR(64)      | 是   | -                                                   | IDX               | 姓名                                |
| mobile              | VARCHAR(20)      | 是   | -                                                   | UK(org_id,mobile) | 手机号（组织内唯一）                |
| email               | VARCHAR(128)     | 否   | NULL                                                | IDX               | 邮箱                                |
| avatar_url          | VARCHAR(255)     | 否   | NULL                                                | -                 | 头像地址                            |
| org_id              | BIGINT UNSIGNED  | 是   | -                                                   | IDX               | 所属组织                            |
| team_id             | BIGINT UNSIGNED  | 否   | NULL                                                | IDX               | 所属团队                            |
| title               | VARCHAR(64)      | 否   | NULL                                                | -                 | 岗位名称                            |
| employment_type     | TINYINT UNSIGNED | 是   | 1                                                   | IDX               | 用工类型：1内部/2外包/3供应商       |
| person_status       | TINYINT UNSIGNED | 是   | 1                                                   | IDX               | 人员状态：1在岗/2请假/3离岗/4禁用   |
| availability_status | TINYINT UNSIGNED | 是   | 1                                                   | IDX               | 可分配状态：1可分配/2忙碌/3不可分配 |
| work_city           | VARCHAR(32)      | 否   | NULL                                                | IDX               | 工作城市                            |
| current_task_count  | INT UNSIGNED     | 是   | 0                                                   | -                 | 当前任务数（快照）                  |
| critical_task_count | INT UNSIGNED     | 是   | 0                                                   | -                 | 关键任务数（快照）                  |
| risk_level          | TINYINT UNSIGNED | 是   | 1                                                   | IDX               | 风险等级：1低/2中/3高               |
| remark              | VARCHAR(500)     | 否   | NULL                                                | -                 | 备注                                |
| is_deleted          | TINYINT(1)       | 是   | 0                                                   | IDX               | 逻辑删除标记                        |
| deleted_at          | DATETIME(3)      | 否   | NULL                                                | -                 | 删除时间                            |
| created_by          | VARCHAR(64)      | 是   | 'system'                                            | -                 | 创建人                              |
| created_at          | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3)                                | IDX               | 创建时间                            |
| updated_by          | VARCHAR(64)      | 是   | 'system'                                            | -                 | 更新人                              |
| updated_at          | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) | -                 | 更新时间                            |

### 13.3 组织表 `pm_organization`

| 字段名         | 类型             | 必填 | 默认值                                              | 索引 | 说明                  |
| -------------- | ---------------- | ---- | --------------------------------------------------- | ---- | --------------------- |
| id             | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT                                      | PK   | 主键                  |
| org_code       | VARCHAR(32)      | 是   | -                                                   | UK   | 组织编码              |
| org_name       | VARCHAR(128)     | 是   | -                                                   | IDX  | 组织名称              |
| org_type       | TINYINT UNSIGNED | 是   | 1                                                   | IDX  | 1品牌方/2平台/3资源方 |
| status         | TINYINT UNSIGNED | 是   | 1                                                   | IDX  | 1启用/2禁用           |
| contact_name   | VARCHAR(64)      | 否   | NULL                                                | -    | 联系人                |
| contact_mobile | VARCHAR(20)      | 否   | NULL                                                | -    | 联系电话              |
| created_at     | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3)                                | -    | 创建时间              |
| updated_at     | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) | -    | 更新时间              |

### 13.4 团队表 `pm_team`

| 字段名         | 类型             | 必填 | 默认值                                              | 索引                 | 说明                   |
| -------------- | ---------------- | ---- | --------------------------------------------------- | -------------------- | ---------------------- |
| id             | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT                                      | PK                   | 主键                   |
| org_id         | BIGINT UNSIGNED  | 是   | -                                                   | IDX                  | 组织ID                 |
| team_code      | VARCHAR(32)      | 是   | -                                                   | UK(org_id,team_code) | 团队编码（组织内唯一） |
| team_name      | VARCHAR(128)     | 是   | -                                                   | IDX                  | 团队名称               |
| team_leader_id | BIGINT UNSIGNED  | 否   | NULL                                                | IDX                  | 团队负责人             |
| service_scope  | VARCHAR(255)     | 否   | NULL                                                | -                    | 服务范围               |
| status         | TINYINT UNSIGNED | 是   | 1                                                   | IDX                  | 1启用/2禁用            |
| created_at     | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3)                                | -                    | 创建时间               |
| updated_at     | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) | -                    | 更新时间               |

### 13.5 角色表与关联表

#### 13.5.1 角色表 `pm_role`

| 字段名      | 类型             | 必填 | 默认值                                              | 索引 | 说明                      |
| ----------- | ---------------- | ---- | --------------------------------------------------- | ---- | ------------------------- |
| id          | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT                                      | PK   | 主键                      |
| role_code   | VARCHAR(32)      | 是   | -                                                   | UK   | 角色编码                  |
| role_name   | VARCHAR(64)      | 是   | -                                                   | IDX  | 角色名称                  |
| role_scope  | TINYINT UNSIGNED | 是   | 1                                                   | IDX  | 1品牌/2平台/3资源方/4全局 |
| description | VARCHAR(500)     | 否   | NULL                                                | -    | 角色说明                  |
| status      | TINYINT UNSIGNED | 是   | 1                                                   | IDX  | 1启用/2禁用               |
| created_at  | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3)                                | -    | 创建时间                  |
| updated_at  | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) | -    | 更新时间                  |

#### 13.5.2 人员-角色关联 `pm_person_role_rel`

| 字段名     | 类型            | 必填 | 默认值               | 索引                  | 说明       |
| ---------- | --------------- | ---- | -------------------- | --------------------- | ---------- |
| id         | BIGINT UNSIGNED | 是   | AUTO_INCREMENT       | PK                    | 主键       |
| person_id  | BIGINT UNSIGNED | 是   | -                    | UK(person_id,role_id) | 人员ID     |
| role_id    | BIGINT UNSIGNED | 是   | -                    | UK(person_id,role_id) | 角色ID     |
| is_primary | TINYINT(1)      | 是   | 0                    | IDX                   | 是否主角色 |
| created_at | DATETIME(3)     | 是   | CURRENT_TIMESTAMP(3) | -                     | 创建时间   |

### 13.6 技能与资质

#### 13.6.1 技能字典 `pm_skill_dict`

| 字段名     | 类型             | 必填 | 默认值               | 索引 | 说明        |
| ---------- | ---------------- | ---- | -------------------- | ---- | ----------- |
| id         | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT       | PK   | 主键        |
| skill_code | VARCHAR(32)      | 是   | -                    | UK   | 技能编码    |
| skill_name | VARCHAR(64)      | 是   | -                    | IDX  | 技能名称    |
| status     | TINYINT UNSIGNED | 是   | 1                    | IDX  | 1启用/2禁用 |
| created_at | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) | -    | 创建时间    |

#### 13.6.2 人员技能关联 `pm_person_skill_rel`

| 字段名      | 类型             | 必填 | 默认值               | 索引                   | 说明              |
| ----------- | ---------------- | ---- | -------------------- | ---------------------- | ----------------- |
| id          | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT       | PK                     | 主键              |
| person_id   | BIGINT UNSIGNED  | 是   | -                    | UK(person_id,skill_id) | 人员ID            |
| skill_id    | BIGINT UNSIGNED  | 是   | -                    | UK(person_id,skill_id) | 技能ID            |
| skill_level | TINYINT UNSIGNED | 是   | 1                    | IDX                    | 1初级/2中级/3高级 |
| verified_at | DATETIME(3)      | 否   | NULL                 | -                      | 最近认证时间      |
| created_at  | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) | -                      | 创建时间          |

#### 13.6.3 资质字典 `pm_cert_dict`

| 字段名     | 类型             | 必填 | 默认值               | 索引 | 说明             |
| ---------- | ---------------- | ---- | -------------------- | ---- | ---------------- |
| id         | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT       | PK   | 主键             |
| cert_code  | VARCHAR(32)      | 是   | -                    | UK   | 资质编码         |
| cert_name  | VARCHAR(128)     | 是   | -                    | IDX  | 资质名称         |
| valid_days | INT UNSIGNED     | 否   | NULL                 | -    | 默认有效期（天） |
| status     | TINYINT UNSIGNED | 是   | 1                    | IDX  | 1启用/2禁用      |
| created_at | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) | -    | 创建时间         |

#### 13.6.4 人员资质关联 `pm_person_cert_rel`

| 字段名         | 类型             | 必填 | 默认值                                              | 索引                          | 说明                    |
| -------------- | ---------------- | ---- | --------------------------------------------------- | ----------------------------- | ----------------------- |
| id             | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT                                      | PK                            | 主键                    |
| person_id      | BIGINT UNSIGNED  | 是   | -                                                   | UK(person_id,cert_id,cert_no) | 人员ID                  |
| cert_id        | BIGINT UNSIGNED  | 是   | -                                                   | UK(person_id,cert_id,cert_no) | 资质ID                  |
| cert_no        | VARCHAR(64)      | 是   | -                                                   | UK(person_id,cert_id,cert_no) | 证书编号                |
| cert_status    | TINYINT UNSIGNED | 是   | 1                                                   | IDX                           | 1有效/2即将到期/3已过期 |
| issued_at      | DATETIME(3)      | 否   | NULL                                                | -                             | 发证时间                |
| expire_at      | DATETIME(3)      | 否   | NULL                                                | IDX                           | 到期时间                |
| attachment_url | VARCHAR(255)     | 否   | NULL                                                | -                             | 证书附件                |
| created_at     | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3)                                | -                             | 创建时间                |
| updated_at     | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) | -                             | 更新时间                |

### 13.7 人员关联表 `pm_assignment_rel`

| 字段名                 | 类型             | 必填 | 默认值                                              | 索引                       | 说明                            |
| ---------------------- | ---------------- | ---- | --------------------------------------------------- | -------------------------- | ------------------------------- |
| id                     | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT                                      | PK                         | 主键                            |
| relation_code          | VARCHAR(32)      | 是   | -                                                   | UK                         | 关联编码                        |
| source_type            | TINYINT UNSIGNED | 是   | 1                                                   | IDX                        | 1项目/2任务                     |
| source_id              | BIGINT UNSIGNED  | 是   | -                                                   | IDX(source_type,source_id) | 来源对象ID                      |
| person_id              | BIGINT UNSIGNED  | 是   | -                                                   | IDX                        | 人员ID                          |
| relation_role          | TINYINT UNSIGNED | 是   | 1                                                   | IDX                        | 1负责人/2执行人/3协同人/4替补人 |
| start_at               | DATETIME(3)      | 否   | NULL                                                | -                          | 生效时间                        |
| end_at                 | DATETIME(3)      | 否   | NULL                                                | -                          | 结束时间                        |
| status                 | TINYINT UNSIGNED | 是   | 1                                                   | IDX                        | 1有效/2失效                     |
| replace_from_person_id | BIGINT UNSIGNED  | 否   | NULL                                                | IDX                        | 替补来源人员                    |
| change_reason          | VARCHAR(255)     | 否   | NULL                                                | -                          | 变更原因                        |
| created_by             | VARCHAR(64)      | 是   | 'system'                                            | -                          | 创建人                          |
| created_at             | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3)                                | -                          | 创建时间                        |
| updated_by             | VARCHAR(64)      | 是   | 'system'                                            | -                          | 更新人                          |
| updated_at             | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) | -                          | 更新时间                        |

### 13.8 人员状态变更日志 `pm_person_status_log`

| 字段名               | 类型             | 必填 | 默认值               | 索引 | 说明             |
| -------------------- | ---------------- | ---- | -------------------- | ---- | ---------------- |
| id                   | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT       | PK   | 主键             |
| person_id            | BIGINT UNSIGNED  | 是   | -                    | IDX  | 人员ID           |
| before_person_status | TINYINT UNSIGNED | 否   | NULL                 | -    | 变更前人员状态   |
| after_person_status  | TINYINT UNSIGNED | 否   | NULL                 | -    | 变更后人员状态   |
| before_availability  | TINYINT UNSIGNED | 否   | NULL                 | -    | 变更前可分配状态 |
| after_availability   | TINYINT UNSIGNED | 否   | NULL                 | -    | 变更后可分配状态 |
| reason               | VARCHAR(255)     | 否   | NULL                 | -    | 变更原因         |
| operator_id          | VARCHAR(64)      | 是   | -                    | IDX  | 操作人           |
| changed_at           | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) | IDX  | 变更时间         |

### 13.9 推荐索引补充

- `pm_person`：`idx_org_status_availability(org_id, person_status, availability_status)`
- `pm_person`：`idx_org_team(org_id, team_id)`
- `pm_assignment_rel`：`idx_source_role(source_type, source_id, relation_role, status)`
- `pm_person_cert_rel`：`idx_expire_status(expire_at, cert_status)`

### 13.10 枚举口径（建议）

- `employment_type`：1内部、2外包、3供应商
- `person_status`：1在岗、2请假、3离岗、4禁用
- `availability_status`：1可分配、2忙碌、3不可分配
- `source_type`：1项目、2任务
- `relation_role`：1负责人、2执行人、3协同人、4替补人
- `cert_status`：1有效、2即将到期、3已过期
