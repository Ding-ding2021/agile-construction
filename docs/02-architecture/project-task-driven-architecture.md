---
id: ARCH-PROJECT-TASK-DRIVEN
title: 项目"任务驱动"状态架构重构
status: active
ai_contract: docs/ai/contracts/project-task-driven.md
last_updated: 2026-05-14
---

# Spec: 项目"任务驱动"状态架构重构

## Objective

**我们在构建什么？**

将项目管理从"项目是独立的大任务"（9 状态硬编码）重构为 **"项目是任务容器，状态由任务聚合推导"** 的新模型。

**为什么？**

V1 产品定义（§2.1）的核心假设：

> 营建项目可以拆解为一系列独立的原子任务，每个任务有独立的状态机。项目的整体进展由任务聚合推导，而非项目级硬编码。

老模型（9 状态）把项目当做一个大任务，需要人手动推进项目状态。新模型认为项目没有"一个"状态，而是有多个正交维度的子状态，每个维度由对应的任务/数据实时计算。

**成功标准：**

1. 项目不再有手动"状态按钮"——项目状态由任务聚合计算
2. 多个正交维度（执行/验收/结算/派单）各自独立推进
3. 任何一个维度发生变更时，项目概览自动刷新
4. PMBOK 五大过程组（启动/计划/执行/监控/收尾）作为项目的生命周期阶段

**用户是谁？**

- 营建主管：需要看到项目的"健康状态"概览，而非手动控制状态流转
- 营建专员：通过推进任务来推动项目，不需要关心"项目状态"
- 系统从任务数据中自动推导一切

---

## Current State（当前问题诊断）

### 问题一：9 状态不存在于代码中

| 层次     | 现状                                      | 问题                     |
| -------- | ----------------------------------------- | ------------------------ |
| PRD 文档 | 定义了 9 状态（待立项→待确认→...→已归档） | 仅存在于文档，代码未实现 |
| 数据库   | `status` 为 String，无枚举无默认值        | 可写入任意字符串         |
| 后端     | `PUT /:code` 通用更新，无状态守卫         | 客户端可任意设 status    |
| 前端     | 仅有 Badge 展示，无状态变更按钮           | 样式映射只有 6 个旧值    |
| 测试     | 创建测试写了 '待立项'                     | 无状态机测试             |

### 问题二：新字段存在但未被使用

Prisma 模型中有 `parentStatus`, `dispatchStatus`, `executionStatus`, `acceptanceStatus`, `settlementStatus` 和四个 `pendingXxxCount` 字段，但：

- 后端没有任何计算逻辑
- 创建时全部设 null
- 前端完全不展示

### 问题三：任务状态机完整但项目没利用

任务已经有完整的状态机守卫（checkTransition），但项目完全没利用任务的聚合信息。

---

## New Architecture Design

### 核心模型

```
项目的"状态" = 三个正交维度的聚合结果
                     ↓
            ┌────────────────┐
            │   project       │
            │  ─────────      │
            │  id: Int        │
            │  name: String   │
            │  parentStatus → PMBOK 五阶段（固定不可逆）│
            │                │
            │  ┌─ dispatchStatus ── 从任务分配状态聚合 │
            │  ├─ executionStatus ─ 从任务执行状态聚合 │
            │  ├─ acceptanceStatus─ 从验收检查项聚合    │
            │  └─ settlementStatus─ 从结算数据聚合     │
            │                │
            │  health → 从任务进度/预警实时计算         │
            └────────────────┘
```

### 1. parentStatus — 生命周期阶段（PMBOK 五大过程组）

| 阶段 | 含义                         | 进入条件           | 退出条件             | 可逆？ |
| ---- | ---------------------------- | ------------------ | -------------------- | ------ |
| 启动 | 项目创建，基本信息配置       | 创建项目           | 首次 WBS 拆解完成    | 否     |
| 计划 | WBS 拆解 + 任务安排          | 拆解完成           | 首个任务进入"执行中" | 否     |
| 执行 | 任务推进中                   | 首个任务开始执行   | 全部任务达到终态     | 否     |
| 监控 | 验收和质量控制（与执行并行） | 首个验收检查项创建 | 全部检查项通过       | 否     |
| 收尾 | 结算、归档                   | 全部验收通过       | 归档完成             | 否     |

**关键规则**：

- parentStatus 是**不可逆**的（只能前进不能后退）
- parentStatus 由**系统自动推导**，用户无法手动设置
- 但 "执行" 和 "监控" 在 PMBOK 中是并行的，所以 parentStatus 更像日志而非状态

