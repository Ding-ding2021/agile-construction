---
id: AI-WORKTEAM-MANAGEMENT
human_source: docs/01-product/workteam-management-prd.md
status: active
last_synced: 2026-05-11
---

# AI 合约：工队资源管理

## 模块定位

工队资源独立管理体系，支撑工队档案全生命周期管理、班组结构维护、资质证照管理、绩效评级与排期负载可视化，为项目派单提供工队选择能力。

## 核心实体

| 实体                             | 字段                                                                                                                                                                                                                                                                                                                                                 | 状态机                                                               |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 工队 (Workteam)                  | id, code(TEAM-YYYY-NNN), name, shortName, level(A/B/C/D/未评级), status(active/suspended/inactive), availability(available/busy/full/unavailable), cooperationMode(exclusive/preferred/general), captain, members[], specialties[], serviceAreas[], qualifications[], rating{}, currentProjectCount, maxConcurrentProjects, priceRange, contactPhone | status: active→suspended→inactive; availability: 按负载/状态自动计算 |
| 班组成员 (CrewMember)            | id, name, phone, idCard(脱敏), role(captain/vice_captain/technician/worker/assistant), skills[], certs[], joinDate, isCoreMember                                                                                                                                                                                                                     | status: active→leave→left                                            |
| 成员证书 (CrewCert)              | name, certNo, issueDate, expireDate, issuingAuthority                                                                                                                                                                                                                                                                                                | status: valid→expiring→expired                                       |
| 工队资质 (WorkteamQualification) | id, name, category(safety/construction/special/quality/other), level, certNo, issueDate, expireDate, issuingAuthority, attachmentUrl                                                                                                                                                                                                                 | status: valid→expiring→expired                                       |

## 业务规则

1. 工队编码格式：TEAM-YYYY-NNN（年+序号）
2. 工队可派单状态按在手项目数 vs 最大并发项目数自动计算
3. 工队评级基于历史项目评价自动计算（质量/进度/安全/配合度各 0-100）
4. 资质证照到期前 30 天自动预警（expiring 状态）
5. 班组长必填，每工队仅一位班组长
6. 工队成员可关联 personnel 表（如有系统账号），也可独立存在
7. 派单目标类型新增 workteam：`{ type: 'workteam'; workteamId: string }`

## 依赖模块

| 模块     | 引用位置                                    | 依赖内容                |
| -------- | ------------------------------------------- | ----------------------- |
| 项目管理 | docs/01-product/project-management-prd.md   | 派单对接、在手项目关联  |
| 人员管理 | docs/01-product/personnel-management-prd.md | 成员与 personnel 表关联 |

## API 骨架

| 方法   | 路径                                   | 说明                                               |
| ------ | -------------------------------------- | -------------------------------------------------- |
| GET    | /api/workteams                         | 列表（含筛选：等级/专业/区域/可派单状态/资质状态） |
| POST   | /api/workteams                         | 创建工队                                           |
| GET    | /api/workteams/:id                     | 详情                                               |
| PUT    | /api/workteams/:id                     | 更新                                               |
| PATCH  | /api/workteams/:id/status              | 状态变更                                           |
| POST   | /api/workteams/:id/members             | 添加成员                                           |
| POST   | /api/workteams/:id/members             | 批量导入成员                                       |
| DELETE | /api/workteams/:id/members/:mid        | 移除成员                                           |
| POST   | /api/workteams/:id/qualifications      | 添加资质                                           |
| PUT    | /api/workteams/:id/qualifications/:qid | 更新资质                                           |
| GET    | /api/workteams/schedule                | 排期数据（甘特图）                                 |

## 质量门禁

- 工队档案完整创建（基础信息+班组长+至少 1 专业领域）方可保存
- 资质到期预警自动触发（P0 级别通知）
- 在手项目数自动计算，可派单状态自动更新
- 工队数据组织隔离，不可跨组织查看
