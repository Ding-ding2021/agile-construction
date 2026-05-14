---
id: ARCH-TASK-CENTER
title: 任务中心"从 CRUD 到业务引擎"架构重构
status: active
ai_contract: docs/ai/contracts/task-center.md
last_updated: 2026-05-14
---

# Spec: 任务中心"从 CRUD 到业务引擎"架构重构

## Objective

**我们在构建什么？**

将任务中心从"能存能查的 CRUD 容器"升级为 **"连接模板实例化、执行推进、提交验收、服务协议、材料同步的业务引擎"**。

**为什么？**

V1 产品定义（§2.1）的核心假设：

> 营建项目可以拆解为一系列独立的原子任务，每个任务有独立的状态机。项目的整体进展由任务聚合推导。

当前任务中心有一个极为超前的数据模型（ProjectTask 50+ 字段覆盖 PRD 90% 需求），但业务逻辑停留在 CRUD 层面。就像一个精装修的房子，水电煤管道都埋好了，但水龙头拧不开、灯不亮、电梯没电。

**成功标准：**

1. 任务可以从模板自动实例化（项目模板→任务模板→ProjectTask 树）
2. 提交→验收形成完整闭环（提交→审核→通过/退回→重交）
3. 服务协议（SLA）实现自动计算和手动催办双触发
4. 任务详情页从前端骨架升级为功能完整的操作界面
5. 任务中心正确消费标准管理模块的标准绑定引擎

**用户是谁？**

- 项目经理：创建项目后触发任务生成、审阅任务树、跟踪进度
- 调度/运营：查看待分配任务、分配执行人
- 执行人员：接收任务、填报进度、提交成果
- 验收人员：审核提交、执行验收判定

---

## Current State（5 维诊断汇总）

### 维度一：功能 — 完成度 55%

| #   | V1 功能                 | 状态    | 说明                                 |
| --- | ----------------------- | ------- | ------------------------------------ |
| 1   | 任务树管理（CRUD）      | ✅      | 增删改查、分页、批量创建             |
| 2   | 父子任务管理            | ✅      | parentId + treePath + 树形查询       |
| 3   | 任务关系管理            | ⚠️ 部分 | 前置依赖 CRUD 有，仅支持 1 种类型    |
| 4   | 任务自动生成            | ❌      | 模板完整但实例化逻辑为零             |
| 5   | 任务分配与派单          | ❌      | 无派单逻辑，仅直接指定人             |
| 6   | 任务执行推进            | ⚠️ 骨架 | progress 字段存在但无填报流程        |
| 7   | 任务提交与结果          | ⚠️ 部分 | TaskSubmission 表在，缺审核通知闭环  |
| 8   | 标准快照绑定            | ⚠️ 骨架 | 字段有，缺绑定交互                   |
| 9   | 执行清单/检查项         | ⚠️ 骨架 | ChecklistItem 表在，不从标准自动派生 |
| 10  | 服务协议/催办/阻塞/风险 | ⚠️ 骨架 | 字段全有，计算逻辑全缺               |
| 11  | 派生任务（整改）        | ⚠️ 骨架 | 字段在，纯手动                       |
| 12  | Agent 辅助              | ❌      | 见 Agent 架构独立文档                |

### 维度二：前端 — 完成度 40%

| 维度        | 评估 | 详情                                                  |
| ----------- | :--: | ----------------------------------------------------- |
| 页面结构    |  🟢  | TaskListPage → 详情 → Tab 子组件，层级清晰            |
| 多视图      |  🟢  | 表格/看板/日历/树形 4 种视图                          |
| 组件拆分    |  🟢  | info/operation/tree/flow/kanban/calendar 六个子目录   |
| 详情页      |  🔴  | TaskDetailPage 仅 17 行（旧版 1236 行），功能严重缩水 |
| 交互深度    |  🔴  | 多数组件只读展示，缺增删改操作入口                    |
| 错误/加载态 |  🔴  | 无 Skeleton、无错误边界、无空状态                     |

### 维度三：后端 — 完成度 50%

