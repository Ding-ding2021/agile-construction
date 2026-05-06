---
id: DOC-01-PRODUCT-PERSONNEL-MANAGEMENT-PRD
title: 人员管理需求文档
owner: docs-maintainer
status: active
last_updated: 2026-05-06
source_of_truth: true
related_code:
  - prisma/schema.prisma
  - src/components/personnel/personnelUsers.ts
  - src/services/repositories/personnelRepository.ts
related_docs:
  - docs/01-product/product-roadmap-v1.2-draft.md
  - docs/01-product/project-management-prd.md
  - docs/01-product/task-center-prd.md
  - docs/02-architecture/state-machine-design.md
  - docs/03-engineering/development-plan-v1.2.md
  - docs/PLAN.md
---

# 人员管理需求文档

> **文档版本**：V1.1
> **文档状态**：已评审（2026-05-06 产品路线评审通过）
> **适用阶段**：V1 / MVP
> **所属模块**：人员管理
> **关联文档**：`docs/01-product/product-roadmap-v1.2-draft.md`、`docs/01-product/project-management-prd.md`、`docs/01-product/task-center-prd.md`、`docs/02-architecture/state-machine-design.md`、`docs/03-engineering/development-plan-v1.2.md`、`docs/PLAN.md`
> **变更说明（V1.1）**：
>
> - 新增 §3 业务数据关系图（ER 图、流程数据流、现有系统字符串碎片诊断）
> - 新增 §13 分阶段开发策略（4 阶段 11 张表，从「能被引用」到「能被管理」）
> - 新增 §15 与现有 Prisma Schema 整合方案（现有表字段映射、迁移策略）
> - 新增 §16 开发顺序与路线图嵌入（嵌入 Phase 1.5~Phase 4）
> - §14 数据字典新增分阶段标识（阶段 A/B/C/D）
> - 里程碑从 4 个粗粒度阶段细化为渐进交付策略
> - 状态模型新增与任务/项目状态机的守卫衔接点

---

## 1. 模块概述

### 1.1 模块定位

人员管理模块是三端协作的组织与角色底座，负责统一管理"人、组织、角色、技能、可用性、协同关系"。

在本系统中：

- `项目管理`负责项目容器与总体进度
- `任务中心`负责任务执行流转
- `人员管理`负责谁可以做、谁正在做、谁最适合做

人员管理并非简单通讯录，而是支撑"分配-执行-验收-结算"全链路的人效与协同基础模块。

### 1.2 模块目标

V1 重点解决以下问题：

- 人员信息分散（散落在 Project/ProjectMember/ProjectTask 等表的字符串字段中），跨端口径不一致
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

系统识别"关键任务无人可接""关键岗位资质过期""负载超阈值"等风险并提示。

---

## 3. 业务数据关系

### 3.1 现状诊断：当前系统中的人员"字符串碎片"

当前 Prisma Schema 中没有独立的 Person 表，人员信息以字符串碎片形式散落在各处：

| 表                                    | 字段      | 问题                                     |
| ------------------------------------- | --------- | ---------------------------------------- |
| `Project.owner`                       | `String?` | 存人名文本，无外键，无法追溯             |
| `ProjectMember.userId`                | `String`  | 存 ID 字符串，无对应 Person 表           |
| `ProjectMember.name/role/phone/email` | 各字段    | 人员属性冗余在项目成员表                 |
| `ProjectTask.assigneeId`              | `String?` | 存 ID 字符串，与 assigneeName 可能不一致 |
| `ProjectTask.assigneeName`            | `String?` | 存人名文本                               |
| `ProjectTask.ownerRole`               | `String?` | 存角色文本                               |
| `ProjectMilestone.assignee`           | `String?` | 存人名文本                               |
| `ProjectRisk.assignee`                | `String?` | 存人名文本                               |
| `WorkPackage.managerId`               | `String?` | 存 ID 字符串                             |

**结论**：系统里没有 `Person` 的概念，只有"一串字"。一旦改名、换岗、离职，所有引用点都要手动修改。

### 3.2 核心业务流程的数据流向

