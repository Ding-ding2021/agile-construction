export type TaskViewMode = 'grid' | 'list' | 'kanban' | 'calendar'

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

export type TaskStatusTone = 'blue' | 'neutral' | 'green' | 'red' | 'orange'

export type TaskRiskLevel = '高风险' | '中风险' | '低风险'
export type TaskRiskTone = 'red' | 'orange' | 'blue'

export type TaskSlaStatus = '正常' | '即将超时' | '超时'
export type TaskSlaTone = 'green' | 'orange' | 'red'

export type TaskPredecessorStatus = '无前置任务' | '前置已完成' | '前置进行中' | '前置阻塞'
export type TaskStandardBindingStatus = '已绑定' | '未绑定'

export type TaskType = '标准任务' | '关键任务' | '里程碑' | '检查点'

export type WorkItemSourceType = 'manual' | 'template' | 'wbs' | 'standard'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type TaskNodeLevelType = 'project_root' | 'work_package' | 'task' | 'subtask'

export type TaskAssigneeType = 'internal' | 'external'
export type TaskSnapshotStatus = '已生成' | '待生成' | '未生成'

// ─── TaskItem：核心任务数据模型（P0 字段必填，其余渐进补齐） ───
// PRD 58 字段，当前逐步补齐中。P0 核心字段 10 个：
// id, code, name, projectId, status, assigneeId, plannedStartAt, plannedEndAt, createdBy, createdAt
export interface TaskItem {
  /** 任务唯一 ID（P0） */
  id: string
  /** 任务编码（P0） */
  code: string
  /** 任务名称（P0） */
  name: string
  /** 所属项目 ID（P0）替换 projectName 字符串 */
  projectId: string
  /** 父任务 ID，null 表示顶层任务（P0）。替换 parentPath 字符串 */
  parentTaskId: string | null
  /** 任务状态（P0） */
  status: TaskStatus
  /** 执行人 ID（P0） */
  assigneeId: string
  /** 计划开始时间（P0） */
  plannedStartAt: string
  /** 计划结束时间（P0） */
  plannedEndAt: string
  /** 创建人（P0） */
  createdBy: string
  /** 创建时间（P0） */
  createdAt: string

  // ── 展示用派生字段 ──
  /** 执行人姓名（展示用，非存储字段） */
  assigneeName: string
  /** 所属项目名称（展示用，非存储字段） */
  projectName: string

  // ── P1 字段 ──
  /** 节点层级类型 */
  nodeLevelType: TaskNodeLevelType
  /** 优先级 */
  priority: TaskPriority
  /** 进度 0-100 */
  progress: number
  /** 任务类型 */
  taskType: TaskType
  /** 来源方式 */
  sourceType: WorkItemSourceType
  /** 风险等级 */
  riskLevel: TaskRiskLevel
  /** SLA 状态 */
  slaStatus: TaskSlaStatus
  /** 任务描述 */
  taskDescription?: string
  /** 是否必做（P1） */
  requiredFlag: boolean
  /** 是否里程碑节点（P1） */
  milestoneFlag: boolean
  /** 责任角色 */
  ownerRole?: string
  /** 执行方类型 internal|vendor */
  assigneeType?: TaskAssigneeType
  /** 所属品牌 ID */
  brandId?: string
  /** 所属门店 ID */
  storeId?: string

