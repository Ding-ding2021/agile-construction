/**
 * TaskKanbanView — 看板视图（拖拽 + 排序 + 状态流转）
 *
 * 按任务状态分组展示，每个状态一列。支持：
 * - 跨列拖拽变更任务状态
 * - 列内拖拽排序（持久化顺序）
 * - 仅允许拖入合法的状态流转目标
 */
import { useState, useMemo, useCallback } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { TaskItem, TaskStatus } from './taskManagement.types'
import { STATUS_TONE_MAP, resolveAvailableStatusOptions } from './taskManagement.types'
import { validateStatusTransition } from './taskStateMachine.guards'
import StatusChip from '../ui/StatusChip'

const STATUS_ORDER: TaskStatus[] = [
  '待分配',
  '待执行',
  '执行中',
  '已暂停',
  '待提交',
  '待验收',
  '不通过',
  '已完成',
  '已关闭',
]

type TaskKanbanViewProps = {
  tasks: TaskItem[]
  onOpenTaskDetail?: (taskCode: string) => void
  onStatusChange?: (taskCode: string, nextStatus: TaskStatus) => void
  /** 列内排序变化回调 */
  onSortChange?: (columnStatus: TaskStatus, orderedCodes: string[]) => void
}

/** 可拖拽排序的任务卡片 */
function SortableCard({ task, onOpen }: { task: TaskItem; onOpen?: (code: string) => void }) {
  const { attributes, listeners, setNodeRef, isDragging, transform, transition } = useSortable({
    id: task.code,
    data: task,
  })

  return (
    <Paper
      ref={setNodeRef}
      variant="outlined"
      {...attributes}
      onClick={() => onOpen?.(task.code)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      sx={{
        p: 1.5,
        borderRadius: 'var(--pm-radius-md)',
        bgcolor: isDragging ? 'var(--pm-primary-15)' : 'var(--pm-card)',
        borderColor: isDragging ? 'var(--pm-primary)' : 'var(--pm-border)',
        opacity: isDragging ? 0.4 : 1,
        transition: 'all 0.15s',
        cursor: 'pointer',
        '&:hover': { bgcolor: 'var(--pm-element-hover)', borderColor: 'var(--pm-primary-15)' },
        touchAction: 'none',
      }}
    >
      {/* 拖拽手柄 — 卡片右上角 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5, mt: -0.5, mr: -0.5 }}>
        <Box
          {...listeners}
          role="button"
          tabIndex={0}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            borderRadius: 1,
            cursor: 'grab',
            color: 'var(--pm-text-40)',
            fontSize: 14,
            lineHeight: 1,
            '&:hover': { bgcolor: 'var(--pm-element-hover)', color: 'var(--pm-text-70)' },
            touchAction: 'none',
          }}
        >
          ⠿
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 500,
          mb: 0.5,
          color: 'var(--pm-text-white)',
          lineHeight: 1.3,
        }}
      >
        {task.name}
      </Typography>
      <Typography
        sx={{ fontSize: 11, color: 'var(--pm-text-40)', fontFamily: 'monospace', mb: 0.5 }}
      >
        {task.code}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 11, color: 'var(--pm-text-70)' }}>
          {task.assigneeName || '—'}
        </Typography>
        {task.progress > 0 && (
          <Typography sx={{ fontSize: 11, color: 'var(--pm-text-40)' }}>
            {task.progress}%
          </Typography>
        )}
      </Box>
      {task.progress > 0 && (
        <Box
          sx={{
            mt: 0.5,
            height: 3,
            bgcolor: 'var(--pm-border)',
            borderRadius: 999,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${task.progress}%`,
              height: '100%',
              bgcolor: task.progress >= 100 ? 'var(--pm-green)' : 'var(--pm-blue)',
              borderRadius: 999,
            }}
          />
        </Box>
      )}
    </Paper>
  )
}

/** 可拖放的状态列（含 SortableContext） */
function DroppableColumn({
  status,
  tasks,
  onOpen,
  isValidDrop,
}: {
  status: TaskStatus
  tasks: TaskItem[]
  onOpen?: (code: string) => void
  isValidDrop: boolean
}) {
  const { setNodeRef, isOver } = useSortable({
    id: `column-${status}`,
    data: { type: 'column', status },
    disabled: true,
  })

  const taskIds = useMemo(() => tasks.map(t => t.code), [tasks])

  const overStyle = isOver
    ? {
        bgcolor: isValidDrop ? 'var(--pm-primary-15)' : 'rgba(255,80,80,0.08)',
        borderColor: isValidDrop ? 'var(--pm-primary)' : 'rgba(255,80,80,0.4)',
      }
    : {}

  return (
    <Paper
      ref={setNodeRef}
      variant="outlined"
      sx={{
        minWidth: 240,
        maxWidth: 280,
        flexShrink: 0,
        bgcolor: isOver ? overStyle.bgcolor : 'var(--pm-element)',
        borderColor: isOver ? overStyle.borderColor : 'var(--pm-border)',
        borderRadius: 'var(--pm-radius-card)',
        transition: 'all 0.15s',
        position: 'relative',
      }}
    >
      <Box sx={{ p: 2, pb: 1.5, borderBottom: '1px solid var(--pm-border-light)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StatusChip label={status} tone={STATUS_TONE_MAP[status] ?? 'neutral'} />
          <Typography sx={{ fontSize: 12, color: 'var(--pm-text-40)' }}>{tasks.length}</Typography>
        </Box>
      </Box>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 60 }}>
          {tasks.map(task => (
            <SortableCard key={task.code} task={task} onOpen={onOpen} />
          ))}
          {tasks.length === 0 && (
            <Typography
              sx={{ fontSize: 12, color: 'var(--pm-text-30)', textAlign: 'center', py: 2 }}
            >
              拖拽任务到此处
            </Typography>
          )}
        </Box>
      </SortableContext>
    </Paper>
  )
}

/** 拖拽时的悬浮卡片副本 */
function DragGhost({ task }: { task: TaskItem }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 'var(--pm-radius-md)',
        bgcolor: 'var(--pm-primary)',
        borderColor: 'var(--pm-primary)',
        color: '#fff',
        width: 240,
        boxShadow: '0 8px 24px rgba(21,77,217,0.3)',
        transform: 'rotate(-3deg)',
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5, lineHeight: 1.3 }}>
        {task.name}
      </Typography>
      <Typography sx={{ fontSize: 11, opacity: 0.7, fontFamily: 'monospace' }}>
        {task.code}
      </Typography>
    </Paper>
  )
}

export default function TaskKanbanView({
  tasks,
  onOpenTaskDetail,
  onStatusChange,
  onSortChange,
}: TaskKanbanViewProps) {
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null)

  const columns = useMemo(() => {
    const groups: Record<string, TaskItem[]> = {}
    for (const s of STATUS_ORDER) groups[s] = []
    for (const t of tasks) {
      if (groups[t.status]) groups[t.status].push(t)
    }
    return STATUS_ORDER.filter(s => groups[s].length > 0).map(status => ({
      status: status as TaskStatus,
      items: groups[status],
    }))
  }, [tasks])

  /** 判断目标状态是否为合法流转目标（静态映射 + 守卫校验） */
  const isAllowedTransition = useCallback(
    (taskCode: string, targetStatus: TaskStatus): boolean => {
      const task = tasks.find(t => t.code === taskCode)
      if (!task) return false
      if (targetStatus === task.status) return true // 同一列 = 排序
      // 1. 静态映射检查
      const allowed = resolveAvailableStatusOptions(task.status)
      if (!allowed.includes(targetStatus)) return false
      // 2. 守卫检查
      const guardResult = validateStatusTransition(task, targetStatus, tasks)
      return guardResult.passed
    },
    [tasks]
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = event.active.data.current as TaskItem | undefined
    if (task) setActiveTask(task)
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null)

      const { active, over } = event
      if (!over || !active) return

      const taskCode = String(active.id)
      const overId = String(over.id)

      // 解析目标状态：列容器 ID 或卡片所在列
      let targetStatus: TaskStatus | null = null
      if (overId.startsWith('column-')) {
        targetStatus = overId.replace('column-', '') as TaskStatus
      } else {
        const overTask = over.data.current as TaskItem | undefined
        if (overTask?.status) targetStatus = overTask.status
      }
      if (!targetStatus) return

      const task = tasks.find(t => t.code === taskCode)
      if (!task) return

      // 同一列内排序
      if (targetStatus === task.status) {
        const columnTasks = columns.find(c => c.status === targetStatus)?.items
        if (!columnTasks || columnTasks.length <= 1) return

        const oldIndex = columnTasks.findIndex(t => t.code === taskCode)
        const overIndex = columnTasks.findIndex(t => t.code === overId)
        if (oldIndex === -1 || overIndex === -1 || oldIndex === overIndex) return

        const reordered = arrayMove(columnTasks, oldIndex, overIndex)
        onSortChange?.(
          targetStatus,
          reordered.map(t => t.code)
        )
        return
      }

      // 跨列状态变更 — 仅允许合法流转
      if (!isAllowedTransition(taskCode, targetStatus)) return

      onStatusChange?.(taskCode, targetStatus)
    },
    [tasks, columns, onStatusChange, onSortChange, isAllowedTransition]
  )

  if (tasks.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
          color: 'var(--pm-text-40)',
          fontSize: 14,
        }}
      >
        暂无任务数据
      </Box>
    )
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <Box sx={{ display: 'flex', gap: 3, p: 3, overflowX: 'auto', minHeight: 400 }}>
        {columns.map(col => (
          <DroppableColumn
            key={col.status}
            status={col.status}
            tasks={col.items}
            onOpen={onOpenTaskDetail}
            isValidDrop={!activeTask ? false : isAllowedTransition(activeTask.code, col.status)}
          />
        ))}
      </Box>
      <DragOverlay>{activeTask ? <DragGhost task={activeTask} /> : null}</DragOverlay>
    </DndContext>
  )
}
