import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getQualityItems, getQualitySummary } from '@/services/mock/quality'
import type { QualityCheckItem } from '@/types/project-detail'

interface TabQualityProps {
  projectCode: string
}

const QUALITY_STATUS_STYLE: Record<string, string> = {
  pass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  fail: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
}

const QUALITY_LABEL: Record<string, string> = {
  pass: '通过',
  fail: '不合格',
  pending: '待检查',
}

export function TabQuality({ projectCode }: TabQualityProps) {
  const [items, setItems] = useState<QualityCheckItem[]>([])
  const [summary, setSummary] = useState<{
    total: number
    passed: number
    failed: number
    pending: number
    passRate: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([getQualityItems(projectCode), getQualitySummary(projectCode)])
      .then(([i, s]) => {
        setItems(i)
        setSummary(s)
      })
      .catch(() => {
        setItems([])
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
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 @4xl/main:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>检查项总数</CardDescription>
            <CardTitle className="text-xl">{summary?.total ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>通过</CardDescription>
            <CardTitle className="text-xl text-emerald-500">{summary?.passed ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>不合格</CardDescription>
            <CardTitle className="text-xl text-red-500">{summary?.failed ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>通过率</CardDescription>
            <CardTitle className="text-xl">{summary?.passRate ?? 0}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={summary?.passRate ?? 0} className="h-1.5" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>检查项明细</CardTitle>
          <CardDescription>质量验收检查清单</CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">暂无检查记录</p>
          ) : (
            <div className="space-y-2">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.category} · {item.inspector}
                      {item.checkedAt ? ` · ${item.checkedAt}` : ''}
                    </p>
                  </div>
                  <Badge variant="ghost" className={QUALITY_STATUS_STYLE[item.status] ?? ''}>
                    {QUALITY_LABEL[item.status]}
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
