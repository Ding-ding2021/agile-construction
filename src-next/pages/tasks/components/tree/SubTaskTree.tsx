import { useState, useRef, useCallback, type MouseEvent } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronRight, ChevronDown } from 'lucide-react'
import type { TaskSubtaskNode } from '@/types/task'

const STATUS_BG: Record<string, string> = {
  '草稿': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  '待分配': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  '待执行': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  '执行中': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  '已暂停': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  '待提交': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  '待验收': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  '不通过': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  '已完成': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  '已关闭': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
}

const DEFAULT_WIDTHS = [32, 100, 0, 70, 80, 90]

interface SubTaskTreeProps {
  subtasks: TaskSubtaskNode[]
  progress?: number
  onSelect?: (code: string) => void
}

export default function SubTaskTree({ subtasks, progress, onSelect }: SubTaskTreeProps) {
  const isEmpty = subtasks.length === 0

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          子任务 ({subtasks.length})
        </h3>
        {progress !== undefined && (
          <div className="flex items-center gap-2">
            <Progress value={progress} className="w-20 h-1.5" />
            <span className="text-xs font-semibold tabular-nums">{progress}%</span>
          </div>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <colgroup>
            {DEFAULT_WIDTHS.map((w, i) => (
              <col key={i} style={{ width: w ? `${w}px` : undefined }} />
            ))}
          </colgroup>
          <TableHeader>
            <TableRow>
              <ResizableHead defaultWidth={32} />
              <ResizableHead defaultWidth={100}>编号</ResizableHead>
              <ResizableHead>名称</ResizableHead>
              <ResizableHead defaultWidth={70}>状态</ResizableHead>
              <ResizableHead defaultWidth={80}>进度</ResizableHead>
              <ResizableHead defaultWidth={90}>计划结束</ResizableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEmpty ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-xs text-muted-foreground">暂无子任务</TableCell>
              </TableRow>
            ) : (
              subtasks.map(node => (
                <SubTaskRow key={node.id} node={node} depth={0} onSelect={onSelect} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
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

interface SubTaskRowProps {
  node: TaskSubtaskNode
  depth: number
  onSelect?: (code: string) => void
}

function SubTaskRow({ node, depth, onSelect }: SubTaskRowProps) {
  const hasChildren = node.children && node.children.length > 0
  const [expanded, setExpanded] = useState(true)

  return (
    <>
      <TableRow className="cursor-pointer" onClick={() => onSelect?.(node.code)}>
        <TableCell className="py-1.5">
          {hasChildren ? (
            <button
              onClick={e => { e.stopPropagation(); setExpanded(!expanded) }}
              className="size-4 flex items-center justify-center"
            >
              {expanded ? <ChevronDown className="size-3 text-muted-foreground" /> : <ChevronRight className="size-3 text-muted-foreground" />}
            </button>
          ) : (
            <span className="size-4 inline-block" />
          )}
        </TableCell>
        <TableCell className="py-1.5 text-xs font-mono text-muted-foreground">{node.code}</TableCell>
        <TableCell className="py-1.5 text-sm font-medium">{node.name}</TableCell>
        <TableCell className="py-1.5">
          <Badge variant="ghost" className={"text-[10px] font-medium " + (STATUS_BG[node.status] ?? 'bg-zinc-100')}>
            {node.status}
          </Badge>
        </TableCell>
        <TableCell className="py-1.5">
          <div className="flex items-center gap-1.5">
            <Progress value={node.progress} className="w-10 h-1.5" />
            <span className="text-xs tabular-nums">{node.progress}%</span>
          </div>
        </TableCell>
        <TableCell className="py-1.5 text-xs text-muted-foreground">{node.plannedEndAt?.slice(0, 10)}</TableCell>
      </TableRow>
      {hasChildren && expanded && node.children!.map(child => (
        <SubTaskRow key={child.id} node={child} depth={depth + 1} onSelect={onSelect} />
      ))}
    </>
  )
}
