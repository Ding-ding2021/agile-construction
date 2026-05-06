import { useMemo, useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { Skeleton } from '@/components/ui/skeleton'
import { ALL_STATUSES } from '../../constants/task-styles'
import type { TaskItem } from '@/types/task'

interface KanbanViewProps {
  tasks: TaskItem[]
  onSelectTask: (task: TaskItem) => void
  onUpdateTask: (taskId: string, updates: Partial<TaskItem>) => void
  loading?: boolean
}

export function KanbanView({ tasks, onSelectTask, onUpdateTask, loading }: KanbanViewProps) {
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Group tasks by status
  const columns = useMemo(() => {
    const map = new Map<string, TaskItem[]>()
    for (const status of ALL_STATUSES) {
      const group = tasks.filter(t => t.status === status)
      if (group.length > 0) map.set(status, group)
    }
    return map
  }, [tasks])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id)
    if (task) setActiveTask(task)
  }, [tasks])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const draggedTask = tasks.find(t => t.id === active.id)
    if (!draggedTask) return

    // Determine target status from droppable column or adjacent task's column
    let targetStatus: string | null = null

    if (over.data.current?.type === 'column') {
      targetStatus = over.data.current.status as string
    } else if (over.data.current?.type === 'task') {
      const overTask = tasks.find(t => t.id === over.id)
      if (overTask) targetStatus = overTask.status
    }

    if (targetStatus && targetStatus !== draggedTask.status) {
      onUpdateTask(draggedTask.id, { status: targetStatus as TaskItem['status'] })
    }
  }, [tasks, onUpdateTask])

  const handleDragCancel = useCallback(() => {
    setActiveTask(null)
  }, [])

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex shrink-0 w-72 flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed py-20">
        <div className="text-center">
          <p className="text-muted-foreground">暂无任务</p>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from(columns.entries()).map(([status, columnTasks]) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={columnTasks}
            onSelectTask={onSelectTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-3 opacity-90">
            <KanbanCard task={activeTask} onClick={() => {}} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
