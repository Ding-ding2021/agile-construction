import type { TaskFlowLog, TaskStatus } from '@/types/task'

const STATUS_COLORS: Record<string, string> = {
  '执行中': 'bg-blue-500', '已暂停': 'bg-zinc-400', '不通过': 'bg-red-500',
  '已完成': 'bg-green-500', '已关闭': 'bg-zinc-400',
  '待分配': 'bg-amber-500', '待执行': 'bg-amber-500', '待提交': 'bg-amber-500',
  '待验收': 'bg-blue-500', '草稿': 'bg-zinc-400',
}

interface TaskFlowTimelineProps {
  currentStatus: TaskStatus
  logs: TaskFlowLog[]
}

export default function TaskFlowTimeline({ currentStatus, logs }: TaskFlowTimelineProps) {
  if (logs.length === 0) {
    return (
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">流程时间线</h3>
        <p className="text-xs text-muted-foreground py-4 text-center">暂无流转记录</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">流程时间线</h3>
      <div className="space-y-0">
        {logs.map((log, idx) => {
          const isCurrent = idx === 0
          const extractedStatus = extractStatus(log.action) ?? currentStatus
          const dotColor = isCurrent ? (STATUS_COLORS[extractedStatus] ?? 'bg-blue-500') : 'bg-zinc-300 dark:bg-zinc-600'

          return (
            <div key={log.id} className="flex gap-3">
              {/* Timeline line & dot */}
              <div className="flex flex-col items-center">
                <div className={"size-2.5 rounded-full shrink-0 ring-2 ring-background " + dotColor} />
                {idx < logs.length - 1 && (
                  <div className="w-px flex-1 min-h-[24px] bg-border" />
                )}
              </div>
              {/* Content */}
              <div className={"pb-4 " + (idx < logs.length - 1 ? '' : 'pb-0')}>
                <div className="flex items-center gap-2">
                  <span className={"text-sm font-medium " + (isCurrent ? 'text-foreground' : 'text-muted-foreground')}>
                    {log.action}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">
                      当前
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {log.operator} · {log.time}
                </p>
                {log.detail && (
                  <p className="text-xs text-muted-foreground/70 mt-0.5">{log.detail}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Extract a status label from action text, e.g. "状态变更为：执行中" → "执行中" */
function extractStatus(action: string): string | null {
  const match = action.match(/(草稿|待分配|待执行|执行中|已暂停|待提交|待验收|不通过|已完成|已关闭)/)
  return match?.[1] ?? null
}