```
                    ┌─────────────────┐
                    │   组织           │
                    │  Organization   │
                    └────────┬────────┘
                             │ 1:N
                             ▼
┌──────────┐  绑定  ┌─────────────────┐  持有  ┌──────────────┐
│  角色     │◄──────│     人员 Person  │───────►│  技能 Skill   │
│  Role    │  N:M  │                 │  N:M   │  资质 Cert    │
└──────────┘       └────────┬────────┘        └──────────────┘
                             │
              ┌──────────────┼──────────────┐
              │ 分配          │ 变更          │ 校验
              ▼              ▼              ▼
       ┌──────────┐  ┌──────────────┐  ┌──────────────┐
       │ 项目成员  │  │ 状态变更日志  │  │ 分配前守卫    │
       │ 任务执行  │  │ StatusLog    │  │ 在岗?可分配?  │
       │ 采购申请  │  │              │  │ 资质?负载?   │
       │ 验收执行  │  │              │  │              │
       └──────────┘  └──────────────┘  └──────────────┘
```

### 3.3 五条核心业务流程

| #   | 流程               | 触发方              | 数据流向                                                      | 关键约束                                 |
| --- | ------------------ | ------------------- | ------------------------------------------------------------- | ---------------------------------------- |
| 1   | **新成员入驻**     | 管理员              | Person 表 INSERT → 可选 Role/Skill/Cert 关联                  | 手机号组织内唯一，必填：姓名、组织、角色 |
| 2   | **项目组建**       | 项目经理            | Person 表 SELECT → `pm_assignment_rel` INSERT                 | 只能选在岗 + 可分配人员                  |
| 3   | **任务分配前校验** | 调度运营 / 系统守卫 | 查 Person + Assignment + Cert 三表交叉                        | 在岗 ∧ 可分配 ∧ (资质通过 ∨ 无资质要求)  |
| 4   | **人员变更与替补** | 管理员 / 系统       | Person.status UPDATE → StatusLog INSERT → Assignment 替补标记 | 离岗/禁用不可新分配；替补记录来源        |
| 5   | **风险识别**       | 定时 / 事件触发     | 查 Cert(过期) + Person(负载)                                  | 资质 7/30 天预警；负载 > 阈值标记        |

### 3.4 ER 关系总图

```
pm_organization ──1:N──► pm_team ──N:1──► pm_person
                                                 │
                          pm_role ◄──N:M──► pm_person_role_rel
                                                 │
                          pm_skill_dict ◄──N:M──► pm_person_skill_rel
                                                 │
                          pm_cert_dict ◄──N:M──► pm_person_cert_rel
                                                 │
                                         1:N ───► pm_person_status_log
                                                 │
                                         1:N ───► pm_assignment_rel
                                                   │
                          Project ◄────────────────┤ source_type=1
                          ProjectTask ◄────────────┤ source_type=2
```

---

## 4. 业务对象定义

### 4.1 人员 Person

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
- `person_status`（在岗/请假/离岗/禁用）
- `availability_status`（可分配/忙碌/不可分配）
- `work_city`
- `current_task_count`（冗余快照，从 assignment_rel 计算）
- `critical_task_count`（冗余快照）
- `risk_level`
- `created_at`
- `updated_at`

### 4.2 组织 Organization

- `org_id`
- `org_type`（品牌方/平台/资源方）
- `org_name`
- `org_code`
- `status`

### 4.3 团队 Team

- `team_id`
- `org_id`
- `team_name`
- `team_leader_id`
- `service_scope`
- `status`

### 4.4 角色 Role

- `role_id`
- `role_code`
- `role_name`
- `role_scope`（品牌/平台/资源方/全局）
- `description`

### 4.5 技能与资质 Skill / Certification

- `skill_id`
- `skill_name`
- `skill_level`（初级/中级/高级）
- `cert_id`
- `cert_name`
- `cert_expire_at`
- `cert_status`（有效/即将到期/已过期）

### 4.6 关联关系 Assignment Relation

- `relation_id`
- `source_type`（project/task）
- `source_id`
- `person_id`
- `relation_role`（负责人/执行人/协同人/替补人）
- `start_at`
- `end_at`
- `status`
- `replace_from_person_id`（替补来源）
- `change_reason`（变更原因）

---

## 5. 状态模型

### 5.1 人员状态（person_status）

| 值  | 状态 | 说明                                       |
| --- | ---- | ------------------------------------------ |
| 1   | 在岗 | 正常工作，可被分配                         |
| 2   | 请假 | 暂离岗位，保留历史任务，不可新分配关键任务 |
| 3   | 离岗 | 已离开组织，不可分配，历史记录保留         |
| 4   | 禁用 | 被管理员禁用，不可分配，历史记录保留       |

### 5.2 可分配状态（availability_status）

