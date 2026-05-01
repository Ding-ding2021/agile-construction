# 任务与工作流管理

## 目的

任务与工作流管理模块为建筑/装修项目管理应用提供完整的任务生命周期管理。它将用于查看、筛选和编辑任务的丰富UI层与声明式授权及状态转换引擎相结合，在项目和任务工作流中强制执行基于角色的策略。

## 子模块关系

该模块分为两个互补的子模块：

- **[任务与工作流管理 — 组件](task-workflow-management-components.md)** — UI编排器（`TaskManagementPage`）及其子组件（`TaskToolbar`、`TaskListView`、`TaskDetailPage`、`TaskTreeView`），以表格或分层树状视图渲染任务，支持筛选/排序/分页，并显示带有守卫条件的状态转换。

- **[任务与工作流管理 — 服务](task-workflow-management-services.md)** — 策略层（`workflowContract.ts`），定义`SystemRole`类型（管理员、项目经理、执行人、财务、审计员）和`WorkflowAction`联合类型，在执行前验证每个基于角色的操作和项目状态变更。

组件子模块消费服务子模块，在UI层面强制执行工作流规则——例如，`TaskDetailPage`使用由合约验证的状态操作，`TaskTreeView`应用尊重已定义状态机的`filterNodesByStatus`逻辑。

## 关键工作流

1. **任务列表与筛选** — `TaskManagementPage`编排`TaskToolbar`（筛选/排序控件）和`TaskListView`（分页表格）或`TaskTreeView`（分层树）。`processTasks`选择器串联`searchTasks`、`filterByStatKey`、`advancedFilter`、`sortTasks`和`paginateTasks`以生成最终视图。

2. **任务详情与状态转换** — `TaskDetailPage`显示任务详情和可用状态操作（例如，"待分配" → "执行中"）。每个转换由`validateTransitionToExecuting`或`validateTransitionToPendingExecution`守卫，这些守卫通过`getPredecessorTasks`检查前置任务——所有逻辑均在服务合约中定义。

3. **分层树状视图** — `TaskTreeView`使用`buildTaskTreeViewModel`（调用`mapTaskStatusToTreeStatus`和`countNodes`）从扁平任务数据构建树，然后通过`buildVisibleRows`渲染可展开行。它支持`collectDefaultExpandedIds`、`collectNodeMap`和`collectParentMap`进行状态管理，以及`locateFirstRiskNode`配合`expandAncestors`进行风险导航。

4. **跨模块集成** — `ProjectScopeTab`（来自项目模块）复用`buildTaskTreeViewModel`和`countNodes`在项目范围内显示任务树。类似地，`ProjectTemplateView`调用`getTasksByTemplateId`填充基于模板的任务列表。