- **11 个 CRUD 端点** + 子资源端点（logs/submissions/checklist/relations/remind）全部就位
- **状态机 7 状态** 设计扎实（草稿→待分配→待执行→执行中→已暂停→待提交→待验收→已完成/不通过→已关闭）
- **缺失的业务引擎**：模板实例化器、验收工作流、服务协议计算器、快照生成器、派生任务生成器

### 维度四：数据库 — 完成度 65%

6 个 Task 相关模型，ProjectTask 核心表 50+ 字段覆盖 7 大属性类别。设计超前是最大的资产也是债务——字段存在但从未被驱动。

### 维度五：可复用组件 — 完成度 60%

| 已有可复用                                         | 缺失的通用模式  |
| -------------------------------------------------- | --------------- |
| TaskPaginationBar、TaskToolbar、TaskTableView      | Skeleton 加载态 |
| TaskDetailTabs、TaskDetailLayout、TaskFlowTimeline | 空状态提示      |
| 状态 Badge 颜色映射                                | 批量操作工具栏  |
| KanbanView、CalendarView                           | 向导式创建流程  |
| SubTaskTree、TaskPeople、TaskStatusOps 等          | 错误边界        |

---

## Core Contradictions（6 个核心矛盾）

### 矛盾 1：数据模型超前 vs 业务逻辑空白

ProjectTask 50+ 字段但 694 行控制器代码中 600 行是 CRUD。`slaRuleId`/`standardSnapshotId`/`derivedFromTaskId` 全有，但没有一行代码在驱动它们。

**影响**：数据库像 V2，实际能力 V0.5。

### 矛盾 2：模板完整 vs 零实例化

TaskTemplate 表 20+ 字段含 dependencyBlueprint/childTemplateRefs/standardBinding，设计精美。但整个代码库找不到一行「根据模板创建任务」的代码。

**影响**：用户每个项目要手工建几十个任务，模板吃灰。

### 矛盾 3：提交记录完整 vs 验收工作流缺失

TaskSubmission 表有全套审核字段。但缺通知→审核→退回→重交的闭环——执行人提交了，项目经理不知道。

**影响**：提交审核变成双方约好同时在线操作的假流程。

### 矛盾 4：新版前端骨架完整 vs 功能空心化

src-next 组件拆得细（20+ 文件），但详情页 17 行，多数 operation 组件只读展示。

**影响**：组件结构好了，但功能只迁移了 20%。

### 矛盾 5：标准字段丰富 vs 链路断裂

ProjectTask 有 standardSnapshotId/standardBindingStatus/snapshotStatus 全套字段。但没有绑定面板、没有快照生成触发、没有验收判定调用。

**影响**：等标准管理改造完，任务中心不配合，引擎建好了也没人点火。

### 矛盾 6：服务协议字段丰富 vs 零自动计算

slaRuleId/slaStatus/dueDate/remindCount 都在，但 slaStatus 全靠人工手动更新。没有临期/超期自动标记，没有自动催办触发。

**影响**：项目经理每天人工巡视所有任务截止日期。

---

## New Architecture Design

### 总体架构

```
┌──────────────────────────────────────────────────────────────┐
│                      前端界面层                               │
│                                                              │
│  TaskListPage(4视图)  TaskDetailPage(6 Tab)  新建任务Dialog   │
│                                                              │
│  表格/看板/日历/树形  │  基本信息/进度/检查项/标准/日志/提交    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                     local-api 接口层                          │
│                                                              │
│  现有 11 CRUD 端点  +  新增业务引擎端点                       │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                      Service 层（新增）                        │
│                                                              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐     │
│  │ 模板实例化器  │ │ 验收工作流   │ │ 服务协议计算器    │     │
│  │ instantiator │ │ workflow     │ │ slaCalculator    │     │
│  └──────────────┘ └──────────────┘ └──────────────────┘     │
│                                                              │
│  ┌──────────────┐ ┌──────────────┐                           │
│  │ 快照生成器    │ │ 派生任务生成器│   ← 标准管理模块提供      │
│  │ (消费端调用)  │ │ (消费端调用) │                           │
│  └──────────────┘ └──────────────┘                           │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                     数据库                                    │
│  ProjectTask / TaskRelation / TaskEventLog                   │
│  TaskSubmission / ChecklistItem / TaskTemplate               │
│  StandardSnapshot / TaskStandardBinding（依赖标准管理）       │
└──────────────────────────────────────────────────────────────┘
```

