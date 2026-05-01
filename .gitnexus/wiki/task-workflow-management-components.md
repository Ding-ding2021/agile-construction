# Task & Workflow Management — components

# Task & Workflow Management — Components

## Overview

This module provides the complete UI layer for task management within a project management application. It implements task listing, filtering, detail viewing, status transitions with guard conditions, and a hierarchical tree view of tasks organized by work packages and projects.

The module is designed for construction/renovation project management, supporting a multi-project task workflow with states like "待分配" (pending assignment), "执行中" (in progress), "待验收" (pending acceptance), and "已完成" (completed).

## Architecture

```
TaskManagementPage (orchestrator)
├── TaskToolbar (filtering, sorting, view mode)
├── TaskListView (table with pagination)
├── TaskDetailPage (drawer/page for task editing)
├── TaskTreeView (hierarchical WBS-style view)
├── taskManagement.selectors (data processing pipeline)
├── taskManagement.data (mock data, tree builder)
├── taskManagement.types (type definitions)
└── taskStateMachine.guards (status transition validation)
```

## Key Components

### TaskManagementPage

The main orchestrator component. It manages:

- Task data loading from `taskRepository` with fallback to mock data
- Filter state, pagination, and search query
- Task detail drawer open/close
- All status transition callbacks
- Feedback snackbar for user actions

**Data flow:**

1. On mount, calls `loadRemoteTasks()` which attempts to load from `taskRepository.loadTasks()`
2. Tasks are processed through `processTasks()` selector pipeline
3. When a task is selected, `selectedTaskDetail` is built from the tasks array or cached detail
4. All mutation callbacks update local state and persist via `taskRepository`

### TaskDetailPage

Renders a task's full detail in either page or drawer mode. Key sections:

- **Header**: Task name, status chip, priority, action buttons (remind, advance, status-specific)
- **Tree Context**: Project, parent task, node level, source type
- **Execution Info**: Assignee selector, planned dates, actual dates, progress
- **Status & Risk**: Status selector with available transitions, risk level, SLA status, blocked reason
- **Standards**: Execution and acceptance standards display
- **Checklist**: Trackable items with completion status
- **Attachments**: Upload and remove files
- **Relations**: Linked tasks display
- **Flow Logs**: Chronological action history

**Editing behavior:**

- Tracks dirty state via `hasChanges` computed from draft values vs. original
- Shows sticky save/reset bar only when changes exist
- Assignee changes trigger `onAssign`, inline field changes trigger `onInlineUpdate`
- Status changes require explicit "应用状态变更" button click

### TaskListView

Renders tasks in a table with columns: name, parent path, project, status, risk level, owner, planned dates, SLA status, predecessor status, remind count, standard binding status.

Supports only `list` view mode currently — grid, kanban, and calendar modes show placeholder messages.

### TaskToolbar

Provides:

- View mode toggle (grid/list/kanban/calendar)
- Search input
- Group dropdown (none/project/status/owner)
- Filter dropdown (status, risk level, SLA status, blocked only)
- Sort dropdown (default/planned end asc/risk desc/remind desc)
- New task button (placeholder)

Uses click-outside detection to close dropdown menus.

### TaskTreeView

Displays tasks in a hierarchical tree structure based on `parentTaskId` relationships. Features:

- Status filter tabs (all/completed/in-progress/delayed/planned) with counts
- Expand/collapse all buttons
- "定位风险节点" button to find and highlight delayed tasks
- Left panel: tree rows with indentation, expand/collapse toggles, status badges
- Right panel: selected node detail with assignee editor

**Tree building logic** (`buildTaskTreeViewModel`):

1. Creates `TaskTreeNode` objects for each task
2. Links children to parents via `parentTaskId`
3. Maps task status + SLA status to tree status (completed/in-progress/delayed/planned)
4. Counts projects, work packages, tasks, and delayed nodes

## Data Processing Pipeline

The `processTasks` function in `taskManagement.selectors.ts` implements a sequential pipeline:

```
filterByStatKey → searchTasks → advancedFilter → sortTasks → paginateTasks
```

1. **filterByStatKey**: Filters by the active stats card (all/pendingAssign/executing/etc.)
2. **searchTasks**: Fuzzy match on name, code, project name, parent path
3. **advancedFilter**: AND combination of status, risk level, SLA status, blocked only
4. **sortTasks**: Default, planned end ascending, risk descending, remind count descending
5. **paginateTasks**: Slice with page clamping

## State Machine Guards

The `taskStateMachine.guards.ts` module implements PRD section 7.4 guard conditions for status transitions:

| Transition      | Guards                                                                     |
| --------------- | -------------------------------------------------------------------------- |
| 待分配 → 待执行 | Owner assigned, predecessors complete, standards bound, snapshot generated |
| 待执行 → 执行中 | Owner confirmed, no blocked predecessors, task not blocked                 |
| 执行中 → 待提交 | Progress ≥ 80%, required materials submitted                               |
| 待提交 → 待验收 | Progress ≥ 90%, acceptance standards bound, snapshot generated             |
| 待验收 → 已完成 | Progress = 100%, not blocked, standards bound                              |

The `getAvailableNextStatuses` function combines the transition map with guard validation to return only allowed next states with reasons for disallowed ones.

## Type System

Core types in `taskManagement.types.ts`:

- **TaskItem**: Full task data model with P0-P2 fields, deprecated fields for backward compatibility
- **TaskDetail**: Extends TaskItem with execution standards, acceptance standards, checklist, attachments, relations, flow logs
- **TaskFilters**: All filter dimensions including statKey, searchQuery, groupBy, sortBy, status, riskLevel, slaStatus, blockedOnly
- **TaskStatus**: 10-state enum (草稿 through 已关闭)
- **TaskStatusTransitionMap**: Defines valid transitions for each status

## Integration Points

The module is consumed by:

- **ProjectScopeTab**: Uses `calculateTaskStats` and `buildTaskTreeViewModel`
- **ProjectTemplateView**: Uses `buildTaskTreeViewModel`, `getTasksByTemplateId`, `getTemplateNameById`, `getTemplateInstantiationDiagnostics`

External dependencies:

- `taskRepository` service for data persistence
- `AppSidebar`, `PageHeader`, `StatsCards` shared components
- MUI components (Drawer, Snackbar, Alert, Paper, etc.)

## Mock Data

`taskManagement.data.ts` provides realistic mock data for 4 projects (Shanghai, Hangzhou, Beijing, Shenzhen) with 12 tasks and 11 work packages. The `buildTaskDetailFromItem` function generates complete detail objects from task items, including synthetic checklist items, attachments, relations, and flow logs.
