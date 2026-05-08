import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { SectionCards, type MetricCardData } from '@/components/section-cards'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
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
import { Search, Plus } from 'lucide-react'
import { getStandards, createStandard } from '@/services/api'
import type { StandardItem } from '@/types/standard'
import {
  SOURCE_TYPE_OPTIONS,
  STANDARD_STATUS_OPTIONS,
  STANDARD_STATUS_STYLE,
} from '@/types/standard'

const PAGE_SIZE = 10

export default function StandardListPage() {
  const navigate = useNavigate()
  const [allItems, setAllItems] = useState<StandardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [page, setPage] = useState(1)

  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newSourceType, setNewSourceType] = useState('brand')
  const [newBrand, setNewBrand] = useState('')
  const [newStoreType, setNewStoreType] = useState('')
  const [creating, setCreating] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getStandards()
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
    const matchSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase())
    const matchSource = sourceFilter === 'all' || item.sourceType === sourceFilter
    return matchSearch && matchSource
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const metrics: MetricCardData[] = [
    {
      title: '标准总数',
      value: String(allItems.length),
      trend: 'neutral' as const,
      description: '全部标准',
    },
    {
      title: '生效中',
      value: String(allItems.filter(i => i.status === 'active').length),
      trend: 'up' as const,
      description: '可用标准',
    },
    {
      title: '草稿',
      value: String(allItems.filter(i => i.status === 'draft').length),
      trend: 'neutral' as const,
      description: '待发布',
    },
  ]

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      await createStandard({
        name: newName.trim(),
        sourceType: newSourceType,
        brand: newBrand.trim() || undefined,
        storeType: newStoreType.trim() || undefined,
      })
      setShowCreate(false)
      setNewName('')
      setNewSourceType('brand')
      setNewBrand('')
      setNewStoreType('')
      await loadData()
    } catch (err) {
      console.warn('Failed to create standard:', err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">标准管理</h1>
          <p className="text-sm text-muted-foreground mt-0.5">管理营建标准、条款和规则项</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="size-4 mr-1" /> 新建标准
        </Button>
      </div>

      <SectionCards metrics={metrics} cardSize="lg" />

      <div className="flex items-center gap-3">
        <InputGroup className="flex-1">
          <InputGroupAddon>
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="搜索标准名称或编码..."
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </InputGroup>
        <Select
          value={sourceFilter}
          onValueChange={v => {
            setSourceFilter(v ?? 'all')
            setPage(1)
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="来源类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部来源</SelectItem>
            {SOURCE_TYPE_OPTIONS.map(opt => (
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
              <TableHead className="bg-muted/60">编码</TableHead>
              <TableHead className="bg-muted/60">名称</TableHead>
              <TableHead className="bg-muted/60">品牌</TableHead>
              <TableHead className="bg-muted/60">店型</TableHead>
              <TableHead className="bg-muted/60">来源</TableHead>
              <TableHead className="bg-muted/60">状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                  加载中...
                </TableCell>
              </TableRow>
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                  {search ? '无匹配标准' : '暂无标准，点击"新建标准"创建'}
                </TableCell>
              </TableRow>
            ) : (
              paged.map(item => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/standards/${item.id}`)}
                >
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {item.code}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.brand || '-'}</TableCell>
                  <TableCell>{item.storeType || '-'}</TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {SOURCE_TYPE_OPTIONS.find(o => o.value === item.sourceType)?.label ??
                        item.sourceType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="ghost" className={STANDARD_STATUS_STYLE[item.status] ?? ''}>
                      {STANDARD_STATUS_OPTIONS.find(o => o.value === item.status)?.label ??
                        item.status}
                    </Badge>
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
            <DialogTitle>新建标准</DialogTitle>
            <DialogDescription>创建新的标准来源，可后续添加条款和规则项</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>
                标准名称 <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="如：肯德基门店装修标准"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                来源类型 <span className="text-destructive">*</span>
              </Label>
              <Select value={newSourceType} onValueChange={v => setNewSourceType(v ?? 'brand')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_TYPE_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>品牌</Label>
                <Input
                  placeholder="如：肯德基"
                  value={newBrand}
                  onChange={e => setNewBrand(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>店型</Label>
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
