import type { ProjectRisk, IssueLog } from '@/types/project-detail'

const MOCK_RISKS: ProjectRisk[] = [
  {
    id: 1,
    projectId: 0,
    description: '钢结构供应商产能不足',
    level: 'high',
    probability: '60%',
    impact: '工期延误2周',
    mitigation: '已联系备选供应商',
    status: 'active',
    assignee: '张三',
    dueDate: '2026-05-01',
  },
  {
    id: 2,
    projectId: 0,
    description: '雨季施工影响外墙作业',
    level: 'medium',
    probability: '70%',
    impact: '工期延误1周',
    mitigation: '准备防雨棚和排水方案',
    status: 'active',
    assignee: '李四',
    dueDate: '2026-05-15',
  },
  {
    id: 3,
    projectId: 0,
    description: '设计变更导致返工',
    level: 'medium',
    probability: '40%',
    impact: '增加成本5万',
    mitigation: '加强图纸会审',
    status: 'mitigated',
    assignee: '王五',
    dueDate: null,
  },
  {
    id: 4,
    projectId: 0,
    description: '现场安全事故风险',
    level: 'high',
    probability: '30%',
    impact: '人员伤亡',
    mitigation: '安全培训+每日巡检',
    status: 'active',
    assignee: '赵六',
    dueDate: '2026-06-01',
  },
  {
    id: 5,
    projectId: 0,
    description: '资金拨付延迟',
    level: 'low',
    probability: '50%',
    impact: '材料采购延迟',
    mitigation: '提前申请+滚动预算',
    status: 'closed',
    assignee: '项目经理',
    dueDate: null,
  },
]

const MOCK_ISSUES: IssueLog[] = [
  {
    id: 1,
    projectCode: '',
    title: '现场施工噪音投诉',
    severity: 'medium',
    status: '处理中',
    assignee: '张三',
    createdAt: '2026-04-10',
  },
  {
    id: 2,
    projectCode: '',
    title: '材料进场时间与计划不符',
    severity: 'low',
    status: '已解决',
    assignee: '李四',
    createdAt: '2026-04-05',
  },
  {
    id: 3,
    projectCode: '',
    title: '分包商人员不足',
    severity: 'high',
    status: '处理中',
    assignee: '王五',
    createdAt: '2026-04-15',
  },
]

export async function getProjectRisks(projectCode: string): Promise<ProjectRisk[]> {
  void projectCode
  await new Promise(r => setTimeout(r, 200))
  return MOCK_RISKS
}

export async function getIssueLogs(projectCode: string): Promise<IssueLog[]> {
  void projectCode
  await new Promise(r => setTimeout(r, 150))
  return MOCK_ISSUES.map(i => ({ ...i, projectCode }))
}

export async function getRiskSummary(projectCode: string): Promise<{
  totalRisks: number
  activeRisks: number
  highRisks: number
  openIssues: number
}> {
  void projectCode
  await new Promise(r => setTimeout(r, 100))
  return {
    totalRisks: MOCK_RISKS.length,
    activeRisks: MOCK_RISKS.filter(r => r.status === 'active').length,
    highRisks: MOCK_RISKS.filter(r => r.level === 'high').length,
    openIssues: MOCK_ISSUES.filter(i => i.status === '处理中').length,
  }
}
