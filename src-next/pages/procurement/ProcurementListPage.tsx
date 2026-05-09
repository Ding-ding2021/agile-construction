import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { PageLayout } from '@/components/page-layout'
import { SectionCards, type MetricCardData } from '@/components/section-cards'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Search, Plus } from 'lucide-react'
import { TaskPaginationBar } from '@/pages/tasks/components/TaskPaginationBar'
import {
  getProcurements,
  createProcurement,
  updateProcurement,
  deleteProcurement,
  getSuppliers,
} from '@/services/api'
import type { ProcurementOrder, ProcurementFormData, Supplier } from '@/types/procurement'
import {
  PROCUREMENT_STATUS_OPTIONS,
  PROCUREMENT_STATUS_STYLE,
  PRIORITY_OPTIONS,
  PRIORITY_STYLE,
} from '@/types/procurement'

export default function ProcurementListPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<ProcurementOrder[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [editOrder, setEditOrder] = useState<ProcurementOrder | null>(null)
  const [formData, setFormData] = useState<ProcurementFormData>({
    title: '',
    projectCode: '',
    supplierId: null,
    quantity: 0,
    unit: '',
    priority: 'medium',
    applicant: '',
    applicantName: '',
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [ordersRes, suppliersRes] = await Promise.all([getProcurements(), getSuppliers()])
      setOrders(ordersRes.data)
      setSuppliers(suppliersRes.data)
    } catch (e) {
      console.error('Failed to load procurements', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
  useEffect(() => {
    setPage(1)
  }, [search, pageSize, statusFilter, priorityFilter])

  const filtered = orders
    .filter(o => {
      if (statusFilter && statusFilter !== 'all' && o.status !== statusFilter) return false
      if (priorityFilter && priorityFilter !== 'all' && o.priority !== priorityFilter) return false
      return true
    })
    .filter(
      o =>
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        o.orderCode.toLowerCase().includes(search.toLowerCase())
    )

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const openCreate = () => {
    setEditOrder(null)
    setFormData({
      title: '',
      projectCode: '',
      supplierId: null,
      quantity: 0,
      unit: '',
      priority: 'medium',
      applicant: '',
      applicantName: '',
    })
    setShowDialog(true)
  }

  const openEdit = (order: ProcurementOrder) => {
    setEditOrder(order)
    setFormData({
      title: order.title,
      projectCode: order.projectCode,
      supplierId: order.supplierId,
      categoryId: order.categoryId,
      quantity: order.quantity,
      unit: order.unit,
      budgetAmount: order.budgetAmount,
      priority: order.priority,
      applicant: order.applicant,
      applicantName: order.applicantName,
      description: order.description,
      expectedDate: order.expectedDate,
    })
    setShowDialog(true)
  }

  const handleDelete = async (order: ProcurementOrder) => {
    if (!confirm(`确认删除采购单 ${order.title}？`)) return
    try {
      await deleteProcurement(order.id)
      loadData()
    } catch (e) {
      console.error('Failed to delete procurement', e)
    }
  }

  const handleSave = async () => {
    if (!formData.title) return
    try {
      if (editOrder) {
        await updateProcurement(editOrder.id, formData as unknown as Record<string, unknown>)
      } else {
        await createProcurement(formData as unknown as Record<string, unknown>)
      }
      setShowDialog(false)
      loadData()
    } catch (e) {
      console.error('Failed to save procurement', e)
    }
  }

  return (
    <PageLayout>
      <SectionCards
        className="px-0"
        cardSize="lg"
        metrics={
          [
            {
              title: '采购单总数',
              value: String(orders.length),
              trend: 'neutral',
              description: '全部采购单',
            },
            {
              title: '待审批',
              value: String(orders.filter(o => o.status === 'pending').length),
              trend: 'up',
              trendLabel: '待处理',
              description: '等待审批',
            },
            {
              title: '待下单',
              value: String(orders.filter(o => o.status === 'approved').length),
              trend: 'neutral',
              description: '已批准待下单',
            },
            {
              title: '已完成',
              value: String(orders.filter(o => o.status === 'closed').length),
              trend: 'down',
              trendLabel: '已完成',
              description: '已关闭',
            },
          ] as MetricCardData[]
        }
      />

      <div className="flex items-center justify-end gap-2">
        <InputGroup className="max-w-[180px]">
          <InputGroupAddon align="inline-start">
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="搜索订单编码/标题..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </InputGroup>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v ?? 'all')}>
          <SelectTrigger className="w-[110px] h-7 text-xs">
            <SelectValue placeholder="全部状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            {PROCUREMENT_STATUS_OPTIONS.map(s => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={v => setPriorityFilter(v ?? 'all')}>
          <SelectTrigger className="w-[100px] h-7 text-xs">
            <SelectValue placeholder="全部优先级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部优先级</SelectItem>
            {PRIORITY_OPTIONS.map(p => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" className="h-7 text-xs" onClick={openCreate}>
          <Plus className="size-3.5" />
          新增采购单
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editOrder ? '编辑采购单' : '新增采购单'}</DialogTitle>
            <DialogDescription>
              {editOrder ? `修改 ${editOrder.title}` : '填写采购单基本信息'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto px-0.5">
            <div className="flex flex-col gap-2">
              <Label>
                标题 <span className="text-destructive">*</span>
              </Label>
              <Input
                value={formData.title}
                onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                placeholder="请输入采购标题"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>项目编码</Label>
                <Input
                  value={formData.projectCode}
                  onChange={e => setFormData(f => ({ ...f, projectCode: e.target.value }))}
                  placeholder="可选"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>
                  供应商 <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.supplierId ? String(formData.supplierId) : ''}
                  onValueChange={v =>
                    setFormData(f => ({ ...f, supplierId: v ? Number(v) : null }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>数量</Label>
                <Input
                  type="number"
                  value={formData.quantity || ''}
                  onChange={e => setFormData(f => ({ ...f, quantity: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>单位</Label>
                <Input
                  value={formData.unit}
                  onChange={e => setFormData(f => ({ ...f, unit: e.target.value }))}
                  placeholder="如：个/套/米"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>预算金额</Label>
                <Input
                  type="number"
                  value={formData.budgetAmount ?? ''}
                  onChange={e =>
                    setFormData(f => ({
                      ...f,
                      budgetAmount: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  placeholder="可选"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>
                  优先级 <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={v => v && setFormData(f => ({ ...f, priority: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map(p => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>申请人编码</Label>
                <Input
                  value={formData.applicant}
                  onChange={e => setFormData(f => ({ ...f, applicant: e.target.value }))}
                  placeholder="可选"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>申请人姓名</Label>
                <Input
                  value={formData.applicantName}
                  onChange={e => setFormData(f => ({ ...f, applicantName: e.target.value }))}
                  placeholder="可选"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>描述</Label>
              <Input
                value={formData.description || ''}
                onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                placeholder="可选"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>期望到货日期</Label>
              <Input
                type="date"
                value={formData.expectedDate || ''}
                onChange={e => setFormData(f => ({ ...f, expectedDate: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">取消</Button>} />
            <Button onClick={handleSave} disabled={!formData.title}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] bg-muted/60">订单编码</TableHead>
              <TableHead className="w-[180px] bg-muted/60">标题</TableHead>
              <TableHead className="w-[100px] bg-muted/60">金额</TableHead>
              <TableHead className="w-[80px] bg-muted/60">状态</TableHead>
              <TableHead className="w-[70px] bg-muted/60">优先级</TableHead>
              <TableHead className="w-[80px] bg-muted/60">申请人</TableHead>
              <TableHead className="w-[100px] bg-muted/60">创建日期</TableHead>
              <TableHead className="w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  加载中...
                </TableCell>
              </TableRow>
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  无匹配采购单
                </TableCell>
              </TableRow>
            ) : (
              paged.map(order => (
                <TableRow key={order.id}>
                  <TableCell>
                    <span
                      className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                      onClick={() => navigate(`/procurement/${order.id}`)}
                    >
                      {order.orderCode}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{order.title}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {order.budgetAmount != null ? `¥${order.budgetAmount.toLocaleString()}` : '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="ghost"
                      className={`text-[11px] font-medium ${PROCUREMENT_STATUS_STYLE[order.status]}`}
                    >
                      {PROCUREMENT_STATUS_OPTIONS.find(s => s.value === order.status)?.label ||
                        order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="ghost"
                      className={`text-[11px] font-medium ${PRIORITY_STYLE[order.priority]}`}
                    >
                      {PRIORITY_OPTIONS.find(p => p.value === order.priority)?.label ||
                        order.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{order.applicantName || order.applicant || '—'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('zh-CN')
                        : '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => openEdit(order)}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-red-500 hover:text-red-400"
                        onClick={() => handleDelete(order)}
                      >
                        删除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TaskPaginationBar
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        total={filtered.length}
        rangeStart={(page - 1) * pageSize + 1}
        rangeEnd={Math.min(page * pageSize, filtered.length)}
        selectedCount={0}
      />
    </PageLayout>
  )
}
