# 项目管理模块 — 数据

## 概述

`src/data` 模块为项目管理功能提供数据层。它将原始项目数据（来自模拟源和任务管理类型）转换为结构化、可直接呈现的格式，用于两个主要视图：**甘特图**和**WBS（工作分解结构）树**。该模块还定义了核心 `ProjectItem` 类型，该类型通过预算、团队规模、日期范围和描述字段丰富了基础项目数据。

## 关键类型

### `ProjectItem` (src/data/projects.ts)

核心项目实体。扩展了来自人员模块的基础 `ProjectItem`，增加了：

- `budget` — 格式化后的预算字符串（例如 `"1,280万"`）
- `teamSize` — 团队人数字符串（例如 `"26人"`）
- `dateRange` — 日期范围字符串（例如 `"2024-01-15 ~ 2024-06-15"`）
- `description` — 项目摘要文本

项目从 `mockProjects` 加载，并根据项目代码使用详细覆盖信息进行丰富。对于没有显式覆盖的项目，回退函数会生成默认值。

### `WorkItem` (src/domain/workItem)

表示任何工作单元（项目、工作包、任务、子任务或里程碑）的领域类型。用作原始任务数据与 WBS/甘特视图之间的中间表示。关键字段：

- `kind` — `'project' | 'work_package' | 'task' | 'subtask' | 'milestone'`
- `wbsCode` — 层级代码（例如 `"1.2.1.1"`）
- `parentId` — 对父工作项的引用
- `status`, `progress`, `planStart`, `planEnd`
- `dependencies` — 依赖工作项 ID 列表
- `domain` — `'工程' | '设备' | '运营' | '合规' | '通用'`

## 模块结构

```
src/data/
├── projects.ts          — ProjectItem 类型、项目列表、查找
├── workItems.ts         — 从项目和任务生成 WorkItem
├── projectGantt.ts      — 甘特图数据转换
└── projectWbs.ts        — WBS 树数据转换
```

## 数据流

```mermaid
graph LR
    A[mockProjects] --> B[projects.ts]
    B --> C[ProjectItem]
    C --> D[workItems.ts]
    D --> E[WorkItem[]]
    E --> F[projectGantt.ts]
    E --> G[projectWbs.ts]
    F --> H[ProjectGanttData]
    G --> I[ProjectWbsData]
    J[TaskItem[]] --> D
```

## 详细模块说明

### `projects.ts`

**目的：** 定义 `ProjectItem` 类型并提供项目查找函数。

**关键导出：**

- `projects` — 所有 `ProjectItem` 实例的数组
- `getProjectByCode(code: string)` — 根据项目代码返回单个项目

**详细覆盖：** `detailOverrides` 映射存储每个项目的预算、团队规模、日期范围和描述。没有覆盖的项目会根据其阶段和状态自动生成回退值。

### `workItems.ts`

**目的：** 从两个来源生成 `WorkItem` 数组：

1. 一个 `ProjectItem` — 生成完整的 WBS 层级结构（项目 → 工作包 → 任务 → 子任务），每个项目包含 4 个工作包和约 17 个项目。
2. 一个 `TaskItem` 数组 — 将通用任务数据映射为 `WorkItem` 格式，从任务元数据推断源类型和领域。

**关键函数：**

- `getProjectWorkItems(project)` — 构建标准项目 WBS 模板
- `mapTasksToWorkItems(tasks)` — 将外部任务项转换为工作项
- `getAllWorkItems(project, tasks)` — 合并两个来源

**推断逻辑：** `inferTaskSourceType` 使用启发式方法，根据任务代码、父路径和项目名称来确定任务属于项目、维护、检查、合规还是临时领域。

### `projectGantt.ts`

**目的：** 将 `ProjectItem` 转换为 `ProjectGanttData` — 用于渲染甘特图的数据结构。

**关键类型：**

- `ProjectGanttData` — 包含时间线月份、任务组、图例和摘要计数
- `ProjectGanttGroup` — 包含任务的阶段组（例如 "设计阶段"）
- `ProjectGanttTaskItem` — 具有开始/结束日期、进度、状态、依赖关系的单个任务或里程碑

**关键函数：**

- `getProjectGanttData(project)` — 构建完整的甘特数据结构

**内部流程：**

1. 解析项目的日期范围以确定时间线起点
2. 生成 10 个月的时间线数据
3. 从模板构建 4 个阶段组（设计、结构、现场、开业）
4. 对于每个任务，使用月份偏移和月份中的日期值计算实际开始/结束日期
5. 将依赖 ID 解析为任务名称以进行显示
6. 计算摘要计数（阶段、任务、里程碑）

**日期工具函数：**

- `addMonths`, `startOfMonth`, `getDaysInMonth`, `clampDay` — 安全的日期运算
- `formatDate` — 生成 `YYYY-MM-DD` 格式的字符串
- `createDateInTimelineMonth` — 将 (monthOffset, day) 转换为实际日期

### `projectWbs.ts`

**目的：** 将 `ProjectItem` 转换为 `ProjectWbsData` — 用于 WBS 可视化的树形结构。

**关键类型：**

- `ProjectWbsData` — 包含根节点、焦点节点 ID、展开的 ID 和摘要
- `ProjectWbsNode` — 具有类型、WBS 代码、状态、进度和子节点的树节点

**关键函数：**

- `getProjectWbsData(project)` — 构建 WBS 树

**内部流程：**

1. 通过 `getProjectWorkItems` 获取工作项
2. 从工作项构建节点映射，解析父子关系
3. 将依赖 ID 解析为名称
4. 计算摘要计数（工作包、任务、子任务、延迟项）
5. 确定焦点节点（第一个未完成的任务，或第一个任务，或根节点）
6. 收集默认展开的 ID（项目和工作包节点）

## 使用示例

```typescript
// 获取项目及其甘特数据
const project = getProjectByCode('PRJ-2024-001')
const ganttData = getProjectGanttData(project)
// ganttData.timeline — 10 个月
// ganttData.groups — 4 个阶段组及其任务

// 获取 WBS 数据
const wbsData = getProjectWbsData(project)
// wbsData.nodes — ProjectWbsNode 的树
// wbsData.summary.delayedCount — 延迟项数量

// 合并项目和工作项
const allItems = getAllWorkItems(project, externalTasks)
```

## 依赖关系

- **内部：** `src/domain/workItem` — `WorkItem`, `toWorkItemStatus`, `WORK_ITEM_STATUS_LABEL`
- **内部：** `src/components/personnel/projectManagement.data` — `mockProjects`
- **内部：** `src/components/personnel/projectManagement.types` — 基础 `ProjectItem`, `ProjectMember`, `ProjectRisk`
- **内部：** `src/components/task/taskManagement.types` — `TaskItem`