### 1. 模板实例化引擎 `local-api/services/taskInstantiator.ts`

**解决矛盾 2**：模板→任务树的自动展开。

```typescript
interface InstantiationInput {
  projectId: number
  templateIds: string[] // 要实例化的任务模板 ID 列表
  projectStartDate: string // 项目开始日期，用于推算计划时间
}

interface InstantiationResult {
  createdTasks: ProjectTask[] // 创建的任务列表（含嵌套树）
  createdRelations: TaskRelation[] // 创建的依赖关系
  warnings: string[] // 缺失数据警告（如无负责人）
}

function instantiateFromTemplates(input: InstantiationInput): InstantiationResult
```

**执行流程**：

```
1. 读取指定模板列表
2. 按 templateLevel 排序（project_root → work_package → task）
3. 逐条实例化：
   - 复制模板字段到 ProjectTask
   - 生成任务编码（projectCode + 序号）
   - 处理 childTemplateRefs → 递归展开子任务
   - 处理 dependencyBlueprint → 暂存依赖关系
   - 处理 standardBinding → 暂存标准绑定
4. 事务写入：
   - 批量插入 ProjectTask
   - 批量插入 TaskRelation
   - 批量插入 TaskStandardBinding（调用标准绑定服务）
5. 返回创建结果 + 缺失项警告
```

**API 端点新增**：

| 端点                                            | 说明                         |
| ----------------------------------------------- | ---------------------------- |
| `POST /projects/:code/tasks/instantiate`        | 根据模板批量实例化任务树     |
| `GET /projects/:code/tasks/instantiate/preview` | 预览实例化结果（不实际创建） |

### 2. 验收工作流引擎 `local-api/services/acceptanceWorkflow.ts`

**解决矛盾 3**：提交→审核→退回→重交的完整闭环。

```
状态流转:
  执行中 → 待提交 → 待验收 → 已完成
                  ↑         ↓
                  └── 执行中 ←── 不通过（退回重做）
```

```typescript
interface AcceptanceWorkflow {
  // 执行人提交
  submit(submission: {
    taskId: number
    submissionType: 'normal' | 'rectification' | 'supplement'
    description: string
    attachmentIds: string[]
    submittedBy: string
  }): TaskSubmission

  // 项目经理审核
  review(review: {
    submissionId: number
    result: 'pass' | 'reject'
    comment: string
    reviewedBy: string
  }): void
  // 副作用: pass → 任务状态→已完成, reject → 任务状态→执行中
}
```

**退回逻辑**：

- 审核不通过 → 任务状态自动从「待验收」→「执行中」
- 审计日志记录退回原因
- 支持多次提交/退回（每次退回 reopenCount +1）
- 同一任务退回 ≥2 次 → 触发质量风险预警

**API 端点新增**：

| 端点                           | 说明                    |
| ------------------------------ | ----------------------- |
| `POST /tasks/:id/submit`       | 执行人提交成果          |
| `POST /submissions/:id/review` | 审核人审核（通过/退回） |
| `GET /tasks/:id/submissions`   | 查看任务的所有提交记录  |

### 3. 服务协议计算器 `local-api/services/slaCalculator.ts`

**解决矛盾 6**：根据截止日期实时计算服务协议状态。

```typescript
type SlaStatus = '正常' | '临期' | '超期'

function calculateSlaStatus(task: {
  dueDate: string | null
  status: string
  actualEndAt: string | null
}): SlaStatus

// 规则:
// - 任务已完成/已关闭 → 正常
// - 超过截止日 → 超期
// - 距截止日 ≤ 1 天 → 临期
// - 其他 → 正常
```

**设计原则**：不存库、每次查询时实时计算，避免状态不一致。