> **设计决策**：由于 PMBOK 的"执行"和"监控"是并行的，parentStatus 实际意义有限。**项目最核心的是三个正交维度的状态 + 健康度指标。**

### 2. 三正交维度（核心设计）

每个维度独立计算，互不影响：

```
                    ┌─────────────────────────────┐
                    │     执行维度                  │
                    │  (executionStatus)           │
                    │                              │
                    │  未开始 → 进行中 → 已完成      │
                    │  聚合自：任务树执行进度          │
                    └─────────────────────────────┘

                    ┌─────────────────────────────┐
                    │     验收维度                  │
                    │  (acceptanceStatus)          │
                    │                              │
                    │  待验收 → 验收中 → 通过/整改中  │
                    │  聚合自：验收检查项完成度        │
                    └─────────────────────────────┘

                    ┌─────────────────────────────┐
                    │     结算维度                  │
                    │  (settlementStatus)          │
                    │                              │
                    │  未结算 → 结算中 → 已结算      │
                    │  聚合自：采购/费用结算状态       │
                    └─────────────────────────────┘
```

#### 执行维度（executionStatus）

| 值     | 含义             | 聚合规则                         |
| ------ | ---------------- | -------------------------------- |
| 未开始 | 尚无任务开始执行 | 全部任务状态为"草稿"或"待分配"   |
| 进行中 | 有任务正在执行   | 存在至少一个状态为"执行中"的任务 |
| 已完成 | 全部任务到达终态 | 全部任务为"已完成"或"已关闭"     |

#### 验收维度（acceptanceStatus）

| 值     | 含义                      | 聚合规则                         |
| ------ | ------------------------- | -------------------------------- |
| 待验收 | 尚无验收请求              | 无任务处于"待验收"状态，无检查项 |
| 验收中 | 有任务/检查项在验收流程中 | 存在"待验收"任务或未完成的检查项 |
| 已通过 | 全部验收通过              | 全部任务已完成，全部检查项通过   |
| 整改中 | 存在不通过项              | 存在"不通过"标记或整改派生任务   |

#### 结算维度（settlementStatus）

| 值     | 含义                   | 聚合规则                       |
| ------ | ---------------------- | ------------------------------ |
| 未结算 | 无需结算或尚未进入结算 | 无采购订单或全部未结算         |
| 结算中 | 有采购/费用正在结算    | 存在"待结算"或"结算中"的采购单 |
| 已结算 | 全部结算完成           | 全部采购单已结算               |

#### 派单维度（dispatchStatus）— 辅助维度

| 值     | 含义           | 聚合规则                |
| ------ | -------------- | ----------------------- |
| 未派单 | 尚未分配执行方 | 全部任务未分配人员/工队 |
| 派单中 | 部分已分配     | 部分任务已分配          |
| 已派完 | 全部已分配     | 全部任务已指定执行方    |

### 3. health — 项目健康度

健康度是一个**实时计算**的复合指标，展示在项目概览最上方：

```
健康度 = {
  status: "正常" | "关注" | "预警" | "严重",
  indicators: [
    { label: "进度偏差", value: "+2天", level: "warning" },
    { label: "SLA超时", value: "3项", level: "critical" },
    { label: "风险项", value: "5项", level: "warning" },
    { label: "未分配", value: "8项", level: "info" },
  ]
}
```

计算规则：
| health 级别 | 触发条件 |
|-------------|----------|
| 正常 | 无超时、无高风险、进度偏差 < 5% |
| 关注 | 存在 ≥1 项低风险 或 进度偏差 5-15% |
| 预警 | 存在 ≥1 项高风险 或 SLA 超时 或 进度偏差 > 15% |
| 严重 | 存在 ≥1 项阻断性风险 或 关键路径任务超时 > 7天 |

---

### 4. 后端逻辑

#### 4.1 移除旧状态字段

**不要**在数据库中（temporarily）保留 `status` 字段。改为：

- `parentStatus` → PMBOK 阶段（系统计算）
- `executionStatus` → 执行维度（系统聚合）
- `acceptanceStatus` → 验收维度（系统聚合）
- `settlementStatus` → 结算维度（系统聚合）
- `dispatchStatus` → 派单维度（系统聚合）

#### 4.2 新增聚合引擎

新建 `local-api/services/projectAggregator.ts`：

