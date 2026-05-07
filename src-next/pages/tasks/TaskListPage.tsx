import { useState, useEffect, useRef, useCallback } from 'react'
import { SectionCards } from '@/components/section-cards'
import { api } from '@/services/api'
import { KanbanView } from './components/kanban/KanbanView'
import { CalendarView } from './components/calendar/CalendarView'
import { TaskToolbar } from './components/TaskToolbar'
import { NewTaskDialog } from './components/NewTaskDialog'
import { TaskTableView } from './components/TaskTableView'
import { TaskPaginationBar } from './components/TaskPaginationBar'
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
  const [newTaskFields, setNewTaskFields] = useState<Record<string, string>>({
    name: '',
    status: '草稿',
  })
  const [extraFields, setExtraFields] = useState<
    { key: string; label: string; type: 'system' | 'custom' }[]
  >([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const systemFields = [
    {
      key: 'status',
      label: '流程状态',
      type: 'select' as const,
      options: ['草稿', '待分配', '待执行', '执行中'],
    },
    { key: 'assigneeName', label: '负责人', type: 'text' as const },
    {
      key: 'priority',
      label: '优先级',
      type: 'select' as const,
      options: ['low', 'medium', 'high', 'urgent'],
    },
    { key: 'plannedEndAt', label: '计划结束', type: 'date' as const },
    { key: 'plannedStartAt', label: '计划开始', type: 'date' as const },
    { key: 'description', label: '描述', type: 'text' as const },
  ]

  const templates = [
    { id: 'generic', label: '常规任务', defaults: { status: '草稿', priority: 'medium' } },
    { id: 'inspection', label: '巡检任务', defaults: { status: '待执行', priority: 'high' } },
    { id: 'acceptance', label: '验收任务', defaults: { status: '待验收', priority: 'urgent' } },
  ]

  const templateDetails: Record<
    string,
    { label: string; fields: { key: string; label: string }[] }
  > = {
    generic: {
      label: '常规任务',
      fields: [
        { key: 'assigneeName', label: '负责人' },
        { key: 'plannedEndAt', label: '计划结束' },
      ],
    },
    inspection: {
      label: '巡检任务',
      fields: [
        { key: 'assigneeName', label: '负责人' },
        { key: 'plannedEndAt', label: '计划结束' },
        { key: 'description', label: '巡检要点' },
      ],
    },
    acceptance: {
      label: '验收任务',
      fields: [
        { key: 'assigneeName', label: '负责人' },
        { key: 'plannedEndAt', label: '计划结束' },
        { key: 'description', label: '验收标准' },
      ],
    },
  }

  const availableExtraFields = systemFields.filter(
    f => f.key !== 'status' && !extraFields.some(e => e.key === f.key)
  )

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
    } catch {
      /* ignore */
    }
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
      case 'status':
        return task.status
      case 'priority':
        return task.priority || '未设置'
      case 'assignee':
        return task.assigneeName || task.owner || '未分配'
      case 'slaStatus':
        return task.slaStatus || '正常'
      case 'projectName':
        return task.projectName || '未归属'
      default:
        return ''
    }
  }

  const filtered = tasks
    .filter(t => {
      if (statusFilter.length > 0 && !statusFilter.includes(t.status)) return false
      if (slaFilter.length > 0 && !slaFilter.includes(t.slaStatus ?? '')) return false
      return true
    })
    .filter(
      t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.code.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let cmp = 0
      if (sortKey === 'plannedEndAt')
        cmp = (a.plannedEndAt || '').localeCompare(b.plannedEndAt || '')
      else if (sortKey === 'progress') cmp = (a.progress ?? 0) - (b.progress ?? 0)
      return sortDir === 'asc' ? cmp : -cmp
    })
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const groupedTasks = groupBy
    ? (() => {
        const groups = new Map<string, TaskItem[]>()
        const source = groupBy ? filtered : paged
        for (const task of source) {
          const key = getGroupValue(task, groupBy)
          if (!groups.has(key)) groups.set(key, [])
          groups.get(key)!.push(task)
        }
        return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
      })()
    : null

  const allSelected = paged.length > 0 && paged.every(t => selected.has(t.id))

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set([...selected].filter(id => !paged.some(t => t.id === id))))
    } else {
      setSelected(new Set([...selected, ...paged.map(t => t.id)]))
    }
  }
  const toggleOne = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelected(next)
  }

  const fetchTasks = useCallback(() => {
    setLoading(true)
    api
      .getAllTasks(1, 200)
      .then(res => setTasks([...localTasksRef.current, ...res.data]))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks, refreshTrigger])

  // Reset to page 1 when search or pageSize changes
  useEffect(() => {
    setPage(1)
  }, [search, pageSize])

  const groupedTasksData =
    groupedTasks?.map(([groupValue, items]) => ({ groupValue, items })) ?? null

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-4">
          <SectionCards
            className="px-0"
            cardSize="lg"
            metrics={[
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
            ]}
          />

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
            onNewTask={() => setShowNewTask(true)}
          />

          <NewTaskDialog
            open={showNewTask}
            onOpenChange={setShowNewTask}
            mode={newTaskMode}
            onModeChange={setNewTaskMode}
            fields={newTaskFields}
            onFieldsChange={setNewTaskFields}
            selectedTemplate={selectedTemplate}
            onTemplateChange={applyTemplate}
            extraFields={extraFields}
            onAddExtraField={addExtraField}
            onAddCustomField={addCustomField}
            onRemoveExtraField={removeExtraField}
            systemFields={systemFields}
            templates={templates}
            templateDetails={templateDetails}
            availableExtraFields={availableExtraFields}
            onCreate={handleCreateTask}
          />

          {view === 'table' && (
            <>
              <TaskTableView
                loading={loading}
                paged={paged}
                groupedTasks={groupedTasksData}
                selected={selected}
                visibleColumns={visibleColumns}
                allSelected={allSelected}
                onSelectTask={onSelectTask}
                onToggleAll={toggleAll}
                onToggleOne={toggleOne}
              />
              <TaskPaginationBar
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                total={filtered.length}
                rangeStart={(page - 1) * pageSize + 1}
                rangeEnd={Math.min(page * pageSize, filtered.length)}
                selectedCount={selected.size}
              />
            </>
          )}

          <div className={view === 'kanban' ? '' : 'hidden'}>
            <KanbanView
              tasks={filtered}
              onSelectTask={onSelectTask}
              onUpdateTask={(taskId, updates) => {
                api.updateTask('', Number(taskId), updates).then(() => fetchTasks())
              }}
              loading={loading}
            />
          </div>

          <div className={view === 'calendar' ? '' : 'hidden'}>
            <CalendarView tasks={filtered} onSelectTask={onSelectTask} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
