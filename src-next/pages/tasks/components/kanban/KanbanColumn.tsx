import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from './KanbanCard'
import { STATUS_STYLE } from '../../constants/task-styles'
import type { TaskItem } from '@/types/task'

interface KanbanColumnProps {
  status: string
  tasks: TaskItem[]
  onSelectTask: (task: TaskItem) => void
}

export function KanbanColumn({ status, tasks, onSelectTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status, data: { type: 'column', status } })
  const statusStyle = STATUS_STYLE[status]

  return (
    <div className="flex shrink-0 w-72 flex-col rounded-lg border border-border bg-muted/30">
      {/* Column header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
        <span className={`size-2 rounded-full ${statusStyle?.dot ?? 'bg-zinc-400'}`} />
        <span className="text-sm font-medium">{status}</span>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">{tasks.length}</span>
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-2 p-2 min-h-[120px] transition-colors ${
          isOver ? 'bg-muted/50 ring-1 ring-primary/20 rounded-b-lg' : ''
        }`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onClick={() => onSelectTask(task)} />
          ))}
        </SortableContext>

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-xs text-muted-foreground/60">暂无</span>
          </div>
        )}
      </div>
    </div>
  )
}
