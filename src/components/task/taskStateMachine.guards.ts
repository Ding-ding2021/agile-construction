import { TASK_STATUS_TRANSITION_MAP, type TaskItem, type TaskStatus } from './taskManagement.types'

/**
 * 状态机守卫条件校验模块
 *
 * 根据PRD文档7.4节"守卫条件"实现
 * 每个状态流转前必须通过对应的守卫校验
 */

export type GuardValidationResult = {
  passed: boolean
  blockedReason?: string
  missingConditions?: string[]
}

/**
 * 守卫条件校验器类型
 */
type StatusGuardValidator = (task: TaskItem, allTasks: TaskItem[]) => GuardValidationResult

/**
 * 守卫条件映射表
 * key: 目标状态
 * value: 守卫校验函数
 */
const STATUS_GUARD_VALIDATORS: Partial<Record<TaskStatus, StatusGuardValidator>> = {
  待执行: validateTransitionToPendingExecution,
  执行中: validateTransitionToExecuting,
  待提交: validateTransitionToPendingSubmission,
  待验收: validateTransitionToPendingAcceptance,
  已完成: validateTransitionToCompleted,
}

/**
 * 主入口：校验状态流转是否允许
 *
 * @param task 当前任务
 * @param nextStatus 目标状态
 * @param allTasks 所有任务列表（用于检查依赖关系）
 * @returns 校验结果
 */
export const validateStatusTransition = (
  task: TaskItem,
  nextStatus: TaskStatus,
  allTasks: TaskItem[] = []
): GuardValidationResult => {
  // 如果目标状态没有守卫条件，默认通过
  const validator = STATUS_GUARD_VALIDATORS[nextStatus]
  if (!validator) {
    return { passed: true }
  }

  return validator(task, allTasks)
}

/**
 * 守卫条件：待分配 -> 待执行
 *
 * 根据PRD 7.4节：
 * - 已分配责任角色或执行人
 * - 前置依赖满足
 * - 执行标准已绑定
 * - 标准快照已生成
 */
function validateTransitionToPendingExecution(
  task: TaskItem,
  allTasks: TaskItem[]
): GuardValidationResult {
  const missingConditions: string[] = []

  // 1. 检查已分配责任角色或执行人
  if (!task.owner || task.owner === '待分配') {
    missingConditions.push('未分配执行人或责任角色')
  }

  // 2. 检查前置依赖任务
  const predecessorTasks = getPredecessorTasks(task.code, allTasks)
  const hasUncompletedPredecessors = predecessorTasks.some(
    predecessor => !isCompletedStatus(predecessor.status)
  )
  if (hasUncompletedPredecessors && predecessorTasks.length > 0) {
    const incompleteTasks = predecessorTasks
      .filter(p => !isCompletedStatus(p.status))
      .map(p => p.name)
      .join('、')
    missingConditions.push(`前置任务未完成：${incompleteTasks}`)
  }

  // 3. 检查执行标准已绑定
  if (task.standardBindingStatus !== '已绑定') {
    missingConditions.push('执行标准未绑定')
  }

  // 4. 检查标准快照已生成
  if (!task.standardSnapshotId || task.snapshotStatus !== '已生成') {
    missingConditions.push('标准快照未生成')
  }

  if (missingConditions.length > 0) {
    return {
      passed: false,
      blockedReason: `无法流转到"待执行"：${missingConditions.join('；')}`,
      missingConditions,
    }
  }

  return { passed: true }
}

/**
 * 守卫条件：待执行 -> 执行中
 *
 * 根据PRD 7.4节：
 * - 执行主体已确认开始
 * - 无阻塞前置任务
 */
function validateTransitionToExecuting(
  task: TaskItem,
  allTasks: TaskItem[]
): GuardValidationResult {
  const missingConditions: string[] = []

  // 1. 检查执行主体已确认（owner不为"待分配"）
  if (!task.owner || task.owner === '待分配') {
    missingConditions.push('执行主体未确认')
  }

  // 2. 检查无阻塞前置任务
  const predecessorTasks = getPredecessorTasks(task.code, allTasks)
  const hasBlockedPredecessors = predecessorTasks.some(
    predecessor => predecessor.isBlocked || isBlockedStatus(predecessor.status)
  )
  if (hasBlockedPredecessors) {
    const blockedTasks = predecessorTasks
      .filter(p => p.isBlocked || isBlockedStatus(p.status))
      .map(p => p.name)
      .join('、')
    missingConditions.push(`前置任务阻塞：${blockedTasks}`)
  }

  // 3. 检查任务本身未被阻塞
  if (task.isBlocked) {
    missingConditions.push('任务当前处于阻塞状态')
  }

  if (missingConditions.length > 0) {
    return {
      passed: false,
      blockedReason: `无法流转到"执行中"：${missingConditions.join('；')}`,
      missingConditions,
    }
  }

  return { passed: true }
}

/**
 * 守卫条件：执行中 -> 待提交
 *
 * 根据PRD 7.4节：
 * - 执行动作完成
 * - 必传资料已提交或已明确不适用
 */
