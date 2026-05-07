import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionCards, type MetricCardData } from '@/components/section-cards'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Users, Target, ArrowUpRight, ClipboardList, Settings } from 'lucide-react'
import { PROJECT_STATUS_STYLE } from '@/pages/projects/constants/project-styles'
import type { ProjectDetail } from '@/types/project-detail'

const STATUS_FALLBACK = 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'

interface TabOverviewProps {
  project: ProjectDetail | null
  loading: boolean
}

export function TabOverview({ project, loading }: TabOverviewProps) {
  const navigate = useNavigate()

  const metrics: MetricCardData[] = useMemo(() => {
    if (!project) return []
    return [
      {
        title: '整体进度',
        value: `${project.progress}%`,
        trend: project.progress >= 50 ? 'up' : 'neutral',
        description: '计划 vs 实际',
      },
      {
        title: '团队成员',
        value: String(project.members?.length ?? 0),
        trend: 'neutral',
        description: '项目参与人数',
      },
      {
        title: '风险数量',
        value: String(project.riskCount ?? 0),
        trend: (project.riskCount ?? 0) > 3 ? 'down' : 'neutral',
        trendLabel: '高风险',
        description: '活跃风险项',
      },
      {
        title: '里程碑',
        value:
          String(project.milestones?.filter(m => m.status === 'completed').length ?? 0) +
          '/' +
          String(project.milestones?.length ?? 0),
        trend: 'neutral',
        description: '已完成里程碑',
      },
    ]
  }, [project])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="h-24" />
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="h-48" />
        </Card>
      </div>
    )
  }

  if (!project) {
    return <div className="text-sm text-muted-foreground">加载失败</div>
  }

  return (
    <div className="space-y-4">
      <SectionCards metrics={metrics} cardSize="lg" />

      <div className="grid grid-cols-1 @4xl/main:grid-cols-3 gap-4">
        <Card className="@4xl/main:col-span-2">
          <CardHeader>
            <CardTitle>项目信息</CardTitle>
            <CardDescription>基本信息与进度概览</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">项目编码</label>
                <p className="text-sm font-mono">{project.code}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">品牌</label>
                <p className="text-sm">{project.brand}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">状态</label>
                <div className="mt-0.5">
                  <Badge
                    variant="ghost"
                    className={PROJECT_STATUS_STYLE[project.status] ?? STATUS_FALLBACK}
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">负责人</label>
                <p className="text-sm">{project.owner || '-'}</p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">计划开业</label>
                <p className="text-sm">
                  {project.plannedOpenDate ? project.plannedOpenDate.slice(0, 10) : '-'}
                </p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">实际开业</label>
                <p className="text-sm">
                  {project.actualOpenDate ? project.actualOpenDate.slice(0, 10) : '-'}
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <label className="text-xs text-muted-foreground">项目描述</label>
              <p className="text-sm mt-1">{project.description || '暂无描述'}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">整体进度</label>
              <div className="flex items-center gap-3">
                <Progress value={project.progress} className="flex-1 h-2" />
                <span className="text-sm tabular-nums font-medium">{project.progress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>快捷操作</CardTitle>
            <CardDescription>常用功能入口</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => navigate(`/projects/${project.code}/wbs`)}
            >
              <ClipboardList className="size-4" />
              WBS 管理
              <ArrowUpRight className="size-3 ml-auto" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => navigate(`/projects/${project.code}?tab=resource`)}
            >
              <Users className="size-4" />
              人员管理
              <ArrowUpRight className="size-3 ml-auto" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => navigate(`/projects/${project.code}?tab=progress`)}
            >
              <Target className="size-4" />
              进度查看
              <ArrowUpRight className="size-3 ml-auto" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => navigate(`/projects/${project.code}?tab=settings`)}
            >
              <Settings className="size-4" />
              项目设置
              <ArrowUpRight className="size-3 ml-auto" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
