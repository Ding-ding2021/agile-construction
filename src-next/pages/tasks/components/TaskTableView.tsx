import { Fragment, type MouseEvent } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { avatarColor, STATUS_STYLE, SLA_STYLE } from '@/pages/tasks/constants/task-styles'
import type { TaskItem } from '@/types/task'
import { useCallback, useRef, useState } from 'react'

interface ColumnDef {
  id: string
  label: string
  defaultWidth: number
  visible: boolean
}

interface GroupedTasks {
  groupValue: string
  items: TaskItem[]
}

interface TaskTableViewProps {
  loading: boolean
  paged: TaskItem[]
  groupedTasks: GroupedTasks[] | null
  selected: Set<string>
  visibleColumns: ColumnDef[]
  allSelected: boolean
  onSelectTask: (task: TaskItem) => void
  onToggleAll: () => void
  onToggleOne: (id: string) => void
}

function renderCell(task: TaskItem, colId: string) {
  switch (colId) {
    case 'code':
      return <span className="text-xs font-mono text-muted-foreground">{task.code}</span>
    case 'name':
      return <span className="text-sm font-normal text-foreground/80">{task.name}</span>
    case 'status':
      return (
        <Badge
          variant="ghost"
          className={'text-[11px] font-medium ' + (STATUS_STYLE[task.status]?.bg ?? 'bg-zinc-100')}
        >
          <span
            className={
              'mr-1 size-1.5 rounded-full ' + (STATUS_STYLE[task.status]?.dot ?? 'bg-zinc-400')
            }
          />
          {task.status}
        </Badge>
      )
    case 'assignee':
      return (
        <div className="flex items-center gap-2">
          <Avatar className={`size-5 ${avatarColor(task.owner || task.assigneeName || '')}`}>
            <AvatarFallback className="text-[10px] leading-none bg-inherit">
              {(task.assigneeName || task.owner || '?')[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{task.assigneeName || task.owner || '—'}</span>
        </div>
      )
    case 'plannedEndAt':
      return (
        <span className="text-sm text-muted-foreground">
          {task.plannedEndAt?.slice(0, 10) || '—'}
        </span>
      )
    case 'slaStatus':
      return (
        <Badge
          variant="ghost"
          className={
            'text-[11px] font-medium ' + (SLA_STYLE[task.slaStatus ?? ''] ?? 'bg-zinc-100')
          }
        >
          {task.slaStatus ?? '—'}
        </Badge>
      )
    case 'priority':
      return <span className="text-sm">{task.priority || '—'}</span>
    case 'progress':
      return (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${task.progress ?? 0}%` }}
            />
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
      className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground relative bg-muted/60"
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

export function TaskTableView({
  loading,
  paged,
  groupedTasks,
  selected,
  visibleColumns,
  allSelected,
  onSelectTask,
  onToggleAll,
  onToggleOne,
}: TaskTableViewProps) {
  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 bg-muted/60">
              <Checkbox checked={!!allSelected} onCheckedChange={onToggleAll} aria-label="全选" />
            </TableHead>
            {visibleColumns.map(col => (
              <ResizableHead key={col.id} defaultWidth={col.defaultWidth}>
                {col.label}
              </ResizableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length + 1}
                className="text-center py-12 text-muted-foreground"
              >
                加载中...
              </TableCell>
            </TableRow>
          ) : groupedTasks ? (
            groupedTasks.map(({ groupValue, items }) => (
              <Fragment key={groupValue}>
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={visibleColumns.length + 1} className="py-1.5 px-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {groupValue}
                      <span className="ml-2 font-normal text-[10px] opacity-60">
                        ({items.length})
                      </span>
                    </span>
                  </TableCell>
                </TableRow>
                {items.map(task => (
                  <TableRow
                    key={task.id}
                    className="cursor-pointer"
                    onClick={() => onSelectTask(task)}
                  >
                    <TableCell className="h-12" onClick={e => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(task.id)}
                        onCheckedChange={() => onToggleOne(task.id)}
                        aria-label={task.name}
                      />
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
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length + 1}
                className="text-center py-12 text-muted-foreground"
              >
                无匹配任务
              </TableCell>
            </TableRow>
          ) : (
            paged.map(task => (
              <TableRow key={task.id} className="cursor-pointer" onClick={() => onSelectTask(task)}>
                <TableCell className="h-12" onClick={e => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.has(task.id)}
                    onCheckedChange={() => onToggleOne(task.id)}
                    aria-label={task.name}
                  />
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
  )
}
