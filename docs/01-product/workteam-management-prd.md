---
title: 工单团队管理 PRD
number: PRD-010
domain: product
category: prd
status: active
last_updated: 2026-05-05
---

# 工队资源管理模块 PRD

## 1. 文档概述

### 1.1 文档信息

- **模块名称**: 工队资源管理
- **版本**: V1.0
- **状态**: 草稿
- **目标用户**: 项目经理、资源调度员、工队管理员

### 1.2 背景

当前系统中，工队以"人员类型"形式存在（`employmentType: 'outsource'`），但缺乏对**固定班组结构**的管理能力。实际业务中：

- 工队有明确的班组长+核心成员结构
- 派单通常以工队为单位，而非个人
- 需要管理工队整体资质（如安全生产许可证）
- 工队有独立的评级体系

### 1.3 目标

建立独立的工队资源管理体系，支撑：

- 工队档案全生命周期管理
- 班组结构维护（班组长+核心成员）
- 工队资质证照管理
- 工队绩效评级
- 排期与负载可视化

---

## 2. 业务范围

### 2.1 纳入范围

| 功能域   | 说明                               |
| -------- | ---------------------------------- |
| 工队档案 | 基本信息、班组结构、联系方式       |
| 资质管理 | 工队级资质证照（安全、施工、特种） |
| 人员管理 | 班组长、核心成员、灵活成员         |
| 评级体系 | 质量/进度/安全/配合度多维度评分    |
| 排期负载 | 当前在手项目、可派单状态           |
| 派单对接 | 为项目派单提供工队选择能力         |

### 2.2 暂不纳入

- 工队内部工资结算（属于供应商或人力模块）
- 工队培训管理（可后续扩展）
- 工队设备管理（可后续扩展）

---

## 3. 数据模型

### 3.1 核心实体

```typescript
/** 工队等级 */
type WorkteamLevel = 'A' | 'B' | 'C' | 'D' | '未评级'

/** 工队状态 */
type WorkteamStatus = 'active' | 'suspended' | 'inactive'

/** 可派单状态 */
type WorkteamAvailability = 'available' | 'busy' | 'full' | 'unavailable'

/** 班组成员角色 */
type CrewRole = 'captain' | 'vice_captain' | 'technician' | 'worker' | 'assistant'

/** 班组成员 */
interface CrewMember {
  id: string
  name: string
  phone: string
  idCard?: string // 身份证号（脱敏）
  role: CrewRole
  skills: string[]
  certs: CrewCert[]
  joinDate: string
  isCoreMember: boolean // 是否核心成员
  status: 'active' | 'leave' | 'left'
}

/** 成员证书 */
interface CrewCert {
  name: string
  certNo: string
  issueDate: string
  expireDate: string
  status: 'valid' | 'expiring' | 'expired'
  issuingAuthority: string
}

/** 工队资质 */
interface WorkteamQualification {
  id: string
  name: string
  category: 'safety' | 'construction' | 'special' | 'quality' | 'other'
  level: string
  certNo: string
  issueDate: string
  expireDate: string
  status: 'valid' | 'expiring' | 'expired'
  issuingAuthority: string
  attachmentUrl?: string
}

/** 工队实体 */
interface Workteam {
  // 基础信息
  id: string
  code: string // 工队编码（TEAM-YYYY-NNN）
  name: string // 显示名称
  shortName?: string // 简称

  // 状态
  level: WorkteamLevel
  status: WorkteamStatus
  availability: WorkteamAvailability

  // 归属（松散关系）
  supplierId?: string // 关联供应商ID（可选）
  supplierName?: string // 供应商名称
  cooperationMode: 'exclusive' | 'preferred' | 'general' // 合作模式：独家/优先/一般

  // 班组结构
  captain: CrewMember // 班组长
  members: CrewMember[] // 全部成员（含班组长）
  coreMemberCount: number // 核心成员数量
  totalMemberCount: number // 总人数

  // 能力范围
  specialties: string[] // 专业领域
  serviceAreas: string[] // 服务城市
  maxProjectScale: string // 最大项目规模

  // 资质
  qualifications: WorkteamQualification[]

  // 负载
  currentProjects: string[] // 在手项目ID列表
  currentProjectCount: number
  maxConcurrentProjects: number

  // 评级
  rating: {
    overall: number // 综合 0-100
    quality: number // 质量
    schedule: number // 进度
    safety: number // 安全
    cooperation: number // 配合度
    totalProjects: number // 累计项目数
    lastRatingAt: string // 最近评级时间
  }

  // 财务
  priceRange?: {
    min: number
    max: number
    unit: 'day' | 'project' // 按天/按项目
  }

  // 联系
  contactPhone: string
  contactAddress?: string
  emergencyContact?: string

  // 审计
  createdAt: string
  updatedAt: string
  createdBy: string
  remark?: string
}
```