| 值  | 状态     | 说明                                                 |
| --- | -------- | ---------------------------------------------------- |
| 1   | 可分配   | 可被分配到新项目/任务                                |
| 2   | 忙碌     | 负载接近上限，不建议分配关键任务                     |
| 3   | 不可分配 | 明确不可分配（如请假/离岗/禁用自动联动，或手动设置） |

### 5.3 人员状态与可分配状态的联动

| person_status | 默认 availability_status | 可手动覆盖                 |
| ------------- | ------------------------ | -------------------------- |
| 在岗 (1)      | 可分配 (1)               | 是（可在岗但手动设为忙碌） |
| 请假 (2)      | 不可分配 (3)             | 否                         |
| 离岗 (3)      | 不可分配 (3)             | 否                         |
| 禁用 (4)      | 不可分配 (3)             | 否                         |

### 5.4 状态流转规则（V1）

- 离岗/禁用人员不可被新增分配
- 请假人员可保留历史任务，不可新分配关键任务
- 资质过期人员不可承接需资质校验任务
- 人员状态变更需写入 `pm_person_status_log`，记录操作人和原因
- 从在岗 → 请假/离岗/禁用时，自动将 availability_status 置为不可分配

### 5.5 与任务/项目状态机的守卫衔接

人员状态作为其他模块状态机的守卫条件，不独立构建复杂状态机：

| 场景                   | 守卫条件                                         | 涉及人员字段                             |
| ---------------------- | ------------------------------------------------ | ---------------------------------------- |
| 任务 `待分配 → 待执行` | assignee 在岗 ∧ 可分配 ∧ (资质通过 ∨ 无资质要求) | person_status, availability_status, cert |
| 项目组建选人           | 过滤：仅在岗 + 可分配                            | person_status, availability_status       |
| 关键岗位空缺告警       | 角色下在岗人数 < 最小阈值                        | person_status, role_rel                  |
| 任务执行中替补         | 原人标记为替补来源，新人关联关系                 | assignment_rel                           |

---

## 6. 功能需求

### 6.1 人员列表

**目标**：统一查看并快速定位可用人员。

功能点：

- 列表展示：姓名、组织、团队、角色、状态、可分配状态、技能摘要、当前任务数
- 搜索：姓名/手机号/工号
- 筛选：组织、团队、角色、状态、技能、城市
- 排序：负载、最近活跃、风险等级
- 批量操作：启用、禁用、标签维护

### 6.2 人员详情

功能点：

- 基本信息
- 角色与岗位信息
- 技能与资质信息
- 项目参与记录
- 当前任务负载
- 状态变更记录

### 6.3 新增/编辑人员

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

### 6.4 角色管理

功能点：

- 角色定义与说明
- 角色范围（品牌/平台/资源方）
- 人员与角色绑定
- 角色使用统计（关联人数）

### 6.5 技能与资质管理

功能点：

- 技能字典维护
- 资质类型维护
- 人员技能等级维护
- 资质有效期预警（7/30 天）

### 6.6 可用性与负载管理

功能点：

- 手动切换可分配状态
- 自动负载计算（任务数、关键任务数）
- 超阈值预警（可配置阈值）
- 请假/离岗期间禁止新分配

### 6.7 人员关联管理（项目/任务）

功能点：

- 在项目详情中配置项目成员
- 在任务分配前选择执行人/协同人
- 替补人设置与一键替换
- 关联变更日志

---

## 7. 关键业务规则

1. 人员删除策略：V1 采用逻辑删除（禁用），不物理删除。
2. 已关联项目/任务的人员不可直接移除历史记录。
3. 任务分配时必须校验人员状态 + 可分配状态 + 必要资质。
4. 替补切换必须保留原责任人、切换时间、切换原因。
5. 组织管理员仅可操作本组织人员数据。
6. 状态变更（在岗↔请假↔离岗↔禁用）必须写入 `pm_person_status_log`。
7. `current_task_count` 和 `critical_task_count` 为冗余快照字段，由 assignment_rel 写操作触发更新。

---

## 8. 页面与交互建议（V1）

### 8.1 页面清单

- 人员管理列表页
- 人员详情页
- 新增/编辑人员抽屉
- 角色管理页
- 技能资质管理页

### 8.2 列表页关键交互

- 统计卡：在岗人数、可分配人数、资质即将到期人数、超负载人数
- 快捷筛选：仅看可分配 / 仅看关键岗位 / 仅看高负载
- 行内操作：查看详情、编辑、状态切换、设置替补

