import { getDatabase } from '../store/sqlite'

// ─── 类型定义 ────────────────────────────────────────────────

export interface TaskData {
  id: number
  status: string
  assigneeId: string | null
  assigneeType: string | null
}

export interface AcceptanceData {
  id: number
  status: string
  reviewResult: string | null
}

export interface ProcurementData {
  id: number
  status: string
  settlement_status?: string
}

export interface RiskData {
  id: number
  riskLevel: string
  status: string
}

export interface ProjectData {
  id: number
  parentStatus: string
  progress: number
  plannedOpenDate: string | null
}

export interface HealthIndicator {
  status: '正常' | '关注' | '预警' | '严重'
  indicators: Array<{
    label: string
    value: string
    level: 'normal' | 'warning' | 'critical' | 'info'
  }>
}

export interface ProjectAggregation {
  parentStatus: string
  executionStatus: string
  acceptanceStatus: string
  settlementStatus: string
  dispatchStatus: string
  health: HealthIndicator
  progress: number
  pendingCounts: {
    dispatch: number
    execution: number
    acceptance: number
    settlement: number
  }
}

// ─── 纯函数：各维度聚合 ──────────────────────────────────────

export function computeExecutionStatus(tasks: TaskData[]): string {
  if (tasks.length === 0) return '未开始'

  const allTerminal = tasks.every(t => ['已完成', '已关闭'].includes(t.status))
  if (allTerminal) return '已完成'

  const anyActive = tasks.some(t =>
    ['执行中', '待提交', '待验收', '不通过', '已完成'].includes(t.status)
  )
  if (anyActive) return '进行中'

  return '未开始'
}

export function computeAcceptanceStatus(acceptanceItems: AcceptanceData[]): string {
  if (acceptanceItems.length === 0) return '待验收'

  const hasRework = acceptanceItems.some(t => t.reviewResult === 'reject' || t.status === '整改中')
  if (hasRework) return '整改中'

  const hasPending = acceptanceItems.some(t => t.status === '待验收' || t.status === '验收中')
  if (hasPending) return '验收中'

  const allPassed = acceptanceItems.every(t => t.reviewResult === 'pass' || t.status === '已通过')
  if (allPassed) return '已通过'

  return '待验收'
}

export function computeSettlementStatus(procurements: ProcurementData[]): string {
  if (procurements.length === 0) return '未结算'

  const s = (p: ProcurementData): string => p.settlement_status || p.status

  const allSettled = procurements.every(p => s(p) === '已结算')
  if (allSettled) return '已结算'

  const anySettling = procurements.some(p => ['待结算', '结算中'].includes(s(p)))
  if (anySettling) return '结算中'

  return '未结算'
}

export function computeDispatchStatus(tasks: TaskData[]): string {
  if (tasks.length === 0) return '未派单'

  const allAssigned = tasks.every(t => t.assigneeId !== null && t.assigneeId !== '')
  if (allAssigned) return '已派完'

  const anyAssigned = tasks.some(t => t.assigneeId !== null && t.assigneeId !== '')
  if (anyAssigned) return '派单中'

  return '未派单'
}

const PARENT_ORDER = ['启动', '计划', '执行', '监控', '收尾', '中止']

export function computeParentStatus(
  project: ProjectData,
  hasWbsNodes: boolean,
  hasExecutingTask: boolean,
  hasAcceptanceItem: boolean,
  allAccepted: boolean
): string {
  if (project.parentStatus === '中止') return '中止'

  let target = '启动'
  if (allAccepted) {
    target = '收尾'
  } else if (hasAcceptanceItem) {
    target = '监控'
  } else if (hasExecutingTask) {
    target = '执行'
  } else if (hasWbsNodes) {
    target = '计划'
  }

  const currentIdx = PARENT_ORDER.indexOf(project.parentStatus)
  const targetIdx = PARENT_ORDER.indexOf(target)

  return targetIdx > currentIdx ? target : project.parentStatus
}

export function computeHealth(
  risks: RiskData[],
  progress: number,
  overdueTaskCount: number,
  unassignedTaskCount: number,
  slaOverdueCount: number
): HealthIndicator {
  const activeRisks = risks.filter(r => r.status !== '已关闭')

  const hasBlocking = activeRisks.some(r => r.riskLevel === '严重')
  const hasHighRisk = activeRisks.some(r => r.riskLevel === '高')
  const hasMediumLowRisk = activeRisks.some(r => r.riskLevel === '中' || r.riskLevel === '低')

  let status: '正常' | '关注' | '预警' | '严重'
  if (hasBlocking || slaOverdueCount > 0) {
    status = '严重'
  } else if (hasHighRisk || overdueTaskCount > 0) {
    status = '预警'
  } else if (hasMediumLowRisk) {
    status = '关注'
  } else {
    status = '正常'
  }

  const progressDev = `${progress > 0 ? '+' : ''}${progress}%`
  const indicators: HealthIndicator['indicators'] = [
    { label: '进度偏差', value: progressDev, level: progress > 15 ? 'warning' : 'normal' },
    {
      label: 'SLA超时',
      value: `${slaOverdueCount}项`,
      level: slaOverdueCount > 0 ? 'critical' : 'normal',
    },
    {
      label: '风险项',
      value: `${activeRisks.length}项`,
      level: hasHighRisk ? 'warning' : hasMediumLowRisk ? 'warning' : 'normal',
    },
    {
      label: '未分配',
      value: `${unassignedTaskCount}项`,
      level: unassignedTaskCount > 0 ? 'info' : 'normal',
    },
  ]

  return { status, indicators }
}

