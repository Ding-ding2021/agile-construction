import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { DIMENSION_LABELS, DIMENSION_ORDER } from '@/pages/projects/constants/project-styles'
import { CheckCircle2, ClipboardCheck, DollarSign, Send } from 'lucide-react'

interface ProjectDimensionStatusProps {
  project: {
    executionStatus?: string | null
    acceptanceStatus?: string | null
    settlementStatus?: string | null
    dispatchStatus?: string | null
    progress?: number
  } | null
  loading?: boolean
}

const DIMENSION_ICONS: Record<string, React.ReactNode> = {
  executionStatus: <CheckCircle2 className="size-4" />,
  acceptanceStatus: <ClipboardCheck className="size-4" />,
  settlementStatus: <DollarSign className="size-4" />,
  dispatchStatus: <Send className="size-4" />,
}

function computeProgress(key: string, value: string | null | undefined): number {
  if (!value) return 0
  switch (key) {
    case 'executionStatus':
      if (value === '已完成') return 100
      if (value === '进行中') return 50
      return 0
    case 'acceptanceStatus':
      if (value === '已通过') return 100
      if (value === '验收中') return 60
      if (value === '整改中') return 40
      return 0
    case 'settlementStatus':
      if (value === '已结算') return 100
      if (value === '结算中') return 50
      return 0
    case 'dispatchStatus':
      if (value === '已派完') return 100
      if (value === '派单中') return 50
      return 0
    default:
      return 0
  }
}

export function ProjectDimensionStatus({ project, loading }: ProjectDimensionStatusProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-muted animate-pulse" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!project) {
    return (
      <Card role="region" aria-label="项目维度状态">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">暂无维度状态数据</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card role="region" aria-label="项目维度状态">
      <CardContent className="p-4 space-y-3">
        {DIMENSION_ORDER.map(key => {
          const value = project[key]
          const progressVal = computeProgress(key, value)
          const label = DIMENSION_LABELS[key] ?? key

          return (
            <div key={key} className="flex items-center gap-3">
              <div className="text-muted-foreground shrink-0">
                {DIMENSION_ICONS[key] ?? <CheckCircle2 className="size-4" />}
              </div>
              <span className="text-sm text-muted-foreground w-16 shrink-0">{label}</span>
              <Progress
                value={progressVal}
                className="flex-1 h-2"
                aria-label={`${label}: ${value || '无'}`}
              />
              <span className="text-xs tabular-nums text-muted-foreground w-16 text-right">
                {value || '-'}
              </span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
