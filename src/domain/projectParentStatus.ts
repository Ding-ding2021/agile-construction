export type ParentStatus = '启动' | '计划' | '执行' | '收尾' | '归档'

export type SubStatusProgressItem = {
  subStatusId: string
  name: string
  sortOrder: number
  isMilestone: boolean
  completed: boolean
  completedAt?: string
  linkedTaskCode?: string
}

export type SubStatusProgress = {
  parentStatus: ParentStatus
  items: SubStatusProgressItem[]
}

export const PARENT_STATUS_FLOW: ParentStatus[] = ['启动', '计划', '执行', '收尾', '归档']

export const getNextParentStatus = (current: ParentStatus): ParentStatus | null => {
  const idx = PARENT_STATUS_FLOW.indexOf(current)
  if (idx === -1 || idx >= PARENT_STATUS_FLOW.length - 1) return null
  return PARENT_STATUS_FLOW[idx + 1]
}

export const getParentStatusLabel = (status: ParentStatus): string => {
  const labels: Record<ParentStatus, string> = {
    启动: '启动',
    计划: '计划',
    执行: '执行（含监控）',
    收尾: '收尾',
    归档: '归档',
  }
  return labels[status]
}

export const getParentStatusTone = (status: ParentStatus): 'blue' | 'yellow' | 'green' | 'red' => {
  const tones: Record<ParentStatus, 'blue' | 'yellow' | 'green' | 'red'> = {
    启动: 'blue',
    计划: 'blue',
    执行: 'green',
    收尾: 'yellow',
    归档: 'green',
  }
  return tones[status]
}

export const allMilestonesCompleted = (progress: SubStatusProgress): boolean => {
  const milestones = progress.items.filter(item => item.isMilestone)
  if (milestones.length === 0) return true
  return milestones.every(m => m.completed)
}

export const getCurrentSubStatus = (progress: SubStatusProgress): SubStatusProgressItem | null => {
  const incomplete = progress.items.find(item => !item.completed)
  return incomplete ?? null
}

export const getSubStatusProgressPercent = (progress: SubStatusProgress): number => {
  if (progress.items.length === 0) return 100
  const completed = progress.items.filter(item => item.completed).length
  return Math.round((completed / progress.items.length) * 100)
}
