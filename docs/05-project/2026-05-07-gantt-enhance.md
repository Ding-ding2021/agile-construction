---
number: PRJ-006
domain: project
category: plan
---

# 甘特图增强（批次 A）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 甘特图从扁平行列表升级为树形层级结构，支持展开/折叠、父节点日期汇总、日/周/月粒度切换、水平滚动同步，修复 UI 规范违规（opacity/透明度）。

**Architecture:**

- `buildGanttRows` 改为递归版，输入 `tree`（已有 `buildWBSTree` 产出），按 `expandedIds` 过滤
- 父节点日期从子节点递归汇总（最早 `plannedStart` / 最晚 `plannedEnd`）
- `DAY_WIDTH` 从常量改为 store 的 `ganttZoom` 状态（30/210/60 对应 日/周/月）
- 左侧信息列 `sticky left-0` + 右侧 `overflow-x-auto`，使用 shadcn `ScrollArea`
- 甘特条移除 `opacity`，状态色改用纯色语义映射

**Tech Stack:** React 18.3, shadcn/ui, Tailwind CSS v4, date-fns v4, Zustand

---

## Task 1: 重写工具函数（tree → 递归甘特行 + 父节点汇总）

**Files:**

- Modify: `src-next/lib/wbs-gantt-utils.ts`
- Test: `src-next/lib/__tests__/wbs-gantt-utils.test.ts`

- [ ] **Step 1: 更新 `buildGanttRows` 为递归树形版本**

Replace the current flat `buildGanttRows` in `src-next/lib/wbs-gantt-utils.ts`:

```typescript
export function buildGanttRows(
  tree: WBSNode[],
  timelineStart: Date,
  expandedIds: number[],
  depth: number = 0
): GanttRow[] {
  const result: GanttRow[] = []
  for (const node of tree) {
    const children = buildGanttRows(node.children || [], timelineStart, expandedIds, depth + 1)
    const childRows = expandedIds.includes(node.id) ? children : []

    const allRows = [node, ...(node.children || [])]
    const childDates = (node.children || [])
      .filter(c => c.plannedStart || c.plannedEnd)
      .flatMap(c => [
        c.plannedStart ? new Date(c.plannedStart) : null,
        c.plannedEnd ? new Date(c.plannedEnd) : null,
      ])
      .filter((d): d is Date => d !== null)

    const hasOwnDates = node.plannedStart || node.plannedEnd
    const dayStart = hasOwnDates
      ? node.plannedStart
        ? dayOffset(new Date(node.plannedStart), timelineStart)
        : 0
      : childDates.length > 0
        ? dayOffset(new Date(Math.min(...childDates.map(d => d.getTime()))), timelineStart)
        : 0

    const daySpan = hasOwnDates
      ? node.duration || 1
      : childDates.length > 0
        ? dayOffset(new Date(Math.max(...childDates.map(d => d.getTime()))), timelineStart) -
          dayStart +
          1
        : node.duration || 1

    result.push({
      node,
      depth,
      dayStart,
      daySpan,
      children: childRows,
    })

    if (expandedIds.includes(node.id)) {
      result.push(...childRows)
    }
  }
  return result
}
```

- [ ] **Step 2: 新增 `summarizeParentDates` 工具函数**

Add to `src-next/lib/wbs-gantt-utils.ts`:

```typescript
export function summarizeParentDates(node: WBSNode): { start: string | null; end: string | null } {
  if (!node.children || node.children.length === 0) {
    return { start: node.plannedStart, end: node.plannedEnd }
  }
  const childStarts = node.children
    .map(c => summarizeParentDates(c).start)
    .filter((s): s is string => s !== null)
  const childEnds = node.children
    .map(c => summarizeParentDates(c).end)
    .filter((e): e is string => e !== null)
  return {
    start: childStarts.length > 0 ? childStarts.sort()[0] : node.plannedStart,
    end: childEnds.length > 0 ? childEnds.sort().reverse()[0] : node.plannedEnd,
  }
}
```

- [ ] **Step 3: 新增展开状态下全部节点遍历函数**

Add to `src-next/lib/wbs-gantt-utils.ts`:

```typescript
export function flattenVisibleTree(tree: WBSNode[], expandedIds: number[]): WBSNode[] {
  const result: WBSNode[] = []
  for (const node of tree) {
    result.push(node)
    if (expandedIds.includes(node.id) && node.children) {
      result.push(...flattenVisibleTree(node.children, expandedIds))
    }
  }
  return result
}
```

