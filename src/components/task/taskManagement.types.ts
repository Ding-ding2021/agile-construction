export type TaskViewMode = 'grid' | 'list' | 'kanban' | 'calendar'

export type TaskStatus =
  | '待创建'
  | '待分配'
  | '待执行'
  | '执行中'
  | '待提交'
  | '待验收'
  | '不通过'
  | '已完成'
  | '已关闭'

export type TaskStatusTone = 'blue' | 'neutral' | 'green' | 'red' | 'orange'

export type TaskRiskLevel = '高风险' | '中风险' | '低风险'
export type TaskRiskTone = 'red' | 'orange' | 'blue'

export type TaskSlaStatus = '正常' | '即将超时' | '超时'
export type TaskSlaTone = 'green' | 'orange' | 'red'

export type TaskPredecessorStatus = '无前置任务' | '前置已完成' | '前置进行中' | '前置阻塞'
export type TaskStandardBindingStatus = '已绑定' | '未绑定'

export type TaskType = '标准任务' | '关键任务' | '里程碑' | '检查点'

export type WorkItemSourceType = 'manual' | 'template' | 'wbs' | 'standard'

export interface TaskItem {
  name: string
  code: string
  projectName: string
  parentPath: string
  status: TaskStatus
  statusTone: TaskStatusTone
  owner: string
  plannedStartAt: string
  plannedEndAt: string
  slaStatus: TaskSlaStatus
  slaTone: TaskSlaTone
  riskLevel: TaskRiskLevel
  riskTone: TaskRiskTone
  predecessorStatus: TaskPredecessorStatus
  remindCount: number
  standardBindingStatus: TaskStandardBindingStatus
  isBlocked: boolean
  progress: number
  taskType?: TaskType
  sourceType?: WorkItemSourceType
  taskDescription?: string
  standardSnapshotId?: string
  snapshotStatus?: TaskSnapshotStatus
}

export type TaskAssigneeType = 'internal' | 'external'
export type TaskSnapshotStatus = '已生成' | '待生成' | '未生成'

export interface TaskChecklistItem {
  id: string
  label: string
  done: boolean
}

export interface TaskAttachment {
  id: string
  fileName: string
  fileSizeKb: number
  uploader: string
}

export interface TaskRelation {
  code: string
  name: string
  type: '前置任务' | '后置任务' | '阻塞任务' | '关联任务'
}

export interface TaskFlowLog {
  id: string
  action: string
  operator: string
  detail: string
  time: string
}

export interface TaskDetail extends TaskItem {
  taskType: TaskType
  assigneeName?: string
  assigneeType: TaskAssigneeType
  actualStartAt?: string
  actualEndAt?: string
  blockedReason?: string
  snapshotStatus?: TaskSnapshotStatus
  standardSnapshotId?: string
  executionStandards: string[]
  acceptanceStandards: string[]
  checklist: TaskChecklistItem[]
  attachments: TaskAttachment[]
  relations: TaskRelation[]
  flowLogs: TaskFlowLog[]
}

export interface TaskStats {
  total: number
  pendingAssign: number
  executing: number
  pendingSubmit: number
  pendingAcceptance: number
  slaWarningOrOverdue: number
  blocked: number
}

export interface TaskFilters {
  statKey:
    | 'all'
    | 'pendingAssign'
    | 'executing'
    | 'pendingSubmit'
    | 'pendingAcceptance'
    | 'slaRisk'
    | 'blocked'
  searchQuery: string
  groupBy: 'none' | 'project' | 'status' | 'owner'
  sortBy: 'default' | 'planned-end-asc' | 'risk-desc' | 'remind-desc'
  status?: TaskStatus
  riskLevel?: TaskRiskLevel
  slaStatus?: TaskSlaStatus
  blockedOnly?: boolean
}

export interface PaginationState {
  currentPage: number
  pageSize: number
  total: number
}

const READONLY_TASK_STATUS: TaskStatus[] = ['已完成', '已关闭']

const AVAILABLE_STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  待创建: ['待分配', '待执行'],
  待分配: ['待执行'],
  待执行: ['执行中', '不通过'],
  执行中: ['待提交', '不通过'],
  待提交: ['待验收', '不通过'],
  待验收: ['已完成', '不通过'],
  不通过: ['待执行', '执行中'],
  已完成: ['已完成'],
  已关闭: ['已关闭'],
}

export const isTaskReadonlyStatus = (status: TaskStatus): boolean =>
  READONLY_TASK_STATUS.includes(status)

export const TASK_STATUS_TRANSITION_MAP = AVAILABLE_STATUS_TRANSITIONS

export const resolveAvailableStatusOptions = (currentStatus: TaskStatus): TaskStatus[] => {
  return AVAILABLE_STATUS_TRANSITIONS[currentStatus] ?? [currentStatus]
}