**催办机制**：

- 自动触发：超期 3 天 → 系统自动创建催办事件日志
- 手动触发：项目经理点催办按钮 → remindCount +1 → 记录事件日志
- 前端着色：列表页根据服务协议状态标记颜色（正常=绿、临期=黄、超期=红）

### 4. 派生任务生成器

**整合进状态机守卫**：

```
验收不通过后的处理:
  ┌──────────────────┐
  │ 审核人点"不通过"   │
  └────────┬─────────┘
           ▼
  ┌──────────────────┐
  │ 可选：生成整改任务 │  ← isRectification=true
  │ 继承原任务的标准   │  ← derivedFromTaskId
  │ 绑定 + 快照引用    │
  └────────┬─────────┘
           ▼
  ┌──────────────────┐
  │ 原任务状态→执行中  │
  │ 整改任务状态→待分配 │
  └──────────────────┘
```

### 5. 前端重构

#### 5.1 TaskDetailPage — 从 17 行到完整操作界面

当前 TaskDetailPage 仅 17 行。重构为 6 个标签页：

```
┌──────────────────────────────────────────────────────┐
│ ← 任务中心 / PRJ-001-T-003                            │
├──────────────────────────────────────────────────────┤
│ [基本信息] [进度] [检查项] [标准绑定] [操作日志] [提交记录] │
├──────────────────────────────────────────────────────┤
│                                                      │
│  （当前选中标签页的内容）                               │
│                                                      │
└──────────────────────────────────────────────────────┘
```

| 标签页   | 内容                                    | 现有基础                       |
| -------- | --------------------------------------- | ------------------------------ |
| 基本信息 | 任务名称/编码/状态/负责人/时间/优先级等 | TaskBasicInfo.tsx（可复用）    |
| 进度     | 进度填报 + 服务协议状态 + 阻塞原因      | TaskProgress.tsx（需增强编辑） |
| 检查项   | 执行清单列表 + 增删改 + 标记完成        | TaskChecklist.tsx（可复用）    |
| 标准绑定 | 已绑定标准条款 + 绑定/解绑操作          | 新建 StandardBindingPanel      |
| 操作日志 | 状态变更时间线                          | TaskFlowTimeline.tsx（可复用） |
| 提交记录 | 提交→审核→退回历史列表                  | 新建 SubmissionHistory         |

#### 5.2 组件增强清单

| 组件              | 当前               | 增强后                         |
| ----------------- | ------------------ | ------------------------------ |
| TaskProgress.tsx  | 只读显示进度百分比 | 可填报进度 + 服务协议状态显示  |
| TaskStatusOps.tsx | 只改状态           | 改状态 + 填原因 + 事件日志记录 |
| TaskStandards.tsx | 只读展示绑定       | 增删标准绑定 + 绑定类型选择    |
| NewTaskDialog.tsx | 单表单             | 可选关联模板预填               |

#### 5.3 新增组件

| 文件路径                                                                     | 说明                                 |
| ---------------------------------------------------------------------------- | ------------------------------------ |
| `src-next/pages/tasks/components/StandardBinding/StandardBindingPanel.tsx`   | 标准绑定面板（复用标准管理模块组件） |
| `src-next/pages/tasks/components/StandardBinding/StandardSnapshotViewer.tsx` | 快照查看器                           |
| `src-next/pages/tasks/components/SubmissionHistory.tsx`                      | 提交审核历史列表                     |
| `src-next/pages/tasks/components/SubmissionReviewDialog.tsx`                 | 审核弹窗                             |
| `src-next/pages/tasks/components/SlaBadge.tsx`                               | 服务协议状态标记（正常/临期/超期）   |
| `src-next/pages/tasks/components/StatsCards.tsx`                             | 待分配/进行中/超期 统计卡片          |

#### 5.4 通用组件提升

| 组件              | 当前位置                  | 提升到                                   |
| ----------------- | ------------------------- | ---------------------------------------- |
| TaskPaginationBar | `pages/tasks/components/` | `src-next/components/`（所有列表页复用） |
| Skeleton          | —                         | 新建，标准管理 + 任务中心共享            |
| EmptyState        | —                         | 新建，全局复用                           |

