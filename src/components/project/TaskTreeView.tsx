/**
 * 任务树视图组件
 * 支持4层任务树展示（项目→阶段→工作包→执行任务）
 */

import { useState, useMemo, useEffect } from 'react'
import { EmptyState } from '../shared'
import type {
  ProjectTask,
  ProjectTaskStatus as TaskStatus,
} from '../personnel/projectManagement.types'

type TaskTreeViewProps = {
  tasks: ProjectTask[]
  onTaskClick?: (task: ProjectTask) => void
  filterByStatus?: TaskStatus
  filterByAssignee?: string
  maxLevel?: 0 | 1 | 2 | 3
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  completed: { label: '已完成', className: 'task-status-completed' },
  'in-progress': { label: '进行中', className: 'task-status-in-progress' },
  pending: { label: '待处理', className: 'task-status-pending' },
  paused: { label: '已暂停', className: 'task-status-paused' },
  cancelled: { label: '已取消', className: 'task-status-cancelled' },
}

const TaskItem = ({
  task,
  depth,
  expandedIds,
  onToggle,
  onTaskClick,
}: {
  task: ProjectTask
  depth: number
  expandedIds: Set<string>
  onToggle: (taskId: string) => void
  onTaskClick?: (task: ProjectTask) => void
}) => {
  const hasChildren = task.children && task.children.length > 0
  const isExpanded = expandedIds.has(task.id)
  const statusInfo = statusConfig[task.status]
  const indentStyle = { paddingLeft: `${depth * 24 + 12}px` }

  const handleClick = () => {
    if (hasChildren) {
      onToggle(task.id)
    }
    onTaskClick?.(task)
  }

  return (
    <div className="task-tree-node">
      <div
        className={`task-tree-item task-level-${task.level}`}
        style={indentStyle}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick()
          }
        }}
      >
        {/* 展开/折叠图标 */}
        <span
          className={`task-expand-icon ${hasChildren ? 'has-children' : ''} ${isExpanded ? 'expanded' : ''}`}
        >
          {hasChildren ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d={isExpanded ? 'M4 6l4 4 4-4' : 'M6 4l4 4-4 4'} />
            </svg>
          ) : (
            <span className="task-leaf-dot" />
          )}
        </span>

        {/* 任务名称 */}
        <span className="task-name">{task.name}</span>

        {/* 负责人 */}
        {task.assignee && <span className="task-assignee">{task.assignee}</span>}

        {/* 截止日期 */}
        {task.dueDate && <span className="task-due-date">{task.dueDate}</span>}

        {/* 进度条 */}
        <div className="task-progress-bar">
          <div
            className={`task-progress-fill ${task.status === 'completed' ? 'completed' : ''}`}
            style={{ width: `${task.progress}%` }}
          />
        </div>
        <span className="task-progress-text">{task.progress}%</span>

        {/* 状态标签 */}
        <span className={`task-status ${statusInfo.className}`}>{statusInfo.label}</span>
      </div>

      {/* 子任务 */}
      {hasChildren && isExpanded && (
        <div className="task-tree-children">
          {task.children!.map(child => (
            <TaskItem
              key={child.id}
              task={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const TaskTreeView = ({
  tasks,
  onTaskClick,
  filterByStatus,
  filterByAssignee,
  maxLevel = 3,
}: TaskTreeViewProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // 过滤任务
  const filteredTasks = useMemo(() => {
    if (!filterByStatus && !filterByAssignee) {
      return tasks
    }

    const filterTask = (task: ProjectTask): ProjectTask | null => {
      const matchesStatus = !filterByStatus || task.status === filterByStatus
      const matchesAssignee = !filterByAssignee || task.assignee === filterByAssignee

      if (task.children && task.children.length > 0) {
        const filteredChildren = task.children
          .map(filterTask)
          .filter((t): t is ProjectTask => t !== null)

        if (filteredChildren.length > 0) {
          return { ...task, children: filteredChildren }
        }
      }

      return matchesStatus && matchesAssignee ? task : null
    }

    return tasks.map(filterTask).filter((t): t is ProjectTask => t !== null)
  }, [tasks, filterByStatus, filterByAssignee])

  // 展开/折叠切换
  const handleToggle = (taskId: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(taskId)) {
        next.delete(taskId)
      } else {
        next.add(taskId)
      }
      return next
    })
  }

  // 初始展开第一层
  useEffect(() => {
    const initialExpanded = new Set<string>()
    const collectLevel0 = (taskList: ProjectTask[]) => {
      taskList.forEach(task => {
        if (task.level === 0 || task.level === 1) {
          initialExpanded.add(task.id)
        }
        if (task.children) {
          collectLevel0(task.children)
        }
      })
    }
    collectLevel0(tasks)
    // eslint-disable-next-line
    setExpandedIds(initialExpanded)
  }, [tasks])

  // 统计信息
  const taskStats = useMemo(() => {
    let total = 0
    let completed = 0
    const collectStats = (taskList: ProjectTask[]) => {
      taskList.forEach(task => {
        if (task.level === maxLevel) {
          total += 1
          if (task.status === 'completed') {
            completed += 1
          }
        }
        if (task.children) {
          collectStats(task.children)
        }
      })
    }
    collectStats(tasks)
    return { total, completed }
  }, [tasks, maxLevel])

  if (filteredTasks.length === 0) {
    return (
      <EmptyState
        icon={
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        }
        title="暂无任务数据"
        compact
      />
    )
  }

  return (
    <div className="task-tree-container">
      {/* 统计概览 */}
      <div className="task-tree-stats">
        <span className="task-tree-stat-item">
          <span className="task-tree-stat-label">总任务</span>
          <span className="task-tree-stat-value">{taskStats.total}</span>
        </span>
        <span className="task-tree-stat-item">
          <span className="task-tree-stat-label">已完成</span>
          <span className="task-tree-stat-value completed">{taskStats.completed}</span>
        </span>
        <span className="task-tree-stat-item">
          <span className="task-tree-stat-label">完成率</span>
          <span className="task-tree-stat-value">
            {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%
          </span>
        </span>
      </div>

      {/* 任务树 */}
      <div className="task-tree-list">
        {filteredTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            depth={0}
            expandedIds={expandedIds}
            onToggle={handleToggle}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  )
}

export default TaskTreeView
