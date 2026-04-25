import type { WorkItem } from '../domain/workItem'
import { WORK_ITEM_STATUS_LABEL } from '../domain/workItem'
import { getProjectWorkItems } from './workItems'
import type { ProjectItem } from './projects'

export type WbsNodeType = 'project' | 'work_package' | 'task' | 'subtask'
export type WbsNodeStatus = 'completed' | 'in-progress' | 'delayed' | 'planned'

export type ProjectWbsNode = {
  id: string
  parentId: string | null
  level: number
  type: WbsNodeType
  wbsCode: string
  name: string
  owner: string
  status: WbsNodeStatus
  statusLabel: string
  progress: number
  planStart: string
  planEnd: string
  dependencies: string[]
  children: ProjectWbsNode[]
}

export type ProjectWbsData = {
  nodes: ProjectWbsNode[]
  focusNodeId: string
  defaultExpandedIds: string[]
  updatedAt: string
  summary: {
    workPackageCount: number
    taskCount: number
    subtaskCount: number
    delayedCount: number
  }
}

const getLevelFromWbsCode = (wbsCode: string): number => Math.max(wbsCode.split('.').length - 1, 0)

const toWbsType = (kind: WorkItem['kind']): WbsNodeType => {
  if (kind === 'project') return 'project'
  if (kind === 'work_package') return 'work_package'
  if (kind === 'subtask') return 'subtask'
  return 'task'
}

const toWbsNodes = (workItems: WorkItem[]): ProjectWbsNode[] => {
  const nodeMap = new Map<string, ProjectWbsNode>()
  const nameMap = new Map(workItems.map(item => [item.id, item.name] as const))

  workItems.forEach(item => {
    const type = toWbsType(item.kind)
    nodeMap.set(item.id, {
      id: item.id,
      parentId: item.parentId,
      level: getLevelFromWbsCode(item.wbsCode),
      type,
      wbsCode: item.wbsCode,
      name: item.name,
      owner: item.owner,
      status: item.status,
      statusLabel: WORK_ITEM_STATUS_LABEL[item.status],
      progress: item.progress,
      planStart: item.planStart,
      planEnd: item.planEnd,
      dependencies: item.dependencies.map(
        dependencyId => nameMap.get(dependencyId) ?? dependencyId
      ),
      children: [],
    })
  })

  const roots: ProjectWbsNode[] = []
  nodeMap.forEach(node => {
    if (!node.parentId) {
      roots.push(node)
      return
    }
    const parent = nodeMap.get(node.parentId)
    if (parent) {
      parent.children.push(node)
    }
  })

  return roots
}

const countNodesByType = (nodes: ProjectWbsNode[], type: WbsNodeType): number => {
  let count = 0
  const visit = (list: ProjectWbsNode[]) => {
    list.forEach(node => {
      if (node.type === type) count += 1
      if (node.children.length > 0) visit(node.children)
    })
  }
  visit(nodes)
  return count
}

const countDelayedNodes = (nodes: ProjectWbsNode[]): number => {
  let count = 0
  const visit = (list: ProjectWbsNode[]) => {
    list.forEach(node => {
      if (node.status === 'delayed') count += 1
      if (node.children.length > 0) visit(node.children)
    })
  }
  visit(nodes)
  return count
}

const collectDefaultExpandedIds = (workItems: WorkItem[]): string[] =>
  workItems
    .filter(item => item.kind === 'project' || item.kind === 'work_package')
    .map(item => item.id)

export const getProjectWbsData = (project: ProjectItem): ProjectWbsData => {
  const workItems = getProjectWorkItems(project)
  const nodes = toWbsNodes(workItems)
  const focusNode =
    workItems.find(item => item.kind === 'task' && item.status !== 'completed') ??
    workItems.find(item => item.kind === 'task') ??
    workItems[0]

  return {
    nodes,
    focusNodeId: focusNode?.id ?? `${project.code}-p0`,
    defaultExpandedIds: collectDefaultExpandedIds(workItems),
    updatedAt: '今日 09:30',
    summary: {
      workPackageCount: countNodesByType(nodes, 'work_package'),
      taskCount: countNodesByType(nodes, 'task'),
      subtaskCount: countNodesByType(nodes, 'subtask'),
      delayedCount: countDelayedNodes(nodes),
    },
  }
}
