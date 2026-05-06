export type WBSNodeLevel = 'workPackage' | 'task' | 'subtask'

export type WBSStatus = 'pending' | 'in_progress' | 'completed' | 'blocked'

export interface WBSNode {
  id: number
  projectCode: string
  wbsCode: string
  name: string
  nodeLevel: WBSNodeLevel
  status: WBSStatus
  progress: number
  plannedStart: string | null
  plannedEnd: string | null
  duration: number
  assignee: string | null
  parentId: number | null
  sortOrder: number
  dependencies: string | null
  children: WBSNode[]
}
