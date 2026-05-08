import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ChevronRight, ChevronDown, FileText } from 'lucide-react'
import { api } from '@/services/api'
import { cn } from '@/lib/utils'
import TaskDetailSheet from '@/pages/tasks/TaskDetailSheet'
import type { TaskItem } from '@/types/task'

interface FlatTask {
  id: number
  code: string
  name: string
  status: string
  assigneeName: string
  progress: number
  parentId: number | null
  nodeLevelType: string
  priority: string
  plannedStartAt: string | null
  plannedEndAt: string | null
}

const TASK_STATUS_STYLE: Record<string, string> = {
  草稿: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  待分配: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  待执行: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  执行中: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  待验收: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  已完成: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  待提交: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}

interface ProjectTaskTreeProps {
  projectCode: string
}

export function ProjectTaskTree({ projectCode }: ProjectTaskTreeProps) {
  const [tasks, setTasks] = useState<FlatTask[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)

  useEffect(() => {
    setLoading(true)
    api
      .getTasks(projectCode)
      .then(res => {
        const raw = res.data as unknown as Record<string, unknown>[]
        const data = raw.map(r => ({
          id: r.id as number,
          code: r.code as string,
          name: r.name as string,
          status: r.status as string,
          assigneeName: (r.assigneeName as string) || '',
          progress: (r.progress as number) || 0,
          parentId: r.parentId as number | null,
          nodeLevelType: r.nodeLevelType as string,
          priority: r.priority as string,
          plannedStartAt: r.plannedStartAt as string | null,
          plannedEndAt: r.plannedEndAt as string | null,
        }))
        setTasks(data)
        const wpIds = data
          .filter(t => t.nodeLevelType === 'work_package' || !t.parentId)
          .map(t => t.id)
        setExpanded(new Set(wpIds))
      })
      .catch(() => setTasks([]))
      .finally(() => setLoading(false))
  }, [projectCode])

  const toggleExpand = useCallback((id: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleTaskClick = useCallback(
    (task: FlatTask) => {
      setSelectedTask({
        id: task.id,
        code: task.code,
        name: task.name,
        projectName: projectCode,
        projectCode: projectCode,
        status: task.status,
        owner: task.assigneeName,
        assigneeName: task.assigneeName,
        priority: task.priority || 'medium',
        progress: task.progress,
      } as unknown as TaskItem)
    },
    [projectCode]
  )

  const tree = useMemo(() => {
    const roots = tasks.filter(t => !t.parentId)
    const childMap = new Map<number, FlatTask[]>()
    for (const t of tasks) {
      if (t.parentId) {
        const children = childMap.get(t.parentId) || []
        children.push(t)
        childMap.set(t.parentId, children)
      }
    }
    return { roots, childMap }
  }, [tasks])

  const renderRow = (task: FlatTask, depth: number): React.ReactElement => {
    const hasChildren = (tree.childMap.get(task.id)?.length ?? 0) > 0
    const isExpanded = expanded.has(task.id)
    const indent = depth * 20

    return (
      <TableRow
        key={task.id}
        className="cursor-pointer hover:bg-muted/50"
        onClick={() => handleTaskClick(task)}
      >
        <TableCell>
          <div className="flex items-center gap-1" style={{ paddingLeft: indent }}>
            {hasChildren ? (
              <button
                onClick={e => {
                  e.stopPropagation()
                  toggleExpand(task.id)
                }}
                className="size-5 flex items-center justify-center hover:bg-muted rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="size-3.5 text-muted-foreground" />
                )}
              </button>
            ) : (
              <span className="size-5 flex items-center justify-center">
                <FileText className="size-3.5 text-muted-foreground" />
              </span>
            )}
            <span className="text-sm font-medium">{task.name}</span>
          </div>
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">{task.code}</TableCell>
        <TableCell>
          <Badge
            variant="ghost"
            className={cn('text-xs', TASK_STATUS_STYLE[task.status] || 'bg-zinc-100 text-zinc-600')}
          >
            {task.status}
          </Badge>
        </TableCell>
        <TableCell className="text-xs">{task.assigneeName || '-'}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Progress value={task.progress} className="h-1.5 w-16" />
            <span className="text-xs tabular-nums text-muted-foreground">{task.progress}%</span>
          </div>
        </TableCell>
        <TableCell className="text-xs text-muted-foreground/60">
          {task.nodeLevelType === 'work_package'
            ? '工作包'
            : task.nodeLevelType === 'task'
              ? '任务'
              : ''}
        </TableCell>
      </TableRow>
    )
  }

  const renderTree = (task: FlatTask, depth: number): React.ReactElement[] => {
    const rows: React.ReactElement[] = [renderRow(task, depth)]
    if (expanded.has(task.id)) {
      const children = tree.childMap.get(task.id) || []
      for (const child of children) {
        rows.push(...renderTree(child, depth + 1))
      }
    }
    return rows
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground py-4 text-center">加载中...</div>
  }

  if (tasks.length === 0) {
    return <div className="text-sm text-muted-foreground py-4 text-center">暂无任务</div>
  }

  return (
    <>
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%]">任务名称</TableHead>
              <TableHead className="w-[15%]">编码</TableHead>
              <TableHead className="w-[12%]">状态</TableHead>
              <TableHead className="w-[12%]">负责人</TableHead>
              <TableHead className="w-[16%]">进度</TableHead>
              <TableHead className="w-[10%]">层级</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{tree.roots.map(root => renderTree(root, 0))}</TableBody>
        </Table>
      </div>
      <TaskDetailSheet task={selectedTask} onClose={() => setSelectedTask(null)} />
    </>
  )
}
