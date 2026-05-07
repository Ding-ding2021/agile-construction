import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { WBSGanttSvar } from '@/pages/wbs/components/WBSGanttSvar'
import { useWBSStore } from '@/store/wbsStore'
import { api } from '@/services/api'
import type { ProjectMilestone } from '@/types/project-detail'

interface TabProgressProps {
  projectCode: string
}

const MILESTONE_STATUS_STYLE: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  delayed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

export function TabProgress({ projectCode }: TabProgressProps) {
  const loadTree = useWBSStore(s => s.loadTree)
  const flatNodes = useWBSStore(s => s.flatNodes)
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([])
  const [mlLoading, setMlLoading] = useState(true)

  useEffect(() => {
    loadTree(projectCode)
  }, [projectCode, loadTree])

  useEffect(() => {
    setMlLoading(true)
    api
      .getMilestones(projectCode)
      .then(setMilestones)
      .catch(() => setMilestones([]))
      .finally(() => setMlLoading(false))
  }, [projectCode])

  const wbsProgress =
    flatNodes.length > 0
      ? Math.round(flatNodes.reduce((s, n) => s + (n.progress || 0), 0) / flatNodes.length)
      : 0

  const completedMilestones = milestones.filter(m => m.status === 'completed').length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 @4xl/main:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>WBS 整体进度</CardTitle>
            <CardDescription>所有工作包平均完成度</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Progress value={wbsProgress} className="flex-1 h-2.5" />
              <span className="text-2xl font-semibold tabular-nums">{wbsProgress}%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>里程碑</CardTitle>
            <CardDescription>关键节点完成情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold tabular-nums">{completedMilestones}</span>
              <span className="text-sm text-muted-foreground">/ {milestones.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>WBS 节点</CardTitle>
            <CardDescription>总节点数</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold tabular-nums">{flatNodes.length}</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>甘特图</CardTitle>
          <CardDescription>WBS 任务时序与依赖</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="h-[400px]">
            <WBSGanttSvar />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>里程碑列表</CardTitle>
          <CardDescription>项目关键节点</CardDescription>
        </CardHeader>
        <CardContent>
          {mlLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : milestones.length === 0 ? (
            <p className="text-sm text-muted-foreground">暂无里程碑</p>
          ) : (
            <div className="space-y-2">
              {milestones.map(m => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.dueDate ? m.dueDate.slice(0, 10) : '未设置'}{' '}
                        {m.assignee ? `· ${m.assignee}` : ''}
                      </p>
                    </div>
                  </div>
                  <Badge variant="ghost" className={MILESTONE_STATUS_STYLE[m.status] ?? ''}>
                    {m.status === 'completed'
                      ? '已完成'
                      : m.status === 'delayed'
                        ? '延迟'
                        : '进行中'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
