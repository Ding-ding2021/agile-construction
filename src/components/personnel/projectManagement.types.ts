/**
 * 项目管理页面的类型定义
 */

export type ProjectStage = '启动' | '准备' | '计划' | '执行' | '监控' | '收尾'

export type ProjectViewMode = 'list' | 'grid' | 'kanban' | 'calendar' | 'map'

export interface ProjectFilters {
  statKey: 'all' | 'active' | 'pendingAcceptance' | 'risk'
  searchQuery: string
  groupBy: 'none' | 'stage' | 'owner' | 'brand'
  sortBy: 'default' | 'name-asc' | 'progress-desc' | 'planned-open-asc' | 'risk-desc'
  stage?: ProjectStage
  status?: string
  riskOnly: boolean
}

export interface ProjectRisk {
  id: string
  level: 'low' | 'medium' | 'high' | 'critical'
  description: string
  impact: string
  status: 'active' | 'mitigated' | 'closed'
  assignee?: string
  dueDate?: string
}

export interface ProjectPhase {
  name: string
  status: 'completed' | 'in-progress' | 'pending'
  progress: number
}

export interface ProjectMilestone {
  name: string
  status: 'completed' | 'in-progress' | 'pending'
  dueDate: string
}

export interface ProjectMember {
  id: string
  userId?: string
  name: string
  role: string
  avatar?: string
  department?: string
  phone?: string
  email?: string
}

export interface ProjectItem {
  name: string
  code: string
  brand: string
  stage: ProjectStage
  status: string
  statusTone: 'blue' | 'yellow' | 'green' | 'red'
  progress: number
  milestone: string
  tasks: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | null
  riskCount: number
  plannedOpenDate: string
  owner: string
  templateId?: string
  acceptanceStatus?: string
  settlementStatus?: string
  executionStatus?: string
  risks?: ProjectRisk[]
  phases?: ProjectPhase[]
  milestones?: ProjectMilestone[]
  pendingExecutionCount?: number
  pendingAcceptanceCount?: number
  actualOpenDate?: string
}

export interface CreateProjectFormData {
  projectName: string
  storeName: string
  storeType: string
  city: string
  region: string
  projectType: string
  projectStatus: string
  projectOwner: string
  plannedStartDate: string
  plannedEndDate: string
  plannedOpenDate: string
  specialRequirements: string
}

export type CreateProjectFormErrors = Partial<Record<keyof CreateProjectFormData, string>>

export interface ProjectStats {
  total: number
  active: number
  pendingAcceptance: number
  risk: number
}

export interface PaginationState {
  currentPage: number
  pageSize: number
  total: number
}

export type ProjectTaskStatus = 'completed' | 'in-progress' | 'pending' | 'paused' | 'cancelled'

export interface ProjectTask {
  id: string
  name: string
  status: ProjectTaskStatus
  assignee?: string
  dueDate?: string
  progress: number
  level: number
  children?: ProjectTask[]
}

export interface ProjectDetail {
  project: ProjectItem
  milestones: Array<{
    name: string
    status: 'completed' | 'in-progress' | 'pending'
    dueDate: string
  }>
  tasks: Array<{
    name: string
    assignee: string
    status: 'completed' | 'in-progress' | 'pending'
  }>
  risks: Array<{
    level: 'low' | 'medium' | 'high' | 'critical'
    description: string
    impact: string
  }>
}
