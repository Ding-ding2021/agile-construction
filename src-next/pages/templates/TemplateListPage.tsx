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
import { SectionCards, type MetricCardData } from '@/components/section-cards'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Search, Plus } from 'lucide-react'
import { getTemplates, createTemplate } from '@/services/api'
import type { ProjectTemplate } from '@/types/template'
import { TEMPLATE_STATUS_STYLE, TEMPLATE_STATUS_OPTIONS } from '@/types/template'

const PAGE_SIZE = 10

export default function TemplateListPage() {
  const navigate = useNavigate()
  const [allItems, setAllItems] = useState<ProjectTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newBrand, setNewBrand] = useState('')
  const [newStoreType, setNewStoreType] = useState('')
  const [creating, setCreating] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getTemplates()
      setAllItems(res.data)
    } catch {
      setAllItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filtered = allItems.filter(item => {
    const matchSearch = !search || item.templateName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || item.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const metrics: MetricCardData[] = [
    {
      title: '模板总数',
      value: String(allItems.length),
      trend: 'neutral',
      description: '项目模板',
    },
    {
      title: '生效中',
      value: String(allItems.filter(i => i.status === 'active').length),
      trend: 'up',
      description: '可用模板',
    },
    {
      title: '草稿',
      value: String(allItems.filter(i => i.status === 'draft').length),
      trend: 'neutral',
      description: '待发布',
    },
  ]

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      await createTemplate({
        templateName: newName.trim(),
        brand: newBrand.trim(),
        storeType: newStoreType.trim(),
        status: 'draft',
      })
      setShowCreate(false)
      setNewName('')
      setNewBrand('')
      setNewStoreType('')
      await loadData()
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">模板中心</h1>
          <p className="text-sm text-muted-foreground mt-0.5">管理项目模板和任务模板</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="size-4 mr-1" />
          新建模板
        </Button>
      </div>

      <SectionCards metrics={metrics} cardSize="lg" />

      <div className="flex items-center gap-3">
        <InputGroup>
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="搜索模板名称..."
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </InputGroup>
        <Select
          value={statusFilter}
          onValueChange={v => {
            setStatusFilter(v ?? 'all')
            setPage(1)
          }}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            {TEMPLATE_STATUS_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-muted/60">模板名称</TableHead>
              <TableHead className="bg-muted/60">编码</TableHead>
              <TableHead className="bg-muted/60">品牌</TableHead>
              <TableHead className="bg-muted/60">店型</TableHead>
              <TableHead className="bg-muted/60">版本</TableHead>
              <TableHead className="bg-muted/60">状态</TableHead>
              <TableHead className="text-right bg-muted/60">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                  加载中...
                </TableCell>
              </TableRow>
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                  {search ? '无匹配模板' : '暂无模板，点击"新建模板"创建'}
                </TableCell>
              </TableRow>
            ) : (
              paged.map(item => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/templates/${item.id}`)}
                >
                  <TableCell className="font-medium">{item.templateName}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {item.templateCode}
                  </TableCell>
                  <TableCell>{item.brand || '-'}</TableCell>
                  <TableCell>{item.storeType || '-'}</TableCell>
                  <TableCell className="text-xs">{item.templateVersion}</TableCell>
                  <TableCell>
                    <Badge variant="ghost" className={TEMPLATE_STATUS_STYLE[item.status] ?? ''}>
                      {TEMPLATE_STATUS_OPTIONS.find(o => o.value === item.status)?.label ??
                        item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={e => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => navigate(`/templates/${item.id}`)}
                      >
                        <Search className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => setPage(p => Math.min(totalPages, p + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建项目模板</DialogTitle>
            <DialogDescription>创建新的项目模板，可后续绑定任务模板</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>模板名称 *</Label>
              <Input
                placeholder="如：标准门店装修"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>适用品牌</Label>
                <Input
                  placeholder="如：肯德基"
                  value={newBrand}
                  onChange={e => setNewBrand(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>适用店型</Label>
                <Input
                  placeholder="如：标准店"
                  value={newStoreType}
                  onChange={e => setNewStoreType(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              取消
            </Button>
            <Button onClick={handleCreate} disabled={!newName.trim() || creating}>
              {creating ? '创建中...' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