- [ ] **Step 4: 更新已有测试 + 新增测试**

Update `src-next/lib/__tests__/wbs-gantt-utils.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import {
  parseDependencies,
  getTimelineRange,
  buildGanttRows,
  summarizeParentDates,
  flattenVisibleTree,
} from '../wbs-gantt-utils'
import type { WBSNode } from '@/types/wbs'

describe('parseDependencies', () => {
  it('有效字符串返回数字数组', () => {
    expect(parseDependencies('3,5')).toEqual([3, 5])
  })
  it('null 返回空数组', () => {
    expect(parseDependencies(null)).toEqual([])
  })
  it('空字符串返回空数组', () => {
    expect(parseDependencies('')).toEqual([])
  })
  it('异常格式跳过非法值', () => {
    expect(parseDependencies('1,abc,3')).toEqual([1, 3])
  })
})

describe('getTimelineRange', () => {
  it('有日期节点返回范围', () => {
    const nodes = [
      { plannedStart: '2026-05-01', plannedEnd: '2026-05-10' },
      { plannedStart: '2026-05-15', plannedEnd: '2026-05-20' },
    ] as WBSNode[]
    const { start, end } = getTimelineRange(nodes)
    expect(start <= new Date('2026-05-01')).toBe(true)
    expect(end >= new Date('2026-05-20')).toBe(true)
  })
  it('无日期节点返回当月', () => {
    const { start } = getTimelineRange([])
    expect(start.getMonth()).toBe(new Date().getMonth())
  })
})

describe('buildGanttRows', () => {
  it('扁平节点转为甘特行', () => {
    const nodes = [{ id: 1, plannedStart: '2026-05-10', duration: 5, children: [] }] as WBSNode[]
    const rows = buildGanttRows(nodes, new Date('2026-05-01'), [])
    expect(rows).toHaveLength(1)
    expect(rows[0].dayStart).toBe(9)
    expect(rows[0].daySpan).toBe(5)
    expect(rows[0].depth).toBe(0)
  })

  it('树形展开时包含子节点行', () => {
    const nodes = [
      {
        id: 1,
        plannedStart: '2026-05-01',
        duration: 30,
        children: [{ id: 2, plannedStart: '2026-05-05', duration: 10, children: [] }],
      },
    ] as WBSNode[]
    const rows = buildGanttRows(nodes, new Date('2026-05-01'), [1])
    expect(rows.length).toBeGreaterThanOrEqual(2)
    const childRow = rows.find(r => r.node.id === 2)
    expect(childRow).toBeDefined()
    expect(childRow!.depth).toBe(1)
  })

  it('折叠时不包含子节点行', () => {
    const nodes = [
      {
        id: 1,
        plannedStart: '2026-05-01',
        duration: 30,
        children: [{ id: 2, plannedStart: '2026-05-05', duration: 10, children: [] }],
      },
    ] as WBSNode[]
    const rows = buildGanttRows(nodes, new Date('2026-05-01'), [])
    expect(rows).toHaveLength(1)
    expect(rows[0].node.id).toBe(1)
    expect(rows[0].children).toHaveLength(0)
  })

  it('父节点无日期时自动汇总子节点日期', () => {
    const nodes = [
      {
        id: 1,
        plannedStart: null,
        plannedEnd: null,
        duration: 0,
        children: [
          {
            id: 2,
            plannedStart: '2026-05-05',
            plannedEnd: '2026-05-15',
            duration: 10,
            children: [],
          },
          {
            id: 3,
            plannedStart: '2026-05-20',
            plannedEnd: '2026-05-25',
            duration: 5,
            children: [],
          },
        ],
      },
    ] as WBSNode[]
    const rows = buildGanttRows(nodes, new Date('2026-05-01'), [])
    const parent = rows[0]
    expect(parent.dayStart).toBeGreaterThan(0)
    expect(parent.daySpan).toBeGreaterThanOrEqual(20)
  })
})

describe('summarizeParentDates', () => {
  it('叶子节点返回自身日期', () => {
    const node = { plannedStart: '2026-05-01', plannedEnd: '2026-05-10', children: [] } as WBSNode
    const result = summarizeParentDates(node)
    expect(result.start).toBe('2026-05-01')
    expect(result.end).toBe('2026-05-10')
  })
  it('父节点汇总子节点最早/最晚', () => {
    const node = {
      plannedStart: null,
      plannedEnd: null,
      children: [
        { plannedStart: '2026-05-05', plannedEnd: '2026-05-10', children: [] },
        { plannedStart: '2026-05-01', plannedEnd: '2026-05-20', children: [] },
      ],
    } as WBSNode
    const result = summarizeParentDates(node)
    expect(result.start).toBe('2026-05-01')
    expect(result.end).toBe('2026-05-20')
  })
})

describe('flattenVisibleTree', () => {
  it('展开顶层时返回顶层+展开的子节点', () => {
    const tree = [
      { id: 1, children: [{ id: 2, children: [] }] },
      { id: 3, children: [] },
    ] as WBSNode[]
    const flat = flattenVisibleTree(tree, [1])
    expect(flat.map(n => n.id)).toEqual([1, 2, 3])
  })
  it('全部折叠时只返回顶层', () => {
    const tree = [{ id: 1, children: [{ id: 2, children: [] }] }] as WBSNode[]
    const flat = flattenVisibleTree(tree, [])
    expect(flat.map(n => n.id)).toEqual([1])
  })
})
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npx vitest run src-next/lib/__tests__/wbs-gantt-utils.test.ts`
Expected: ALL PASS

