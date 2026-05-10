import { useMemo, useCallback, useState } from 'react'
import { Gantt, Toolbar, Willow } from '@svar-ui/react-gantt'
import '@svar-ui/react-gantt/all.css'
import '@/pages/wbs/gantt-svar.css'
import { useWBSStore } from '@/store/wbsStore'
import { parseDependencies } from '@/lib/wbs-gantt-utils'
import { calculateCriticalPath } from '@/lib/wbs-cpm'
import type { ITask, ILink, IApi } from '@svar-ui/gantt-store'
import { cn } from '@/lib/utils'

const ZOOM_PRESETS = [
  {
    label: '日',
    cellWidth: 40,
    scales: [
      { unit: 'month' as const, step: 1, format: '%Y年%m月' },
      {
        unit: 'day' as const,
        step: 1,
        format: '%j',
        css: (d: Date) => (d.getDay() === 0 ? 'svar-day-nonworking' : ''),
      },
    ],
  },
  {
    label: '周',
    cellWidth: 20,
    scales: [
      { unit: 'month' as const, step: 1, format: '%m月' },
      { unit: 'week' as const, step: 1, format: 'W%w' },
    ],
  },
  {
    label: '月',
    cellWidth: 8,
    scales: [
      { unit: 'year' as const, step: 1, format: '%Y年' },
      { unit: 'month' as const, step: 1, format: '%m月' },
    ],
  },
  {
    label: '年',
    cellWidth: 2,
    scales: [
      { unit: 'year' as const, step: 1, format: '%Y年' },
      { unit: 'quarter' as const, step: 1, format: 'Q%q' },
    ],
  },
]

export function WBSGanttSvar() {
  const flatNodes = useWBSStore(s => s.flatNodes)
  const updateNode = useWBSStore(s => s.updateNode)
  const [preset, setPreset] = useState(0)
  const [todayKey, setTodayKey] = useState(0)
  const [svarApi, setSvarApi] = useState<IApi | null>(null)

  const p = ZOOM_PRESETS[preset]

  const tasks = useMemo(() => {
    const parentIds = new Set(flatNodes.map(n => n.parentId).filter(Boolean))
    const cpmResult = calculateCriticalPath(
      flatNodes.map(n => ({
        id: n.id,
        duration: n.duration || 1,
        dependencies: parseDependencies(n.dependencies),
      }))
    )
    return flatNodes.map(n => ({
      id: n.id,
      text: n.name,
      start: n.plannedStart ? new Date(n.plannedStart) : undefined,
      end: n.plannedEnd ? new Date(n.plannedEnd) : undefined,
      duration: n.duration || 1,
      progress: (n.progress || 0) / 100,
      parent: n.parentId || 0,
      type: parentIds.has(n.id) ? ('summary' as const) : ('task' as const),
      status: n.status,
      isCritical: cpmResult.get(n.id)?.isCritical || false,
    }))
  }, [flatNodes])

  const links = useMemo(() => {
    const ids = new Set(flatNodes.map(n => n.id))
    const result: ILink[] = []
    for (const n of flatNodes) {
      const deps = parseDependencies(n.dependencies)
      for (const depId of deps) {
        if (ids.has(depId))
          result.push({ id: `${depId}-${n.id}`, source: depId, target: n.id, type: 'e2s' as const })
      }
    }
    return result.length > 0 ? result : undefined
  }, [flatNodes])

  const handleUpdateTask = useCallback(
    (ev: { id: number; start?: string; end?: string; duration?: number; progress?: number }) => {
      const id = Number(ev.id)
      if (!id) return
      const u: Record<string, unknown> = {}
      if (ev.start) u.plannedStart = new Date(ev.start).toISOString().slice(0, 10)
      if (ev.end) u.plannedEnd = new Date(ev.end).toISOString().slice(0, 10)
      if (ev.duration !== undefined) u.duration = Number(ev.duration)
      if (ev.progress !== undefined) u.progress = Math.round(Number(ev.progress) * 100)
      if (Object.keys(u).length > 0) updateNode(id, u)
    },
    [updateNode]
  )

  const handleToday = useCallback(() => {
    setTodayKey(k => k + 1)
  }, [])

  const now = useMemo(() => {
    const d = new Date()
    const start = new Date(d)
    start.setDate(start.getDate() - 30)
    const end = new Date(d)
    end.setDate(end.getDate() + 60)
    return { start, end }
  }, [todayKey])

  if (flatNodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        暂无 WBS 节点
      </div>
    )
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center gap-0.5 px-3 py-1 border-b border-border bg-background">
        {ZOOM_PRESETS.map((zp, i) => (
          <button
            key={zp.label}
            className={cn(
              'rounded px-2 py-0.5 text-[11px] font-medium transition-colors',
              i === preset
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
            onClick={() => setPreset(i)}
          >
            {zp.label}
          </button>
        ))}
        <div className="w-px h-4 bg-border mx-1" />
        <button
          className="rounded px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={handleToday}
        >
          今日
        </button>
      </div>
      <Willow>
        <Toolbar api={svarApi ?? undefined} />
        <Gantt
          key={`${preset}-${todayKey}`}
          tasks={tasks as ITask[]}
          links={links}
          zoom
          start={preset === 0 ? now.start : undefined}
          end={preset === 0 ? now.end : undefined}
          cellWidth={p.cellWidth}
          scales={p.scales}
          init={api => {
            setSvarApi(api)
          }}
          onupdate-task={handleUpdateTask}
          columns={[
            { id: 'text', header: '任务名称', width: 220 },
            { id: 'start', header: '开始', width: 100 },
            { id: 'duration', header: '工期', width: 60 },
            { id: 'progress', header: '进度', width: 80 },
          ]}
        />
      </Willow>
    </div>
  )
}
