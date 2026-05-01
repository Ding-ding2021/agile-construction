# 项目管理模块

## 概述

项目管理模块提供了完整的UI和数据层，用于管理施工项目的全生命周期。涵盖项目列表、创建、详细执行跟踪（通过甘特图和WBS树）、验收流程及团队管理。该模块由四个子模块组成，协同提供一致的项目管理体验。

## 子模块架构

该模块采用分层架构：

- **[组件](project-management-module-components.md)** — 表示层，包含所有项目视图的React UI组件，包括`ProjectAcceptanceView`、`GanttChart`、`TaskTreeView`、`WbsTreeTable`、`ProjectMembersView`和`TaskDispatchPanel`。这些组件从数据层消费数据，并与`AppSidebar`和`PageHeader`等共享UI组件协调。

- **[数据](project-management-module-data.md)** — 将原始项目数据转换为甘特图和WBS树的展示就绪格式。定义核心`ProjectItem`类型，包含预算、团队规模、日期范围和描述字段。关键函数包括`getProjectGanttData`和`getProjectWbsData`。

- **[领域](project-management-module-domain.md)** — 提供核心类型和业务逻辑，包括两个并行的状态系统：传统扁平状态模型和新的分层父/子状态模型（`ParentStatus`类型：`'启动' | '计划' | '执行' | '收尾' | '归档'`）。包含状态机逻辑、转换守卫和视图辅助函数。

- **[工具](project-management-module-utils.md)** — 纯无状态辅助函数，用于项目业务逻辑，例如用于解析`"done/total"`进度字符串的`parseProgressPair`。

## 关键工作流

子模块在以下几个关键工作流中协同工作：

1. **验收工作流** — `ProjectAcceptanceView`（组件）调用`bootstrapAcceptance` → `readAcceptanceState` → `createInitialAcceptanceState` → `createMilestonesForProject` → `parseProgressPair`（工具）。此链通过里程碑跟踪初始化和管理项目验收状态。

2. **甘特图渲染** — `getProjectGanttData`（数据）调用`createTimeline` → `addMonths`、`createDateInTimelineMonth` → `clampDay` → `getDaysInMonth`，以及`parseProjectRange` → `startOfMonth`。生成的数据由`GanttChart`（组件）消费，该组件还使用`getMilestoneStyle`和`buildYearSegments`。

3. **WBS树构建** — `getProjectWbsData`（数据）调用`toWbsNodes`、`countDelayedNodes`和`countNodesByType`。输出提供给`WbsTreeTable`（组件），该组件使用`buildVisibleRows`，以及使用`collectNodeMap`和`visit`的`ProjectWbsView`。

4. **任务管理** — `mapTasksToWorkItems`（数据）调用`inferTaskSourceType`和`inferDomain`。任务数据由`TaskTreeView`（组件）使用`collectLevel0`渲染，并通过`TaskDispatchPanel`使用`handleTaskClick`进行分派。

5. **团队管理** — `ProjectMembersView`（组件）使用`getRoleAssignees`和`saveDraftSelection` → `closeEditor`来管理项目团队成员。

## 数据流

该模块遵循单向数据流：领域类型定义结构，数据函数将原始输入转换为视图模型，组件在渲染这些模型的同时处理用户交互。工具模块提供跨所有层使用的无状态辅助函数。状态转换由领域的状态机逻辑控制，确保一致的项目生命周期管理。