---

## Task 2: 时间轴粒度切换（日/周/月）

**Files:**

- Modify: `src-next/pages/wbs/components/WBSGanttTimeline.tsx`

- [ ] **Step 1: 重写时间轴组件支持粒度切换**

Replace `src-next/pages/wbs/components/WBSGanttTimeline.tsx` completely:

```tsx
import { useMemo } from 'react'
import {
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  format,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { zhCN } from 'date-fns/locale'

export const ZOOM_LEVELS = { day: 30, week: 7, month: 1.5 } as const
export type ZoomLevel = keyof typeof ZOOM_LEVELS

interface WBSGanttTimelineProps {
  startDate: Date
  endDate: Date
  zoom: ZoomLevel
  dayWidth: number
}

export function WBSGanttTimeline({ startDate, endDate, zoom, dayWidth }: WBSGanttTimelineProps) {
  const { topLabels, bottomLabels } = useMemo(() => {
    if (zoom === 'day') {
      const days = eachDayOfInterval({ start: startDate, end: endDate })
      const weeks: { label: string; colSpan: number }[] = []
      let currentWeek = -1
      for (const day of days) {
        const weekNum = Number(format(day, 'I'))
        if (weekNum !== currentWeek) {
          currentWeek = weekNum
          weeks.push({ label: `W${weekNum}`, colSpan: 1 })
        } else {
          weeks[weeks.length - 1].colSpan++
        }
      }
      return {
        topLabels: weeks.map((w, i) => ({
          label: w.label,
          width: w.colSpan * dayWidth,
          key: `w-${i}`,
        })),
        bottomLabels: days.map((d, i) => ({
          label: format(d, 'd'),
          width: dayWidth,
          key: `d-${i}`,
        })),
      }
    }

    if (zoom === 'week') {
      const weeks = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 })
      return {
        topLabels: eachMonthOfInterval({ start: startDate, end: endDate }).map(m => {
          const monthWeeks = weeks.filter(w => w.getMonth() === m.getMonth())
          return {
            label: format(m, 'M月', { locale: zhCN }),
            width: monthWeeks.length * dayWidth,
            key: `m-${format(m, 'yyyy-MM')}`,
          }
        }),
        bottomLabels: weeks.map((w, i) => ({
          label: `W${format(w, 'I')}`,
          width: dayWidth,
          key: `w-${i}`,
        })),
      }
    }

    // zoom === 'month'
    const months = eachMonthOfInterval({ start: startDate, end: endDate })
    return {
      topLabels: [
        {
          label: format(startDate, 'yyyy年', { locale: zhCN }),
          width: months.length * dayWidth,
          key: 'year',
        },
      ],
      bottomLabels: months.map((m, i) => ({
        label: format(m, 'M月', { locale: zhCN }),
        width: dayWidth,
        key: `m-${i}`,
      })),
    }
  }, [startDate, endDate, zoom, dayWidth])

  return (
    <div className="flex-none">
      <div className="flex border-b border-border">
        {topLabels.map(tl => (
          <div
            key={tl.key}
            className="text-[10px] text-muted-foreground text-center border-r border-border py-1 font-medium"
            style={{ width: tl.width, minWidth: tl.width }}
          >
            {tl.label}
          </div>
        ))}
      </div>
      <div className="flex">
        {bottomLabels.map(bl => (
          <div
            key={bl.key}
            className="text-[9px] text-muted-foreground text-center border-r border-border py-0.5"
            style={{ width: bl.width, minWidth: bl.width }}
          >
            {bl.label}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 移除 DAY_WIDTH 常量导出（改为从 store 读取）**

KEY CHANGE: Remove the `const DAY_WIDTH = 30` and `export { DAY_WIDTH }` from this file. The day width now comes from the store's `ganttZoom`.

- [ ] **Step 3: 验证 build**

Run: `npm run build`
Expected: No new errors from this file

---

## Task 3: 甘特条组件修复（移除 opacity + 状态色纯化）

**Files:**

- Modify: `src-next/pages/wbs/components/WBSGanttBar.tsx`

- [ ] **Step 1: 重写甘特条样式（移除 opacity，改用纯色）**

Replace `src-next/pages/wbs/components/WBSGanttBar.tsx` completely:

```tsx
import { useCallback } from 'react'
import type { WBSNode } from '@/types/wbs'
import { useWBSStore } from '@/store/wbsStore'
import { cn } from '@/lib/utils'

