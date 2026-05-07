import { useState, useMemo, useCallback } from 'react'
import {
  addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth,
  isSameDay, isToday, format,
} from 'date-fns'
import {
  ChevronLeft, ChevronRight,
  Settings, Plus, Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { STATUS_STYLE, SLA_STYLE, avatarColor } from '../../constants/task-styles'
import type { TaskItem } from '@/types/task'

interface CalendarViewProps {
  tasks: TaskItem[]
  onSelectTask: (task: TaskItem) => void
  loading?: boolean
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

// ─── Calendar categories ───
interface CalendarCategory {
  id: string
  label: string
  color: string
  enabled: boolean
  filter?: (t: TaskItem) => boolean
}

const DEFAULT_CATEGORIES: CalendarCategory[] = [
  { id: 'executing', label: '执行中', color: 'bg-blue-500', enabled: true, filter: (t) => t.status === '执行中' },
  { id: 'pending', label: '待处理', color: 'bg-amber-500', enabled: true, filter: (t) => ['待分配', '待执行', '待提交', '待验收'].includes(t.status) },
  { id: 'overdue', label: '超时', color: 'bg-red-500', enabled: true, filter: (t) => t.slaStatus === '超时' },
  { id: 'complete', label: '已完成', color: 'bg-green-500', enabled: false, filter: (t) => ['已完成', '已关闭'].includes(t.status) },
]

// ─── Mini Calendar ───
function MiniCalendar({
  currentMonth, selectedDate, onMonthChange, onSelectDate,
}: {
  currentMonth: Date
  selectedDate: Date
  onMonthChange: (d: Date) => void
  onSelectDate: (d: Date) => void
}) {
  const days = useMemo(() => {
    const ms = startOfMonth(currentMonth)
    const me = endOfMonth(currentMonth)
    return eachDayOfInterval({ start: startOfWeek(ms), end: endOfWeek(me) })
  }, [currentMonth])

  return (
    <div className="px-3 py-2">
      {/* Mini header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{format(currentMonth, 'M月')}</span>
        <div className="flex items-center gap-0.5">
          <button onClick={() => onMonthChange(subMonths(currentMonth, 1))} className="size-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground">
            <ChevronLeft className="size-3" />
          </button>
          <button onClick={() => onMonthChange(addMonths(currentMonth, 1))} className="size-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground">
            <ChevronRight className="size-3" />
          </button>
        </div>
      </div>

      {/* Weekday initials */}
      <div className="grid grid-cols-7 mb-0.5">
        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
          <div key={d} className="text-center text-[10px] text-muted-foreground h-5 leading-5">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7">
        {days.map(day => {
          const key = format(day, 'yyyy-MM-dd')
          const isCM = isSameMonth(day, currentMonth)
          const isSel = isSameDay(day, selectedDate)
          const isT = isToday(day)
          return (
            <button
              key={key}
              onClick={() => onSelectDate(day)}
              className={`
                text-center text-[11px] h-6 leading-6 rounded-full
                hover:bg-muted transition-colors
                ${!isCM ? 'text-muted-foreground/30' : ''}
                ${isT && !isSel ? 'font-semibold text-primary' : ''}
                ${isSel ? 'bg-primary text-primary-foreground font-medium hover:bg-primary' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Calendar Category List ───
function CalendarCategoryList({
  title, categories, onToggle,
}: {
  title: string
  categories: CalendarCategory[]
  onToggle: (id: string) => void
}) {
  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
        <Plus className="size-3 text-muted-foreground cursor-pointer hover:text-foreground" />
      </div>
      {categories.map(cat => (
        <label
          key={cat.id}
          className="flex items-center gap-2 py-0.5 cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1 group"
        >
          <div
            className={`size-3.5 rounded flex items-center justify-center transition-colors ${cat.enabled ? cat.color : 'bg-muted'}`}
            onClick={() => onToggle(cat.id)}
          >
            {cat.enabled && <Check className="size-2.5 text-white" />}
          </div>
          <span className="text-xs flex-1 truncate">{cat.label}</span>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
            <Settings className="size-2.5" />
          </button>
        </label>
      ))}
    </div>
  )
}

// ─── Right-side Task Panel ───
function CalendarTaskPanel({ date, tasks, onSelectTask }: {
  date: Date
  tasks: TaskItem[]
  onSelectTask: (t: TaskItem) => void
}) {
  const dateKey = format(date, 'yyyy-MM-dd')
  const dayTasks = useMemo(
    () => tasks.filter(t => {
      const end = t.plannedEndAt?.slice(0, 10)
      const start = t.plannedStartAt?.slice(0, 10)
      return end === dateKey || start === dateKey
    }),
    [tasks, dateKey]
  )

  return (
    <div className="w-64 border-l border-border bg-muted/20 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-sm font-medium">{format(date, 'M月d日')}</p>
        <p className="text-xs text-muted-foreground">{format(date, 'EEEE')}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{dayTasks.length} 项任务</p>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {dayTasks.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">该日期无任务</p>
        ) : (
          dayTasks.map(task => {
            const style = STATUS_STYLE[task.status]
            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="px-3 py-2 rounded-lg hover:bg-muted cursor-pointer transition-colors border border-border/50 hover:border-border group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`size-2 rounded-full shrink-0 ${style?.dot ?? ''}`} />
                  <span className="text-xs font-mono text-muted-foreground">{task.code}</span>
                  {task.slaStatus && task.slaStatus !== '正常' && (
                    <Badge variant="ghost" className={`text-[10px] h-4 px-1 ml-auto ${SLA_STYLE[task.slaStatus] ?? ''}`}>
                      {task.slaStatus}
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-medium leading-snug mb-1.5 line-clamp-2">{task.name}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Avatar className={`size-4 ${avatarColor(task.assigneeName || task.owner || '')}`}>
                      <AvatarFallback className="text-[8px] leading-none bg-inherit">
                        {(task.assigneeName || task.owner || '?')[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[11px] text-muted-foreground">{task.assigneeName || task.owner || '—'}</span>
                  </div>
                  <Badge variant="ghost" className={`text-[10px] h-4 px-1 ${style?.bg ?? ''}`}>
                    {task.status}
                  </Badge>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ─── Main Calendar View ───
export function CalendarView({ tasks, onSelectTask, loading }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [categories, setCategories] = useState<CalendarCategory[]>(DEFAULT_CATEGORIES)

  // Filter tasks by enabled categories
  const enabledCategoryIds = useMemo(() =>
    new Set(categories.filter(c => c.enabled).map(c => c.id)),
  [categories])

  const filteredTasks = useMemo(() =>
    tasks.filter(t => {
      // A task is visible if ANY enabled category matches
      return categories.some(c => c.enabled && c.filter?.(t))
    }),
  [tasks, categories, enabledCategoryIds])

  // Build tasks index by date (using filtered tasks)
  const tasksByDate = useMemo(() => {
    const map = new Map<string, TaskItem[]>()
    for (const t of filteredTasks) {
      const keys = new Set<string>()
      if (t.plannedEndAt) keys.add(t.plannedEndAt.slice(0, 10))
      if (t.plannedStartAt) keys.add(t.plannedStartAt.slice(0, 10))
      for (const key of keys) {
        const list = map.get(key) ?? []
        list.push(t)
        map.set(key, list)
      }
    }
    return map
  }, [filteredTasks])

  // Calendar grid days
  const days = useMemo(() => {
    const ms = startOfMonth(currentMonth)
    const me = endOfMonth(currentMonth)
    return eachDayOfInterval({ start: startOfWeek(ms), end: endOfWeek(me) })
  }, [currentMonth])

  const goToToday = useCallback(() => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }, [])

  const toggleCategory = useCallback((id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c))
  }, [])

  const goPrev = useCallback(() => setCurrentMonth(m => subMonths(m, 1)), [])
  const goNext = useCallback(() => setCurrentMonth(m => addMonths(m, 1)), [])

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* ─── Toolbar ─── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs font-medium" onClick={goToToday}>
            今日
          </Button>
          <div className="flex items-center gap-0.5 ml-1">
            <Button variant="ghost" size="icon-xs" onClick={goPrev} className="size-7">
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-xs" onClick={goNext} className="size-7">
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <h2 className="text-lg font-semibold ml-2">
            {format(currentMonth, 'yyyy年M月')}
          </h2>
        </div>

        {/* View switcher */}
        <div className="flex items-center border border-border rounded-md overflow-hidden">
          {['月', '周', '日'].map(v => (
            <button
              key={v}
              className={`px-3 py-1 text-xs font-medium transition-colors ${v === '月' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Body: Sidebar + Grid + Task Panel ─── */}
      <div className="flex">
        {/* Left sidebar */}
        <div className="w-56 border-r border-border flex flex-col divide-y divide-border">
          {/* Mini Calendar */}
          <MiniCalendar
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onMonthChange={setCurrentMonth}
            onSelectDate={(d) => { setSelectedDate(d); setCurrentMonth(d) }}
          />

          {/* 我的日历 */}
          <CalendarCategoryList
            title="我的日历"
            categories={[
              { id: 'my-tasks', label: '我的任务', color: 'bg-blue-500', enabled: true },
              { id: 'my-create', label: '我创建的', color: 'bg-purple-500', enabled: false },
            ]}
            onToggle={() => {}}
          />

          {/* 任务分类 */}
          <CalendarCategoryList
            title="任务分类"
            categories={categories}
            onToggle={toggleCategory}
          />

          {/* 订阅 */}
          <CalendarCategoryList
            title="订阅"
            categories={[
              { id: 'sub-sla', label: '超时提醒', color: 'bg-red-500', enabled: true },
              { id: 'sub-milestone', label: '里程碑', color: 'bg-amber-500', enabled: false },
            ]}
            onToggle={() => {}}
          />

          {/* 项目日历 */}
          <CalendarCategoryList
            title="项目日历"
            categories={[
              { id: 'prj-demo', label: '南京路旗舰店', color: 'bg-purple-500', enabled: true },
              { id: 'prj-other', label: '其他项目', color: 'bg-cyan-500', enabled: false },
            ]}
            onToggle={() => {}}
          />
        </div>

        {/* Main grid */}
        <div className="flex-1 min-w-0">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {WEEKDAYS.map(d => (
              <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground border-r border-border last:border-r-0">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {days.map(day => {
              const dateKey = format(day, 'yyyy-MM-dd')
              const dayTasks = tasksByDate.get(dateKey) ?? []
              const isCM = isSameMonth(day, currentMonth)
              const isSel = isSameDay(day, selectedDate)
              const isT = isToday(day)

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(day)}
                  data-selected={isSel ? '' : undefined}
                  className={`
                    min-h-[90px] p-1.5 text-left border-b border-r border-border
                    hover:bg-muted/50 transition-colors cursor-pointer
                    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
                    ${!isCM ? 'bg-muted/20' : ''}
                    ${isSel ? 'bg-accent/30' : ''}
                    last:border-r-0 [&:nth-child(7n)]:border-r-0
                  `}
                >
                  <div className={`
                    inline-flex items-center justify-center size-6 text-xs rounded-full mb-0.5
                    ${isT && !isSel ? 'bg-primary text-primary-foreground font-semibold' : ''}
                    ${isSel && !isT ? 'bg-primary/10 text-primary font-semibold' : ''}
                    ${!isCM ? 'text-muted-foreground/40' : ''}
                    ${isT && isSel ? 'bg-primary text-primary-foreground font-semibold ring-2 ring-primary/30' : ''}
                  `}>
                    {format(day, 'd')}
                  </div>

                  <div className="space-y-0.5">
                    {dayTasks.slice(0, 3).map(task => {
                      const style = STATUS_STYLE[task.status]
                      return (
                        <div
                          key={task.id}
                          onClick={e => { e.stopPropagation(); onSelectTask(task) }}
                          className={`
                            flex items-center gap-1 px-1 py-0.5 rounded-sm text-[10px] leading-tight
                            cursor-pointer truncate hover:opacity-80 transition-opacity
                            ${task.slaStatus === '超时'
                              ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                              : task.status === '执行中'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              : task.status === '已完成' || task.status === '已关闭'
                              ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                              : 'bg-muted text-muted-foreground'
                            }
                          `}
                        >
                          <span className={`size-1.5 rounded-full shrink-0 ${style?.dot ?? ''}`} />
                          <span className="truncate">{task.name}</span>
                        </div>
                      )
                    })}
                    {dayTasks.length > 3 && (
                      <div className="text-[10px] text-muted-foreground pl-1">+{dayTasks.length - 3} 项</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right task panel */}
        <CalendarTaskPanel
          date={selectedDate}
          tasks={filteredTasks}
          onSelectTask={onSelectTask}
        />
      </div>
    </div>
  )
}
