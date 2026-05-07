export interface CPMNode {
  id: number
  duration: number
  dependencies: number[]
}

export interface CPMResult {
  es: number
  ef: number
  ls: number
  lf: number
  slack: number
  isCritical: boolean
}

export function calculateCriticalPath(nodes: CPMNode[]): Map<number, CPMResult> {
  const result = new Map<number, CPMResult>()

  const sorted = topologicalSort(nodes)
  if (sorted.length === 0) return result

  const es = new Map<number, number>()
  const ef = new Map<number, number>()
  for (const node of sorted) {
    const predEFs = node.dependencies.map(id => ef.get(id) ?? 0)
    es.set(node.id, Math.max(...predEFs, 0))
    ef.set(node.id, es.get(node.id)! + node.duration)
  }

  const maxEF = Math.max(...Array.from(ef.values()), 0)

  const ls = new Map<number, number>()
  const lf = new Map<number, number>()
  for (const node of [...sorted].reverse()) {
    const succLS = nodes
      .filter(n => n.dependencies.includes(node.id))
      .map(n => ls.get(n.id) ?? maxEF)
    lf.set(node.id, Math.min(...succLS, maxEF))
    ls.set(node.id, lf.get(node.id)! - node.duration)
  }

  for (const node of nodes) {
    const slack = ls.get(node.id)! - es.get(node.id)!
    result.set(node.id, {
      es: es.get(node.id)!,
      ef: ef.get(node.id)!,
      ls: ls.get(node.id)!,
      lf: lf.get(node.id)!,
      slack,
      isCritical: slack === 0,
    })
  }

  return result
}

function topologicalSort(nodes: CPMNode[]): CPMNode[] {
  const visited = new Set<number>()
  const stack: CPMNode[] = []
  const visiting = new Set<number>()

  function dfs(node: CPMNode) {
    if (visiting.has(node.id)) return
    if (visited.has(node.id)) return
    visiting.add(node.id)
    for (const depId of node.dependencies) {
      const dep = nodes.find(n => n.id === depId)
      if (dep) dfs(dep)
    }
    visiting.delete(node.id)
    visited.add(node.id)
    stack.push(node)
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) dfs(node)
  }

  return stack
}

export function detectCycle(nodes: CPMNode[]): boolean {
  const visited = new Set<number>()
  const recStack = new Set<number>()

  function dfs(id: number): boolean {
    if (recStack.has(id)) return true
    if (visited.has(id)) return false
    visited.add(id)
    recStack.add(id)
    const node = nodes.find(n => n.id === id)
    if (node) {
      for (const depId of node.dependencies) {
        if (dfs(depId)) return true
      }
    }
    recStack.delete(id)
    return false
  }

  for (const node of nodes) {
    if (dfs(node.id)) return true
  }
  return false
}