### 8.3 详情页关键交互

- 标签页：基础信息 / 技能资质 / 项目任务 / 操作日志
- 右侧风险提示：资质过期、负载超阈值、关键岗位空缺

---

## 9. 数据统计与监控指标

### 9.1 核心指标

- 总人数 / 在岗率 / 可分配率
- 人员平均负载（任务数）
- 关键岗位覆盖率
- 资质有效率
- 替补切换次数

### 9.2 预警指标

- 资质 7 天内到期人数
- 高负载人员数
- 不可分配但仍被分配的异常次数

---

## 10. 非功能性要求

- 权限：按组织边界隔离（V1）
- 审计：关键操作需记录（状态切换、角色变更、替补切换）
- 性能：列表查询响应 < 2s（万级数据下分页）
- 可用性：关键操作支持二次确认与失败重试

---

## 11. 与其他模块接口边界

### 11.1 与项目管理

- 项目成员池读取人员列表（查询 Person 表 + 过滤在岗可分配）
- 项目负责人变更写回 `pm_assignment_rel`
- 项目详情"资源与人员"标签展示已关联成员

### 11.2 与任务中心

- 任务分配时读取人员可用性、技能、资质（调用守卫校验函数）
- 任务状态变化回写人员负载（`current_task_count` / `critical_task_count`）
- 任务 `待分配 → 待执行` 的守卫条件包含人员状态校验

### 11.3 与调度能力

- 人员画像作为推荐输入（城市/技能/负载/资质）

### 11.4 与采购管理

- 采购申请关联申请人（`person_id`）
- 物资到货后通知关联任务负责人

---

## 12. 验收标准（V1）

### 12.1 功能验收

- 可完成人员新增、编辑、禁用、查询、筛选
- 可完成角色绑定、技能资质维护
- 可在项目/任务中完成人员关联与替补设置
- 分配前校验规则生效（守卫函数返回明确拒绝原因）

### 12.2 数据一致性验收

- 人员状态变化后，项目/任务侧可见一致
- 关联记录、变更日志完整可追溯
- `current_task_count` 快照与 assignment_rel 实际记录数一致

### 12.3 风险控制验收

- 资质过期预警可触发
- 超负载预警可触发
- 禁用人员无法新增分配

---

## 13. 分阶段开发策略

### 13.1 开发原则

> **先做「能被引用」，再做「能被校验」，最后做「能被管理」。每个阶段只建刚好够用的表，不做过度设计。**

### 13.2 四阶段总览

| 阶段       | 嵌入路线图位置                 | 核心目标                 | 建表            | 工期   |
| ---------- | ------------------------------ | ------------------------ | --------------- | ------ |
| **阶段 A** | Phase 1.5 末 / Phase 2 初      | 让其他模块能引用"一个人" | 2 张核心表      | 4.5 天 |
| **阶段 B** | Phase 2 后期（与项目立项并行） | 角色体系 + 人员详情      | 3 张角色表      | 2 天   |
| **阶段 C** | Phase 3（与任务状态流转同步）  | 分配校验 + 可用性管理    | 2 张关联+日志表 | 2.5 天 |
| **阶段 D** | Phase 4（与采购/资源并行）     | 技能资质 + 完整管理      | 4 张技能资质表  | 2.5 天 |

### 13.3 阶段 A：人员最小底座（P0 阻塞性）

> 只做「让其他模块能下拉选一个人」的最小闭环

**建表**：`pm_organization` + `pm_person`

**API**：`GET/POST/PUT /api/personnel`、`GET/POST /api/organizations`

**UI（shadcn）**：

- 人员列表页（表格 + 搜索框 + 状态筛选）
- 新增/编辑抽屉（表单：姓名/手机/组织/角色下拉/状态）
- 人员选择器组件 `PersonSelect`（供项目详情/任务分配复用）

**不做**：

- 详情页（点名字跳转占位即可）
- 独立角色管理页（角色用硬编码枚举过渡：管理员/项目经理/执行人员/验收人员）
- 技能、资质、团队（字段预留，UI 后续补）
- 可用性管理（默认可分配，手动切换后续补）

**产出物**：能查、能增、能改、能被其他模块的下拉框引用。

### 13.4 阶段 B：角色与人员详情（P1）

> 当项目立项需要"选项目负责人"时，角色体系必须可用

