import type { ParentStatus, SubStatusProgress } from './projectParentStatus'
import { allMilestonesCompleted } from './projectParentStatus'

// ─── 向后兼容：保留旧的 ProjectStatus 类型 ──────────────────────
export type ProjectStatus =
  | '待立项'
  | '待确认'
  | '待拆解'
  | '执行中'
  | '待验收'
  | '整改中'
  | '待结算'
  | '已归档'
  | '已中止'

// ─── 新旧状态映射（向后兼容） ──────────────────────────────────
export const legacyStatusMap: Record<ParentStatus, ProjectStatus> = {
  启动: '待立项',
  计划: '待拆解',
  执行: '执行中',
  收尾: '待结算',
  归档: '已归档',
}

export const parentStatusFromLegacy = (status: ProjectStatus): ParentStatus => {
  const map: Record<ProjectStatus, ParentStatus> = {
    待立项: '启动',
    待确认: '启动',
    待拆解: '计划',
    执行中: '执行',
    待验收: '执行',
    整改中: '执行',
    待结算: '收尾',
    已归档: '归档',
    已中止: '启动',
  }
  return map[status] ?? '启动'
}

// ─── Guard 上下文（模板驱动） ────────────────────────────────────
export type GuardContext = {
  hasContainer: boolean
  hasApproval: boolean
  hasMilestones: boolean
  hasTaskTree: boolean
  hasStandardBinding: boolean
  keyTasksCompleted: boolean
  acceptancePassed: boolean
  hasAcceptanceFeedback: boolean
  rectificationClosed: boolean
  settlementCompleted: boolean
}

export type GuardResult = {
  ok: boolean
  reason?: string
}

export type ProjectStatusTransitionOption = {
  toStatus: ProjectStatus
  label: string
  requiresReason?: boolean
}

export type ProjectStatusLogEntry = {
  id: string
  type: 'transition' | 'hook'
  at: string
  operator: string
  message: string
  from?: ProjectStatus | ParentStatus
  to?: ProjectStatus | ParentStatus
  reason?: string
}

// ─── 向后兼容：保留旧的状态数组和转换（供未改动的代码使用） ────
export const projectStatusOptions: ProjectStatus[] = [
  '待立项',
  '待确认',
  '待拆解',
  '执行中',
  '待验收',
  '整改中',
  '待结算',
  '已归档',
  '已中止',
]

export const allowedTransitions: Record<ProjectStatus, ProjectStatus[]> = {
  待立项: ['待确认', '已中止'],
  待确认: ['待拆解', '已中止'],
  待拆解: ['执行中', '已中止'],
  执行中: ['待验收', '整改中', '已中止'],
  待验收: ['待结算', '整改中', '已中止'],
  整改中: ['待验收', '已中止'],
  待结算: ['已归档', '整改中', '已中止'],
  已归档: [],
  已中止: [],
}

// ─── 新版：父状态转换规则（模板驱动） ──────────────────────────
export const parentStatusTransitions: Record<ParentStatus, ParentStatus[]> = {
  启动: ['计划'],
  计划: ['执行'],
  执行: ['收尾'],
  收尾: ['归档'],
  归档: [],
}

export const canTransitionParentStatus = (
  currentParent: ParentStatus,
  targetParent: ParentStatus,
  subStatusProgress: SubStatusProgress,
  _context?: GuardContext
): GuardResult => {
  const allowed = parentStatusTransitions[currentParent]
  if (!allowed?.includes(targetParent)) {
    return { ok: false, reason: `不允许从「${currentParent}」流转到「${targetParent}」` }
  }

  if (!allMilestonesCompleted(subStatusProgress)) {
    return { ok: false, reason: '当前父状态的里程碑未全部完成，无法流转' }
  }

  return { ok: true }
}

// ─── 向后兼容：旧版 canTransition ──────────────────────────────
export const canTransition = (
  fromStatus: ProjectStatus,
  toStatus: ProjectStatus,
  context: GuardContext,
  reason?: string
): GuardResult => {
  if (!allowedTransitions[fromStatus]?.includes(toStatus)) {
    return { ok: false, reason: `不允许从「${fromStatus}」流转到「${toStatus}」` }
  }

  if ((toStatus === '已中止' || toStatus === '整改中') && !reason?.trim()) {
    return { ok: false, reason: `流转到「${toStatus}」需要填写原因` }
  }

  // 旧版守卫检查（保留兼容）
  if (fromStatus === '待立项' && toStatus === '待确认' && !context.hasContainer) {
    return { ok: false, reason: '缺少项目容器，请先创建项目容器' }
  }
  if (fromStatus === '待确认' && toStatus === '待拆解' && !context.hasApproval) {
    return { ok: false, reason: '立项审批未完成，无法进入待拆解' }
  }
  if (fromStatus === '待拆解' && toStatus === '执行中') {
    if (!context.hasContainer) return { ok: false, reason: '项目容器未创建，无法开始执行' }
    if (!context.hasMilestones) return { ok: false, reason: '里程碑未生成，无法开始执行' }
    if (!context.hasTaskTree) return { ok: false, reason: '任务树未生成，无法开始执行' }
    if (!context.hasStandardBinding) return { ok: false, reason: '标准上下文未绑定，无法开始执行' }
  }
  if (fromStatus === '执行中' && toStatus === '待验收' && !context.keyTasksCompleted) {
    return { ok: false, reason: '关键任务未完成，无法提交验收' }
  }
  if (fromStatus === '待验收' && toStatus === '待结算' && !context.acceptancePassed) {
    return { ok: false, reason: '验收未通过，无法进入待结算' }
  }
  if (fromStatus === '待验收' && toStatus === '整改中' && !context.hasAcceptanceFeedback) {
    return { ok: false, reason: '缺少验收反馈，无法打回整改' }
  }
  if (fromStatus === '整改中' && toStatus === '待验收' && !context.rectificationClosed) {
    return { ok: false, reason: '整改未闭环，无法重新提交验收' }
  }
  if (fromStatus === '待结算' && toStatus === '已归档' && !context.settlementCompleted) {
    return { ok: false, reason: '结算未完成，无法归档项目' }
  }

  return { ok: true }
}

