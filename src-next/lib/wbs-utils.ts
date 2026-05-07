import type { WBSNode } from '@/types/wbs'

export function buildWBSTree(nodes: WBSNode[]): WBSNode[] {
  const map = new Map<number, WBSNode>()
  const roots: WBSNode[] = []

  nodes.forEach(n => map.set(n.id, { ...n, children: [] }))
  nodes.forEach(n => {
    const node = map.get(n.id)!
    if (n.parentId != null && map.has(n.parentId)) {
      map.get(n.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

export function calculateParentProgress(node: WBSNode): number {
  if (node.children.length === 0) return node.progress
  const activeChildren = node.children.filter(c => c.status !== 'blocked')
  if (activeChildren.length === 0) return node.progress
  const sum = activeChildren.reduce((acc, c) => acc + calculateParentProgress(c), 0)
  return Math.round(sum / activeChildren.length)
}

export function getNodeLevelBadge(level: WBSNode['nodeLevel']): string {
  const map = { workPackage: '工作包', task: '任务', subtask: '子任务' }
  return map[level]
}

export function parseDependencies(deps: string | null): number[] {
  if (!deps || deps.trim() === '') return []
  return deps.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n))
}

export const WBS_STATUS_LABEL: Record<WBSNode['status'], string> = {
  pending: '待开始',
  in_progress: '进行中',
  completed: '已完成',
  blocked: '阻塞',
}
