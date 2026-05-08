import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import type { TaskChecklistItem } from '@/types/task'

interface TaskChecklistProps {
  items: TaskChecklistItem[]
  readonly?: boolean
  onToggle?: (itemId: string) => void
}

const RESULT_ICON: Record<string, { icon: typeof CheckCircle2; className: string }> = {
  pass: { icon: CheckCircle2, className: 'text-green-500' },
  fail: { icon: XCircle, className: 'text-red-500' },
  pending: { icon: Clock, className: 'text-muted-foreground/30' },
}

export default function TaskChecklist({ items, readonly, onToggle }: TaskChecklistProps) {
  const doneCount = items.filter(i => i.result === 'pass').length

  if (items.length === 0) {
    return (
      <Card className="p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          检查项
        </h3>
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
        {items.map(item => {
          const info = RESULT_ICON[item.result ?? 'pending']
          const Icon = info.icon
          return (
            <div key={item.id} className="flex items-center gap-2 py-0.5">
              {readonly ? (
                <Icon className={`size-4 shrink-0 ${info.className}`} />
              ) : (
                <button
                  onClick={() => onToggle?.(item.id)}
                  className="size-4 shrink-0 cursor-pointer focus:outline-none"
                >
                  <Icon className={`size-4 ${info.className}`} />
                </button>
              )}
              <span
                className={`text-sm ${item.result === 'pass' ? 'line-through text-muted-foreground' : ''}`}
              >
                {item.name}
              </span>
              {item.clauseId && (
                <Badge variant="outline" className="text-[10px] ml-auto">
                  条款#{item.clauseId}
                </Badge>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