```typescript
// 核心接口
interface ProjectAggregation {
  parentStatus: string // 生命周期阶段
  executionStatus: string // 执行维度
  acceptanceStatus: string // 验收维度
  settlementStatus: string // 结算维度
  dispatchStatus: string // 派单维度
  health: HealthIndicator // 健康度
  progress: number // 进度百分比
  pendingCounts: {
    // 各维度待办数
    dispatch: number
    execution: number
    acceptance: number
    settlement: number
  }
}

// 聚合函数签名
function aggregateProjectStatus(projectId: number): ProjectAggregation
```

聚合引擎在以下时机自动触发：

1. 任何任务状态变更时
2. 任何验收检查项状态变更时
3. 任何采购订单状态变更时
4. 定时刷新（心跳刷新，例如每 5 分钟）

#### 4.3 API 调整

| 端点                                         | 变更                                           |
| -------------------------------------------- | ---------------------------------------------- |
| `GET /projects/:code`                        | 返回聚合后的状态数据（不是原始字段）           |
| `PUT /projects/:code`                        | **移除 status 字段支持**，禁止手动设置         |
| `POST /projects`                             | 默认 parentStatus='启动'，维度状态全部为起始值 |
| **新增**: `GET /projects/:code/health`       | 返回健康度详情（含各指标明细）                 |
| **新增**: `POST /projects/:code/reaggregate` | 手动触发聚合计算（调试/修复用）                |

#### 4.4 移除旧状态守卫

既然项目不再有手动状态，「状态机守卫」的逻辑从项目层移除。原有的 `checkTransition` 只保留在任务层。

### 5. 数据库模式变更

```prisma
model Project {
  id                     Int      @id @default(autoincrement())
  code                   String   @unique
  name                   String
  brand                  String

  // ── 生命周期阶段 ──
  parentStatus           String   @default("启动") @map("parent_status")
  // 允许值: "启动" | "计划" | "执行" | "监控" | "收尾"

  // ── 正交维度状态 ──
  executionStatus        String   @default("未开始") @map("execution_status")
  // 允许值: "未开始" | "进行中" | "已完成"

  acceptanceStatus       String   @default("待验收") @map("acceptance_status")
  // 允许值: "待验收" | "验收中" | "已通过" | "整改中"

  settlementStatus       String   @default("未结算") @map("settlement_status")
  // 允许值: "未结算" | "结算中" | "已结算"

  dispatchStatus         String   @default("未派单") @map("dispatch_status")
  // 允许值: "未派单" | "派单中" | "已派完"

  // ── 健康度 ──
  healthStatus           String   @default("正常") @map("health_status")
  // 允许值: "正常" | "关注" | "预警" | "严重"

  // ── 聚合数据 ──
  progress               Int      @default(0)
  pendingDispatchCount   Int      @default(0) @map("pending_dispatch_count")
  pendingExecutionCount  Int      @default(0) @map("pending_execution_count")
  pendingAcceptanceCount Int      @default(0) @map("pending_acceptance_count")
  pendingSettlementCount Int      @default(0) @map("pending_settlement_count")

  // ── 基线属性 ──
  plannedOpenDate        DateTime  @map("planned_open_date")
  actualOpenDate         DateTime? @map("actual_open_date")
  budget                 Float?
  description            String?

  // ── 时间戳 ──
  createdAt              DateTime @default(now()) @map("created_at")
  updatedAt              DateTime @updatedAt @map("updated_at")

  // 关联...
}
```

**注意**：删除旧 `status` 字段，保留 `parentStatus`，全部维度状态字段加上默认值。

### 6. 聚合规则详细实现

#### 6.1 executionStatus 聚合规则

```
function computeExecutionStatus(tasks: Task[]): string {
  if (tasks.length === 0) return "未开始"
  const allTerminal = tasks.every(t =>
    ["已完成", "已关闭"].includes(t.status)
  )
  if (allTerminal) return "已完成"
  const anyExecuting = tasks.some(t =>
    ["执行中", "待提交", "待验收", "不通过"].includes(t.status)
  )
  if (anyExecuting) return "进行中"
  return "未开始"
}
```

#### 6.2 acceptanceStatus 聚合规则

```
function computeAcceptanceStatus(projectId: number): string {
  // 检查是否有"不通过"的检查项或整改任务
  const hasRework = checkReworkItems(projectId)
  if (hasRework) return "整改中"

  // 检查是否有正在验收的条目
  const hasPendingAccept = checkPendingAcceptance(projectId)
  if (hasPendingAccept) return "验收中"

  // 检查是否全部验收通过
  const allPassed = checkAllAccepted(projectId)
  if (allPassed) return "已通过"

  return "待验收"
}
```