  // ── P2 字段 ──
  /** 实际开始时间 */
  actualStartAt?: string
  /** 实际结束时间 */
  actualEndAt?: string
  /** 阻塞原因，null 表示未阻塞 */
  blockedReason?: string
  /** 前置任务状态（实时计算） */
  predecessorStatus: TaskPredecessorStatus
  /** 催办次数 */
  remindCount: number
  /** 标准绑定状态 */
  standardBindingStatus: TaskStandardBindingStatus
  /** 标准快照 ID */
  standardSnapshotId?: string
  /** 快照状态 */
  snapshotStatus?: TaskSnapshotStatus
  /** 是否阻塞 */
  isBlocked: boolean
  /** 标签 */
  tags: string[]
  /** 工作包 ID */
  workPackageId?: string
  /** SLA 规则 ID */
  slaRuleId?: string
  /** 计划工时（小时） */
  plannedWorkHours?: number
  /** 实际工时（小时） */
  actualWorkHours?: number
  /** 派生来源任务 ID（整改链路） */
  derivedFromTaskId?: string
  /** 是否整改任务 */
  isRectification: boolean
  /** 整改原因 */
  rectificationReason?: string
  /** 关闭原因 */
  closeReason?: string
  /** 重开次数 */
  reopenCount: number
  /** 更新人 */
  updatedBy?: string
  /** 更新时间 */
  updatedAt?: string

  // ── 以下为已弃用字段，兼容过渡期 ──
  /**
   * @deprecated 使用 parentTaskId 替代。保留过渡期兼容，新代码不应使用。
   * 读取时从 parentTaskId + tree 结构计算
   */
  parentPath?: string
  /** @deprecated 展示用色调，由 status 计算 */
  statusTone: TaskStatusTone
  /** @deprecated 展示用色调，由 riskLevel 计算 */
  riskTone: TaskRiskTone
  /** @deprecated 展示用色调，由 slaStatus 计算 */
  slaTone: TaskSlaTone
  /** @deprecated 使用 assigneeId + assigneeName 替代 */
  owner: string
}

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
  id: string
  fromTaskId: string
  toTaskId: string
  relationType: 'finish_start' | 'start_start' | 'finish_finish' | 'start_finish'
  /** 展示用 */
  fromTaskName?: string
  toTaskName?: string
}

export interface TaskEventLog {
  id: string
  taskId: string
  eventType: 'status_change' | 'field_change' | 'comment' | 'attachment' | 'assign' | 'favorite'
  eventAction: string
  beforeValue?: unknown
  afterValue?: unknown
  operatorId: string
  operatorSource: 'user' | 'agent' | 'system'
  createdAt: string
}

export interface TaskSubmission {
  id: string
  taskId: string
  submissionType: 'normal' | 'rectification' | 'supplement'
  description?: string
  attachmentIds: string[]
  status: 'submitted' | 'rejected' | 'accepted'
  submittedBy: string
  submittedAt: string
  reviewedBy?: string
  reviewResult?: 'pass' | 'reject'
  reviewComment?: string
  reviewedAt?: string
}

export interface TaskFlowLog {
  id: string
  action: string
  operator: string
  detail: string
  time: string
}

export interface TaskDetail extends TaskItem {
  /** 执行方类型 */
  assigneeType: TaskAssigneeType
  executionStandards: string[]
  acceptanceStandards: string[]
  checklist: TaskChecklistItem[]
  attachments: TaskAttachment[]
  relations: TaskRelation[]
  flowLogs: TaskFlowLog[]
  /** 提交记录 */
  submissions: TaskSubmission[]
  /** 事件日志（替代 flowLogs） */
  eventLogs: TaskEventLog[]
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
  草稿: ['待分配'],
  待分配: ['待执行', '已关闭'],
  待执行: ['执行中', '已关闭'],
  执行中: ['待提交', '已暂停', '不通过', '已关闭'],
  已暂停: ['执行中', '已关闭'],
  待提交: ['待验收', '执行中', '不通过'],
  待验收: ['已完成', '不通过'],
  不通过: ['待执行', '执行中', '已关闭'],
  已完成: ['待分配'],
  已关闭: ['待分配'],
}

export const isTaskReadonlyStatus = (status: TaskStatus): boolean =>
  READONLY_TASK_STATUS.includes(status)

export const TASK_STATUS_TRANSITION_MAP = AVAILABLE_STATUS_TRANSITIONS

export const resolveAvailableStatusOptions = (currentStatus: TaskStatus): TaskStatus[] => {
  return AVAILABLE_STATUS_TRANSITIONS[currentStatus] ?? [currentStatus]
}
