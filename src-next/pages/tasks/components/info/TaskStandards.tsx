import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import type { TaskDetail } from '@/types/task'

interface TaskStandardsProps {
  task: TaskDetail
  readonly?: boolean
  onBindStandard?: () => void
}

export default function TaskStandards({ task, readonly, onBindStandard }: TaskStandardsProps) {
  const standards = task.executionStandards ?? []
  const acceptance = task.acceptanceStandards ?? []

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">标准与规范</h3>
        {task.standardBindingStatus === '未绑定' && !readonly && (
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={onBindStandard}>
            <FileText className="size-3" />
            绑定标准
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">标准绑定</span>
        <Badge variant="secondary" className="text-[10px]">{task.standardBindingStatus ?? '未绑定'}</Badge>
        <span className="text-muted-foreground ml-2">快照</span>
        <Badge variant="secondary" className="text-[10px]">{task.snapshotStatus ?? '未生成'}</Badge>
      </div>

      {standards.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-foreground">执行标准</p>
          <ul className="space-y-0.5">
            {standards.map((s, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-blue-500 mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {acceptance.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-foreground">验收标准</p>
          <ul className="space-y-0.5">
            {acceptance.map((s, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-green-500 mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {standards.length === 0 && acceptance.length === 0 && (
        <p className="text-xs text-muted-foreground">暂未绑定标准和规范</p>
      )}
    </Card>
  )
}