#### 6.3 settlementStatus 聚合规则

```
function computeSettlementStatus(projectId: number): string {
  const procurements = getProjectProcurements(projectId)
  if (procurements.length === 0) return "未结算"

  const allSettled = procurements.every(p => p.status === "已结算")
  if (allSettled) return "已结算"

  const anySettling = procurements.some(p =>
    ["待结算", "结算中"].includes(p.status)
  )
  if (anySettling) return "结算中"

  return "未结算"
}
```

#### 6.4 dispatchStatus 聚合规则

```
function computeDispatchStatus(tasks: Task[]): string {
  if (tasks.length === 0) return "未派单"
  const allAssigned = tasks.every(t =>
    t.assigneeId !== null || t.assigneeType !== null
  )
  if (allAssigned) return "已派完"
  const anyAssigned = tasks.some(t => t.assigneeId !== null)
  if (anyAssigned) return "派单中"
  return "未派单"
}
```

---

### 7. 前端页面与功能

#### 7.1 项目概览页（tab-overview）— 重构

| 功能区域   | 内容                                                       | 数据来源                 |
| ---------- | ---------------------------------------------------------- | ------------------------ |
| 健康度看板 | 健康状态 + 指标卡（进度偏差/SLA/风险/未分配）              | 聚合引擎                 |
| 状态面板   | 展示三个正交维度状态（执行/验收/结算），每个维度用独立颜色 | 聚合引擎                 |
| 进度条     | 项目总进度（完成的任务数/总任务数）                        | 聚合引擎                 |
| 基本信息   | 品牌、店型、计划开业日期等                                 | Project 模型             |
| 快捷操作   | 新增任务、发起验收、创建采购                               | 根据维度状态显示可用操作 |

健康度卡预览：

```
┌─────────────────────────────────────────────────┐
│  🔵 健康度：正常                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│  │进度+2d│ │SLA 0项│ │风险3项│ │未分5项│           │
│  │ ⚠️ 关注│ │ ✅ 正常│ │ ⚠️ 关注│ │ ℹ️ 待办│           │
│  └──────┘ └──────┘ └──────┘ └──────┘           │
└─────────────────────────────────────────────────┘
```

#### 7.2 项目详情 → 状态维度面板

```
┌─────────────────────────────────────────────────────┐
│ 执行维度 ●●●○○ 进行中   验收维度 ●●○○○ 待验收         │
│ 结算维度 ●○○○○ 未结算   派单维度 ●●●●○ 已派完         │
└─────────────────────────────────────────────────────┘
```

每个维度是一个小进度环 + 状态标签，点击可展开详情。

#### 7.3 项目列表页（ProjectListPage）— 调整

| 列     | 变更                                                  |
| ------ | ----------------------------------------------------- |
| 状态列 | 改为展示**健康度**（带颜色标签：正常/关注/预警/严重） |
| 新增列 | 执行进度（进度条）                                    |
| 新增列 | 各维度待办数（悬停展示明细）                          |
| 过滤   | 新增按健康度过滤、按维度状态过滤                      |
| 移除   | 移除旧版按 status 过滤                                |

#### 7.4 移除的 UI 元素

| 元素                                 | 原因                 |
| ------------------------------------ | -------------------- |
| 项目状态变更按钮（"推进到下一状态"） | 项目不再手动设置状态 |
| 项目状态选择器/下拉框                | 同上                 |
| 项目详情页的"状态"Badge（旧 9 状态） | 替换为维度状态面板   |

#### 7.5 新增页面/组件

| 文件路径（建议）                                                | 内容                                                 |
| --------------------------------------------------------------- | ---------------------------------------------------- |
| `src-next/pages/projects/detail/tab-health.tsx`                 | 健康度详细标签页（原概览页中的健康度部分独立成标签） |
| `src-next/pages/projects/components/ProjectHealthCard.tsx`      | 健康度指标卡组件（可复用）                           |
| `src-next/pages/projects/components/ProjectDimensionStatus.tsx` | 正交维度状态展示组件                                 |
| `src-next/pages/projects/components/DimensionProgressRing.tsx`  | 维度进度环（每个维度一个小环）                       |

---

### 8. 迁移策略

#### 阶段一：数据迁移

```
1. 新增字段：
   - parentStatus: 旧 status 映射到新 parentStatus
     9 状态 → PMBOK 映射表：
       待立项/待确认 → "启动"
       待拆解 → "计划"
       执行中/整改中 → "执行"
       待验收 → "监控"
       待结算/已归档/已中止 → "收尾"

2. 维度状态初始化：
   - 根据现有任务数据计算各维度初始值

3. 健康度初始化：
   - 根据现有风险、进度数据计算初始健康度
```