**建表**：`pm_role` + `pm_person_role_rel` + `pm_team`

**API**：`GET/POST/PUT /api/roles`、角色绑定接口

**UI（shadcn）**：

- 人员详情页（基本信息 / 关联项目任务 / 操作日志 3 个 Tab）
- 角色管理页（简化版：预置 5-6 个系统角色，支持增删改）
- 团队 CRUD（组织内团队列表）

**不做**：

- 完整权限矩阵（V1 先硬编码角色权限）
- 组织管理员数据隔离（MVP 单组织）

### 13.5 阶段 C：分配校验与可用性（P1）

> 当任务进入「待分配→待执行」流转时，需要校验执行人

**建表**：`pm_assignment_rel` + `pm_person_status_log`

**API**：`GET/POST /api/assignments`、人员分配校验接口（返回守卫结果）

**逻辑**：

- 任务分配前守卫函数：`canAssign(personId, taskId) → { ok, reasons[] }`
- 负载快照更新：assignment_rel 写操作触发 `current_task_count` 重算
- 可用性管理 UI：手动切换可分配/忙碌/不可分配
- 负载超阈值预警

**不做**：

- 替补机制复杂 UI（先支持数据层面的替补标记，交互后续补）

### 13.6 阶段 D：技能资质与完整管理（P2）

> 技能和资质是"锦上添花"，V1 MVP 可以用标签代替

**建表**：`pm_skill_dict` + `pm_person_skill_rel` + `pm_cert_dict` + `pm_person_cert_rel`

**API**：技能/资质字典 CRUD、人员技能/资质关联、资质到期查询

**UI（shadcn）**：

- 技能资质管理页（技能字典 + 资质字典 + 人员关联）
- 资质 7/30 天到期预警
- 人员详情页"技能资质"Tab 填充真实数据
- 替补人设置 + 一键替换 UI

---

## 14. 字段级数据字典

> 每张表标注所属阶段：**A** = 阶段 A 建表，**B/C/D** = 后续阶段

### 14.1 通用约束

- 字符集：`utf8mb4`
- 主键：`BIGINT UNSIGNED AUTO_INCREMENT`（业务编码字段保留唯一索引）
- 时间字段：`DATETIME(3)`，统一使用北京时间
- 逻辑删除：`is_deleted TINYINT(1)` + `deleted_at DATETIME(3)`
- 审计字段：`created_by`、`updated_by`、`created_at`、`updated_at`

### 14.2 人员主表 `pm_person` — 阶段 A

| 字段名              | 类型             | 必填 | 默认值                                              | 索引              | 说明                                |
| ------------------- | ---------------- | ---- | --------------------------------------------------- | ----------------- | ----------------------------------- |
| id                  | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT                                      | PK                | 主键                                |
| person_code         | VARCHAR(32)      | 是   | -                                                   | UK                | 人员编码（如 P-2026-0001）          |
| name                | VARCHAR(64)      | 是   | -                                                   | IDX               | 姓名                                |
| mobile              | VARCHAR(20)      | 是   | -                                                   | UK(org_id,mobile) | 手机号（组织内唯一）                |
| email               | VARCHAR(128)     | 否   | NULL                                                | IDX               | 邮箱                                |
| avatar_url          | VARCHAR(255)     | 否   | NULL                                                | -                 | 头像地址                            |
| org_id              | BIGINT UNSIGNED  | 是   | -                                                   | IDX               | 所属组织                            |
| team_id             | BIGINT UNSIGNED  | 否   | NULL                                                | IDX               | 所属团队（阶段 B 建 team 表后 FK）  |
| title               | VARCHAR(64)      | 否   | NULL                                                | -                 | 岗位名称                            |
| employment_type     | TINYINT UNSIGNED | 是   | 1                                                   | IDX               | 用工类型：1内部/2外包/3供应商       |
| person_status       | TINYINT UNSIGNED | 是   | 1                                                   | IDX               | 人员状态：1在岗/2请假/3离岗/4禁用   |
| availability_status | TINYINT UNSIGNED | 是   | 1                                                   | IDX               | 可分配状态：1可分配/2忙碌/3不可分配 |
| work_city           | VARCHAR(32)      | 否   | NULL                                                | IDX               | 工作城市                            |
| current_task_count  | INT UNSIGNED     | 是   | 0                                                   | -                 | 当前任务数（冗余快照，阶段 C 启用） |
| critical_task_count | INT UNSIGNED     | 是   | 0                                                   | -                 | 关键任务数（阶段 C 启用）           |
| risk_level          | TINYINT UNSIGNED | 是   | 1                                                   | IDX               | 风险等级：1低/2中/3高               |
| remark              | VARCHAR(500)     | 否   | NULL                                                | -                 | 备注                                |
| is_deleted          | TINYINT(1)       | 是   | 0                                                   | IDX               | 逻辑删除标记                        |
| deleted_at          | DATETIME(3)      | 否   | NULL                                                | -                 | 删除时间                            |
| created_by          | VARCHAR(64)      | 是   | 'system'                                            | -                 | 创建人                              |
| created_at          | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3)                                | IDX               | 创建时间                            |
| updated_by          | VARCHAR(64)      | 是   | 'system'                                            | -                 | 更新人                              |
| updated_at          | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) | -                 | 更新时间                            |

