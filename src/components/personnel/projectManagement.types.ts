/**
 * 项目管理页面的类型定义
 */

export type ProjectStage = '启动' | '准备' | '执行' | '收尾';

export type ProjectViewMode = 'list' | 'grid' | 'kanban' | 'calendar' | 'map';

export interface ProjectFilters {
  statKey: 'all' | 'active' | 'pendingAcceptance' | 'risk';
  searchQuery: string;
  groupBy: 'none' | 'stage' | 'owner' | 'brand';
  sortBy: 'default' | 'name-asc' | 'progress-desc' | 'planned-open-asc' | 'risk-desc';
  stage?: ProjectStage;
  status?: string;
  riskOnly: boolean;
}

export interface ProjectItem {
  name: string;
  code: string;
  brand: string;
  stage: ProjectStage;
  status: string;
  statusTone: 'blue' | 'yellow' | 'green' | 'red';
  progress: number;
  milestone: string;
  tasks: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | null;
  riskCount: number;
  plannedOpenDate: string;
  owner: string;
}

export interface ProjectStats {
  total: number;
  active: number;
  pendingAcceptance: number;
  risk: number;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  total: number;
}

export interface ProjectDetail {
  project: ProjectItem;
  milestones: Array<{
    name: string;
    status: 'completed' | 'in-progress' | 'pending';
    dueDate: string;
  }>;
  tasks: Array<{
    name: string;
    assignee: string;
    status: 'completed' | 'in-progress' | 'pending';
  }>;
  risks: Array<{
    level: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    impact: string;
  }>;
}
