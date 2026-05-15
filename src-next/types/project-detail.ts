export interface ProjectDetail extends ProjectOverview {
  phases: ProjectPhase[]
  milestones: ProjectMilestone[]
  risks: ProjectRisk[]
  members: ProjectMember[]
}

export interface ProjectOverview {
  id: number
  code: string
  name: string
  brand: string
  parentStatus: string | null
  healthStatus: string | null
  dispatchStatus: string | null
  executionStatus: string | null
  acceptanceStatus: string | null
  settlementStatus: string | null
  stage: string
  progress: number
  budget: string | null
  teamSize: number | null
  description: string | null
  owner: string | null
  riskLevel: string | null
  riskCount: number
  plannedOpenDate: string | null
  actualOpenDate: string | null
  createdAt: string
  updatedAt: string
}

export interface ProjectPhase {
  id: number
  projectId: number
  name: string
  status: string
  sortOrder: number
}

export interface ProjectMilestone {
  id: number
  projectId: number
  name: string
  dueDate: string | null
  status: string
  assignee: string | null
  completedDate: string | null
}

export interface ProjectRisk {
  id: number
  projectId: number
  description: string
  level: string
  probability: string | null
  impact: string | null
  mitigation: string | null
  status: string
  assignee: string | null
  dueDate: string | null
}

export interface ProjectMember {
  id: number
  projectId: number
  userId: string
  name: string
  role: string
  avatar: string | null
  department: string | null
  phone: string | null
  email: string | null
}

export interface CostOrder {
  id: number
  projectCode: string
  title: string
  category: string
  amount: number
  status: string
  applicant: string
  createdAt: string
}

export interface QualityCheckItem {
  id: number
  projectCode: string
  name: string
  category: string
  status: 'pass' | 'fail' | 'pending'
  inspector: string
  checkedAt: string | null
}

export interface ProjectHealthResponse {
  projectCode: string
  health: {
    status: '正常' | '关注' | '预警' | '严重'
    indicators: Array<{
      label: string
      value: string
      level: 'normal' | 'warning' | 'critical' | 'info'
    }>
  }
  executionStatus: string
  acceptanceStatus: string
  settlementStatus: string
  dispatchStatus: string
  parentStatus: string
  progress: number
  pendingCounts: {
    dispatch: number
    execution: number
    acceptance: number
    settlement: number
  }
}

export interface IssueLog {
  id: number
  projectCode: string
  title: string
  severity: 'low' | 'medium' | 'high'
  status: string
  assignee: string | null
  createdAt: string
}

export const TAB_KEYS = [
  'overview',
  'scope',
  'progress',
  'cost',
  'quality',
  'resource',
  'risk',
  'settings',
] as const

export type TabKey = (typeof TAB_KEYS)[number]

export const TAB_LABELS: Record<TabKey, string> = {
  overview: '项目概览',
  scope: '范围与任务',
  progress: '进度管理',
  cost: '成本与采购',
  quality: '质量与验收',
  resource: '资源与人员',
  risk: '风险与沟通',
  settings: '项目设置',
}