### 3.2 枚举值定义

| 枚举            | 值                                               | 说明                       |
| --------------- | ------------------------------------------------ | -------------------------- |
| WorkteamLevel   | A/B/C/D/未评级                                   | A级最优                    |
| WorkteamStatus  | active/suspended/inactive                        | 正常/暂停/停用             |
| Availability    | available/busy/full/unavailable                  | 可派/忙碌/饱和/不可派      |
| CrewRole        | captain/vice_captain/technician/worker/assistant | 班长/副班长/技工/普工/辅助 |
| CooperationMode | exclusive/preferred/general                      | 独家/优先/一般合作         |

---

## 4. 功能设计

### 4.1 工队列表页

**页面路径**: `/workteams`

**核心功能**:

- 统计卡片：工队总数、可派单、资质临期、高负载
- 筛选器：等级、专业、区域、可派单状态、资质状态
- 搜索：名称/编码/班组长姓名
- 列表：工队卡片/表格展示
- 快捷操作：查看详情、编辑、调整状态

**列表字段**:

```
工队名称 | 等级 | 班组长 | 专业领域 | 在手项目 | 可派单状态 | 综合评分 | 操作
```

### 4.2 工队详情页

**页面路径**: `/workteams/:id`

**标签页结构**:

1. **概览**: 基础信息、关键指标、快速统计
2. **班组结构**: 成员列表、角色、技能、证书状态
3. **资质证照**: 工队级资质列表、到期提醒
4. **在手项目**: 当前项目列表、排期甘特图
5. **评价记录**: 历史项目评价、评分趋势
6. **操作日志**: 状态变更、成员调整记录

### 4.3 新增/编辑工队

**表单分组**:

- 基础信息（名称、编码、等级、供应商关联）
- 班组信息（添加成员、设置班组长、标记核心成员）
- 能力范围（专业、服务区域、规模上限）
- 资质上传（证照信息、有效期）
- 联系信息（电话、地址、紧急联系人）

### 4.4 工队排期视图

**页面路径**: `/workteams/schedule`

**展示方式**:

- 甘特图形式，横轴时间，纵轴工队
- 显示各工队在手项目的时间分布
- 冲突预警（同一工队时间重叠）
- 可派单窗口高亮

---

## 5. 与现有模块的关系

### 5.1 与资源池的关系

```
资源池页面
├── 人员资源（现有）
│   └── 类型：资源方、工队（调整为仅显示个人）
├── 供应商资源（现有）
│   └── 显示供应商及旗下工队数量
└── 工队资源（新增）
    └── 独立Tab，显示工队卡片
```

### 5.2 与项目派单的关系

```typescript
// 派单时可选择
type AssignTarget =
  | { type: 'personnel'; ... }      // 个人（资源方）
  | { type: 'workteam'; ... }       // 工队（新增）
  | { type: 'supplier'; ... };      // 供应商
```

### 5.3 与人员模块的关系

- 工队成员可关联到 personnel 表（如有系统账号）
- 工队成员可独立存在（仅作为班组档案）

---

## 6. 接口设计（前端视角）

| 接口                              | 方法   | 说明           |
| --------------------------------- | ------ | -------------- |
| /api/workteams                    | GET    | 列表（含筛选） |
| /api/workteams                    | POST   | 创建工队       |
| /api/workteams/:id                | GET    | 详情           |
| /api/workteams/:id                | PUT    | 更新           |
| /api/workteams/:id/status         | PATCH  | 状态变更       |
| /api/workteams/:id/members        | POST   | 添加成员       |
| /api/workteams/:id/members/:mid   | DELETE | 移除成员       |
| /api/workteams/:id/qualifications | POST   | 添加资质       |
| /api/workteams/schedule           | GET    | 排期数据       |

---

## 7. 验收标准

- [ ] 可完整创建、编辑、停用、删除工队
- [ ] 班组长、核心成员、灵活成员结构清晰
- [ ] 工队资质证照有到期预警
- [ ] 在手项目数自动计算，可派单状态自动更新
- [ ] 可在项目派单时选择工队作为执行方
- [ ] 工队评级基于历史项目评价自动计算

---

## 8. 后续扩展计划

| 优先级 | 功能         | 说明                     |
| ------ | ------------ | ------------------------ |
| P2     | 工队设备管理 | 管理工队自带设备清单     |
| P2     | 工队培训记录 | 培训历史、证书关联       |
| P3     | 工队内部结算 | 与供应商的对账接口       |
| P3     | 智能派单推荐 | 基于专业、位置、负载推荐 |

---

**文档创建时间**: 2026-04-23  
**最后更新**: 2026-04-23  
**版本**: V1.0 (草稿)
