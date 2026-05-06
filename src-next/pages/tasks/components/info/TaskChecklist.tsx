import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Circle } from 'lucide-react'
import type { TaskChecklistItem } from '@/types/task'

interface TaskChecklistProps {
  items: TaskChecklistItem[]
  readonly?: boolean
  onToggle?: (itemId: string) => void
}

export default function TaskChecklist({ items, readonly, onToggle }: TaskChecklistProps) {
  const doneCount = items.filter(i => i.done).length

  if (items.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">检查项</h3>
        <p className="text-xs text-muted-foreground py-2 text-center">暂无检查项</p>
      </Card>
    )
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          检查项 ({doneCount}/{items.length})
        </h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          {items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0}%
        </span>
      </div>
      {items.length > 0 && <Progress value={(doneCount / items.length) * 100} className="h-1.5" />}
      <div className="space-y-1.5">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-2 py-0.5">
            {readonly ? (
              item.done ? (
                <CheckCircle2 className="size-4 text-green-500 shrink-0" />
              ) : (
                <Circle className="size-4 text-muted-foreground/30 shrink-0" />
              )
            ) : (
              <Checkbox
                checked={item.done}
                onCheckedChange={() => onToggle?.(item.id)}
                className="size-4"
              />
            )}
            <span className={`text-sm ${item.done ? 'line-through text-muted-foreground' : ''}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
