import { useState, useEffect, useRef, useCallback, Fragment, type MouseEvent } from 'react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { SectionCards, type MetricCardData } from '@/components/section-cards'
import { Checkbox } from '@/components/ui/checkbox'
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Search, Filter, ArrowUpDown, Layers, Settings, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { api } from '@/services/api'
import {
  PERSON_STATUS_STYLE,
  AVAILABILITY_STYLE,
  PERSON_STATUS_LABEL,
  AVAILABILITY_LABEL,
  avatarColor,
} from './constants/personnel-styles'
import PersonnelDetailSheet from './PersonnelDetailSheet'
import type { PersonItem, PersonFormData, OrganizationItem } from '@/types/personnel'

interface ColumnDef {
  id: string
  label: string
  defaultWidth: number
  visible: boolean
}

export default function PersonnelListPage() {
  const [persons, setPersons] = useState<PersonItem[]>([])
  const [orgs, setOrgs] = useState<OrganizationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [statusFilter, setStatusFilter] = useState<number[]>([])
  const [sortKey, setSortKey] = useState<'name' | 'createdAt'>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [groupBy, setGroupBy] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [editPerson, setEditPerson] = useState<PersonItem | null>(null)
  const [detailPerson, setDetailPerson] = useState<PersonItem | null>(null)
  const [formData, setFormData] = useState<PersonFormData>({
    name: '',
    mobile: '',
    orgId: 1,
    employmentType: 1,
    personStatus: 1,
    availabilityStatus: 1,
  })

  const [columnDefs, setColumnDefs] = useState<ColumnDef[]>(() => {
    try {
      const stored = localStorage.getItem('personnel-columns')
      if (stored) return JSON.parse(stored)
    } catch {
      /* ignore */
    }
    return [
      { id: 'name', label: '姓名', defaultWidth: 140, visible: true },
      { id: 'org', label: '组织', defaultWidth: 110, visible: true },
      { id: 'title', label: '角色', defaultWidth: 100, visible: true },
      { id: 'status', label: '状态', defaultWidth: 80, visible: true },
      { id: 'availability', label: '可分配', defaultWidth: 90, visible: true },
      { id: 'taskCount', label: '任务数', defaultWidth: 80, visible: true },
      { id: 'mobile', label: '手机号', defaultWidth: 130, visible: false },
      { id: 'workCity', label: '城市', defaultWidth: 80, visible: false },
    ]
  })

  const toggleColumn = (colId: string) => {
    const updated = columnDefs.map(col =>
      col.id === colId ? { ...col, visible: !col.visible } : col
    )
    setColumnDefs(updated)
    localStorage.setItem('personnel-columns', JSON.stringify(updated))
  }

  const visibleColumns = columnDefs.filter(c => c.visible)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [pres, ors] = await Promise.all([api.getPersonnel(), api.getOrganizations()])
      setPersons(pres.data)
      setOrgs(ors.data)
    } catch (e) {
      console.error('Failed to load personnel', e)
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

  const orgMap = new Map(orgs.map(o => [o.id, o.orgName]))
  const orgName = (orgId: number) => orgMap.get(orgId) || `组织#${orgId}`

  const filtered = persons
    .filter(p => {
      if (statusFilter.length > 0 && !statusFilter.includes(p.personStatus)) return false
      return true
    })
    .filter(
      p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.mobile.includes(search) ||
        (p.title || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
      else if (sortKey === 'createdAt')
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sortDir === 'asc' ? cmp : -cmp
    })

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const groupOptions = [
    { id: 'status', label: '状态' },
    { id: 'org', label: '组织' },
    { id: 'employmentType', label: '用工类型' },
  ]

  const getGroupValue = (person: PersonItem, groupId: string): string => {
    switch (groupId) {
      case 'status':
        return PERSON_STATUS_LABEL[person.personStatus] || '未知'
      case 'org':
        return orgName(person.orgId)
      case 'employmentType':
        return person.employmentType === 1
          ? '内部'
          : person.employmentType === 2
            ? '外包'
            : '供应商'
      default:
        return ''
    }
  }

  const grouped = groupBy
    ? (() => {
        const groups = new Map<string, PersonItem[]>()
        for (const person of paged) {
          const key = getGroupValue(person, groupBy)
          if (!groups.has(key)) groups.set(key, [])
          groups.get(key)!.push(person)
        }
        return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
      })()
    : null

  const allSelected = paged.length > 0 && paged.every(p => selected.has(p.id))
  const someSelected = !allSelected && paged.some(p => selected.has(p.id))

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set([...selected].filter(id => !paged.some(p => p.id === id))))
    } else {
      setSelected(new Set([...selected, ...paged.map(p => p.id)]))
    }
  }
  const toggleOne = (id: number) => {
    const next = new Set(selected)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelected(next)
  }

  const openCreate = () => {
    setEditPerson(null)
    setFormData({
      name: '',
      mobile: '',
      orgId: orgs[0]?.id || 1,
      employmentType: 1,
      personStatus: 1,
      availabilityStatus: 1,
    })
    setShowDialog(true)
  }

  const openEdit = (person: PersonItem) => {
    setEditPerson(person)
    setFormData({
      name: person.name,
      mobile: person.mobile,
      email: person.email || undefined,
      orgId: person.orgId,
      title: person.title || undefined,
      employmentType: person.employmentType,
      personStatus: person.personStatus,
      availabilityStatus: person.availabilityStatus,
      workCity: person.workCity || undefined,
      remark: person.remark || undefined,
    })
    setShowDialog(true)
  }

  const handleDelete = async (person: PersonItem) => {
    if (!confirm(`确认禁用 ${person.name}？`)) return
    try {
      await api.deletePerson(person.id)
      loadData()
    } catch (e) {
      console.error('Failed to delete person', e)
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.mobile) return
    try {
      if (editPerson) {
        await api.updatePerson(editPerson.id, formData)
      } else {
        await api.createPerson(formData)
      }
      setShowDialog(false)
      loadData()
    } catch (e) {
      console.error('Failed to save person', e)
    }
  }

  const renderCell = (person: PersonItem, colId: string) => {
    switch (colId) {
      case 'name':
        return (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setDetailPerson(person)}
          >
            <Avatar className={`size-6 ${avatarColor(person.name)}`}>
              <AvatarFallback className="text-xs leading-none bg-inherit">
                {person.name[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hover:text-primary transition-colors">
              {person.name}
            </span>
            <span className="text-[11px] text-muted-foreground">{person.personCode}</span>
          </div>
        )
      case 'org':
        return <span className="text-sm">{orgName(person.orgId)}</span>
      case 'title':
        return <span className="text-sm">{person.title || '—'}</span>
      case 'status':
        return (
          <Badge
            variant="ghost"
            className={
              'text-[11px] font-medium ' +
              (PERSON_STATUS_STYLE[person.personStatus]?.bg ?? 'bg-zinc-100')
            }
          >
            <span
              className={
                'mr-1 size-1.5 rounded-full ' +
                (PERSON_STATUS_STYLE[person.personStatus]?.dot ?? 'bg-zinc-400')
              }
            />
            {PERSON_STATUS_LABEL[person.personStatus] || '未知'}
          </Badge>
        )
      case 'availability':
        return (
          <Badge
            variant="ghost"
            className={
              'text-[11px] font-medium ' +
              (AVAILABILITY_STYLE[person.availabilityStatus] ?? 'bg-zinc-100')
            }
          >
            {AVAILABILITY_LABEL[person.availabilityStatus] || '未知'}
          </Badge>
        )
      case 'taskCount':
        return (
          <span
            className={`text-sm ${person.criticalTaskCount > 0 ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}
          >
            {person.currentTaskCount}
            {person.criticalTaskCount > 0 ? ` (${person.criticalTaskCount})` : ''}
          </span>
        )
      case 'mobile':
        return <span className="text-sm text-muted-foreground">{person.mobile}</span>
      case 'workCity':
        return <span className="text-sm text-muted-foreground">{person.workCity || '—'}</span>
      default:
        return null
    }
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-4">
            <SectionCards
              className="px-0"
              cardSize="lg"
              metrics={
                [
                  {
                    title: '总人数',
                    value: String(persons.length),
                    trend: 'neutral',
                    description: '全部人员',
                  },
                  {
                    title: '在岗',
                    value: String(persons.filter(p => p.personStatus === 1).length),
                    trend: 'up',
                    trendLabel: '在岗率',
                    description: '当前在岗',
                  },
                  {
                    title: '可分配',
                    value: String(persons.filter(p => p.availabilityStatus === 1).length),
                    trend: 'up' as const,
                    trendLabel: '可用',
                    description: '可分配任务',
                  },
                  {
                    title: '高负载',
                    value: String(persons.filter(p => p.criticalTaskCount > 0).length),
                    trend: 'down',
                    trendLabel: '预警',
                    description: '关键任务超载',
                  },
                ] as MetricCardData[]
              }
            />

            <div className="flex items-center justify-end gap-4">
              <InputGroup className="max-w-[180px]">
                <InputGroupAddon align="inline-start">
                  <Search />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="搜索人员..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </InputGroup>
              <div className="w-px h-4 bg-border" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-0.5 px-2">
                    <Filter className="size-3.5" />
                    筛选{statusFilter.length > 0 && ` (${statusFilter.length})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>按状态</DropdownMenuLabel>
                    {[1, 2, 3, 4].map(s => (
                      <DropdownMenuCheckboxItem
                        key={s}
                        checked={statusFilter.includes(s)}
                        onCheckedChange={c =>
                          setStatusFilter(
                            c ? [...statusFilter, s] : statusFilter.filter(x => x !== s)
                          )
                        }
                      >
                        {PERSON_STATUS_LABEL[s]}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-0.5 px-2">
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
                    姓名 ↑
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortKey === 'name' && sortDir === 'desc'}
                    onCheckedChange={() => {
                      setSortKey('name')
                      setSortDir('desc')
                    }}
                  >
                    姓名 ↓
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortKey === 'createdAt' && sortDir === 'asc'}
                    onCheckedChange={() => {
                      setSortKey('createdAt')
                      setSortDir('asc')
                    }}
                  >
                    创建时间 ↑
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortKey === 'createdAt' && sortDir === 'desc'}
                    onCheckedChange={() => {
                      setSortKey('createdAt')
                      setSortDir('desc')
                    }}
                  >
                    创建时间 ↓
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 text-[11px] gap-0.5 px-2 ${groupBy ? 'text-primary font-medium' : ''}`}
                  >
                    <Layers className="size-3.5" />
                    分组{groupBy ? ` (${groupOptions.find(g => g.id === groupBy)?.label})` : ''}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuCheckboxItem
                    checked={groupBy === null}
                    onCheckedChange={() => setGroupBy(null)}
                  >
                    不分组
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  {groupOptions.map(opt => (
                    <DropdownMenuCheckboxItem
                      key={opt.id}
                      checked={groupBy === opt.id}
                      onCheckedChange={() => setGroupBy(opt.id)}
                    >
                      {opt.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="w-px h-4 bg-border" />
              <Button size="sm" className="h-7 text-xs" onClick={openCreate}>
                <Plus className="size-3.5" />
                新增人员
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="size-7 text-muted-foreground">
                    <Settings className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>显示字段</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {columnDefs.map(col => (
                      <DropdownMenuCheckboxItem
                        key={col.id}
                        checked={col.visible}
                        onCheckedChange={() => toggleColumn(col.id)}
                      >
                        {col.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editPerson ? '编辑人员' : '新增人员'}</DialogTitle>
                  <DialogDescription>
                    {editPerson ? `修改 ${editPerson.name} 的信息` : '填写人员基本信息'}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto px-0.5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>
                        姓名 <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={formData.name || ''}
                        onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                        placeholder="请输入姓名"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>
                        手机号 <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={formData.mobile || ''}
                        onChange={e => setFormData(f => ({ ...f, mobile: e.target.value }))}
                        placeholder="请输入手机号"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>邮箱</Label>
                      <Input
                        value={formData.email || ''}
                        onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                        placeholder="可选"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>岗位</Label>
                      <Input
                        value={formData.title || ''}
                        onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                        placeholder="可选"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>所属组织</Label>
                      <Select
                        value={String(formData.orgId)}
                        onValueChange={v => setFormData(f => ({ ...f, orgId: Number(v) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {orgs.map(o => (
                            <SelectItem key={o.id} value={String(o.id)}>
                              {o.orgName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>用工类型</Label>
                      <Select
                        value={String(formData.employmentType)}
                        onValueChange={v =>
                          setFormData(f => ({ ...f, employmentType: Number(v) as 1 | 2 | 3 }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">内部</SelectItem>
                          <SelectItem value="2">外包</SelectItem>
                          <SelectItem value="3">供应商</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>人员状态</Label>
                      <Select
                        value={String(formData.personStatus)}
                        onValueChange={v =>
                          setFormData(f => ({ ...f, personStatus: Number(v) as 1 | 2 | 3 | 4 }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">在岗</SelectItem>
                          <SelectItem value="2">请假</SelectItem>
                          <SelectItem value="3">离岗</SelectItem>
                          <SelectItem value="4">禁用</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>可分配状态</Label>
                      <Select
                        value={String(formData.availabilityStatus)}
                        onValueChange={v =>
                          setFormData(f => ({ ...f, availabilityStatus: Number(v) as 1 | 2 | 3 }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">可分配</SelectItem>
                          <SelectItem value="2">忙碌</SelectItem>
                          <SelectItem value="3">不可分配</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>工作城市</Label>
                      <Input
                        value={formData.workCity || ''}
                        onChange={e => setFormData(f => ({ ...f, workCity: e.target.value }))}
                        placeholder="可选"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>备注</Label>
                      <Input
                        value={formData.remark || ''}
                        onChange={e => setFormData(f => ({ ...f, remark: e.target.value }))}
                        placeholder="可选"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline">取消</Button>} />
                  <Button onClick={handleSave} disabled={!formData.name || !formData.mobile}>
                    保存
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                        onCheckedChange={toggleAll}
                        aria-label="全选"
                      />
                    </TableHead>
                    {visibleColumns.map(col => (
                      <ResizableHead key={col.id} defaultWidth={col.defaultWidth}>
                        {col.label}
                      </ResizableHead>
                    ))}
                    <TableHead className="w-24">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length + 2}
                        className="text-center py-12 text-muted-foreground"
                      >
                        加载中...
                      </TableCell>
                    </TableRow>
                  ) : grouped ? (
                    grouped.map(([groupValue, groupItems]) => (
                      <Fragment key={groupValue}>
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={visibleColumns.length + 2} className="py-1.5 px-3">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              {groupValue}
                              <span className="ml-2 font-normal text-[10px] opacity-60">
                                ({groupItems.length})
                              </span>
                            </span>
                          </TableCell>
                        </TableRow>
                        {groupItems.map(person => (
                          <TableRow key={person.id}>
                            <TableCell className="h-10">
                              <Checkbox
                                checked={selected.has(person.id)}
                                onCheckedChange={() => toggleOne(person.id)}
                                aria-label={person.name}
                              />
                            </TableCell>
                            {visibleColumns.map(col => (
                              <TableCell key={col.id} className="h-10">
                                {renderCell(person, col.id)}
                              </TableCell>
                            ))}
                            <TableCell className="h-10">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => openEdit(person)}
                                >
                                  编辑
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs text-red-500 hover:text-red-400"
                                  onClick={() => handleDelete(person)}
                                >
                                  禁用
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </Fragment>
                    ))
                  ) : paged.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length + 2}
                        className="text-center py-12 text-muted-foreground"
                      >
                        无匹配人员
                      </TableCell>
                    </TableRow>
                  ) : (
                    paged.map(person => (
                      <TableRow key={person.id}>
                        <TableCell className="h-10">
                          <Checkbox
                            checked={selected.has(person.id)}
                            onCheckedChange={() => toggleOne(person.id)}
                            aria-label={person.name}
                          />
                        </TableCell>
                        {visibleColumns.map(col => (
                          <TableCell key={col.id} className="h-10">
                            {renderCell(person, col.id)}
                          </TableCell>
                        ))}
                        <TableCell className="h-10">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => openEdit(person)}
                            >
                              编辑
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-red-500 hover:text-red-400"
                              onClick={() => handleDelete(person)}
                            >
                              禁用
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {selected.size > 0 && (
                  <span className="font-medium text-foreground">已选 {selected.size} 条 / </span>
                )}
                共 {filtered.length} 条，第 {(page - 1) * pageSize + 1}-
                {Math.min(page * pageSize, filtered.length)} 条
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="rows-per-page"
                    className="text-sm text-muted-foreground whitespace-nowrap"
                  >
                    每页
                  </Label>
                  <Select value={String(pageSize)} onValueChange={v => setPageSize(Number(v))}>
                    <SelectTrigger className="w-16 h-8" id="rows-per-page">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          onClick={() => setPage(p)}
                          isActive={p === page}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className={
                          page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PersonnelDetailSheet person={detailPerson} onClose={() => setDetailPerson(null)} />
    </>
  )
}

function ResizableHead({
  children,
  defaultWidth,
}: {
  children?: React.ReactNode
  defaultWidth?: number
}) {
  const [width, setWidth] = useState(defaultWidth)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startW = useRef(0)
  const thRef = useRef<HTMLTableCellElement>(null)

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      dragging.current = true
      startX.current = e.clientX
      startW.current = thRef.current?.getBoundingClientRect().width ?? defaultWidth ?? 120

      const onMouseMove = (ev: globalThis.MouseEvent) => {
        if (!dragging.current) return
        const diff = ev.clientX - startX.current
        const newW = Math.max(40, startW.current + diff)
        setWidth(newW)
      }

      const onMouseUp = () => {
        dragging.current = false
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    },
    [defaultWidth]
  )

  return (
    <th
      ref={thRef}
      data-slot="table-head"
      className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground relative"
      style={{ width: width ? `${width}px` : undefined }}
    >
      {children}
      <div
        className="absolute right-0 top-1 bottom-1 w-px cursor-col-resize bg-border hover:bg-foreground/30 active:bg-foreground/40 z-10"
        onMouseDown={onMouseDown}
      />
    </th>
  )
}
