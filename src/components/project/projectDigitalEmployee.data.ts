/**
 * 项目数字员工 mock 数据
 * 用于项目详情页 - 数字员工标签页
 */

import type {
  ProjectAgent,
  AgentTask,
  AgentLogEntry,
  AgentOverviewStats,
  AutoTriggerRule,
  ProjectAgentSettings,
  ProjectSettingsCloudBaseContract,
} from './projectDigitalEmployee.types'

/**
 * Agent 总览统计
 */
export const mockAgentOverviewStats: AgentOverviewStats = {
  totalAgents: 3,
  onlineCount: 2,
  todayProcessed: 47,
  avgResponseTime: '2.3s',
  accuracy: '96.8%',
  totalCalls: 1256,
  tokenUsage: 890456,
}

/**
 * 自动触发规则模板
 */
const autoTriggerRules: AutoTriggerRule[] = [
  {
    id: 'rule-001',
    condition: 'task.assigned && task.priority === "high"',
    action: 'analyze_risk',
    isActive: true,
  },
  {
    id: 'rule-002',
    condition: 'milestone.completed && milestone.acceptance === "pending"',
    action: 'generate_report',
    isActive: true,
  },
  {
    id: 'rule-003',
    condition: 'document.uploaded && document.type === "requirement"',
    action: 'extract_tasks',
    isActive: false,
  },
]

/**
 * 已接入项目的 Agent 列表
 */
export const mockProjectAgents: ProjectAgent[] = [
  {
    id: 'agent-001',
    agentId: 'digi-001',
    name: 'AI 助手',
    subtitle: '智能项目助手',
    description: '提供项目数据分析、文档生成、任务调度等智能化支持',
    capabilities: ['数据分析', '文档生成', '任务调度', '进度预测'],
    version: 'v2.1.0',
    tone: 'blue',
    status: 'online',
    config: {
      dataAccessScope: ['tasks', 'documents'],
      operationPermissions: ['read', 'write'],
      autoTriggerRules: autoTriggerRules,
    },
    metrics: {
      todayProcessed: 18,
      avgResponseTime: '1.8s',
      accuracy: '97.2%',
      totalCalls: 523,
      tokenUsage: 345678,
    },
  },
  {
    id: 'agent-002',
    agentId: 'digi-002',
    name: '自动化测试 Agent',
    subtitle: '持续集成测试专家',
    description: '自动化执行回归测试、性能测试，并生成测试报告',
    capabilities: ['自动化测试', '回归测试', '性能监控', '测试报告生成'],
    version: 'v1.5.2',
    tone: 'green',
    status: 'online',
    config: {
      dataAccessScope: ['tasks'],
      operationPermissions: ['read', 'write'],
      autoTriggerRules: [],
    },
    metrics: {
      todayProcessed: 15,
      avgResponseTime: '3.2s',
      accuracy: '95.6%',
      totalCalls: 412,
      tokenUsage: 234567,
    },
  },
  {
    id: 'agent-003',
    agentId: 'digi-003',
    name: '代码审查 Agent',
    subtitle: '代码质量专家',
    description: '自动审查代码质量、安全性，并提供优化建议',
    capabilities: ['代码审查', '安全检查', '性能优化', '代码规范检查'],
    version: 'v1.3.1',
    tone: 'cyan',
    status: 'busy',
    config: {
      dataAccessScope: ['documents'],
      operationPermissions: ['read'],
      autoTriggerRules: [],
    },
    metrics: {
      todayProcessed: 14,
      avgResponseTime: '2.5s',
      accuracy: '97.8%',
      totalCalls: 321,
      tokenUsage: 310211,
    },
  },
]

/**
 * Agent 任务队列
 */
