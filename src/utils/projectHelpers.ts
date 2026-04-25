/**
 * Project Helpers - 纯工具函数集合
 *
 * 职责：提供与项目业务相关的无状态、无副作用工具函数。
 * 这些函数不依赖 React 生命周期，可在任何上下文中调用。
 *
 * @see src/App.tsx
 */

import type { ProjectItem } from '../data/projects'
import type { GuardContext, ProjectStatus } from '../domain/projectStatusMachine'

// ─── Progress Parsing ────────────────────────────────────────────

/**
 * 解析 "done/total" 格式的进度字符串
 * @example parseProgressPair("3/5") → { done: 3, total: 5 }
 * @example parseProgressPair("") → { done: 0, total: 0 }
 */
export const parseProgressPair = (value: string): { done: number; total: number } => {
  const [rawDone = '0', rawTotal = '0'] = value.split('/')
  const done = Number(rawDone)
  const total = Number(rawTotal)

  return {
    done: Number.isFinite(done) ? done : 0,
    total: Number.isFinite(total) ? total : 0,
  }
}

// ─── Budget Parsing ──────────────────────────────────────────────

/**
 * 将金额字符串解析为万元数值
 * @example parseBudgetToWan("¥ 56.5万") → 56.5
 * @example parseBudgetToWan("¥ 168万") → 168
 */
export const parseBudgetToWan = (value: string): number => {
  const numeric = Number(value.replace(/[^\d.]/g, ''))
  return Number.isFinite(numeric) ? numeric : 0
}

// ─── Progress Ceiling by Status ──────────────────────────────────

/**
 * 根据项目状态获取进度上限
 * 用于防止状态与进度不匹配（如「待立项」项目进度不能超过 20%）
 */
export const getProgressCeilingByStatus = (status: ProjectStatus): number => {
  switch (status) {
    case '待立项':
      return 20
    case '待确认':
      return 35
    case '待拆解':
      return 55
    case '执行中':
    case '整改中':
      return 89
    case '待验收':
      return 95
    case '待结算':
      return 99
    case '已归档':
      return 100
    case '已中止':
      return 100
    default:
      return 100
  }
}

// ─── Guard Context Builder ───────────────────────────────────────

/**
 * 从项目数据构建状态流转守卫上下文
 * 供 projectStatusMachine.canTransition 使用
 */
export const buildGuardContextFromProject = (project: ProjectItem): GuardContext => {
  const milestone = parseProgressPair(project.milestone)
  const tasks = parseProgressPair(project.tasks)

  return {
    hasContainer: true,
    hasApproval: project.progress >= 10 || project.stage !== '启动',
    hasMilestones: milestone.total > 0,
    hasTaskTree: tasks.total > 0,
    hasStandardBinding: Boolean(project.templateId) || project.progress > 0,
    keyTasksCompleted: tasks.total > 0 ? tasks.done / tasks.total >= 0.85 : project.progress >= 90,
    acceptancePassed: project.progress >= 95 && project.riskLevel !== 'critical',
    hasAcceptanceFeedback: project.riskLevel !== null || project.progress >= 85,
    rectificationClosed: project.progress >= 90,
    settlementCompleted: project.progress >= 98 || project.status === '已归档',
  }
}
