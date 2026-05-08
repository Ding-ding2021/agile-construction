import { useState, useEffect, useMemo } from 'react'
import { SectionCards, type MetricCardData } from '@/components/section-cards'
import { KanbanView } from '@/pages/tasks/components/kanban/KanbanView'
import { CalendarView } from '@/pages/tasks/components/calendar/CalendarView'
import { TaskToolbar } from '@/pages/tasks/components/TaskToolbar'
import { TaskTableView } from '@/pages/tasks/components/TaskTableView'
import { TaskPaginationBar } from '@/pages/tasks/components/TaskPaginationBar'
import type { TaskItem, TaskStatus } from '@/types/task'

interface ColumnDef {
  id: string
  label: string
  defaultWidth: number
  visible: boolean
}

const defaultColumnDefs: ColumnDef[] = [
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

interface TaskListProps {
  tasks: TaskItem[]
  loading: boolean
  onSelectTask: (task: TaskItem) => void
  onNewTask?: () => void
  className?: string
  compact?: boolean
}

export function TaskList({
  tasks,
  loading,
  onSelectTask,
  onNewTask,
  className,
  compact,
}: TaskListProps) {
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
  const [columnDefs, setColumnDefs] = useState<ColumnDef[]>(defaultColumnDefs)

  const allSelected = tasks.length > 0 && selected.size === tasks.length

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set())
      return
    }
    setSelected(new Set(tasks.filter(t => t.id != null).map(t => String(t.id))))
  }

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleColumn = (colId: string) => {
    setColumnDefs(prev =>
      prev.map(col => (col.id === colId ? { ...col, visible: !col.visible } : col))
    )
  }

  const filtered = useMemo(() => {
    let list = tasks
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q))
    }
    if (statusFilter.length > 0) list = list.filter(t => statusFilter.includes(t.status))
    if (slaFilter.length > 0) list = list.filter(t => slaFilter.includes(t.slaStatus ?? ''))
    if (sortKey) {
      list = [...list].sort((a, b) => {
        const av = String(a[sortKey as keyof TaskItem] ?? '')
        const bv = String(b[sortKey as keyof TaskItem] ?? '')
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      })
    }
    return list
  }, [tasks, search, statusFilter, slaFilter, sortKey, sortDir])

  const groupedTasks = useMemo(() => {
    if (!groupBy) return null
    const groupMap = new Map<string, TaskItem[]>()
    const allGrps = ['status', 'assigneeName', 'priority']
    if (!allGrps.includes(groupBy)) return null
    const getGroupValue = (t: TaskItem) => {
      if (groupBy === 'status') return t.status
      if (groupBy === 'assigneeName') return t.assigneeName || '未分配'
      if (groupBy === 'priority') return t.priority || '未设置'
      return '其他'
    }
    for (const t of filtered) {
      const key = getGroupValue(t)
      if (!groupMap.has(key)) groupMap.set(key, [])
      groupMap.get(key)!.push(t)
    }
    return Array.from(groupMap.entries()).sort((a, b) => {
      const order = ['执行中', '待执行', '待分配', '待验收', '已完成', '草稿']
      return order.indexOf(a[0]) - order.indexOf(b[0])
    })
  }, [filtered, groupBy])

  const groupOptions = [
    { id: 'status', label: '按状态' },
    { id: 'assigneeName', label: '按负责人' },
    { id: 'priority', label: '按优先级' },
  ]

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)
  const groupedTasksData =
    groupedTasks?.map(([groupValue, items]) => ({ groupValue, items })) ?? null

  useEffect(() => {
    setPage(1)
  }, [search, pageSize])

  const metrics: MetricCardData[] = compact
    ? []
    : [
        {
          title: '总任务',
          value: String(tasks.length),
          trend: 'neutral',
          description: '全部任务数量',
        },
        {
          title: '执行中',
          value: String(tasks.filter(t => t.status === '执行中').length),
          trend: 'up',
          trendLabel: '进行中',
          description: '当前正在执行的任务',
        },
        {
          title: '超时',
          value: String(tasks.filter(t => t.slaStatus === '超时').length),
          trend: 'down',
          trendLabel: '逾期',
          description: '已超过截止日期',
        },
        {
          title: '已完成',
          value: String(tasks.filter(t => t.status === '已完成').length),
          trend: 'up',
          trendLabel: '完成率',
          description: '已关闭或完成的任务',
        },
      ]

  return (
    <div className={`flex flex-col h-full ${className ?? ''}`}>
      <div className="flex-1 overflow-auto">
        <div className={compact ? 'space-y-3' : 'p-6 space-y-4'}>
          {!compact && <SectionCards className="px-0" cardSize="lg" metrics={metrics} />}

          <TaskToolbar
            view={view}
            onViewChange={setView}
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            slaFilter={slaFilter}
            onSlaFilterChange={setSlaFilter}
            sortKey={sortKey}
            sortDir={sortDir}
            onSortChange={(key, dir) => {
              setSortKey(key as typeof sortKey)
              setSortDir(dir as typeof sortDir)
            }}
            groupBy={groupBy}
            onGroupChange={setGroupBy}
            groupOptions={groupOptions}
            columnDefs={columnDefs}
            onToggleColumn={toggleColumn}
            onNewTask={onNewTask ?? (() => {})}
          />

          {view === 'table' && (
            <>
              <TaskTableView
                loading={loading}
                paged={paged}
                groupedTasks={groupedTasksData}
                selected={selected}
                visibleColumns={columnDefs.filter(c => c.visible)}
                allSelected={allSelected}
                onSelectTask={onSelectTask}
                onToggleAll={toggleAll}
                onToggleOne={toggleOne}
              />
              <TaskPaginationBar
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                total={filtered.length}
                rangeStart={(page - 1) * pageSize + 1}
                rangeEnd={Math.min(page * pageSize, filtered.length)}
                selectedCount={selected.size}
                onPageChange={setPage}
                onPageSizeChange={v => {
                  setPageSize(v)
                  setPage(1)
                }}
              />
            </>
          )}
          {view === 'kanban' && (
            <KanbanView
              tasks={filtered}
              onSelectTask={onSelectTask}
              onUpdateTask={() => {}}
              loading={loading}
            />
          )}
          {view === 'calendar' && (
            <CalendarView tasks={filtered} onSelectTask={onSelectTask} loading={loading} />
          )}
        </div>
      </div>
    </div>
  )
}
