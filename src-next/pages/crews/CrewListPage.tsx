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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Search, Filter, ArrowUpDown, Plus } from 'lucide-react'
import { TaskPaginationBar } from '@/pages/tasks/components/TaskPaginationBar'
import { getCrews, createCrew, updateCrew, deleteCrew } from '@/services/api'
import type { CrewItem, CrewFormData, CrewStatus } from '@/types/crew'
import { CREW_STATUS_LABEL, CREW_RATING_OPTIONS } from '@/types/crew'

export default function CrewListPage() {
  const navigate = useNavigate()
  const [crews, setCrews] = useState<CrewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [sortKey, setSortKey] = useState<'name'>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [showDialog, setShowDialog] = useState(false)
  const [editCrew, setEditCrew] = useState<CrewItem | null>(null)
  const [formData, setFormData] = useState<CrewFormData>({ name: '' })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getCrews()
      setCrews(res.data)
    } catch (e) {
      console.error('Failed to load crews', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
  useEffect(() => {
    setPage(1)
  }, [search, pageSize])

  const filtered = crews
    .filter(c => {
      if (statusFilter.length > 0 && !statusFilter.includes(c.status)) return false
      return true
    })
    .filter(
      c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        (c.leaderName || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const cmp = a.name.localeCompare(b.name)
      return sortDir === 'asc' ? cmp : -cmp
    })

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const openCreate = () => {
    setEditCrew(null)
    setFormData({ name: '' })
    setShowDialog(true)
  }

  const openEdit = (crew: CrewItem) => {
    setEditCrew(crew)
    setFormData({
      name: crew.name,
      leaderName: crew.leaderName || undefined,
      leaderPhone: crew.leaderPhone || undefined,
      rating: crew.rating || undefined,
      status: crew.status,
      speciality: crew.speciality || undefined,
      workCities: crew.workCities || undefined,
    })
    setShowDialog(true)
  }

  const handleDelete = async (crew: CrewItem) => {
    if (!confirm(`确认删除工队 ${crew.name}？`)) return
    try {
      await deleteCrew(crew.id)
      loadData()
    } catch (e) {
      console.error('Failed to delete crew', e)
    }
  }

  const handleSave = async () => {
    if (!formData.name) return
    try {
      if (editCrew) {
        await updateCrew(editCrew.id, formData)
      } else {
        await createCrew(formData)
      }
      setShowDialog(false)
      loadData()
    } catch (e) {
      console.error('Failed to save crew', e)
    }
  }

  const statusColor = (status: string) => {
    if (status === 'active') return { bg: 'bg-emerald-500/10', dot: 'bg-emerald-400' }
    return { bg: 'bg-zinc-500/10', dot: 'bg-zinc-400' }
  }

  const ratingBadge = (rating: string | null) => {
    if (!rating) return null
    const colors: Record<string, string> = {
      优秀: 'bg-amber-500/10 text-amber-400',
      良好: 'bg-blue-500/10 text-blue-400',
      一般: 'bg-zinc-500/10 text-zinc-400',
    }
    return (
      <Badge
        variant="ghost"
        className={`text-[11px] font-medium ${colors[rating] || 'bg-zinc-500/10'}`}
      >
        {rating}
      </Badge>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-4">
          <SectionCards
            className="px-0"
            cardSize="lg"
            metrics={
              [
                {
                  title: '工队总数',
                  value: String(crews.length),
                  trend: 'neutral',
                  description: '全部工队',
                },
                {
                  title: '启用',
                  value: String(crews.filter(c => c.status === 'active').length),
                  trend: 'up',
                  trendLabel: '活跃率',
                  description: '当前启用',
                },
                {
                  title: '停用',
                  value: String(crews.filter(c => c.status === 'inactive').length),
                  trend: 'neutral',
                  description: '已停用',
                },
                {
                  title: '成员合计',
                  value: String(crews.reduce((s, c) => s + c.memberCount, 0)),
                  trend: 'neutral',
                  trendLabel: '总人数',
                  description: '全部工队成员',
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
                placeholder="搜索工队..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </InputGroup>
            <div className="w-px h-4 bg-border" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-0.5 px-2 text-muted-foreground"
                >
                  <Filter className="size-3.5" />
                  筛选{statusFilter.length > 0 && ` (${statusFilter.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>按状态</DropdownMenuLabel>
                  {(['active', 'inactive'] as CrewStatus[]).map(s => (
                    <DropdownMenuCheckboxItem
                      key={s}
                      checked={statusFilter.includes(s)}
                      onCheckedChange={c =>
                        setStatusFilter(
                          c ? [...statusFilter, s] : statusFilter.filter(x => x !== s)
                        )
                      }
                    >
                      {CREW_STATUS_LABEL[s]}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-0.5 px-2 text-muted-foreground"
                >
                  <ArrowUpDown className="size-3.5" />
                  排序
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuCheckboxItem
                  checked={sortKey === 'name' && sortDir === 'asc'}
                  onCheckedChange={() => {
                    setSortKey('name')
                    setSortDir('asc')
                  }}
                >
                  名称 ↑
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={sortKey === 'name' && sortDir === 'desc'}
                  onCheckedChange={() => {
                    setSortKey('name')
                    setSortDir('desc')
                  }}
                >
                  名称 ↓
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="h-7 text-xs" onClick={openCreate}>
              <Plus className="size-3.5" />
              新增工队
            </Button>
          </div>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editCrew ? '编辑工队' : '新增工队'}</DialogTitle>
                <DialogDescription>
                  {editCrew ? `修改 ${editCrew.name} 的信息` : '填写工队基本信息'}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto px-0.5">
                <div className="flex flex-col gap-2">
                  <Label>
                    工队名称 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={formData.name || ''}
                    onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                    placeholder="请输入工队名称"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>负责人</Label>
                    <Input
                      value={formData.leaderName || ''}
                      onChange={e => setFormData(f => ({ ...f, leaderName: e.target.value }))}
                      placeholder="可选"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>负责人电话</Label>
                    <Input
                      value={formData.leaderPhone || ''}
                      onChange={e => setFormData(f => ({ ...f, leaderPhone: e.target.value }))}
                      placeholder="可选"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>评级</Label>
                    <Select
                      value={formData.rating || ''}
                      onValueChange={v => setFormData(f => ({ ...f, rating: v || undefined }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="不限" />
                      </SelectTrigger>
                      <SelectContent>
                        {CREW_RATING_OPTIONS.map(r => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>状态</Label>
                    <Select
                      value={formData.status || 'active'}
                      onValueChange={v => setFormData(f => ({ ...f, status: v as CrewStatus }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">启用</SelectItem>
                        <SelectItem value="inactive">停用</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>专长领域</Label>
                  <Input
                    value={formData.speciality || ''}
                    onChange={e => setFormData(f => ({ ...f, speciality: e.target.value }))}
                    placeholder="可选"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>工作城市（逗号分隔）</Label>
                  <Input
                    value={formData.workCities || ''}
                    onChange={e => setFormData(f => ({ ...f, workCities: e.target.value }))}
                    placeholder="如：北京,上海,广州"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline">取消</Button>} />
                <Button onClick={handleSave} disabled={!formData.name}>
                  保存
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px] bg-muted/60">工队名称</TableHead>
                  <TableHead className="w-[100px] bg-muted/60">编码</TableHead>
                  <TableHead className="w-[100px] bg-muted/60">负责人</TableHead>
                  <TableHead className="w-[60px] bg-muted/60">人数</TableHead>
                  <TableHead className="w-[70px] bg-muted/60">评级</TableHead>
                  <TableHead className="w-[70px] bg-muted/60">状态</TableHead>
                  <TableHead className="w-[120px] bg-muted/60">专长</TableHead>
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
                      无匹配工队
                    </TableCell>
                  </TableRow>
                ) : (
                  paged.map(crew => (
                    <TableRow key={crew.id}>
                      <TableCell>
                        <span
                          className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                          onClick={() => navigate(`/crews/${crew.id}`)}
                        >
                          {crew.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{crew.code}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{crew.leaderName || '—'}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{crew.memberCount}</span>
                      </TableCell>
                      <TableCell>{ratingBadge(crew.rating)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="ghost"
                          className={`text-[11px] font-medium ${statusColor(crew.status).bg}`}
                        >
                          <span
                            className={`mr-1 size-1.5 rounded-full ${statusColor(crew.status).dot}`}
                          />
                          {CREW_STATUS_LABEL[crew.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {crew.speciality || '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => openEdit(crew)}
                          >
                            编辑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-red-500 hover:text-red-400"
                            onClick={() => handleDelete(crew)}
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
        </div>
      </div>
    </div>
  )
}