---

## 数据库变更

Agent 模块不新增数据库表。任务中心也不新增——数据模型已经超前了。只复用现有模型。

### ProjectTask 字段复用确认

以下字段已在数据库中存在，此次改造补齐驱动逻辑：

| 字段                                                              | 当前状态       | 改造后                           |
| ----------------------------------------------------------------- | -------------- | -------------------------------- |
| `slaRuleId` / `slaStatus`                                         | 存在，手动更新 | slaCalculator 自动计算 slaStatus |
| `standardSnapshotId` / `standardBindingStatus` / `snapshotStatus` | 存在，无写入   | 消费标准管理的快照/绑定服务      |
| `derivedFromTaskId` / `isRectification`                           | 存在，手动填写 | 验收退回时自动生成派生任务       |
| `remindCount`                                                     | 存在，无触发   | 服务协议超期自动 + 手动触发      |
| `progress`                                                        | 存在，手动更新 | 前端提供填报组件                 |
| `blockedReason`                                                   | 存在           | 增强 isBlocked 计算字段显示      |

---

## 后端逻辑

### 新增 Service 文件

```
local-api/services/
├── taskInstantiator.ts      ← 模板实例化引擎
├── acceptanceWorkflow.ts    ← 验收工作流
└── slaCalculator.ts         ← 服务协议计算器
```

### 新增 API 端点

| 端点                                            | 说明             | 关联引擎           |
| ----------------------------------------------- | ---------------- | ------------------ |
| `POST /projects/:code/tasks/instantiate`        | 模板批量实例化   | taskInstantiator   |
| `GET /projects/:code/tasks/instantiate/preview` | 预览实例化结果   | taskInstantiator   |
| `POST /tasks/:id/submit`                        | 执行人提交成果   | acceptanceWorkflow |
| `POST /submissions/:id/review`                  | 审核人审核       | acceptanceWorkflow |
| `GET /tasks/:id/sla-status`                     | 获取服务协议状态 | slaCalculator      |

### 现有端点增强

| 端点                            | 增强内容                                               |
| ------------------------------- | ------------------------------------------------------ |
| `GET /projects/:code/tasks`     | 查询时自动计算 slaStatus（添加 `_slaStatus` 计算字段） |
| `PUT /projects/:code/tasks/:id` | 状态变更时调用验收工作流守卫（审核退回→自动回退状态）  |

---

## 与标准管理模块的关系

任务中心是标准管理改造的**消费端**：

| 标准管理提供的引擎     | 任务中心的消费方式                     |
| ---------------------- | -------------------------------------- |
| standardBindingService | StandardBindingPanel 调用绑定/解绑 API |
| snapshotService        | 任务状态→执行中时触发快照生成          |
| ruleEngine             | 验收审核时执行规则判定                 |

