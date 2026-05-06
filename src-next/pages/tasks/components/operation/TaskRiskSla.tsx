import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import type { TaskDetail } from '@/types/task'

const RISK_BADGE: Record<string, string> = {
  '高风险': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  '中风险': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  '低风险': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
}

const SLA_BADGE: Record<string, string> = {
  '正常': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  '即将超时': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  '超时': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

interface TaskRiskSlaProps {
  task: TaskDetail
  readonly?: boolean
  onRiskChange?: (code: string, riskLevel: string) => void
}

export default function TaskRiskSla({ task, readonly, onRiskChange }: TaskRiskSlaProps) {
  const [draft, setDraft] = useState(task.riskLevel ?? '')

  return (
    <Card className="p-4 space-y-3">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">风险 & SLA</h4>

      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">风险等级</p>
        {readonly ? (
          <Badge variant="ghost" className={"text-[11px] font-medium " + (RISK_BADGE[task.riskLevel ?? ''] ?? 'bg-zinc-100')}>
            {task.riskLevel || '—'}
          </Badge>
        ) : (
          <div className="flex items-center gap-2">
            <Select value={draft} onValueChange={setDraft}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <SelectValue placeholder="选择风险等级" />
              </SelectTrigger>
              <SelectContent>
                {['低风险', '中风险', '高风险'].map(r => (
                  <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {draft !== (task.riskLevel ?? '') && (
              <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => onRiskChange?.(task.code, draft)}>
                <Save className="size-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">SLA 状态</span>
        <Badge variant="ghost" className={"text-[11px] font-medium " + (SLA_BADGE[task.slaStatus ?? ''] ?? 'bg-zinc-100')}>
          {task.slaStatus || '—'}
        </Badge>
      </div>

    </Card>
  )
}