### 14.3 组织表 `pm_organization` — 阶段 A

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

### 14.4 团队表 `pm_team` — 阶段 B

| 字段名         | 类型             | 必填 | 默认值                                              | 索引                 | 说明                       |
| -------------- | ---------------- | ---- | --------------------------------------------------- | -------------------- | -------------------------- |
| id             | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT                                      | PK                   | 主键                       |
| org_id         | BIGINT UNSIGNED  | 是   | -                                                   | IDX                  | 组织ID                     |
| team_code      | VARCHAR(32)      | 是   | -                                                   | UK(org_id,team_code) | 团队编码（组织内唯一）     |
| team_name      | VARCHAR(128)     | 是   | -                                                   | IDX                  | 团队名称                   |
| team_leader_id | BIGINT UNSIGNED  | 否   | NULL                                                | IDX                  | 团队负责人（FK→pm_person） |
| service_scope  | VARCHAR(255)     | 否   | NULL                                                | -                    | 服务范围                   |
| status         | TINYINT UNSIGNED | 是   | 1                                                   | IDX                  | 1启用/2禁用                |
| created_at     | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3)                                | -                    | 创建时间                   |
| updated_at     | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) | -                    | 更新时间                   |

### 14.5 角色表与关联表 — 阶段 B

#### 14.5.1 角色表 `pm_role`

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

#### 14.5.2 人员-角色关联 `pm_person_role_rel`

| 字段名     | 类型            | 必填 | 默认值               | 索引                  | 说明       |
| ---------- | --------------- | ---- | -------------------- | --------------------- | ---------- |
| id         | BIGINT UNSIGNED | 是   | AUTO_INCREMENT       | PK                    | 主键       |
| person_id  | BIGINT UNSIGNED | 是   | -                    | UK(person_id,role_id) | 人员ID     |
| role_id    | BIGINT UNSIGNED | 是   | -                    | UK(person_id,role_id) | 角色ID     |
| is_primary | TINYINT(1)      | 是   | 0                    | IDX                   | 是否主角色 |
| created_at | DATETIME(3)     | 是   | CURRENT_TIMESTAMP(3) | -                     | 创建时间   |

### 14.6 技能与资质 — 阶段 D

#### 14.6.1 技能字典 `pm_skill_dict`

| 字段名     | 类型             | 必填 | 默认值               | 索引 | 说明        |
| ---------- | ---------------- | ---- | -------------------- | ---- | ----------- |
| id         | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT       | PK   | 主键        |
| skill_code | VARCHAR(32)      | 是   | -                    | UK   | 技能编码    |
| skill_name | VARCHAR(64)      | 是   | -                    | IDX  | 技能名称    |
| status     | TINYINT UNSIGNED | 是   | 1                    | IDX  | 1启用/2禁用 |
| created_at | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) | -    | 创建时间    |

#### 14.6.2 人员技能关联 `pm_person_skill_rel`

| 字段名      | 类型             | 必填 | 默认值               | 索引                   | 说明              |
| ----------- | ---------------- | ---- | -------------------- | ---------------------- | ----------------- |
| id          | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT       | PK                     | 主键              |
| person_id   | BIGINT UNSIGNED  | 是   | -                    | UK(person_id,skill_id) | 人员ID            |
| skill_id    | BIGINT UNSIGNED  | 是   | -                    | UK(person_id,skill_id) | 技能ID            |
| skill_level | TINYINT UNSIGNED | 是   | 1                    | IDX                    | 1初级/2中级/3高级 |
| verified_at | DATETIME(3)      | 否   | NULL                 | -                      | 最近认证时间      |
| created_at  | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) | -                      | 创建时间          |

