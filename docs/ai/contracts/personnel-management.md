---
id: AI-PERSONNEL-MANAGEMENT
human_source: docs/01-product/personnel-management-prd.md
status: active
last_synced: 2026-05-11
---

# AI 合约：人员管理

## 模块定位

三端协作的组织与角色底座，统一管理"人、组织、角色、技能、可用性、协同关系"，支撑"分配-执行-验收-结算"全链路的人效与协同。

## 核心实体

| 实体                                 | 字段                                                                                                                                                                   | 状态机                                                                        |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Person `pm_person`                   | person_code, name, mobile(org内唯一), org_id, team_id, title, employment_type(1内部/2外包/3供应商), person_status, availability_status, current_task_count, risk_level | person_status: 1在岗→2请假→3离岗→4禁用；availability: 1可分配/2忙碌/3不可分配 |
| Organization `pm_organization`       | org_code, org_name, org_type(1品牌方/2平台/3资源方), status                                                                                                            | 1启用/2禁用                                                                   |
| Team `pm_team`                       | org_id, team_code(org内唯一), team_name, team_leader_id, service_scope                                                                                                 | —                                                                             |
| Role `pm_role`                       | role_code, role_name, role_scope(1品牌/2平台/3资源方/4全局)                                                                                                            | —                                                                             |
| SkillDict `pm_skill_dict`            | skill_code, skill_name, status                                                                                                                                         | —                                                                             |
| CertDict `pm_cert_dict`              | cert_code, cert_name, valid_days                                                                                                                                       | —                                                                             |
| PersonRoleRel `pm_person_role_rel`   | person_id+role_id UK, is_primary                                                                                                                                       | —                                                                             |
| PersonSkillRel `pm_person_skill_rel` | person_id+skill_id UK, skill_level(1初/2中/3高)                                                                                                                        | —                                                                             |
| PersonCertRel `pm_person_cert_rel`   | person_id+cert_id+cert_no UK, cert_status(1有效/2将到期/3过期), expire_at                                                                                              | —                                                                             |
| AssignmentRel `pm_assignment_rel`    | source_type(1项目/2任务), person_id, relation_role(1负责人/2执行人/3协同人/4替补人), replace_from_person_id                                                            | 1有效/2失效                                                                   |
| StatusLog `pm_person_status_log`     | person_id, before/after_person_status, before/after_availability, reason, operator_id                                                                                  | —                                                                             |

## 业务规则

1. 人员采用逻辑删除（禁用），不物理删除
2. 已关联项目/任务的人员不可直接移除历史记录
3. 任务分配时必须校验人员状态 + 可分配状态 + 必要资质
4. 替补切换必须保留原责任人、切换时间、切换原因
5. 组织管理员仅可操作本组织人员数据
6. 状态变更必须写入 `pm_person_status_log`
7. `current_task_count` / `critical_task_count` 为冗余快照，由 assignment_rel 写操作触发更新
8. 离岗/禁用人员不可被新增分配；请假人员不可新分配关键任务
9. 手机号组织内唯一；关键角色需至少 1 人在岗

## 依赖模块

| 模块     | 引用位置                        | 依赖内容                                     |
| -------- | ------------------------------- | -------------------------------------------- |
| 项目管理 | pm_assignment_rel.source_type=1 | 项目成员池读取/负责人变更/项目详情人员标签   |
| 任务中心 | pm_assignment_rel.source_type=2 | 任务分配守卫校验(在岗∧可分配∧资质)；负载回写 |
| 采购管理 | pm_person.person_id             | 采购申请关联申请人；到货通知任务负责人       |

## API 骨架

| 方法           | 路径                        | 说明                             |
| -------------- | --------------------------- | -------------------------------- |
| GET/POST       | `/api/personnel`            | 人员列表/新增                    |
| GET/PUT/DELETE | `/api/personnel/:id`        | 详情/编辑/逻辑删除               |
| POST           | `/api/personnel/:id/status` | 状态切换                         |
| GET/POST       | `/api/organizations`        | 组织列表/新增                    |
| GET/PUT        | `/api/organizations/:id`    | 组织详情/编辑                    |
| GET/POST       | `/api/roles`                | 角色列表/新增                    |
| PUT            | `/api/roles/:id`            | 角色编辑                         |
| POST           | `/api/personnel/:id/roles`  | 人员角色绑定                     |
| GET/POST       | `/api/assignments`          | 关联记录列表/新建                |
| POST           | `/api/assignments/validate` | 分配前守卫校验 → {ok, reasons[]} |
| GET/POST/PUT   | `/api/skills`               | 技能字典 CRUD                    |
| GET/POST/PUT   | `/api/certifications`       | 资质字典 CRUD                    |
| GET            | `/api/personnel/:id/skills` | 人员技能列表                     |
| GET            | `/api/personnel/:id/certs`  | 人员资质列表                     |
| GET            | `/api/stats/personnel`      | 在岗率/负载/覆盖统计             |

## 质量门禁

- 权限：按组织边界隔离（V1）
- 审计：状态切换、角色变更、替补切换必须记录
- 性能：列表查询响应 < 2s（万级数据下分页）
- 可用性：关键操作支持二次确认与失败重试
- 数据一致性：`current_task_count` 快照与 assignment_rel 实际记录数一致
