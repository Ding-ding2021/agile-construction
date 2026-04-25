/**
 * 项目数字员工类型定义
 * 用于项目详情页 - 数字员工标签页
 */

/**
 * Agent 配置范围
 */
export type DataAccessScope = 'tasks' | 'documents' | 'financials'

/**
 * Agent 操作权限
 */
export type OperationPermission = 'read' | 'write' | 'approve'

/**
 * 自动触发规则
 */
export type AutoTriggerRule = {
  id: string
  condition: string // e.g., "task.assigned && task.priority === 'high'"
  action: string // e.g., "analyze_risk"
  isActive: boolean
}

/**
 * Agent 配置
 */
export type AgentConfig = {
  dataAccessScope: DataAccessScope[]
  operationPermissions: OperationPermission[]
  autoTriggerRules: AutoTriggerRule[]
}

/**
 * Agent 性能指标
 */
export type AgentMetrics = {
  todayProcessed: number
  avgResponseTime: string
  accuracy: string
  totalCalls: number
  tokenUsage: number
}

/**
 * 项目 Agent（数字员工）
 */
export type ProjectAgent = {
  id: string
  agentId: string // 关联数字员工中心
  name: string
  subtitle: string
  description: string
  capabilities: string[]
  version: string
  tone: 'blue' | 'cyan' | 'orange' | 'green' | 'violet' | 'rose'
  status: 'online' | 'offline' | 'busy'
  config: AgentConfig
  metrics: AgentMetrics
}

/**
 * Agent 任务状态
 */
export type AgentTaskStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * Agent 任务优先级
 */
export type AgentTaskPriority = 'low' | 'medium' | 'high'

/**
 * Agent 任务
 */
export type AgentTask = {
  id: string
  agentId: string
  type: string
  input: Record<string, unknown>
  output?: Record<string, unknown>
  status: AgentTaskStatus
  priority: AgentTaskPriority
  createdAt: string
  completedAt?: string
  duration?: number // ms
}

/**
 * Agent 日志状态
 */
export type AgentLogStatus = 'success' | 'error' | 'timeout'

/**
 * Agent 日志条目
 */
export type AgentLogEntry = {
  id: string
  agentId: string
  timestamp: string
  action: string
  input: Record<string, unknown>
  output?: Record<string, unknown>
  status: AgentLogStatus
  errorMessage?: string
}

/**
 * Agent 总览统计
 */
export type AgentOverviewStats = {
  totalAgents: number
  onlineCount: number
  todayProcessed: number
  avgResponseTime: string
  accuracy: string
  totalCalls: number
  tokenUsage: number
}

/**
 * 项目生命周期阶段（用于技能绑定）
 */
export type ProjectLifecyclePhase = 'start' | 'plan' | 'execute' | 'monitor' | 'close'

/**
 * 项目规则配置 - 审批策略
 */
export type ApprovalPolicy = 'single-manager' | 'dual-review'

/**
 * 项目规则配置 - 预警等级
 */
export type WarningSeverity = 'low' | 'medium' | 'high' | 'critical'

/**
 * 项目规则配置 - 自动升级策略
 */
export type AutoEscalationPolicy = 'manual-only' | 'sla-auto' | 'sla-auto-with-notice'

/**
 * 单条规则项
 */
export type ProjectRuleSetting = {
  id: string
  name: string
  description: string
  value: number
  unit?: string
  thresholdTone: 'safe' | 'warning' | 'blocking'
}

/**
 * 项目规则配置
 */
export type ProjectRuleConfig = {
  version: string
  effectiveStatus: 'draft' | 'active' | 'paused'
  approvalPolicy: ApprovalPolicy
  warningSeverity: WarningSeverity
  autoEscalation: AutoEscalationPolicy
  rules: ProjectRuleSetting[]
}

/**
 * Agent 技能绑定
 */
export type AgentSkillBinding = {
  id: string
  name: string
  description: string
  enabled: boolean
  bindings: ProjectLifecyclePhase[]
  requiresHumanApproval: boolean
}

/**
 * 人工接管策略
 */
export type HumanTakeoverPolicy = {
  slaMinutes: number
  allowForceTakeover: boolean
  fallbackRole: string
  notifyChannel: string
}

/**
 * 审计策略
 */
export type ProjectSettingsAuditPolicy = {
  retentionDays: number
  level: 'basic' | 'standard' | 'strict'
  includeDecisionReason: boolean
}

/**
 * 配置变更记录
 */
export type ProjectSettingsChangeLog = {
  id: string
  operator: string
  at: string
  summary: string
  scope: 'rule' | 'skill' | 'policy'
}

/**
 * 项目设置数据模型（规则+技能）
 */
export type ProjectAgentSettings = {
  projectCode: string
  ruleConfig: ProjectRuleConfig
  skillBindings: AgentSkillBinding[]
  takeoverPolicy: HumanTakeoverPolicy
  auditPolicy: ProjectSettingsAuditPolicy
  lastOperator: string
  lastUpdatedAt: string
  changeLogs: ProjectSettingsChangeLog[]
}

/**
 * 项目设置与CloudBase同步契约（预留）
 */
export type ProjectSettingsCloudBaseContract = {
  integration: 'tcb'
  envId: string
  collection: string
  syncMode: 'manual' | 'scheduled'
  status: 'pending' | 'connected'
  lastSyncAt?: string
}
