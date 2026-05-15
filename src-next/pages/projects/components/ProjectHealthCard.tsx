import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HEALTH_STYLE } from '@/pages/projects/constants/project-styles'
import { Activity, AlertTriangle, Timer, Users } from 'lucide-react'

export interface HealthIndicator {
  status: '正常' | '关注' | '预警' | '严重'
  indicators: Array<{
    label: string
    value: string
    level: 'normal' | 'warning' | 'critical' | 'info'
  }>
}

interface ProjectHealthCardProps {
  health: HealthIndicator | null
  loading?: boolean
}

const HEALTH_FALLBACK = 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'

const INDICATOR_ICONS: Record<string, React.ReactNode> = {
  进度偏差: <Timer className="size-4" />,
  SLA超时: <AlertTriangle className="size-4" />,
  风险项: <AlertTriangle className="size-4" />,
  未分配: <Users className="size-4" />,
}

export function ProjectHealthCard({ health, loading }: ProjectHealthCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="h-6 w-24 rounded bg-muted animate-pulse" />
          <div className="grid grid-cols-2 @4xl/main:grid-cols-4 gap-3 mt-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded bg-muted animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!health) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="size-5 text-muted-foreground" />
            <span className="text-sm font-medium">健康度</span>
          </div>
          <p className="text-sm text-muted-foreground">暂无健康度数据</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="size-5 text-muted-foreground" />
          <span className="text-sm font-medium">健康度</span>
          <Badge
            variant="ghost"
            className={'text-xs font-medium ' + (HEALTH_STYLE[health.status] ?? HEALTH_FALLBACK)}
            role="status"
            aria-live="polite"
          >
            {health.status}
          </Badge>
        </div>
        <div className="grid grid-cols-2 @4xl/main:grid-cols-4 gap-3">
          {health.indicators.map((indicator, i) => (
            <div key={i} className="flex items-center gap-2 rounded-md border border-border p-3">
              <div className="text-muted-foreground shrink-0">
                {INDICATOR_ICONS[indicator.label] ?? <Timer className="size-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">{indicator.label}</p>
                <p className="text-sm font-medium tabular-nums">{indicator.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