详见 [标准管理架构规范](file:///Users/dylan/CodeBuddy/agile-construction/docs/02-architecture/standard-management-architecture.md)。

---

## 与 Agent 模块的关系

任务中心是 Agent 的**数据层**：

| Agent 动作                     | 任务中心的角色                  |
| ------------------------------ | ------------------------------- |
| 项目分解（project-decomposer） | 提供模板读取 + 批量任务创建 API |
| 进度分析（progress-analyzer）  | 提供服务协议计算 + 任务聚合查询 |
| 风险识别（risk-identifier）    | 提供阻塞链 + 依赖关系查询       |
| 报告撰写（report-writer）      | 提供全量任务数据聚合            |

Agent 是"生产者"和"分析者"，任务中心是"数据枢纽"。

详见 [Agent 架构规范](file:///Users/dylan/CodeBuddy/agile-construction/docs/02-architecture/agent-architecture.md)。

---

## 迁移策略

### 阶段一：补齐业务引擎（无破坏性变更）

```
1. 建 taskInstantiator.ts + 2 个 instantiate 端点
2. 建 acceptanceWorkflow.ts + 2 个 submit/review 端点
3. 建 slaCalculator.ts + 查询时自动注入 _slaStatus
4. 建派生任务生成器（整合进状态机守卫）
```

### 阶段二：前端增强

```
1. TaskDetailPage 从 17 行重构为 6 标签页完整结构
2. TaskProgress 增强可填报
3. TaskStatusOps 增强原因记录
4. StandardBindingPanel 接入
5. SubmissionHistory + SubmissionReviewDialog 新建
6. SlaBadge + StatsCards 新建
7. Skeleton + EmptyState 全局组件新建
8. TaskPaginationBar 提升为全局组件
```

### 阶段三：打通跨模块链路

```
1. Agent → 调用 taskInstantiator 批量创建任务
2. Agent → 读取 slaCalculator 结果做进度分析
3. 验收工作流 → 触发规则引擎判定
4. 验收退回 → 自动生成派生任务
```

### 阶段四：测试与回归

```
1. 引擎单元测试：taskInstantiator / acceptanceWorkflow / slaCalculator
2. API 集成测试：instantiate → submit → review → reject → resubmit 全链路
3. 前端回归测试：所有现有任务页面功能不受影响
4. E2E：模板实例化→验收完整链路
```

---

## Testing Strategy

| 层级     | 测试内容                                   | 框架               | 覆盖率目标    |
| -------- | ------------------------------------------ | ------------------ | ------------- |
| 单元测试 | taskInstantiator 模板展开逻辑              | Vitest             | 核心路径      |
| 单元测试 | acceptanceWorkflow 提交/审核/退回状态流转  | Vitest             | 100% 状态覆盖 |
| 单元测试 | slaCalculator 正常/临期/超期判定           | Vitest             | 100% 分支覆盖 |
| API 测试 | instantiate/preview 端点                   | Vitest + supertest | 核心路径      |
| API 测试 | submit/review 端点                         | Vitest + supertest | 核心路径      |
| API 测试 | 查询时 \_slaStatus 注入正确                | Vitest + supertest | 核心路径      |
| 组件测试 | SubmissionReviewDialog 交互                | RTL                | 基本覆盖      |
| 组件测试 | SlaBadge 颜色渲染                          | RTL                | 基本覆盖      |
| E2E 测试 | 模板实例化 → 任务执行 → 提交 → 审核 全链路 | Playwright         | 1 场景        |

---

## Boundaries

### Always

- 任务状态变更必须走状态机守卫
- 服务协议状态（SLA）实时计算不存库
- 验收退回必须记录原因
- 模板实例化产出的任务状态统一为"草稿"
- 任务删除前检查子任务和依赖
- 所有状态变更记录到 TaskEventLog

### Ask First

- 修改状态机合法的状态流转路径
- 新增 API 端点
- 修改 ProjectTask 字段含义
- Agent 通过 MCP 写任务数据的方式

### Never

- 绕过状态机直接改 status
- 跳过验收直接标记"已完成"
- 删除关联了子任务或依赖的任务
- 手动修改服务协议状态（由 slaCalculator 统一计算）

---

## Resolved Decisions（已决策 — 2026-05-14）

| #   | 问题             | 决策                                         | 理由                                          |
| --- | ---------------- | -------------------------------------------- | --------------------------------------------- |
| 1   | 任务自动生成     | 项目模板→任务模板→自动实例化                 | 匹配项目创建时选模板的工作流                  |
| 2   | 派单池           | 不做独立功能，仅保留「待分配任务数」统计卡片 | 避免建造调度系统                              |
| 3   | 提交→验收流程    | 完整闭环                                     | 提交→审核通知→通过/退回→退回后回执行中→可重交 |
| 4   | 服务协议         | 自动计算 + 手动催办双触发                    | 临期/超期自动标记，催办支持双触发             |
| 5   | 服务协议中文名称 | "服务协议"                                   | 更贴近业务理解                                |
| 6   | 服务协议存储方式 | 每次查询实时计算，不存库                     | 避免状态不一致                                |
| 7   | 派生任务生成     | 验收退回时可选生成整改任务                   | 整合进验收工作流                              |
