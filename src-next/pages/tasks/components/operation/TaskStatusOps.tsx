import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, AlertTriangle } from 'lucide-react'
import type { TaskDetail, TaskStatus } from '@/types/task'

const STATUS_STYLE: Record<string, { dot: string; bg: string }> = {
  '草稿':   { dot: 'bg-zinc-400',  bg: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
  '待分配': { dot: 'bg-amber-500', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  '待执行': { dot: 'bg-amber-500', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  '执行中': { dot: 'bg-blue-500',  bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  '已暂停': { dot: 'bg-zinc-400',  bg: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
  '待提交': { dot: 'bg-amber-500', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' },
  '待验收': { dot: 'bg-blue-500',  bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  '不通过': { dot: 'bg-red-500',   bg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
  '已完成': { dot: 'bg-green-500', bg: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  '已关闭': { dot: 'bg-zinc-400',  bg: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
}

const AVAILABLE_NEXT: Record<string, TaskStatus[]> = {
  '草稿': ['待分配'],
  '待分配': ['待执行', '已关闭'],
  '待执行': ['执行中', '已关闭'],
  '执行中': ['待提交', '已暂停', '不通过', '已关闭'],
  '已暂停': ['执行中', '已关闭'],
  '待提交': ['待验收', '执行中', '不通过'],
  '待验收': ['已完成', '不通过'],
  '不通过': ['待执行', '执行中', '已关闭'],
  '已完成': [],
  '已关闭': [],
}

interface TaskStatusOpsProps {
  task: TaskDetail
  readonly?: boolean
  onStatusChange?: (code: string, status: TaskStatus) => void
  onRemind?: (code: string) => void
}

export default function TaskStatusOps({ task, readonly, onStatusChange, onRemind }: TaskStatusOpsProps) {
  const nextStatuses = AVAILABLE_NEXT[task.status] ?? []
  const style = STATUS_STYLE[task.status]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">状态</h4>
        {!readonly && task.status !== '已完成' && task.status !== '已关闭' && (
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => onRemind?.(task.code)}>
            <Bell className="size-3.5" />
            催办
          </Button>
        )}
      </div>

      {!readonly && nextStatuses.length > 0 ? (
        <Select onValueChange={v => onStatusChange?.(task.code, v as TaskStatus)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue>
              <span className={"flex items-center gap-1.5"}>
                <span className={"size-2 rounded-full " + (style?.dot ?? 'bg-zinc-400')} />
                {task.status} <span className="text-muted-foreground">→</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {nextStatuses.map(s => (
              <SelectItem key={s} value={s} className="text-xs">
                <span className="flex items-center gap-1.5">
                  <span className={"size-2 rounded-full " + (STATUS_STYLE[s]?.dot ?? 'bg-zinc-400')} />
                  {s}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="flex items-center gap-2">
          <Badge variant="ghost" className={"text-xs font-medium gap-1.5 " + (style?.bg ?? 'bg-zinc-100')}>
            <span className={"size-2 rounded-full " + (style?.dot ?? 'bg-zinc-400')} />
            {task.status}
          </Badge>
        </div>
      )}

      {task.isBlocked && task.blockedReason && (
        <div className="flex items-start gap-2 p-2 rounded-md bg-red-50 dark:bg-red-950/30 text-xs text-red-600 dark:text-red-400">
          <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />
          <span>{task.blockedReason}</span>
        </div>
      )}

      {task.predecessorStatus === '前置进行中' && (
        <div className="flex items-start gap-2 p-2 rounded-md bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-600 dark:text-amber-400">
          <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />
          <span>前置任务未完成，等待前置任务完成后可继续流转</span>
        </div>
      )}
    </div>
  )
}
