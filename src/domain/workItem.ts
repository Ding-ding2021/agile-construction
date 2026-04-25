export type WorkItemSourceType = 'project' | 'maintenance' | 'inspection' | 'compliance' | 'adHoc'

export type WorkItemKind = 'project' | 'work_package' | 'task' | 'subtask' | 'milestone'

export type WorkItemStatus = 'completed' | 'in-progress' | 'delayed' | 'planned'

export type WorkItemDomain = '工程' | '设备' | '运营' | '合规' | '通用'

export interface WorkItem {
  id: string
  sourceType: WorkItemSourceType
  projectCode?: string
  taskCode?: string
  parentId: string | null
  kind: WorkItemKind
  wbsCode: string
  name: string
  owner: string
  status: WorkItemStatus
  progress: number
  planStart: string
  planEnd: string
  dependencies: string[]
  isCritical: boolean
  stage?: string
  domain?: WorkItemDomain
  groupId?: string
  groupLabel?: string
  groupSummary?: string
  tags?: string[]
  description?: string
}

export const WORK_ITEM_SOURCE_LABEL: Record<WorkItemSourceType, string> = {
  project: '项目任务',
  maintenance: '维修保养',
  inspection: '巡检任务',
  compliance: '合规任务',
  adHoc: '临时任务',
}

export const WORK_ITEM_STATUS_LABEL: Record<WorkItemStatus, string> = {
  completed: '已完成',
  'in-progress': '进行中',
  delayed: '延误',
  planned: '未开始',
}

export const toWorkItemStatus = (status: string, blocked = false): WorkItemStatus => {
  if (blocked) {
    return 'delayed'
  }

  if (status === '已完成' || status === '已关闭' || status === 'completed') {
    return 'completed'
  }

  if (
    status === '执行中' ||
    status === '待提交' ||
    status === '待验收' ||
    status === 'in-progress'
  ) {
    return 'in-progress'
  }

  if (status === '不通过' || status === '超时' || status === 'delayed') {
    return 'delayed'
  }

  return 'planned'
}