export const mockAgentTasks: AgentTask[] = [
  {
    id: 'task-001',
    agentId: 'agent-001',
    type: '数据分析',
    input: {
      projectId: 'PRJ-2026-001',
      analysisType: 'progress',
      dateRange: '2026-04-01 ~ 2026-04-14',
    },
    output: {
      progress: 67,
      riskLevel: 'medium',
      recommendations: ['建议加强资源投入', '关注关键路径任务'],
    },
    status: 'completed',
    priority: 'high',
    createdAt: '2026-04-14T09:30:00Z',
    completedAt: '2026-04-14T09:32:45Z',
    duration: 165000,
  },
  {
    id: 'task-002',
    agentId: 'agent-002',
    type: '自动化测试',
    input: {
      testSuite: 'regression',
      modules: ['user-management', 'task-management'],
    },
    status: 'processing',
    priority: 'medium',
    createdAt: '2026-04-14T10:15:00Z',
  },
  {
    id: 'task-003',
    agentId: 'agent-003',
    type: '代码审查',
    input: {
      pullRequestId: 'PR-156',
      repository: 'project-management',
    },
    status: 'pending',
    priority: 'high',
    createdAt: '2026-04-14T10:20:00Z',
  },
  {
    id: 'task-004',
    agentId: 'agent-001',
    type: '文档生成',
    input: {
      documentType: 'weekly-report',
      dateRange: '2026-04-08 ~ 2026-04-14',
    },
    status: 'pending',
    priority: 'low',
    createdAt: '2026-04-14T10:25:00Z',
  },
  {
    id: 'task-005',
    agentId: 'agent-001',
    type: '风险分析',
    input: {
      milestoneId: 'MS-003',
      analysisType: 'completion-risk',
    },
    output: {
      riskScore: 72,
      riskFactors: ['资源不足', '技术依赖'],
      mitigationPlan: '建议增加测试资源，提前准备技术方案',
    },
    status: 'completed',
    priority: 'high',
    createdAt: '2026-04-14T08:45:00Z',
    completedAt: '2026-04-14T08:47:30Z',
    duration: 150000,
  },
  {
    id: 'task-006',
    agentId: 'agent-002',
    type: '性能测试',
    input: {
      testType: 'load-test',
      targetModule: 'api-gateway',
      concurrentUsers: 1000,
    },
    status: 'pending',
    priority: 'medium',
    createdAt: '2026-04-14T10:30:00Z',
  },
  {
    id: 'task-007',
    agentId: 'agent-003',
    type: '安全检查',
    input: {
      scanType: 'dependency-vulnerability',
      projectPath: '/src',
    },
    output: {
      vulnerabilities: 3,
      severity: { high: 1, medium: 2, low: 0 },
      recommendations: ['更新 lodash 到 4.17.21', '修复 axios CVE-2026-1234'],
    },
    status: 'completed',
    priority: 'high',
    createdAt: '2026-04-14T07:00:00Z',
    completedAt: '2026-04-14T07:05:12Z',
    duration: 312000,
  },
  {
    id: 'task-008',
    agentId: 'agent-001',
    type: '进度预测',
    input: {
      projectId: 'PRJ-2026-001',
      predictionType: 'milestone-completion',
      targetMilestone: 'MS-004',
    },
    status: 'pending',
    priority: 'medium',
    createdAt: '2026-04-14T10:35:00Z',
  },
]

/**
 * Agent 运行日志
 */
export const mockAgentLogs: AgentLogEntry[] = [
  {
    id: 'log-001',
    agentId: 'agent-001',
    timestamp: '2026-04-14T09:32:45Z',
    action: '数据分析完成',
    input: {
      analysisType: 'progress',
      projectId: 'PRJ-2026-001',
    },
    output: {
      progress: 67,
      riskLevel: 'medium',
    },
    status: 'success',
  },
  {
    id: 'log-002',
    agentId: 'agent-003',
    timestamp: '2026-04-14T09:15:30Z',
    action: '安全检查失败',
    input: {
      scanType: 'dependency-vulnerability',
      projectPath: '/src',
    },
    output: {
      vulnerabilities: 3,
      severity: { high: 1, medium: 2, low: 0 },
    },
    status: 'error',
    errorMessage: '发现 1 个高危漏洞，需要立即处理',
  },
  {
    id: 'log-003',
    agentId: 'agent-002',
    timestamp: '2026-04-14T08:50:00Z',
    action: '自动化测试启动',
    input: {
      testSuite: 'regression',
      modules: ['user-management'],
    },
    output: {
      status: 'started',
      estimatedDuration: '15min',
    },
    status: 'success',
  },
  {
    id: 'log-004',
    agentId: 'agent-001',
    timestamp: '2026-04-14T08:47:30Z',
    action: '风险分析完成',
    input: {
      milestoneId: 'MS-003',
      analysisType: 'completion-risk',
    },
    output: {
      riskScore: 72,
      riskFactors: ['资源不足', '技术依赖'],
    },
    status: 'success',
  },
  {
    id: 'log-005',
    agentId: 'agent-003',
    timestamp: '2026-04-14T08:30:00Z',
    action: '代码审查超时',
    input: {
      pullRequestId: 'PR-154',
      repository: 'project-management',
    },
    status: 'timeout',
    errorMessage: '审查超时，可能是代码变更量过大',
  },
  {
    id: 'log-006',
    agentId: 'agent-002',
    timestamp: '2026-04-14T07:45:00Z',
    action: '性能测试完成',
    input: {
      testType: 'stress-test',
      targetModule: 'database',
      concurrentUsers: 500,
    },
    output: {
      avgResponseTime: '245ms',
      throughput: '1200 req/s',
      errorRate: '0.2%',
    },
    status: 'success',
  },
  {
    id: 'log-007',
    agentId: 'agent-001',
    timestamp: '2026-04-14T07:20:00Z',
    action: '文档生成完成',
    input: {
      documentType: 'daily-report',
      date: '2026-04-13',
    },
    output: {
      documentUrl: '/reports/daily-2026-04-13.pdf',
      pages: 12,
    },
    status: 'success',
  },
  {
    id: 'log-008',
    agentId: 'agent-003',
    timestamp: '2026-04-14T07:05:12Z',
    action: '安全检查完成',
    input: {
      scanType: 'dependency-vulnerability',
      projectPath: '/src',
    },
    output: {
      vulnerabilities: 3,
      severity: { high: 1, medium: 2, low: 0 },
    },
    status: 'success',
  },
]

