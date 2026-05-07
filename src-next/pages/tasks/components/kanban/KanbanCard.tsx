import { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays, GripVertical } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { STATUS_STYLE, SLA_STYLE, avatarColor } from '../../constants/task-styles'
import type { TaskItem } from '@/types/task'

interface KanbanCardProps {
  task: TaskItem
  onClick: () => void
  isDragging?: boolean
}

export const KanbanCard = memo(function KanbanCard({ task, onClick, isDragging }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSorting,
  } = useSortable({ id: task.id, data: { type: 'task', task } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSorting ? 0.4 : 1,
  }

  const statusStyle = STATUS_STYLE[task.status]

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={`cursor-grab active:cursor-grabbing border-border shadow-sm hover:shadow-md transition-shadow ${isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''}`}
        onClick={(e) => { e.stopPropagation(); onClick() }}
      >
        <CardContent className="p-3 space-y-2">
          {/* Handle + Priority row */}
          <div className="flex items-start gap-1">
            <button
              className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0"
              onPointerDown={(e) => { e.stopPropagation(); (listeners?.onPointerDown as (...args: unknown[]) => void)?.(e) }}
              onKeyDown={listeners?.onKeyDown as React.KeyboardEventHandler | undefined}
            >
              <GripVertical className="size-3.5" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[11px] font-mono text-muted-foreground truncate">{task.code}</span>
                {task.priority === '紧急' && (
                  <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4 leading-none">紧急</Badge>
                )}
              </div>
              <p className="text-sm font-medium leading-snug line-clamp-2">{task.name}</p>
            </div>
          </div>

          {/* Status badge + SLA */}
          <div className="flex items-center gap-2">
            <Badge variant="ghost" className={`text-[11px] font-medium h-5 px-1.5 ${statusStyle?.bg ?? ''}`}>
              <span className={`mr-1 size-1.5 rounded-full ${statusStyle?.dot ?? ''}`} />
              {task.status}
            </Badge>
            {task.slaStatus && task.slaStatus !== '正常' && (
              <Badge variant="ghost" className={`text-[11px] font-medium h-5 px-1.5 ${SLA_STYLE[task.slaStatus] ?? ''}`}>
                {task.slaStatus}
              </Badge>
            )}
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div
              className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden"
              data-complete={task.progress >= 100 ? '' : undefined}
            >
              <div
                className={`h-full rounded-full transition-all ${task.progress >= 100 ? 'bg-green-500' : 'bg-primary'}`}
                style={{ width: `${task.progress}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground tabular-nums w-8 text-right">{task.progress}%</span>
          </div>

          {/* Assignee + Due date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Avatar className={`size-5 ${avatarColor(task.assigneeName || task.owner || '')}`}>
                <AvatarFallback className="text-[10px] leading-none bg-inherit">
                  {(task.assigneeName || task.owner || '?')[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate max-w-20">
                {task.assigneeName || task.owner || '—'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="size-3" />
              <span className="tabular-nums">{task.plannedEndAt?.slice(5, 10) || '—'}</span>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {task.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                  {tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <span className="text-[10px] text-muted-foreground">+{task.tags.length - 3}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
})
