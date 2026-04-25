export type TaskViewMode = 'grid' | 'list' | 'kanban' | 'calendar';

export type TaskStatus =
  | '待创建'
  | '待分配'
  | '待执行'
  | '执行中'
  | '待提交'
  | '待验收'
  | '不通过'
  | '已完成'
  | '已关闭';

export type TaskStatusTone = 'blue' | 'neutral' | 'green' | 'red' | 'orange';

export type TaskRiskLevel = '高风险' | '中风险' | '低风险';
export type TaskRiskTone = 'red' | 'orange' | 'blue';

export type TaskSlaStatus = '正常' | '即将超时' | '超时';
export type TaskSlaTone = 'green' | 'orange' | 'red';

export type TaskPredecessorStatus = '无前置任务' | '前置已完成' | '前置进行中' | '前置阻塞';
export type TaskStandardBindingStatus = '已绑定' | '未绑定';

export interface TaskItem {
  name: string;
  code: string;
  projectName: string;
  parentPath: string;
  status: TaskStatus;
  statusTone: TaskStatusTone;
  owner: string;
  plannedStartAt: string;
  plannedEndAt: string;
  slaStatus: TaskSlaStatus;
  slaTone: TaskSlaTone;
  riskLevel: TaskRiskLevel;
  riskTone: TaskRiskTone;
  predecessorStatus: TaskPredecessorStatus;
  remindCount: number;
  standardBindingStatus: TaskStandardBindingStatus;
  isBlocked: boolean;
  progress: number;
}

export interface TaskStats {
  total: number;
  pendingAssign: number;
  executing: number;
  pendingSubmit: number;
  pendingAcceptance: number;
  slaWarningOrOverdue: number;
  blocked: number;
}

export interface TaskFilters {
  statKey: 'all' | 'pendingAssign' | 'executing' | 'pendingSubmit' | 'pendingAcceptance' | 'slaRisk' | 'blocked';
  searchQuery: string;
  groupBy: 'none' | 'project' | 'status' | 'owner';
  sortBy: 'default' | 'planned-end-asc' | 'risk-desc' | 'remind-desc';
  status?: TaskStatus;
  riskLevel?: TaskRiskLevel;
  slaStatus?: TaskSlaStatus;
  blockedOnly?: boolean;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  total: number;
}
