import { describe, it, expect } from 'vitest'
import {
  canTransition,
  getAvailableTransitions,
  type GuardContext,
  type ProjectStatus,
} from '../../domain/projectStatusMachine'

describe('projectStatusMachine baseline', () => {
  const fullContext: GuardContext = {
    hasContainer: true,
    hasApproval: true,
    hasMilestones: true,
    hasTaskTree: true,
    hasStandardBinding: true,
    keyTasksCompleted: true,
    acceptancePassed: true,
    hasAcceptanceFeedback: true,
    rectificationClosed: true,
    settlementCompleted: true,
  }

  it('canTransition: happy path for 待拆解 -> 执行中', () => {
    const from: ProjectStatus = '待拆解'
    const to: ProjectStatus = '执行中'
    const res = canTransition(from, to, fullContext)
    expect(res.ok).toBe(true)
  })

  it('getAvailableTransitions: 包含执行中的可能性并且每个有 label', () => {
    const from: ProjectStatus = '待拆解'
    const nexts = getAvailableTransitions(from)
    // 确保包含执行中的目标状态，并且每个条目有 label 与 toStatus
    const hasExec = nexts.some(n => n.toStatus === '执行中')
    expect(hasExec).toBe(true)
    expect(nexts.length).toBeGreaterThanOrEqual(1)
    expect(nexts[0]).toHaveProperty('label')
    expect(nexts[0]).toHaveProperty('toStatus')
  })

  it('canTransition: error when disallowed transition', () => {
    const from: ProjectStatus = '待立项'
    const to: ProjectStatus = '执行中' // 非法路径
    const res = canTransition(from, to, fullContext)
    expect(res.ok).toBe(false)
  })

  it('canTransition: requires reason when target is 终止/整改', () => {
    const from: ProjectStatus = '执行中'
    const to: ProjectStatus = '已中止'
    const resNoReason = canTransition(from, to, fullContext, '')
    expect(resNoReason.ok).toBe(false)
  })
})