// ─── 旧版 getAvailableTransitions ─────────────────────────────────
export const getAvailableTransitions = (
  fromStatus: ProjectStatus
): ProjectStatusTransitionOption[] =>
  allowedTransitions[fromStatus].map(toStatus => ({
    toStatus,
    label: transitionLabels[toStatus] ?? `切换为${toStatus}`,
    requiresReason: toStatus === '已中止' || toStatus === '整改中',
  }))

const transitionLabels: Partial<Record<ProjectStatus, string>> = {
  待确认: '推进到待确认',
  待拆解: '推进到待拆解',
  执行中: '开始执行',
  待验收: '提交验收',
  整改中: '打回整改',
  待结算: '进入待结算',
  已归档: '归档项目',
  已中止: '中止项目',
}

// ─── 悬停 hook 动作（保留兼容） ──────────────────────────────────
export type HookActionContext = {
  projectCode: string
  projectName: string
  operator: string
}

export type HookActionResult = {
  ok: boolean
  message: string
}

export type HookAction = (context: HookActionContext) => Promise<HookActionResult>

// ─── 新版：父状态进入 hook ──────────────────────────────────────
export const getParentEnterStatusHooks = (status: ParentStatus): HookAction[] => {
  const hooks: Record<ParentStatus, HookAction[]> = {
    启动: [],
    计划: [
      async ctx => ({ ok: true, message: `项目「${ctx.projectName}」进入计划阶段，初始化任务树` }),
    ],
    执行: [
      async ctx => ({ ok: true, message: `项目「${ctx.projectName}」开始执行，启动风险监控` }),
    ],
    收尾: [
      async ctx => ({ ok: true, message: `项目「${ctx.projectName}」进入收尾，生成了结算草案` }),
    ],
    归档: [async ctx => ({ ok: true, message: `项目「${ctx.projectName}」已归档` })],
  }
  return hooks[status] ?? []
}

// ─── 旧版 hook（保留兼容） ──────────────────────────────────────
const initTaskTreeHook: HookAction = async ctx => ({
  ok: true,
  message: `项目「${ctx.projectName}」任务树已初始化`,
})

const startExecutionHook: HookAction = async ctx => ({
  ok: true,
  message: `项目「${ctx.projectName}」风险监控与催办检查已启动`,
})

const generateAcceptanceSummaryHook: HookAction = async ctx => ({
  ok: true,
  message: `项目「${ctx.projectName}」验收摘要已生成`,
})

const summarizeRectificationHook: HookAction = async ctx => ({
  ok: true,
  message: `项目「${ctx.projectName}」整改项已汇总`,
})

const generateSettlementSuggestionHook: HookAction = async ctx => ({
  ok: true,
  message: `项目「${ctx.projectName}」结算建议草案已生成`,
})

const statusHookActions: Partial<Record<ProjectStatus, HookAction[]>> = {
  待拆解: [initTaskTreeHook],
  执行中: [startExecutionHook],
  待验收: [generateAcceptanceSummaryHook],
  整改中: [summarizeRectificationHook],
  待结算: [generateSettlementSuggestionHook],
}

export const getEnterStatusHooks = (status: ProjectStatus): HookAction[] =>
  statusHookActions[status] ?? []

export const executeEnterStatusHooks = async (
  status: ProjectStatus,
  context: HookActionContext
): Promise<HookActionResult[]> => {
  const actions = getEnterStatusHooks(status)
  const results: HookActionResult[] = []
  for (const action of actions) {
    try {
      results.push(await action(context))
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      results.push({ ok: false, message: `Hook 执行失败: ${message}` })
    }
  }
  return results
}

// ─── 新版 resolveTransitionGuardCode ──────────────────────────────
export const resolveTransitionGuardCode = (
  fromStatus: ProjectStatus,
  toStatus: ProjectStatus,
  reason?: string
): string => {
  if ((toStatus === '已中止' || toStatus === '整改中') && !reason?.trim()) {
    return 'REASON_REQUIRED'
  }
  return `${fromStatus}->${toStatus}`
}
