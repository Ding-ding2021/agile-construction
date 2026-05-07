import { describe, it, expect } from 'vitest'
import { calculateCriticalPath, detectCycle } from '../wbs-cpm'
import type { CPMNode } from '../wbs-cpm'

describe('calculateCriticalPath', () => {
  it('单节点，无依赖', () => {
    const nodes: CPMNode[] = [{ id: 1, duration: 5, dependencies: [] }]
    const result = calculateCriticalPath(nodes)
    expect(result.get(1)!.es).toBe(0)
    expect(result.get(1)!.ef).toBe(5)
    expect(result.get(1)!.isCritical).toBe(true)
  })

  it('简单链式依赖：A→B→C', () => {
    const nodes: CPMNode[] = [
      { id: 1, duration: 3, dependencies: [] },
      { id: 2, duration: 4, dependencies: [1] },
      { id: 3, duration: 2, dependencies: [2] },
    ]
    const result = calculateCriticalPath(nodes)
    expect(result.get(3)!.ef).toBe(9)
    expect(result.get(1)!.isCritical).toBe(true)
    expect(result.get(2)!.isCritical).toBe(true)
    expect(result.get(3)!.isCritical).toBe(true)
  })

  it('并行分支 + 不同路径', () => {
    const nodes: CPMNode[] = [
      { id: 1, duration: 2, dependencies: [] },
      { id: 2, duration: 5, dependencies: [] },
      { id: 3, duration: 1, dependencies: [1, 2] },
    ]
    const result = calculateCriticalPath(nodes)
    expect(result.get(3)!.es).toBe(5)
    expect(result.get(1)!.slack).toBe(3)
    expect(result.get(2)!.isCritical).toBe(true)
  })

  it('空节点列表', () => {
    const result = calculateCriticalPath([])
    expect(result.size).toBe(0)
  })
})

describe('detectCycle', () => {
  it('无环路返回 false', () => {
    const nodes: CPMNode[] = [
      { id: 1, duration: 1, dependencies: [] },
      { id: 2, duration: 1, dependencies: [1] },
    ]
    expect(detectCycle(nodes)).toBe(false)
  })

  it('有环路返回 true', () => {
    const nodes: CPMNode[] = [
      { id: 1, duration: 1, dependencies: [2] },
      { id: 2, duration: 1, dependencies: [1] },
    ]
    expect(detectCycle(nodes)).toBe(true)
  })
})
