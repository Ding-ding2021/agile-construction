/**
 * TaskKanbanView — 看板视图（支持拖拽）
 *
 * 按任务状态分组展示，每个状态一列，任务卡片可拖拽到其他状态列。
 */
import { useState, useMemo, useCallback } from 'react'
import { Box, Paper, Typography } from '@mui/material'
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  pointerWithin,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import type { TaskItem, TaskStatus } from './taskManagement.types'
import { STATUS_TONE_MAP } from './taskManagement.types'
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
}

/** 可拖拽的任务卡片 */
function DraggableCard({ task, onOpen }: { task: TaskItem; onOpen?: (code: string) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.code,
    data: task,
  })

  return (
    <Paper
      ref={setNodeRef}
      variant="outlined"
      {...listeners}
      {...attributes}
      onClick={() => onOpen?.(task.code)}
      sx={{
        p: 1.5,
        cursor: 'grab',
        borderRadius: 'var(--pm-radius-md)',
        bgcolor: isDragging ? 'var(--pm-primary-15)' : 'var(--pm-card)',
        borderColor: isDragging ? 'var(--pm-primary)' : 'var(--pm-border)',
        opacity: isDragging ? 0.4 : 1,
        transition: 'all 0.15s',
        '&:hover': { bgcolor: 'var(--pm-element-hover)', borderColor: 'var(--pm-primary-15)' },
        touchAction: 'none',
      }}
    >
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

/** 可拖放的状态列 */
function DroppableColumn({
  status,
  tasks,
  onOpen,
}: {
  status: TaskStatus
  tasks: TaskItem[]
  onOpen?: (code: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <Paper
      ref={setNodeRef}
      variant="outlined"
      sx={{
        minWidth: 240,
        maxWidth: 280,
        flexShrink: 0,
        bgcolor: isOver ? 'var(--pm-primary-15)' : 'var(--pm-element)',
        borderColor: isOver ? 'var(--pm-primary)' : 'var(--pm-border)',
        borderRadius: 'var(--pm-radius-card)',
        transition: 'all 0.15s',
      }}
    >
      <Box sx={{ p: 2, pb: 1.5, borderBottom: '1px solid var(--pm-border-light)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StatusChip label={status} tone={STATUS_TONE_MAP[status] ?? 'neutral'} />
          <Typography sx={{ fontSize: 12, color: 'var(--pm-text-40)' }}>{tasks.length}</Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {tasks.map(task => (
          <DraggableCard key={task.code} task={task} onOpen={onOpen} />
        ))}
      </Box>
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
}: TaskKanbanViewProps) {
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null)

  const columns = useMemo(() => {
    const groups: Record<string, TaskItem[]> = {}
    for (const s of STATUS_ORDER) groups[s] = []
    for (const t of tasks) {
      if (groups[t.status]) groups[t.status].push(t)
    }
    return STATUS_ORDER.filter(s => groups[s].length > 0).map(status => ({
      status,
      items: groups[status],
    }))
  }, [tasks])

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
      const targetStatus = over.id as TaskStatus
      const task = tasks.find(t => t.code === taskCode)
      if (task && targetStatus !== task.status) {
        onStatusChange?.(taskCode, targetStatus)
      }
    },
    [tasks, onStatusChange]
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
      activationConstraint={{ distance: 8 }}
    >
      <Box sx={{ display: 'flex', gap: 3, p: 3, overflowX: 'auto', minHeight: 400 }}>
        {columns.map(col => (
          <DroppableColumn
            key={col.status}
            status={col.status as TaskStatus}
            tasks={col.items}
            onOpen={onOpenTaskDetail}
          />
        ))}
      </Box>
      <DragOverlay>{activeTask ? <DragGhost task={activeTask} /> : null}</DragOverlay>
    </DndContext>
  )
}