function validateTransitionToPendingSubmission(
  task: TaskItem,
  allTasks: TaskItem[]
): GuardValidationResult {
  const missingConditions: string[] = []

  // 1. 检查执行动作完成（进度至少达到80%）
  if (task.progress < 80) {
    missingConditions.push(`执行进度不足（当前${task.progress}%，需≥80%）`)
  }

  // 2. 检查必传资料（如果有执行清单）
  // 注：这里假设有checklist字段，实际需要从TaskDetail获取
  // 暂时跳过，在UI层校验
  void allTasks // 预留参数用于未来扩展

  if (missingConditions.length > 0) {
    return {
      passed: false,
      blockedReason: `无法流转到"待提交"：${missingConditions.join('；')}`,
      missingConditions,
    }
  }

  return { passed: true }
}

/**
 * 守卫条件：待提交 -> 待验收
 *
 * 根据PRD 7.4节：
 * - 提交结果完整
 * - 验收标准已绑定
 * - 检查项已生成或已具备生成条件
 */
function validateTransitionToPendingAcceptance(
  task: TaskItem,
  allTasks: TaskItem[]
): GuardValidationResult {
  const missingConditions: string[] = []

  // 1. 检查提交结果完整（进度至少90%）
  if (task.progress < 90) {
    missingConditions.push(`提交进度不足（当前${task.progress}%，需≥90%）`)
  }

  // 2. 检查验收标准已绑定
  if (task.standardBindingStatus !== '已绑定') {
    missingConditions.push('验收标准未绑定')
  }

  // 3. 检查标准快照已生成
  if (!task.standardSnapshotId || task.snapshotStatus !== '已生成') {
    missingConditions.push('标准快照未生成')
  }

  void allTasks // 预留参数用于未来扩展

  if (missingConditions.length > 0) {
    return {
      passed: false,
      blockedReason: `无法流转到"待验收"：${missingConditions.join('；')}`,
      missingConditions,
    }
  }

  return { passed: true }
}

/**
 * 守卫条件：待验收 -> 已完成
 *
 * 根据PRD 7.4节：
 * - 检查项通过
 * - 不存在未关闭缺陷
 */
function validateTransitionToCompleted(
  task: TaskItem,
  allTasks: TaskItem[]
): GuardValidationResult {
  const missingConditions: string[] = []

  // 1. 检查进度必须100%
  if (task.progress !== 100) {
    missingConditions.push(`任务进度未完成（当前${task.progress}%，需=100%）`)
  }

  // 2. 检查任务未被阻塞
  if (task.isBlocked) {
    missingConditions.push('任务处于阻塞状态')
  }

  // 3. 检查标准绑定
  if (task.standardBindingStatus !== '已绑定') {
    missingConditions.push('标准未绑定')
  }

  void allTasks // 预留参数用于未来扩展

  if (missingConditions.length > 0) {
    return {
      passed: false,
      blockedReason: `无法流转到"已完成"：${missingConditions.join('；')}`,
      missingConditions,
    }
  }

  return { passed: true }
}

/**
 * 辅助函数：获取前置任务
 */
function getPredecessorTasks(taskCode: string, allTasks: TaskItem[]): TaskItem[] {
  // 当前实现基于parentPath推断，实际应该使用task_relation表
  // 这里简化处理，返回同parentPath下的前序任务
  const currentTask = allTasks.find(t => t.code === taskCode)
  if (!currentTask) return []

  const taskIndex = allTasks.findIndex(t => t.code === taskCode)
  const predecessorPath = currentTask.parentPath

  // 简化逻辑：返回同路径下索引在当前任务之前的任务
  return allTasks
    .slice(0, taskIndex)
    .filter(t => t.parentPath === predecessorPath && t.code !== taskCode)
}

/**
 * 辅助函数：检查状态是否为完成态
 */
function isCompletedStatus(status: TaskStatus): boolean {
  return status === '已完成' || status === '已关闭'
}

/**
 * 辅助函数：检查状态是否为阻塞态
 */
function isBlockedStatus(status: TaskStatus): boolean {
  return status === '不通过' || status === '待创建'
}

/**
 * 批量校验：检查多个任务的流转是否合法
 * 用于批量操作场景
 */
export const validateBatchStatusTransition = (
  tasks: TaskItem[],
  nextStatus: TaskStatus,
  allTasks: TaskItem[]
): Map<string, GuardValidationResult> => {
  const results = new Map<string, GuardValidationResult>()

  tasks.forEach(task => {
    results.set(task.code, validateStatusTransition(task, nextStatus, allTasks))
  })

  return results
}

/**
 * 获取任务的可用流转状态列表（经过守卫校验后）
 */
export const getAvailableNextStatuses = (
  task: TaskItem,
  allTasks: TaskItem[]
): {
  status: TaskStatus
  allowed: boolean
  reason?: string
}[] => {
  // 从状态机映射获取所有可能的下一状态
  const possibleNextStatuses = TASK_STATUS_TRANSITION_MAP[task.status] || []

  // 对每个可能的状态进行守卫校验
  return possibleNextStatuses
    .filter((status: TaskStatus) => status !== task.status)
    .map((status: TaskStatus) => {
      const result = validateStatusTransition(task, status, allTasks)
      return {
        status,
        allowed: result.passed,
        reason: result.passed ? undefined : result.blockedReason,
      }
    })
}
