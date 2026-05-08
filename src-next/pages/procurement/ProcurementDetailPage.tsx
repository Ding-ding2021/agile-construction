import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import { getProcurement } from '@/services/api'
import type { ProcurementOrder } from '@/types/procurement'
import {
  PROCUREMENT_STATUS_OPTIONS,
  PROCUREMENT_STATUS_STYLE,
  PRIORITY_OPTIONS,
  PRIORITY_STYLE,
} from '@/types/procurement'

export default function ProcurementDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<ProcurementOrder | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await getProcurement(Number(id))
      setOrder(res)
    } catch (e) {
      console.error('Failed to load procurement detail', e)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">加载中...</div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        采购单不存在
      </div>
    )
  }

  const currentIndex = PROCUREMENT_STATUS_OPTIONS.findIndex(s => s.value === order.status)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/procurement')}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">{order.title}</h1>
          <p className="text-sm text-muted-foreground">{order.orderCode}</p>
        </div>
      </div>

      {/* 状态进展 */}
      <Card>
        <CardHeader>
          <CardTitle>进展情况</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1">
            {PROCUREMENT_STATUS_OPTIONS.map((s, i) => {
              const isDone = i <= currentIndex
              const isCurrent = i === currentIndex
              return (
                <div key={s.value} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`size-3 rounded-full transition-colors ${
                        isCurrent
                          ? 'ring-2 ring-offset-1 ring-blue-500 bg-blue-500'
                          : isDone
                            ? 'bg-emerald-500'
                            : 'bg-zinc-300'
                      }`}
                    />
                    <span
                      className={`text-[10px] whitespace-nowrap ${
                        isCurrent
                          ? 'font-semibold text-blue-600'
                          : isDone
                            ? 'text-emerald-600'
                            : 'text-zinc-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < PROCUREMENT_STATUS_OPTIONS.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-1 ${
                        i < currentIndex ? 'bg-emerald-400' : 'bg-zinc-200'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">订单编码</Label>
              <p className="mt-1">{order.orderCode}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">项目编码</Label>
              <p className="mt-1">{order.projectCode || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">供应商 ID</Label>
              <p className="mt-1">{order.supplierId}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">类目 ID</Label>
              <p className="mt-1">{order.categoryId ?? '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">数量</Label>
              <p className="mt-1">
                {order.quantity} {order.unit}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">预算金额</Label>
              <p className="mt-1">
                {order.budgetAmount != null ? `¥${order.budgetAmount.toLocaleString()}` : '—'}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">实际金额</Label>
              <p className="mt-1">
                {order.actualAmount != null ? `¥${order.actualAmount.toLocaleString()}` : '—'}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">状态</Label>
              <p className="mt-1">
                <Badge
                  variant="ghost"
                  className={`text-[11px] font-medium ${PROCUREMENT_STATUS_STYLE[order.status]}`}
                >
                  {PROCUREMENT_STATUS_OPTIONS.find(s => s.value === order.status)?.label ||
                    order.status}
                </Badge>
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">优先级</Label>
              <p className="mt-1">
                <Badge
                  variant="ghost"
                  className={`text-[11px] font-medium ${PRIORITY_STYLE[order.priority]}`}
                >
                  {PRIORITY_OPTIONS.find(p => p.value === order.priority)?.label || order.priority}
                </Badge>
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">申请人</Label>
              <p className="mt-1">{order.applicantName || order.applicant || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">负责人</Label>
              <p className="mt-1">{order.assignee || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">关联任务</Label>
              <p className="mt-1">{order.taskCode || '—'}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground">描述</Label>
              <p className="mt-1">{order.description || '—'}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-muted-foreground">备注</Label>
              <p className="mt-1">{order.remark || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">期望到货日期</Label>
              <p className="mt-1">{order.expectedDate || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">实际到货日期</Label>
              <p className="mt-1">{order.deliveredDate || '—'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">创建时间</Label>
              <p className="mt-1">
                {order.createdAt ? new Date(order.createdAt).toLocaleString('zh-CN') : '—'}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">更新时间</Label>
              <p className="mt-1">
                {order.updatedAt ? new Date(order.updatedAt).toLocaleString('zh-CN') : '—'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