#### 14.6.3 资质字典 `pm_cert_dict`

| 字段名     | 类型             | 必填 | 默认值               | 索引 | 说明             |
| ---------- | ---------------- | ---- | -------------------- | ---- | ---------------- |
| id         | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT       | PK   | 主键             |
| cert_code  | VARCHAR(32)      | 是   | -                    | UK   | 资质编码         |
| cert_name  | VARCHAR(128)     | 是   | -                    | IDX  | 资质名称         |
| valid_days | INT UNSIGNED     | 否   | NULL                 | -    | 默认有效期（天） |
| status     | TINYINT UNSIGNED | 是   | 1                    | IDX  | 1启用/2禁用      |
| created_at | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) | -    | 创建时间         |

#### 14.6.4 人员资质关联 `pm_person_cert_rel`

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

### 14.7 人员关联表 `pm_assignment_rel` — 阶段 C

| 字段名                 | 类型             | 必填 | 默认值                                              | 索引                       | 说明                            |
| ---------------------- | ---------------- | ---- | --------------------------------------------------- | -------------------------- | ------------------------------- |
| id                     | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT                                      | PK                         | 主键                            |
| relation_code          | VARCHAR(32)      | 是   | -                                                   | UK                         | 关联编码                        |
| source_type            | TINYINT UNSIGNED | 是   | 1                                                   | IDX                        | 1项目/2任务                     |
| source_id              | BIGINT UNSIGNED  | 是   | -                                                   | IDX(source_type,source_id) | 来源对象ID                      |
| person_id              | BIGINT UNSIGNED  | 是   | -                                                   | IDX                        | 人员ID（FK→pm_person）          |
| relation_role          | TINYINT UNSIGNED | 是   | 1                                                   | IDX                        | 1负责人/2执行人/3协同人/4替补人 |
| start_at               | DATETIME(3)      | 否   | NULL                                                | -                          | 生效时间                        |
| end_at                 | DATETIME(3)      | 否   | NULL                                                | -                          | 结束时间                        |
| status                 | TINYINT UNSIGNED | 是   | 1                                                   | IDX                        | 1有效/2失效                     |
| replace_from_person_id | BIGINT UNSIGNED  | 否   | NULL                                                | IDX                        | 替补来源人员（FK→pm_person）    |
| change_reason          | VARCHAR(255)     | 否   | NULL                                                | -                          | 变更原因                        |
| created_by             | VARCHAR(64)      | 是   | 'system'                                            | -                          | 创建人                          |
| created_at             | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3)                                | -                          | 创建时间                        |
| updated_by             | VARCHAR(64)      | 是   | 'system'                                            | -                          | 更新人                          |
| updated_at             | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3) | -                          | 更新时间                        |

### 14.8 人员状态变更日志 `pm_person_status_log` — 阶段 C

| 字段名               | 类型             | 必填 | 默认值               | 索引 | 说明                   |
| -------------------- | ---------------- | ---- | -------------------- | ---- | ---------------------- |
| id                   | BIGINT UNSIGNED  | 是   | AUTO_INCREMENT       | PK   | 主键                   |
| person_id            | BIGINT UNSIGNED  | 是   | -                    | IDX  | 人员ID（FK→pm_person） |
| before_person_status | TINYINT UNSIGNED | 否   | NULL                 | -    | 变更前人员状态         |
| after_person_status  | TINYINT UNSIGNED | 否   | NULL                 | -    | 变更后人员状态         |
| before_availability  | TINYINT UNSIGNED | 否   | NULL                 | -    | 变更前可分配状态       |
| after_availability   | TINYINT UNSIGNED | 否   | NULL                 | -    | 变更后可分配状态       |
| reason               | VARCHAR(255)     | 否   | NULL                 | -    | 变更原因               |
| operator_id          | VARCHAR(64)      | 是   | -                    | IDX  | 操作人                 |
| changed_at           | DATETIME(3)      | 是   | CURRENT_TIMESTAMP(3) | IDX  | 变更时间               |

### 14.9 推荐索引补充

- `pm_person`：`idx_org_status_availability(org_id, person_status, availability_status)`
- `pm_person`：`idx_org_team(org_id, team_id)`
- `pm_assignment_rel`：`idx_source_role(source_type, source_id, relation_role, status)`
- `pm_person_cert_rel`：`idx_expire_status(expire_at, cert_status)`

