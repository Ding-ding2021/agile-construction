import { useState, useEffect, useMemo } from 'react'
import { TreeDataTable } from '@/components/data-table-tree'
import { api } from '@/services/api'
import TaskDetailSheet from '@/pages/tasks/TaskDetailSheet'
import type { ColumnDef } from '@tanstack/react-table'
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
  plannedEndAt: string | null
}

interface TreeTask extends FlatTask {
  subRows?: TreeTask[]
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

const columns: ColumnDef<TreeTask>[] = [
  {
    accessorKey: 'name',
    header: '任务名称',
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: 'code',
    header: '编码',
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: '状态',
    cell: ({ getValue }) => {
      const status = getValue() as string
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            TASK_STATUS_STYLE[status] ||
            'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
          }`}
        >
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: 'assigneeName',
    header: '负责人',
    cell: ({ getValue }) => <span className="text-xs">{(getValue() as string) || '-'}</span>,
  },
  {
    accessorKey: 'progress',
    header: '进度',
    cell: ({ getValue }) => <span className="text-xs tabular-nums">{getValue() as number}%</span>,
  },
  {
    accessorKey: 'plannedEndAt',
    header: '计划结束',
    cell: ({ getValue }) => {
      const v = getValue() as string | null
      return <span className="text-xs text-muted-foreground">{v || '-'}</span>
    },
  },
]

interface TabScopeProps {
  projectCode: string
}

export function TabScope({ projectCode }: TabScopeProps) {
  const [tasks, setTasks] = useState<FlatTask[]>([])
  const [loading, setLoading] = useState(true)
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
          plannedEndAt: r.plannedEndAt as string | null,
        }))
        setTasks(data)
      })
      .catch(() => setTasks([]))
      .finally(() => setLoading(false))
  }, [projectCode])

  const treeData = useMemo(() => {
    const childMap = new Map<number, FlatTask[]>()
    for (const t of tasks) {
      if (t.parentId) {
        const children = childMap.get(t.parentId) || []
        children.push(t)
        childMap.set(t.parentId, children)
      }
    }
    const buildTree = (items: FlatTask[]): TreeTask[] =>
      items.map(item => {
        const children = childMap.get(item.id) || []
        return {
          ...item,
          subRows: children.length > 0 ? buildTree(children) : undefined,
        }
      })
    return buildTree(tasks.filter(t => !t.parentId))
  }, [tasks])

  if (loading) {
    return <div className="text-sm text-muted-foreground py-4 text-center">加载中...</div>
  }

  if (tasks.length === 0) {
    return <div className="text-sm text-muted-foreground py-4 text-center">暂无任务</div>
  }

  return (
    <div className="space-y-4">
      <TreeDataTable data={treeData} columns={columns} getSubRows={item => item.subRows ?? []} />
      <TaskDetailSheet task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  )
}