#### 阶段二：代码迁移

```
1. 先建聚合引擎（不影响现有功能）
2. 添加 GET /projects/:code/health 端点（新增，不影响旧）
3. 前端添加健康度面板（新增，与旧状态共存）
4. 迁移项目列表页过滤（从旧 status 切换到健康度）
5. 移除旧 status 字段（确认无引用后）
6. 移除旧状态按钮/选择器
```

---

## Tech Stack

| 层次     | 方案                          | 备注             |
| -------- | ----------------------------- | ---------------- |
| 数据库   | SQLite + Prisma               | 保持现有技术栈   |
| 后端     | Express + TypeScript          | 新增聚合服务层   |
| 前端     | React + TypeScript + Tailwind | shadcn/ui 组件   |
| 状态管理 | Zustand                       | 聚合结果缓存     |
| 测试     | Vitest + Playwright           | 新增聚合引擎测试 |

## Commands

```bash
# 开发
npm run dev              # 启动前后端开发服务器
npm run dev:api          # 仅启动后端 API
npm run dev:frontend     # 仅启动前端

# 测试
npm run test             # 运行单元测试
npm run test:e2e         # 运行 E2E 测试
npm run test:api         # 仅后端 API 测试
npm run test:aggregator  # 新增：聚合引擎专项测试

# 质量
npm run build            # 构建项目
npm run lint             # 代码检查
```

## Testing Strategy

| 层级     | 测试内容                                | 框架               | 覆盖率目标    |
| -------- | --------------------------------------- | ------------------ | ------------- |
| 单元测试 | 聚合规则（4 个维度的计算函数）          | Vitest             | 100% 分支覆盖 |
| 单元测试 | 健康度计算规则                          | Vitest             | 100% 分支覆盖 |
| 单元测试 | task→status 状态机守卫（不变）          | Vitest             | 回归测试      |
| API 测试 | GET /projects/:code 返回聚合数据        | Vitest + supertest | 核心路径      |
| API 测试 | 任务状态变更→项目聚合自动触发           | Vitest + supertest | 核心路径      |
| 组件测试 | HealthCard, DimensionStatus 渲染        | RTL                | 基本覆盖      |
| E2E 测试 | 创建项目→添加任务→任务推进→聚合状态刷新 | Playwright         | 1 场景        |

### 测试用例示例（聚合引擎）

```typescript
describe('executionStatus 聚合', () => {
  it('全部任务为草稿时 → 未开始', () => {
    const tasks = [
      { id: 1, status: '草稿' },
      { id: 2, status: '草稿' },
    ]
    expect(computeExecutionStatus(tasks)).toBe('未开始')
  })

  it('存在执行中的任务时 → 进行中', () => {
    const tasks = [
      { id: 1, status: '草稿' },
      { id: 2, status: '执行中' },
    ]
    expect(computeExecutionStatus(tasks)).toBe('进行中')
  })

  it('全部任务为已完成时 → 已完成', () => {
    const tasks = [
      { id: 1, status: '已完成' },
      { id: 2, status: '已关闭' },
    ]
    expect(computeExecutionStatus(tasks)).toBe('已完成')
  })
})
```

## Boundaries

### Always

- 聚合引擎的每个计算函数必须有单元测试
- 任务状态变更后必须触发项目聚合
- 前端维度状态展示必须只依赖聚合结果，不独立计算
- 删除旧 `status` 字段前必须确认无任何代码引用

### Ask First

- 修改 Prisma schema
- 修改 API 端点签名
- 修改现有项目的状态展示区域
- 增加新的维度或新的聚合规则

### Never

- 在项目层允许手动设置状态
- 让前端直接查询任务数据来计算项目状态
- 在迁移过程中同时维护两套状态系统
- 删除旧的 `status` 字段而不先运行迁移脚本

---

## Open Questions（已确认）

以下 4 个问题已由用户决策（2026-05-14）：

1. ❓ parentStatus（PMBOK 五阶段）→ **保留**（"执行和监控对不同的角色"）
2. ❓ 健康度精度 → **简单先上**（第一版用基本规则，后续精细化）
3. ❓ 维度守卫 → **聚合即守卫**（不额外加守卫层）
4. ❓ 结算实体 → **依附采购**（不做独立结算单，从采购订单聚合）
