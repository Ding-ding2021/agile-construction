import { describe, it, expect } from 'vitest'
import { parseDependencies, getTimelineRange, buildGanttRows, summarizeParentDates, flattenVisibleTree } from '../wbs-gantt-utils'
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
    ] as unknown as WBSNode[]
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
  it('扁平节点转为甘特行，无子节点', () => {
    const nodes = [
      { id: 1, plannedStart: '2026-05-10', duration: 5, children: [] },
    ] as unknown as WBSNode[]
    const rows = buildGanttRows(nodes, new Date('2026-05-01'), [])
    expect(rows).toHaveLength(1)
    expect(rows[0].dayStart).toBe(9)
    expect(rows[0].daySpan).toBe(5)
    expect(rows[0].depth).toBe(0)
  })

  it('树形展开时包含子节点行', () => {
    const nodes = [
      { id: 1, plannedStart: '2026-05-01', duration: 30, children: [
        { id: 2, plannedStart: '2026-05-05', duration: 10, children: [] },
      ]},
    ] as unknown as WBSNode[]
    const rows = buildGanttRows(nodes, new Date('2026-05-01'), [1])
    const childRow = rows.find(r => r.node.id === 2)
    expect(childRow).toBeDefined()
    expect(childRow!.depth).toBe(1)
  })

  it('折叠时不包含子节点行', () => {
    const nodes = [
      { id: 1, plannedStart: '2026-05-01', duration: 30, children: [
        { id: 2, plannedStart: '2026-05-05', duration: 10, children: [] },
      ]},
    ] as unknown as WBSNode[]
    const rows = buildGanttRows(nodes, new Date('2026-05-01'), [])
    expect(rows).toHaveLength(1)
    expect(rows[0].node.id).toBe(1)
  })

  it('父节点无日期时自动汇总子节点日期', () => {
    const nodes = [
      { id: 1, plannedStart: null, plannedEnd: null, duration: 0, children: [
        { id: 2, plannedStart: '2026-05-05', plannedEnd: '2026-05-15', duration: 10, children: [] },
        { id: 3, plannedStart: '2026-05-20', plannedEnd: '2026-05-25', duration: 5, children: [] },
      ]},
    ] as unknown as WBSNode[]
    const rows = buildGanttRows(nodes, new Date('2026-05-01'), [])
    const parent = rows[0]
    expect(parent.dayStart).toBeGreaterThan(0)
    expect(parent.daySpan).toBeGreaterThanOrEqual(20)
  })
})

describe('summarizeParentDates', () => {
  it('叶子节点返回自身日期', () => {
    const node = { plannedStart: '2026-05-01', plannedEnd: '2026-05-10', children: [] } as unknown as WBSNode
    const result = summarizeParentDates(node)
    expect(result.start).toBe('2026-05-01')
    expect(result.end).toBe('2026-05-10')
  })
  it('父节点汇总子节点最早/最晚', () => {
    const node = {
      plannedStart: null, plannedEnd: null,
      children: [
        { plannedStart: '2026-05-05', plannedEnd: '2026-05-10', children: [] },
        { plannedStart: '2026-05-01', plannedEnd: '2026-05-20', children: [] },
      ],
    } as unknown as WBSNode
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
    ] as unknown as WBSNode[]
    const flat = flattenVisibleTree(tree, [1])
    expect(flat.map(n => n.id)).toEqual([1, 2, 3])
  })
  it('全部折叠时只返回顶层', () => {
    const tree = [
      { id: 1, children: [{ id: 2, children: [] }] },
    ] as unknown as WBSNode[]
    const flat = flattenVisibleTree(tree, [])
    expect(flat.map(n => n.id)).toEqual([1])
  })
})