/**
 * 可用的 Agent 模板（从数字员工中心选择）
 */
export const availableAgentTemplates = [
  {
    id: 'template-001',
    name: '需求分析 Agent',
    description: '自动分析需求文档，提取功能点和验收标准',
    capabilities: ['需求分析', '功能提取', '验收标准生成'],
    tone: 'violet' as const,
  },
  {
    id: 'template-002',
    name: '进度预测 Agent',
    description: '基于历史数据预测项目进度和风险',
    capabilities: ['进度预测', '风险预警', '资源建议'],
    tone: 'orange' as const,
  },
  {
    id: 'template-003',
    name: '客户沟通 Agent',
    description: '自动化客户沟通，生成沟通记录和会议纪要',
    capabilities: ['沟通记录', '会议纪要', '客户反馈'],
    tone: 'rose' as const,
  },
]

/**
 * 项目设置（规则中枢 + Agent技能）默认mock
 */
export const mockProjectAgentSettings: ProjectAgentSettings = {
  projectCode: 'PRJ-2026-001',
  ruleConfig: {
    version: 'R3.4',
    effectiveStatus: 'active',
    approvalPolicy: 'dual-review',
    warningSeverity: 'high',
    autoEscalation: 'sla-auto-with-notice',
    rules: [
      {
        id: 'rule-gate-001',
        name: '启动门禁通过率下限',
        description: '低于该值时禁止流转到计划阶段',
        value: 100,
        unit: '%',
        thresholdTone: 'blocking',
      },
      {
        id: 'rule-risk-001',
        name: '高风险响应时限',
        description: '超过时限自动升级并通知项目经理',
        value: 4,
        unit: '小时',
        thresholdTone: 'warning',
      },
      {
        id: 'rule-procurement-001',
        name: '关键采购延期阈值',
        description: '超过阈值触发采购风险升级',
        value: 1,
        unit: '天',
        thresholdTone: 'blocking',
      },
      {
        id: 'rule-close-001',
        name: '收尾问题未闭环容忍',
        description: '用于归档门禁的未闭环问题容忍值',
        value: 0,
        unit: '项',
        thresholdTone: 'blocking',
      },
    ],
  },
  skillBindings: [
    {
      id: 'skill-plan-generator',
      name: '开发计划编排',
      description: '根据里程碑、资源与采购依赖生成开发计划建议',
      enabled: true,
      bindings: ['plan'],
      requiresHumanApproval: true,
    },
    {
      id: 'skill-execution-reminder',
      name: '执行催办与升级',
      description: '到期自动催办、超SLA自动升级并可人工接管',
      enabled: true,
      bindings: ['execute', 'monitor'],
      requiresHumanApproval: false,
    },
    {
      id: 'skill-risk-guard',
      name: '风险分级与纠偏建议',
      description: '按风险等级生成措施建议与复核清单',
      enabled: true,
      bindings: ['start', 'plan', 'monitor'],
      requiresHumanApproval: true,
    },
    {
      id: 'skill-close-audit',
      name: '收尾归档审计',
      description: '自动校验验收、结算、问题与资料完整性',
      enabled: true,
      bindings: ['close'],
      requiresHumanApproval: true,
    },
  ],
  takeoverPolicy: {
    slaMinutes: 30,
    allowForceTakeover: true,
    fallbackRole: '项目经理',
    notifyChannel: '站内通知 + 声音提示',
  },
  auditPolicy: {
    retentionDays: 365,
    level: 'strict',
    includeDecisionReason: true,
  },
  lastOperator: '李明（项目经理）',
  lastUpdatedAt: '2026-04-16 11:20',
  changeLogs: [
    {
      id: 'change-001',
      operator: '李明（项目经理）',
      at: '2026-04-16 11:20',
      summary: '将高风险响应时限调整为4小时，并开启自动升级通知',
      scope: 'rule',
    },
    {
      id: 'change-002',
      operator: '王倩（品牌负责人）',
      at: '2026-04-16 10:45',
      summary: '新增收尾归档审计技能并绑定到收尾阶段',
      scope: 'skill',
    },
    {
      id: 'change-003',
      operator: '李明（项目经理）',
      at: '2026-04-16 09:55',
      summary: '接管策略变更：SLA 30分钟未响应可强制转人工',
      scope: 'policy',
    },
  ],
}

/**
 * CloudBase 同步契约（tcb integration）
 */
export const projectSettingsCloudBaseContract: ProjectSettingsCloudBaseContract = {
  integration: 'tcb',
  envId: '待自动注入',
  collection: 'project_settings_rules',
  syncMode: 'manual',
  status: 'pending',
}