// ─── 编排函数：查询 DB → 调用纯函数 ─────────────────────────

export function aggregateProjectStatus(projectId: number): ProjectAggregation {
  const db = getDatabase()

  const project = db
    .prepare(
      `
    SELECT id, parent_status as parentStatus, progress, planned_open_date as plannedOpenDate
    FROM projects WHERE id = ?
  `
    )
    .get(projectId) as ProjectData | undefined

  if (!project) {
    throw new Error(`Project ${projectId} not found`)
  }

  // 查询任务的依赖数据和派单状态
  const tasks = db
    .prepare(
      `
    SELECT id, status, assignee_id as assigneeId, assignee_type as assigneeType
    FROM project_tasks WHERE project_id = ?
  `
    )
    .all(projectId) as TaskData[]

  // 查询验收检查项
  const acceptanceItems = db
    .prepare(
      `
    SELECT cl.id, cl.result as status, cl.result as reviewResult
    FROM checklist_items cl
    JOIN project_tasks pt ON pt.id = cl.task_id
    WHERE pt.project_id = ?
  `
    )
    .all(projectId) as AcceptanceData[]

  // 查询采购订单（结算维度）
  const procurements = db
    .prepare(
      `
    SELECT id, status, NULL as settlementStatus
    FROM procurement_orders
    WHERE project_code = (SELECT code FROM projects WHERE id = ?)
  `
    )
    .all(projectId) as ProcurementData[]

  // 查询风险
  const risks = db
    .prepare(
      `
    SELECT id, level as riskLevel, status
    FROM project_risks WHERE project_id = ?
  `
    )
    .all(projectId) as RiskData[]

  // 查询 WBS 节点数
  const wbsCount = db
    .prepare(
      `
    SELECT COUNT(*) as cnt FROM wbs_nodes WHERE project_code = (
      SELECT code FROM projects WHERE id = ?
    )
  `
    )
    .get(projectId) as { cnt: number }

  // 计算 SLA 超时数量
  const slaOverdueCount = (
    db
      .prepare(
        `
    SELECT COUNT(*) as cnt FROM project_tasks
    WHERE project_id = ? AND status = '执行中'
      AND due_date IS NOT NULL AND due_date < datetime('now')
  `
      )
      .get(projectId) as { cnt: number }
  ).cnt

  // 计算未分配任务数
  const unassignedCount = tasks.filter(t => t.assigneeId === null || t.assigneeId === '').length

  // 调用纯函数
  const executionStatus = computeExecutionStatus(tasks)
  const acceptanceStatus = computeAcceptanceStatus(acceptanceItems)
  const settlementStatus = computeSettlementStatus(procurements)
  const dispatchStatus = computeDispatchStatus(tasks)

  const hasWbsNodes = wbsCount.cnt > 0
  const hasExecutingTask = tasks.some(t =>
    ['执行中', '待提交', '待验收', '不通过'].includes(t.status)
  )
  const hasAcceptanceItem = acceptanceItems.length > 0
  const allAccepted =
    acceptanceItems.length > 0 &&
    acceptanceItems.every(t => t.reviewResult === 'pass' || t.status === '已通过')

  const parentStatus = computeParentStatus(
    project,
    hasWbsNodes,
    hasExecutingTask,
    hasAcceptanceItem,
    allAccepted
  )

  const progress =
    tasks.length > 0
      ? Math.round(
          (tasks.filter(t => ['已完成', '已关闭'].includes(t.status)).length / tasks.length) * 100
        )
      : 0

  const health = computeHealth(risks, progress, 0, unassignedCount, slaOverdueCount)

  return {
    parentStatus,
    executionStatus,
    acceptanceStatus,
    settlementStatus,
    dispatchStatus,
    health,
    progress,
    pendingCounts: {
      dispatch: tasks.filter(t => t.assigneeId === null || t.assigneeId === '').length,
      execution: tasks.filter(t => !['已完成', '已关闭'].includes(t.status)).length,
      acceptance: acceptanceItems.filter(t => t.reviewResult !== 'pass' && t.status !== '已通过')
        .length,
      settlement: procurements.filter(p => {
        const s = p.settlement_status || p.status
        return s !== '已结算'
      }).length,
    },
  }
}
