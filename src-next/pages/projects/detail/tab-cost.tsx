import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getCostOrders, getCostSummary } from '@/services/mock/cost'
import type { CostOrder } from '@/types/project-detail'

interface TabCostProps {
  projectCode: string
}

const ORDER_STATUS_STYLE: Record<string, string> = {
  已下单: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  审批中: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  待报价: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  已到货: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
}

export function TabCost({ projectCode }: TabCostProps) {
  const [orders, setOrders] = useState<CostOrder[]>([])
  const [summary, setSummary] = useState<{
    totalBudget: number
    totalSpent: number
    pendingApproval: number
    orderCount: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([getCostOrders(projectCode), getCostSummary(projectCode)])
      .then(([o, s]) => {
        setOrders(o)
        setSummary(s)
      })
      .catch(() => {
        setOrders([])
        setSummary(null)
      })
      .finally(() => setLoading(false))
  }, [projectCode])

  const spendPercent = summary ? Math.round((summary.totalSpent / summary.totalBudget) * 100) : 0

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
            <CardDescription>总预算</CardDescription>
            <CardTitle className="text-xl">
              {summary?.totalBudget.toLocaleString() ?? '-'}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>已支出</CardDescription>
            <CardTitle className="text-xl">{summary?.totalSpent.toLocaleString() ?? '-'}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>支出占比</CardDescription>
            <CardTitle className="text-xl">{spendPercent}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={spendPercent} className="h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>待审批</CardDescription>
            <CardTitle className="text-xl">{summary?.pendingApproval ?? 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>采购订单</CardTitle>
          <CardDescription>共 {orders.length} 条记录</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">暂无采购记录</p>
          ) : (
            <div className="space-y-2">
              {orders.map(o => (
                <div
                  key={o.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div>
                    <p className="text-sm font-medium">{o.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.category} · {o.applicant} · {o.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium tabular-nums">
                      ¥{o.amount.toLocaleString()}
                    </span>
                    <Badge variant="ghost" className={ORDER_STATUS_STYLE[o.status] ?? ''}>
                      {o.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
