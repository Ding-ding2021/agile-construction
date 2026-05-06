import { useState, useEffect, useRef, useCallback, Fragment, type MouseEvent } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { SectionCards, type MetricCardData } from '@/components/section-cards'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Search, TableIcon, Columns3, Calendar as CalendarIcon, Filter, ArrowUpDown, Layers, Settings, Plus } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { api } from '@/services/api'
import { STATUS_STYLE, SLA_STYLE, avatarColor, ALL_STATUSES } from './constants/task-styles'
import { KanbanView } from './components/kanban/KanbanView'
import { CalendarView } from './components/calendar/CalendarView'
import type { TaskItem, TaskStatus } from '@/types/task'

interface ColumnDef {
  id: string
  label: string
  defaultWidth: number
  visible: boolean
}


interface TaskListPageProps {
  onSelectTask: (task: TaskItem) => void
  refreshTrigger?: number
}

export default function TaskListPage({ onSelectTask, refreshTrigger }: TaskListPageProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const localTasksRef = useRef<TaskItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [view, setView] = useState('table')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [statusFilter, setStatusFilter] = useState<TaskStatus[]>([])
  const [slaFilter, setSlaFilter] = useState<string[]>([])
  const [sortKey, setSortKey] = useState<'plannedEndAt' | 'progress' | 'createdAt'>('plannedEndAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [groupBy, setGroupBy] = useState<string | null>(null)
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTaskMode, setNewTaskMode] = useState<'quick' | 'template'>('quick')
  const [newTaskFields, setNewTaskFields] = useState<Record<string, string>>({ name: '', status: '草稿' })
  const [extraFields, setExtraFields] = useState<{ key: string; label: string; type: 'system' | 'custom' }[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const systemFields = [
    { key: 'status', label: '流程状态', type: 'select' as const, options: ['草稿', '待分配', '待执行', '执行中'] },
    { key: 'assigneeName', label: '负责人', type: 'text' as const },
    { key: 'priority', label: '优先级', type: 'select' as const, options: ['low', 'medium', 'high', 'urgent'] },
    { key: 'plannedEndAt', label: '计划结束', type: 'date' as const },
    { key: 'plannedStartAt', label: '计划开始', type: 'date' as const },
    { key: 'description', label: '描述', type: 'text' as const },
  ]

  const templates = [
    { id: 'generic', label: '常规任务', defaults: { status: '草稿', priority: 'medium' } },
    { id: 'inspection', label: '巡检任务', defaults: { status: '待执行', priority: 'high' } },
    { id: 'acceptance', label: '验收任务', defaults: { status: '待验收', priority: 'urgent' } },
  ]

  const templateDetails: Record<string, { label: string; fields: { key: string; label: string }[] }> = {
    generic: { label: '常规任务', fields: [{ key: 'assigneeName', label: '负责人' }, { key: 'plannedEndAt', label: '计划结束' }] },
    inspection: { label: '巡检任务', fields: [{ key: 'assigneeName', label: '负责人' }, { key: 'plannedEndAt', label: '计划结束' }, { key: 'description', label: '巡检要点' }] },
    acceptance: { label: '验收任务', fields: [{ key: 'assigneeName', label: '负责人' }, { key: 'plannedEndAt', label: '计划结束' }, { key: 'description', label: '验收标准' }] },
  }

  const availableExtraFields = systemFields.filter(f => f.key !== 'status' && !extraFields.some(e => e.key === f.key))

  const addExtraField = (key: string) => {
    const field = systemFields.find(f => f.key === key)
    if (field && !extraFields.some(e => e.key === key)) {
      setExtraFields(prev => [...prev, { key: field.key, label: field.label, type: 'system' }])
      setNewTaskFields(prev => ({ ...prev, [key]: '' }))
    }
  }

  const addCustomField = () => {
    const idx = extraFields.filter(f => f.type === 'custom').length + 1
    const key = `custom_${idx}`
    setExtraFields(prev => [...prev, { key, label: `自定义字段 ${idx}`, type: 'custom' }])
    setNewTaskFields(prev => ({ ...prev, [key]: '', [`${key}_label`]: '' }))
  }

  const removeExtraField = (key: string) => {
    setExtraFields(prev => prev.filter(f => f.key !== key))
    setNewTaskFields(prev => {
      const next = { ...prev }
      delete next[key]
      delete next[`${key}_label`]
      return next
    })
  }

  const applyTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    if (templateId) {
      const tmpl = templates.find(t => t.id === templateId)
      if (tmpl) {
        setNewTaskFields(prev => ({ ...prev, ...tmpl.defaults }))
      }
    }
  }

  const renderFieldInput = (key: string, label: string) => {
    const field = systemFields.find(f => f.key === key)
    if (!field) {
      return (
        <div key={key} className="flex items-center gap-2">
          <Input className="w-28 h-8" placeholder="字段名" value={newTaskFields[`${key}_label`] || ''}
            onChange={e => setNewTaskFields(prev => ({ ...prev, [`${key}_label`]: e.target.value }))} />
          <Input className="flex-1 h-8" placeholder="值" value={newTaskFields[key] || ''}
            onChange={e => setNewTaskFields(prev => ({ ...prev, [key]: e.target.value }))} />
        </div>
      )
    }
    if (field.type === 'select' && field.options) {
      return (
        <Select value={newTaskFields[key] || ''} onValueChange={v => setNewTaskFields(prev => ({ ...prev, [key]: v }))}>
          <SelectTrigger className="h-8"><SelectValue placeholder={`选择${label}`} /></SelectTrigger>
          <SelectContent>
            {field.options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
      )
    }
    if (field.type === 'date') {
      return <Input type="date" className="h-8" value={newTaskFields[key] || ''}
        onChange={e => setNewTaskFields(prev => ({ ...prev, [key]: e.target.value }))} />
    }
    return <Input className="h-8" placeholder={`输入${label}`} value={newTaskFields[key] || ''}
      onChange={e => setNewTaskFields(prev => ({ ...prev, [key]: e.target.value }))} />
  }

  const handleCreateTask = () => {
    if (!newTaskFields.name?.trim()) return
    const task: TaskItem = {
      id: `new-${Date.now()}`,
      code: `TASK-${String(tasks.length + 1).padStart(3, '0')}`,
      name: newTaskFields.name.trim(),
      status: (newTaskFields.status as TaskStatus) || '草稿',
      owner: 'Admin',
      assigneeName: newTaskFields.assigneeName || undefined,
      projectId: '',
      projectName: newTaskFields.projectName || '',
      plannedEndAt: newTaskFields.plannedEndAt || '',
      progress: 0,
      priority: newTaskFields.priority || 'medium',
      tags: [],
    }
    localTasksRef.current = [task, ...localTasksRef.current]
    setTasks(prev => [task, ...prev])
    setNewTaskFields({ name: '', status: '草稿' })
    setExtraFields([])
    setSelectedTemplate('')
    setShowNewTask(false)
  }

  const [columnDefs, setColumnDefs] = useState<ColumnDef[]>(() => {
    try {
      const stored = localStorage.getItem('task-columns')
      if (stored) return JSON.parse(stored)
    } catch { /* ignore */ }
    return [
      { id: 'code', label: '编号', defaultWidth: 120, visible: true },
      { id: 'name', label: '任务名称', defaultWidth: 200, visible: true },
      { id: 'status', label: '流程状态', defaultWidth: 90, visible: true },
      { id: 'assignee', label: '负责人', defaultWidth: 80, visible: true },
      { id: 'plannedEndAt', label: '计划结束', defaultWidth: 100, visible: true },
      { id: 'slaStatus', label: '时效状态', defaultWidth: 80, visible: true },
      { id: 'priority', label: '优先级', defaultWidth: 60, visible: false },
      { id: 'progress', label: '进度', defaultWidth: 80, visible: false },
      { id: 'projectName', label: '所属项目', defaultWidth: 120, visible: false },
    ]
  })

  const toggleColumn = (colId: string) => {
    const updated = columnDefs.map(col =>
      col.id === colId ? { ...col, visible: !col.visible } : col
    )
    setColumnDefs(updated)
    localStorage.setItem('task-columns', JSON.stringify(updated))
  }

  const visibleColumns = columnDefs.filter(c => c.visible)

  const groupOptions = [
    { id: 'status', label: '流程状态' },
    { id: 'priority', label: '优先级' },
    { id: 'assignee', label: '负责人' },
    { id: 'slaStatus', label: '时效状态' },
    { id: 'projectName', label: '所属项目' },
  ]

  const getGroupValue = (task: TaskItem, groupId: string): string => {
    switch (groupId) {
      case 'status': return task.status
      case 'priority': return task.priority || '未设置'
      case 'assignee': return task.assigneeName || task.owner || '未分配'
      case 'slaStatus': return task.slaStatus || '正常'
      case 'projectName': return task.projectName || '未归属'
      default: return ''
    }
  }

  const filtered = tasks
    .filter(t => {
      if (statusFilter.length > 0 && !statusFilter.includes(t.status)) return false
      if (slaFilter.length > 0 && !slaFilter.includes(t.slaStatus ?? '')) return false
      return true
    })
    .filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let cmp = 0
      if (sortKey === 'plannedEndAt') cmp = (a.plannedEndAt || '').localeCompare(b.plannedEndAt || '')
      else if (sortKey === 'progress') cmp = (a.progress ?? 0) - (b.progress ?? 0)
      return sortDir === 'asc' ? cmp : -cmp
    })
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const groupedTasks = groupBy ? (() => {
    const groups = new Map<string, TaskItem[]>()
    const source = groupBy ? filtered : paged
    for (const task of source) {
      const key = getGroupValue(task, groupBy)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(task)
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
  })() : null

  const allSelected = paged.length > 0 && paged.every(t => selected.has(t.id))
  const someSelected = !allSelected && paged.some(t => selected.has(t.id))

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set([...selected].filter(id => !paged.some(t => t.id === id))))
    } else {
      setSelected(new Set([...selected, ...paged.map(t => t.id)]))
    }
  }
  const toggleOne = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const fetchTasks = useCallback(() => {
    setLoading(true)
    api.getAllTasks(1, 200)
      .then(res => setTasks([...localTasksRef.current, ...res.data]))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks, refreshTrigger])

  // Reset to page 1 when search or pageSize changes
  useEffect(() => { setPage(1) }, [search, pageSize])

  const renderCell = (task: TaskItem, colId: string) => {
    switch (colId) {
      case 'code':
        return <span className="text-xs font-mono text-muted-foreground">{task.code}</span>
      case 'name':
        return <span className="text-sm font-medium">{task.name}</span>
      case 'status':
        return (
          <Badge variant="ghost" className={"text-[11px] font-medium " + (STATUS_STYLE[task.status]?.bg ?? 'bg-zinc-100')}>
            <span className={"mr-1 size-1.5 rounded-full " + (STATUS_STYLE[task.status]?.dot ?? 'bg-zinc-400')} />
            {task.status}
          </Badge>
        )
      case 'assignee':
        return (
          <div className="flex items-center gap-2">
            <Avatar className={`size-5 ${avatarColor(task.owner || task.assigneeName || '')}`}>
              <AvatarFallback className="text-[10px] leading-none bg-inherit">{(task.assigneeName || task.owner || '?')[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{task.assigneeName || task.owner || '—'}</span>
          </div>
        )
      case 'plannedEndAt':
        return <span className="text-sm text-muted-foreground">{task.plannedEndAt?.slice(0, 10) || '—'}</span>
      case 'slaStatus':
        return (
          <Badge variant="ghost" className={"text-[11px] font-medium " + (SLA_STYLE[task.slaStatus ?? ''] ?? 'bg-zinc-100')}>
            {task.slaStatus ?? '—'}
          </Badge>
        )
      case 'priority':
        return <span className="text-sm">{task.priority || '—'}</span>
      case 'progress':
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${task.progress ?? 0}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{task.progress ?? 0}%</span>
          </div>
        )
      case 'projectName':
        return <span className="text-sm text-muted-foreground">{task.projectName || '—'}</span>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-4">
          <SectionCards className="px-0" cardSize="lg" metrics={[
            { title: '总任务', value: String(tasks.length), trend: 'neutral', description: '全部任务数量' },
            { title: '执行中', value: String(tasks.filter(t => t.status === '执行中').length), trend: 'up', trendLabel: '进行中', description: '当前正在执行的任务' },
            { title: '超时', value: String(tasks.filter(t => t.slaStatus === '超时').length), trend: 'down', trendLabel: '逾期', description: '已超过截止日期' },
            { title: '已完成', value: String(tasks.filter(t => t.status === '已完成').length), trend: 'up', trendLabel: '完成率', description: '已关闭或完成的任务' },
          ]} />

          <div className="flex items-center justify-between gap-4">
            <Tabs value={view} onValueChange={setView}>
              <TabsList>
                <TabsTrigger value="table"><TableIcon className="size-4" />表格</TabsTrigger>
                <TabsTrigger value="kanban"><Columns3 className="size-4" />看板</TabsTrigger>
                <TabsTrigger value="calendar"><CalendarIcon className="size-4" />日历</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 ml-auto">
            <InputGroup className="max-w-[180px]">
              <InputGroupAddon align="inline-start">
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="搜索任务..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </InputGroup>
            <div className="w-px h-4 bg-border" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-0.5 px-2">
                  <Filter className="size-3.5" />
                  筛选{(statusFilter.length > 0 || slaFilter.length > 0) && ` (${statusFilter.length + slaFilter.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>按状态</DropdownMenuLabel>
                  {(['草稿', '待分配', '待执行', '执行中', '已暂停', '待提交', '待验收', '不通过', '已完成', '已关闭'] as TaskStatus[]).map(s => (
                    <DropdownMenuCheckboxItem key={s} checked={statusFilter.includes(s)}
                      onCheckedChange={c => setStatusFilter(c ? [...statusFilter, s] : statusFilter.filter(x => x !== s))}>
                      {s}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>按时效</DropdownMenuLabel>
                  {['正常', '即将超时', '超时'].map(s => (
                    <DropdownMenuCheckboxItem key={s} checked={slaFilter.includes(s)}
                      onCheckedChange={c => setSlaFilter(c ? [...slaFilter, s] : slaFilter.filter(x => x !== s))}>
                      {s}
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
                <DropdownMenuCheckboxItem checked={sortKey === 'plannedEndAt' && sortDir === 'asc'}
                  onCheckedChange={() => { setSortKey('plannedEndAt'); setSortDir('asc') }}>
                  截止日期 ↑
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={sortKey === 'plannedEndAt' && sortDir === 'desc'}
                  onCheckedChange={() => { setSortKey('plannedEndAt'); setSortDir('desc') }}>
                  截止日期 ↓
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={sortKey === 'progress' && sortDir === 'asc'}
                  onCheckedChange={() => { setSortKey('progress'); setSortDir('asc') }}>
                  进度 ↑
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={sortKey === 'progress' && sortDir === 'desc'}
                  onCheckedChange={() => { setSortKey('progress'); setSortDir('desc') }}>
                  进度 ↓
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={`h-7 text-[11px] gap-0.5 px-2 ${groupBy ? 'text-primary font-medium' : ''}`}>
                  <Layers className="size-3.5" />
                  分组{groupBy ? ` (${groupOptions.find(g => g.id === groupBy)?.label})` : ''}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuCheckboxItem checked={groupBy === null}
                  onCheckedChange={() => setGroupBy(null)}>
                  不分组
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {groupOptions.map(opt => (
                  <DropdownMenuCheckboxItem key={opt.id} checked={groupBy === opt.id}
                    onCheckedChange={() => setGroupBy(opt.id)}>
                    {opt.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-px h-4 bg-border" />
            <Button size="sm" className="h-7 text-xs" onClick={() => setShowNewTask(true)}>
              <Plus className="size-3.5" />
              新建任务
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
                    <DropdownMenuCheckboxItem key={col.id} checked={col.visible}
                      onCheckedChange={() => toggleColumn(col.id)}>
                      {col.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>

          <Dialog open={showNewTask} onOpenChange={open => {
            if (!open) { setNewTaskFields({ name: '', status: '草稿' }); setExtraFields([]); setSelectedTemplate('') }
            setShowNewTask(open)
          }}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>新建任务</DialogTitle>
                <DialogDescription>选择创建方式后填写信息</DialogDescription>
              </DialogHeader>
              <div className="flex gap-1 rounded-lg bg-muted p-1 mb-2">
                <button type="button" onClick={() => { setNewTaskMode('quick'); setSelectedTemplate(''); setExtraFields([]) }}
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${newTaskMode === 'quick' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  快速新建
                </button>
                <button type="button" onClick={() => setNewTaskMode('template')}
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${newTaskMode === 'template' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  从模板创建
                </button>
              </div>
              <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto px-0.5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="task-name">任务名称 <span className="text-destructive">*</span></Label>
                  <Input id="task-name" placeholder="请输入任务名称" value={newTaskFields.name || ''}
                    onChange={e => setNewTaskFields(prev => ({ ...prev, name: e.target.value }))}
                    autoFocus
                    onKeyDown={e => { if (e.key === 'Enter' && newTaskFields.name?.trim()) handleCreateTask() }} />
                </div>
                {newTaskMode === 'template' && (
                  <div className="flex flex-col gap-2">
                    <Label>选择模板</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {templates.map(t => (
                        <button key={t.id} type="button" onClick={() => applyTemplate(t.id)}
                          className={`rounded-lg border-2 p-3 text-left transition-all hover:bg-muted/50 ${selectedTemplate === t.id ? 'border-ring' : 'border-transparent'}`}>
                          <div className="text-sm font-medium">{t.label}</div>
                          <div className="text-[11px] text-muted-foreground mt-1">
                            {templateDetails[t.id]?.fields.map(f => f.label).join('、')}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedTemplate && newTaskMode === 'template' && (
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">
                      已选模板：{templateDetails[selectedTemplate]?.label}，将为任务预填相关信息
                    </p>
                  </div>
                )}
                {extraFields.map(({ key, label, type }) => (
                  <div key={key} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Label>{label}</Label>
                      <button type="button" onClick={() => removeExtraField(key)}
                        className="text-[11px] text-muted-foreground hover:text-destructive">移除</button>
                    </div>
                    {renderFieldInput(key, label)}
                  </div>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                      + 增加字段
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-44">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>系统字段</DropdownMenuLabel>
                      {availableExtraFields.map(f => (
                        <DropdownMenuItem key={f.key} onClick={() => addExtraField(f.key)}>
                          {f.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={addCustomField}>
                      + 自定义字段
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline">取消</Button>} />
                <Button onClick={handleCreateTask} disabled={!newTaskFields.name?.trim()}>创建</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className={view === 'table' ? '' : 'hidden'}>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox checked={allSelected ? true : someSelected ? 'indeterminate' : false} onCheckedChange={toggleAll} aria-label="全选" />
                  </TableHead>
                  {visibleColumns.map(col => (
                    <ResizableHead key={col.id} defaultWidth={col.defaultWidth}>{col.label}</ResizableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={visibleColumns.length + 1} className="text-center py-12 text-muted-foreground">加载中...</TableCell></TableRow>
                ) : groupedTasks ? (
                  groupedTasks.map(([groupValue, groupItems]) => (
                    <Fragment key={groupValue}>
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={visibleColumns.length + 1} className="py-1.5 px-3">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {groupValue}
                            <span className="ml-2 font-normal text-[10px] opacity-60">({groupItems.length})</span>
                          </span>
                        </TableCell>
                      </TableRow>
                      {groupItems.map(task => (
                        <TableRow key={task.id} className="cursor-pointer" onClick={() => onSelectTask(task)}>
                          <TableCell className="h-12" onClick={e => e.stopPropagation()}>
                            <Checkbox checked={selected.has(task.id)} onCheckedChange={() => toggleOne(task.id)} aria-label={task.name} />
                          </TableCell>
                          {visibleColumns.map(col => (
                            <TableCell key={col.id} className="h-12">
                              {renderCell(task, col.id)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </Fragment>
                  ))
                ) : paged.length === 0 ? (
                  <TableRow><TableCell colSpan={visibleColumns.length + 1} className="text-center py-12 text-muted-foreground">无匹配任务</TableCell></TableRow>
                ) : (
                  paged.map(task => (
                    <TableRow key={task.id} className="cursor-pointer" onClick={() => onSelectTask(task)}>
                      <TableCell className="h-12" onClick={e => e.stopPropagation()}>
                        <Checkbox checked={selected.has(task.id)} onCheckedChange={() => toggleOne(task.id)} aria-label={task.name} />
                      </TableCell>
                      {visibleColumns.map(col => (
                        <TableCell key={col.id} className="h-12">
                          {renderCell(task, col.id)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          </div>

          {view === 'table' && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selected.size > 0 && <span className="font-medium text-foreground">已选 {selected.size} 条 / </span>}
              共 {filtered.length} 条，第 {(page-1)*pageSize+1}-{Math.min(page*pageSize, filtered.length)} 条
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="rows-per-page" className="text-sm text-muted-foreground whitespace-nowrap">每页</Label>
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
                    <PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <PaginationItem key={p}>
                      <PaginationLink onClick={() => setPage(p)} isActive={p === page} className="cursor-pointer">
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext onClick={() => setPage(p => Math.min(totalPages, p + 1))} className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
          )}

          {/* Kanban View (always mounted, CSS hidden when not active) */}
          <div className={view === 'kanban' ? '' : 'hidden'}>
            <KanbanView
              tasks={filtered}
              onSelectTask={onSelectTask}
              onUpdateTask={(taskId, updates) => {
                api.updateTask('', taskId, updates).then(() => fetchTasks())
              }}
              loading={loading}
            />
          </div>

          {/* Calendar View (always mounted, CSS hidden when not active) */}
          <div className={view === 'calendar' ? '' : 'hidden'}>
            <CalendarView
              tasks={filtered}
              onSelectTask={onSelectTask}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ResizableHead({ children, defaultWidth }: { children?: React.ReactNode; defaultWidth?: number }) {
  const [width, setWidth] = useState(defaultWidth)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startW = useRef(0)
  const thRef = useRef<HTMLTableCellElement>(null)

  const onMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault()
    dragging.current = true
    startX.current = e.clientX
    startW.current = thRef.current?.getBoundingClientRect().width ?? (defaultWidth ?? 120)

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
  }, [defaultWidth])

  return (
    <th
      ref={thRef}
      data-slot="table-head"
      className="h-12 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground relative"
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
