export type TaskStatus =
  | '草稿'
  | '待分配'
  | '待执行'
  | '执行中'
  | '已暂停'
  | '待提交'
  | '待验收'
  | '不通过'
  | '已完成'
  | '已关闭'

export interface TaskItem {
  id: string
  code: string
  name: string
  status: TaskStatus
  owner: string
  assigneeName?: string
  projectId: string
  projectName: string
  plannedEndAt: string
  plannedStartAt?: string
  progress: number
  priority: string
  slaStatus?: string
  tags: string[]
}

export interface TaskSubtaskNode {
  id: string
  code: string
  name: string
  status: TaskStatus
  assigneeName: string
  progress: number
  priority: string
  plannedEndAt: string
  depth: number
  children?: TaskSubtaskNode[]
}

export interface TaskFlowLog {
  id: string
  action: string
  operator: string
  detail: string
  time: string
}

export interface TaskAttachment {
  id: string
  fileName: string
  fileSizeKb: number
  uploader: string
}

export interface TaskRelation {
  id: string
  fromTaskId: string
  toTaskId: string
  relationType: 'finish_start' | 'start_start' | 'finish_finish' | 'start_finish'
  fromTaskName?: string
  toTaskName?: string
}

export interface TaskChecklistItem {
  id: string
  name: string
  result?: 'pass' | 'fail' | 'pending'
  clauseId?: number | null
  inspector?: string | null
  inspectedAt?: string | null
  remark?: string | null
}

export interface TaskSubmission {
  id: string
  taskId: string
  submissionType: 'normal' | 'rectification' | 'supplement'
  description?: string
  status: 'submitted' | 'rejected' | 'accepted'
  submittedBy: string
  submittedAt: string
  reviewedBy?: string
  reviewResult?: 'pass' | 'reject'
  reviewComment?: string
  reviewedAt?: string
}

export interface TaskDetail extends TaskItem {
  actualStartAt?: string
  actualEndAt?: string
  riskLevel?: string
  projectCode?: string
  assigneeId?: string
  parentId?: number
  requiredFlag?: boolean
  ownerRole?: string
  brandId?: string
  storeId?: string
  workPackageId?: string
  slaRuleId?: string
  plannedWorkHours?: number
  actualWorkHours?: number
  updatedBy?: string
  updatedAt?: string
  standardClauseIds: number[]
  acceptanceClauseIds: number[]
  checklist: TaskChecklistItem[]
  standardBindingStatus?: string
  snapshotStatus?: string
  parentTaskId?: string
  taskType: string
  sourceType: string
  nodeLevelType: string
  description?: string
  blockedReason?: string
  isBlocked: boolean
  remindCount: number
  predecessorStatus: string
  milestoneFlag: boolean
  isRectification: boolean
  rectificationReason?: string
  reopenCount: number
  derivedFromTaskId?: string
  closeReason?: string
  assigneeType: string
  createdBy: string
  createdAt: string
  flowLogs: TaskFlowLog[]
  attachments: TaskAttachment[]
  relations: TaskRelation[]
  submissions: TaskSubmission[]
  subtasks: TaskSubtaskNode[]
}
