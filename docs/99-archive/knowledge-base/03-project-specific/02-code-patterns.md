---
id: ARC-024
number: ARC-024
domain: archive
category: archived
title: 02 Code Patterns
status: superseded
last_updated: 2026-05-05
archived_at: 2026-05-12
archived_reason: 历史归档
superseded_by: docs/ (see docs/README.md for current docs)
---

# 项目代码模式

## 1. 状态机模式

项目中使用状态机管理项目状态流转。

```typescript
// 核心实现：src/domain/projectStatusMachine.ts
export interface GuardContext {
  hasMilestone: boolean
  taskTreeComplete: boolean
  acceptancePassed: boolean
  settlementComplete: boolean
}

export const ProjectStatusMachine = {
  states: [
    'DRAFT',
    'PENDING_CONFIRM',
    'PENDING_BREAKDOWN',
    'IN_PROGRESS',
    'PENDING_ACCEPTANCE',
    'PENDING_SETTLEMENT',
    'ARCHIVED',
  ],

  transitions: {
    DRAFT: ['PENDING_CONFIRM'],
    PENDING_CONFIRM: ['DRAFT', 'PENDING_BREAKDOWN'],
    PENDING_BREAKDOWN: ['PENDING_CONFIRM', 'IN_PROGRESS'],
    IN_PROGRESS: ['PENDING_BREAKDOWN', 'PENDING_ACCEPTANCE'],
    PENDING_ACCEPTANCE: ['IN_PROGRESS', 'PENDING_SETTLEMENT'],
    PENDING_SETTLEMENT: ['PENDING_ACCEPTANCE', 'ARCHIVED'],
    ARCHIVED: [],
  },

  canTransition(from: string, to: string, context: GuardContext): boolean {
    const allowed = this.transitions[from] || []
    if (!allowed.includes(to)) return false

    // 守卫规则
    if (to === 'IN_PROGRESS') {
      return context.hasMilestone && context.taskTreeComplete
    }
    if (to === 'PENDING_SETTLEMENT') {
      return context.acceptancePassed
    }
    if (to === 'ARCHIVED') {
      return context.settlementComplete
    }
    return true
  },
}
```

## 2. 数据加工模式

```typescript
// src/data/projects.ts
// 基础数据 -> 业务模型加工
export interface ProjectItem extends MockProject {
  // 派生状态
  dispatchStatus: 'none' | 'partial' | 'full'
  executionStatus: 'not_started' | 'in_progress' | 'completed'
  acceptanceStatus: 'pending' | 'passed' | 'failed'
  settlementStatus: 'unsettled' | 'partial' | 'settled'

  // 视觉属性
  statusTone: 'neutral' | 'warning' | 'success' | 'danger'
  statusLabel: string
}

// 加工函数
export function enhanceProject(mock: MockProject): ProjectItem {
  return {
    ...mock,
    dispatchStatus: computeDispatchStatus(mock),
    executionStatus: computeExecutionStatus(mock),
    acceptanceStatus: computeAcceptanceStatus(mock),
    settlementStatus: computeSettlementStatus(mock),
    statusTone: getStatusTone(mock.status),
    statusLabel: getStatusLabel(mock.status),
  }
}
```

## 3. 选择器管道模式

```typescript
// src/components/task/taskManagement.selectors.ts
// filter -> search -> advancedFilter -> sort -> paginate

export function processTasks(tasks: Task[], options: ProcessOptions): Task[] {
  return tasks
    .filter(filterByStatus(options.statusFilter))
    .filter(filterBySearch(options.keyword))
    .filter(filterByAdvanced(options.advancedFilters))
    .sort(sortBy(options.sortField, options.sortOrder))
    .slice((options.page - 1) * options.pageSize, options.page * options.pageSize)
}
```

## 4. Props 透传模式

```typescript
// 页面级状态提升，通过 props 向下传递
// App.tsx
<ProjectDetailPage
  project={project}
  onStatusChange={handleStatusChange}
  onAddLog={handleAddLog}
  availableTransitions={transitions}
/>

// 优点：状态集中，易于调试
// 缺点：层级深时 props drilling
```

## 5. 领域事件日志

```typescript
// 状态转换时生成日志
interface StatusLog {
  id: string
  projectId: string
  fromStatus: string
  toStatus: string
  operator: string
  operatedAt: string
  reason?: string
}

function addStatusLog(log: StatusLog) {
  setProjectStatusLogs(prev => ({
    ...prev,
    logs: [log, ...prev.logs],
  }))
}
```

## 6. Mock 数据工厂

```typescript
// 工厂函数生成测试数据
export function createMockProject(overrides?: Partial<MockProject>): MockProject {
  return {
    id: generateProjectCode(),
    name: '新项目',
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockTask(projectId: string): Task {
  return {
    id: `TASK-${Date.now()}`,
    projectId,
    status: 'PENDING',
    // ...
  }
}
```
