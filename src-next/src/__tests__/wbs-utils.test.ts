import { describe, it, expect } from 'vitest'
import { buildWBSTree, calculateParentProgress } from '@/lib/wbs-utils'
import type { WBSNode } from '@/types/wbs'

const makeNode = (overrides: Partial<WBSNode>): WBSNode => ({
  id: 0,
  projectCode: 'CY',
  wbsCode: '',
  name: '',
  nodeLevel: 'task',
  status: 'pending',
  progress: 0,
  plannedStart: null,
  plannedEnd: null,
  duration: 0,
  assignee: null,
  parentId: null,
  sortOrder: 0,
  dependencies: null,
  children: [],
  ...overrides,
})

describe('buildWBSTree', () => {
  it('should build tree from flat nodes', () => {
    const nodes = [
      makeNode({ id: 1, parentId: null }),
      makeNode({ id: 2, parentId: 1 }),
      makeNode({ id: 3, parentId: 1 }),
    ]
    const tree = buildWBSTree(nodes)
    expect(tree).toHaveLength(1)
    expect(tree[0].children).toHaveLength(2)
  })

  it('should return empty array for empty input', () => {
    expect(buildWBSTree([])).toEqual([])
  })

  it('should handle orphan nodes as roots', () => {
    const nodes = [makeNode({ id: 1, parentId: null }), makeNode({ id: 2, parentId: 99 })]
    const tree = buildWBSTree(nodes)
    expect(tree).toHaveLength(2)
  })
})

describe('calculateParentProgress', () => {
  it('should return leaf node progress directly', () => {
    const node = makeNode({ progress: 50 })
    expect(calculateParentProgress(node)).toBe(50)
  })

  it('should calculate average of children', () => {
    const node = makeNode({
      progress: 0,
      children: [makeNode({ progress: 100 }), makeNode({ progress: 50 })],
    })
    expect(calculateParentProgress(node)).toBe(75)
  })

  it('should exclude blocked children from calculation', () => {
    const node = makeNode({
      progress: 0,
      children: [makeNode({ progress: 100 }), makeNode({ progress: 0, status: 'blocked' })],
    })
    expect(calculateParentProgress(node)).toBe(100)
  })
})
