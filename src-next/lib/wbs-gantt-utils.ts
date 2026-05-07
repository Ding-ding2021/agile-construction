import { format, differenceInDays, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from 'date-fns'
import type { WBSNode } from '@/types/wbs'

export interface GanttRow {
  node: WBSNode
  depth: number
  dayStart: number
  daySpan: number
  children: GanttRow[]
}

export function parseDependencies(deps: string | null): number[] {
  if (!deps || deps.trim() === '') return []
  return deps.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n))
}

export function allDatesBetween(start: string | null, end: string | null): Date[] {
  if (!start || !end) return []
  const s = new Date(start)
  const e = new Date(end)
  return eachDayOfInterval({ start: s, end: e })
}

export function getTimelineRange(nodes: WBSNode[]): { start: Date; end: Date } {
  const dates = nodes.flatMap(n => {
    const d: Date[] = []
    if (n.plannedStart) d.push(new Date(n.plannedStart))
    if (n.plannedEnd) d.push(new Date(n.plannedEnd))
    return d
  })
  if (dates.length === 0) {
    const now = new Date()
    return { start: startOfMonth(now), end: endOfMonth(now) }
  }
  const min = new Date(Math.min(...dates.map(d => d.getTime())))
  const max = new Date(Math.max(...dates.map(d => d.getTime())))
  return { start: startOfWeek(min, { weekStartsOn: 1 }), end: endOfWeek(max, { weekStartsOn: 1 }) }
}

export function dayOffset(date: Date, timelineStart: Date): number {
  return differenceInDays(date, timelineStart)
}

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

    const childDates = (node.children || [])
      .filter(c => c.plannedStart || c.plannedEnd)
      .flatMap(c => [c.plannedStart ? new Date(c.plannedStart) : null, c.plannedEnd ? new Date(c.plannedEnd) : null])
      .filter((d): d is Date => d !== null)

    const hasOwnDates = node.plannedStart || node.plannedEnd
    const dayStartVal = hasOwnDates
      ? (node.plannedStart ? dayOffset(new Date(node.plannedStart), timelineStart) : 0)
      : childDates.length > 0
        ? dayOffset(new Date(Math.min(...childDates.map(d => d.getTime()))), timelineStart)
        : 0

    const daySpanVal = hasOwnDates
      ? (node.duration || 1)
      : childDates.length > 0
        ? dayOffset(new Date(Math.max(...childDates.map(d => d.getTime()))), timelineStart) - dayStartVal + 1
        : (node.duration || 1)

    result.push({
      node,
      depth,
      dayStart: dayStartVal,
      daySpan: Math.max(daySpanVal, 1),
      children: childRows,
    })

    if (expandedIds.includes(node.id)) {
      result.push(...childRows)
    }
  }
  return result
}

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

export function flattenVisibleTree(
  tree: WBSNode[],
  expandedIds: number[]
): WBSNode[] {
  const result: WBSNode[] = []
  for (const node of tree) {
    result.push(node)
    if (expandedIds.includes(node.id) && node.children) {
      result.push(...flattenVisibleTree(node.children, expandedIds))
    }
  }
  return result
}

export function isBusinessDay(date: Date, holidays: Date[] = []): boolean {
  if (isWeekend(date)) return false
  return !holidays.some(h => format(h, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
}

export function addBusinessDays(start: Date, days: number, holidays: Date[] = []): Date {
  let current = new Date(start)
  let added = 0
  while (added < days) {
    current = addDays(current, 1)
    if (isBusinessDay(current, holidays)) added++
  }
  return current
}