const STATUS_BAR_COLOR: Record<string, string> = {
  pending: 'bg-muted',
  in_progress: 'bg-chart-1',
  completed: 'bg-chart-2',
  blocked: 'bg-muted',
}

interface WBSGanttBarProps {
  node: WBSNode
  dayStart: number
  daySpan: number
  dayWidth: number
  depth: number
  isCritical: boolean
  isParent: boolean
  onClick: (id: number) => void
}

export function WBSGanttBar({
  node,
  dayStart,
  daySpan,
  dayWidth,
  isCritical,
  isParent,
  onClick,
}: WBSGanttBarProps) {
  const selectedId = useWBSStore(s => s.selectedId)
  const barColor = STATUS_BAR_COLOR[node.status] || 'bg-muted'
  const left = dayStart * dayWidth
  const width = Math.max(daySpan * dayWidth, dayWidth * 0.5)
  const isSelected = selectedId === node.id

  const handleClick = useCallback(() => onClick(node.id), [node.id, onClick])

  return (
    <div
      className={cn(
        'absolute top-0.5 rounded cursor-pointer transition-shadow hover:shadow-sm',
        isParent ? 'h-3 top-1 bg-muted border' : 'h-6',
        !isParent && barColor,
        isCritical && 'border-l-2 border-chart-1',
        isSelected && 'ring-1 ring-ring',
        node.status === 'blocked' && 'border border-destructive'
      )}
      style={{ left, width }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${node.name}，${node.status}`}
      onKeyDown={e => {
        if (e.key === 'Enter') handleClick()
      }}
    >
      <span
        className={cn(
          'px-2 text-[10px] font-medium truncate block leading-6',
          !isParent && 'text-primary-foreground'
        )}
      >
        {node.name}
      </span>
    </div>
  )
}
```

- [ ] **Step 2: 验证 build**

Run: `npm run build`
Expected: No new errors

---

## Task 4: 甘特图主组件重写（树形+刻度+滚动+汇总）

**Files:**

- Modify: `src-next/pages/wbs/components/WBSGanttChart.tsx` (大改)

- [ ] **Step 1: 完整重写 WBSGanttChart**

Replace `src-next/pages/wbs/components/WBSGanttChart.tsx`:

```tsx
import { useMemo, useCallback } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { useWBSStore } from '@/store/wbsStore'
import {
  getTimelineRange,
  buildGanttRows,
  parseDependencies,
  flattenVisibleTree,
  summarizeParentDates,
} from '@/lib/wbs-gantt-utils'
import { calculateCriticalPath } from '@/lib/wbs-cpm'
import { WBSGanttTimeline, type ZoomLevel, ZOOM_LEVELS } from './WBSGanttTimeline'
import { WBSGanttBar } from './WBSGanttBar'
import { WBS_LEVEL_STYLE } from '../constants/wbs-styles'

const LEFT_COL_WIDTH = 220

export function WBSGanttChart() {
  const tree = useWBSStore(s => s.tree)
  const flatNodes = useWBSStore(s => s.flatNodes)
  const expandedIds = useWBSStore(s => s.expandedIds)
  const selectNode = useWBSStore(s => s.selectNode)
  const toggleExpand = useWBSStore(s => s.toggleExpand)
  const ganttZoom = useWBSStore(s => s.ganttZoom)

  const zoom: ZoomLevel =
    ganttZoom === ZOOM_LEVELS.week ? 'week' : ganttZoom === ZOOM_LEVELS.month ? 'month' : 'day'
  const dayWidth = ganttZoom

  const range = useMemo(() => getTimelineRange(flatNodes), [flatNodes])
  const rows = useMemo(
    () => buildGanttRows(tree, range.start, expandedIds),
    [tree, range.start, expandedIds]
  )

  const visibleNodes = useMemo(() => flattenVisibleTree(tree, expandedIds), [tree, expandedIds])

  const cpmResult = useMemo(() => {
    const cpmNodes = flatNodes.map(n => ({
      id: n.id,
      duration: n.duration || 1,
      dependencies: parseDependencies(n.dependencies),
    }))
    return calculateCriticalPath(cpmNodes)
  }, [flatNodes])

  const totalDays = useMemo(() => {
    const td = Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24))
    // 周/月粒度下除以 7 或 30
    if (zoom === 'week') return Math.ceil(td / 7)
    if (zoom === 'month') return Math.ceil(td / 30)
    return Math.max(1, td)
  }, [range, zoom])

  const handleBarClick = useCallback((id: number) => selectNode(id), [selectNode])

  const ROW_HEIGHT = 28

  if (flatNodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        暂无 WBS 节点，请先在树视图中创建
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 可滚动的右侧区域（时间轴 + 甘特条） */}
      <div className="flex-1 overflow-auto">
        <div className="flex" style={{ minWidth: LEFT_COL_WIDTH + totalDays * dayWidth }}>
          {/* 左侧信息列：sticky */}
          <div
            className="sticky left-0 z-20 bg-background border-r border-border flex-none"
            style={{ width: LEFT_COL_WIDTH }}
          >
            {/* 列头 */}
            <div className="h-12 border-b border-border px-3 flex items-center">
              <span className="text-xs font-semibold text-muted-foreground">任务名称</span>
            </div>
            {/* 行 */}
            {rows.map(row => (
              <div
                key={row.node.id}
                className="flex items-center h-7 border-b border-border/50 hover:bg-muted/50"
              >
                <div style={{ paddingLeft: row.depth * 16 }}>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      toggleExpand(row.node.id)
                    }}
                    className="size-4 inline-flex items-center justify-center rounded hover:bg-muted"
                    aria-label={expandedIds.includes(row.node.id) ? '折叠' : '展开'}
                  >
                    {row.node.children && row.node.children.length > 0 ? (
                      expandedIds.includes(row.node.id) ? (
                        <ChevronDown className="size-3 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="size-3 text-muted-foreground" />
                      )
                    ) : null}
                  </button>
                </div>
                <span
                  className={
                    row.depth === 0
                      ? 'text-xs font-medium truncate'
                      : 'text-xs text-muted-foreground truncate'
                  }
                >
                  {row.node.wbsCode} {row.node.name}
                </span>
              </div>
            ))}
          </div>

          {/* 右侧甘特条区域 */}
          <div className="flex-1 relative">
            <WBSGanttTimeline
              startDate={zoom === 'month' ? range.start : range.start}
              endDate={range.end}
              zoom={zoom}
              dayWidth={dayWidth}
            />
            <div className="relative" style={{ minHeight: rows.length * ROW_HEIGHT }}>
              {rows.map(row => {
                const cpm = cpmResult.get(row.node.id)
                const isParent = (row.node.children && row.node.children.length > 0) ?? false
                const startStr = summarizeParentDates(row.node).start ?? row.node.plannedStart
                const endStr = summarizeParentDates(row.node).end ?? row.node.plannedEnd

                return (
                  <div
                    key={row.node.id}
                    className="relative h-7 border-b border-border/50 flex items-center"
                  >
                    <WBSGanttBar
                      node={row.node}
                      dayStart={row.dayStart}
                      daySpan={row.daySpan}
                      dayWidth={dayWidth}
                      depth={row.depth}
                      isCritical={cpm?.isCritical ?? false}
                      isParent={isParent}
                      onClick={handleBarClick}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 验证 build**

Run: `npm run build`
Expected: No new errors from WBSGanttChart.tsx

---

## Task 5: 工具栏增加缩放切换

**Files:**

- Modify: `src-next/pages/wbs/components/WBSToolbar.tsx`

- [ ] **Step 1: 在工具栏增加缩放 ToggleGroup**

Add zoom ToggleGroup to WBSToolbar. Import ToggleGroup components and use ganttZoom from store.

In `src-next/pages/wbs/components/WBSToolbar.tsx`, add these imports at the top:

```tsx
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ZOOM_LEVELS } from './WBSGanttTimeline'
```

Modify the `WBSToolbar` function to include zoom controls. Add before the closing `</div>` of the toolbar:

```tsx
export function WBSToolbar({ projectCode, activeView, onViewChange }: WBSToolbarProps) {
  const addNode = useWBSStore(s => s.addNode)
  const ganttZoom = useWBSStore(s => s.ganttZoom)
  const setGanttZoom = useWBSStore(s => s.setGanttZoom)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* 视图切换 */}
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
          {VIEW_TABS.map(tab => {
            const isActive = activeView === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => onViewChange(tab.value)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* 缩放切换（仅甘特图视图显示） */}
        {activeView === 'gantt' && (
          <ToggleGroup
            type="single"
            value={String(ganttZoom)}
            onValueChange={v => v && setGanttZoom(Number(v))}
          >
            <ToggleGroupItem value={String(ZOOM_LEVELS.day)} size="sm">
              日
            </ToggleGroupItem>
            <ToggleGroupItem value={String(ZOOM_LEVELS.week)} size="sm">
              周
            </ToggleGroupItem>
            <ToggleGroupItem value={String(ZOOM_LEVELS.month)} size="sm">
              月
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      </div>

      <Button
        size="sm"
        onClick={() => addNode(projectCode, { name: '新建工作包', nodeLevel: 'workPackage' })}
      >
        <Plus className="size-4" />
        新建工作包
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: 验证 build + lint**

Run: `npm run build && npm run lint`
Expected: No new errors

---

## Task 6: E2E 测试追加

**Files:**

- Modify: `e2e/wbs.spec.ts`

- [ ] **Step 1: 追加甘特图增强 E2E 测试**

Append to `e2e/wbs.spec.ts` (inside the `test.describe('WBS 页面')` block):

```typescript
test('甘特图展开/折叠子节点', async ({ page }) => {
  await page.goto('http://localhost:5173/projects/P001/wbs')
  await page.waitForResponse(
    resp => resp.url().includes('/api/projects/P001/wbs') && resp.status() === 200,
    { timeout: 15000 }
  )
  await page.waitForTimeout(1000)

  await page.getByRole('button', { name: '甘特图' }).click()
  await page.waitForTimeout(500)

  // 验证初始状态：存在展开按钮
  const expandBtn = page.locator('button[aria-label="展开"]').first()
  if (await expandBtn.isVisible().catch(() => false)) {
    await expandBtn.click()
    await page.waitForTimeout(300)
    // 验证子节点出现
    await expect(page.locator('button[aria-label="折叠"]').first()).toBeVisible()
  }
})

test('甘特图缩放切换日/周/月', async ({ page }) => {
  await page.goto('http://localhost:5173/projects/P001/wbs')
  await page.waitForResponse(
    resp => resp.url().includes('/api/projects/P001/wbs') && resp.status() === 200,
    { timeout: 15000 }
  )
  await page.waitForTimeout(1000)

  await page.getByRole('button', { name: '甘特图' }).click()
  await page.waitForTimeout(500)

  await page.getByRole('button', { name: '周' }).click()
  await page.waitForTimeout(300)
  await expect(page.getByText(/W\d+/)).toBeVisible()
})

test('甘特图左侧信息列固定', async ({ page }) => {
  await page.goto('http://localhost:5173/projects/P001/wbs')
  await page.waitForResponse(
    resp => resp.url().includes('/api/projects/P001/wbs') && resp.status() === 200,
    { timeout: 15000 }
  )
  await page.waitForTimeout(1000)

  await page.getByRole('button', { name: '甘特图' }).click()
  await page.waitForTimeout(500)

  // 验证左侧列存在
  await expect(page.getByText('任务名称')).toBeVisible()
})
```

- [ ] **Step 2: 运行 E2E 测试**

Run: `npm run test:e2e`
Expected: 全部通过

---

## Task 7: 最终验证

- [ ] **Step 1: lint**

Run: `npm run lint`
Expected: 0 errors

- [ ] **Step 2: build**

Run: `npm run build`
Expected: 无新增错误

- [ ] **Step 3: 单元测试**

Run: `npx vitest run src-next/lib/__tests__/`
Expected: ALL PASS

- [ ] **Step 4: E2E**

Run: `npm run test:e2e`
Expected: ALL PASS
