import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getProjectRisks, getIssueLogs, getRiskSummary } from '@/services/mock/risk'
import type { ProjectRisk, IssueLog } from '@/types/project-detail'

interface TabRiskProps {
  projectCode: string
}

const RISK_LEVEL_STYLE: Record<string, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
}

const RISK_LEVEL_LABEL: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

const RISK_STATUS_STYLE: Record<string, string> = {
  active: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  mitigated: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  closed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
}

const ISSUE_SEVERITY_STYLE: Record<string, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
}

export function TabRisk({ projectCode }: TabRiskProps) {
  const [risks, setRisks] = useState<ProjectRisk[]>([])
  const [issues, setIssues] = useState<IssueLog[]>([])
  const [summary, setSummary] = useState<{
    totalRisks: number
    activeRisks: number
    highRisks: number
    openIssues: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getProjectRisks(projectCode),
      getIssueLogs(projectCode),
      getRiskSummary(projectCode),
    ])
      .then(([r, i, s]) => {
        setRisks(r)
        setIssues(i)
        setSummary(s)
      })
      .catch(() => {
        setRisks([])
        setIssues([])
        setSummary(null)
      })
      .finally(() => setLoading(false))
  }, [projectCode])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 @4xl/main:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="h-20" />
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="h-48" />
        </Card>
        <Card>
          <CardContent className="h-48" />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 @4xl/main:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>风险总数</CardDescription>
            <CardTitle className="text-xl">{summary?.totalRisks ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>活跃风险</CardDescription>
            <CardTitle className="text-xl">{summary?.activeRisks ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>高风险</CardDescription>
            <CardTitle className="text-xl text-red-500">{summary?.highRisks ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>待处理问题</CardDescription>
            <CardTitle className="text-xl">{summary?.openIssues ?? 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>风险登记册</CardTitle>
          <CardDescription>已识别项目风险</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {risks.length === 0 ? (
            <p className="text-sm text-muted-foreground">暂无风险记录</p>
          ) : (
            risks.map(r => (
              <div key={r.id} className="p-3 rounded-lg border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{r.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="ghost" className={RISK_LEVEL_STYLE[r.level] ?? ''}>
                      {RISK_LEVEL_LABEL[r.level]}
                    </Badge>
                    <Badge variant="ghost" className={RISK_STATUS_STYLE[r.status] ?? ''}>
                      {r.status === 'active'
                        ? '活跃'
                        : r.status === 'mitigated'
                          ? '已缓解'
                          : '已关闭'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {r.probability && <span>概率: {r.probability}</span>}
                  {r.impact && <span>影响: {r.impact}</span>}
                  {r.assignee && <span>负责人: {r.assignee}</span>}
                </div>
                {r.mitigation && (
                  <p className="text-xs text-muted-foreground">应对: {r.mitigation}</p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>问题日志</CardTitle>
          <CardDescription>沟通与问题跟踪</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {issues.length === 0 ? (
            <p className="text-sm text-muted-foreground">暂无问题记录</p>
          ) : (
            issues.map(issue => (
              <div
                key={issue.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border"
              >
                <div>
                  <p className="text-sm font-medium">{issue.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {issue.assignee ?? '-'} · {issue.createdAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="ghost" className={ISSUE_SEVERITY_STYLE[issue.severity] ?? ''}>
                    {issue.severity === 'high'
                      ? '严重'
                      : issue.severity === 'medium'
                        ? '一般'
                        : '轻微'}
                  </Badge>
                  <Badge variant="outline">{issue.status}</Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