### 14.10 枚举口径

- `employment_type`：1内部、2外包、3供应商
- `person_status`：1在岗、2请假、3离岗、4禁用
- `availability_status`：1可分配、2忙碌、3不可分配
- `source_type`：1项目、2任务
- `relation_role`：1负责人、2执行人、3协同人、4替补人
- `cert_status`：1有效、2即将到期、3已过期

---

## 15. 与现有 Prisma Schema 整合方案

### 15.1 需要新增的表（11 张）

全部 11 张表为新增，分 4 阶段建表（见 §13）。

### 15.2 需要修改的现有表字段映射

现有系统中人员引用是字符串字段，需逐步迁移为外键：

| 现有表                      | 现有字段  | 迁移方案                                                                       | 阶段 |
| --------------------------- | --------- | ------------------------------------------------------------------------------ | ---- |
| `Project.owner`             | `String?` | 新增 `owner_id BIGINT FK→pm_person`，保留旧字段                                | C    |
| `ProjectMember.userId`      | `String`  | 改为 `BIGINT FK→pm_person`，通过 assignment_rel 替代此表                       | C    |
| `ProjectTask.assigneeId`    | `String?` | 新增 `assignee_person_id BIGINT FK→pm_person`，保留 assigneeId 和 assigneeName | C    |
| `WorkPackage.managerId`     | `String?` | 新增 `manager_person_id BIGINT FK→pm_person`                                   | C    |
| `ProjectMilestone.assignee` | `String?` | 新增 `assignee_person_id BIGINT FK→pm_person`                                  | C    |
| `ProjectRisk.assignee`      | `String?` | 新增 `assignee_person_id BIGINT FK→pm_person`                                  | C    |

### 15.3 迁移策略

1. **不一次性改所有引用**。先在 Person 表建好，旧字段保留作为 fallback
2. **写操作双写**：新字段和旧字段同时写入，确保回退兼容
3. **读操作优先新字段**：新字段有值时用新字段，否则 fallback 到旧字段
4. **旧字段逐步废弃**：Phase 3 全部迁移完成后，标记旧字段为 deprecated，Phase 4 移除

---

## 16. 开发顺序与路线图嵌入

### 16.1 原路线图位置 vs 建议调整

| 内容                          | 原路线图位置    | 建议调整到                    | 理由                     |
| ----------------------------- | --------------- | ----------------------------- | ------------------------ |
| 人员数据底座（阶段 A）        | Phase 7（最末） | **Phase 1.5 末 / Phase 2 初** | 阻塞所有模块的人员引用   |
| 角色基础绑定（阶段 B）        | Phase 7         | **Phase 2 后期**              | 项目立项需要选项目负责人 |
| 分配校验 + 可用性（阶段 C）   | Phase 7         | **Phase 3**                   | 与任务状态流转同步推进   |
| 技能资质 + 完整管理（阶段 D） | Phase 7         | **Phase 4**                   | 非 MVP 阻塞项，可后置    |

### 16.2 嵌入路线图后的时间线

```
Phase 1.5（底座收官）
  │
  ├─ 阶段 A: 人员最小底座（pm_organization + pm_person）
  │
Phase 2（标准与项目）
  │
  ├─ 阶段 B: 角色体系 + 人员详情（pm_role + pm_team + 关联表）
  │
Phase 3（任务中心完善）
  │
  ├─ 阶段 C: 分配校验 + 可用性（pm_assignment_rel + pm_person_status_log）
  │
Phase 4（采购、资源与资产）
  │
  ├─ 阶段 D: 技能资质 + 完整角色管理（4 张技能资质表）
  │
Phase 5（Agent 与工作台）
  │
  └─ 人员数据已完整，Agent 可直接消费
```

### 16.3 各阶段交接条件

| 阶段     | 进入下一阶段的条件                                                | 阻塞的后续模块                  |
| -------- | ----------------------------------------------------------------- | ------------------------------- |
| A → B    | Person + Organization 表可用，PersonSelect 组件在项目中可正常使用 | 项目立项（需要选项目负责人）    |
| B → C    | 角色表可用，人员详情页可查看                                      | 任务分配校验（需要角色 + 详情） |
| C → D    | 分配关联表可用，任务守卫可执行                                    | 采购/验收（需要申请人关联）     |
| D → 完成 | 11 张表全部就绪                                                   | 无                              |

---

**维护者**: 技术团队
**下次评审**: 阶段 A 交付后
