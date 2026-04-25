import { describe, it, expect } from 'vitest'
import {
  canTransition,
  getAvailableTransitions,
  resolveTransitionGuardCode,
  type GuardContext,
} from '../projectStatusMachine'

describe('projectStatusMachine', () => {
  const createMockGuardContext = (overrides: Partial<GuardContext> = {}): GuardContext => ({
    hasContainer: true,
    hasApproval: false,
    hasMilestones: false,
    hasTaskTree: false,
    hasStandardBinding: false,
    keyTasksCompleted: false,
    acceptancePassed: false,
    hasAcceptanceFeedback: false,
    rectificationClosed: false,
    settlementCompleted: false,
    ...overrides,
  })

  describe('canTransition', () => {
    it('应允许从"待立项"流转到"待确认"', () => {
      const context = createMockGuardContext({ hasContainer: true })
      const result = canTransition('待立项', '待确认', context)

      expect(result.ok).toBe(true)
      expect(result.reason).toBeUndefined()
    })

    it('应阻止从"待立项"流转到"待确认"（缺少容器）', () => {
      const context = createMockGuardContext({ hasContainer: false })
      const result = canTransition('待立项', '待确认', context)

      expect(result.ok).toBe(false)
      expect(result.reason).toContain('容器')
    })

    it('应允许从"待确认"流转到"待拆解"', () => {
      const context = createMockGuardContext({ hasApproval: true })
      const result = canTransition('待确认', '待拆解', context)

      expect(result.ok).toBe(true)
    })

    it('应允许从"执行中"流转到"整改中"（需要原因）', () => {
      const context = createMockGuardContext()
      const result = canTransition('执行中', '整改中', context, '发现质量问题')

      expect(result.ok).toBe(true)
    })

    it('应允许从"待验收"流转到"待结算"', () => {
      const context = createMockGuardContext({
        acceptancePassed: true,
        hasAcceptanceFeedback: true,
      })
      const result = canTransition('待验收', '待结算', context)

      expect(result.ok).toBe(true)
    })

    it('应允许从"待结算"流转到"已归档"', () => {
      const context = createMockGuardContext({ settlementCompleted: true })
      const result = canTransition('待结算', '已归档', context)

      expect(result.ok).toBe(true)
    })

    it('应阻止非法流转路径', () => {
      const context = createMockGuardContext()
      const result = canTransition('待立项', '已归档', context)

      expect(result.ok).toBe(false)
    })
  })

  describe('getAvailableTransitions', () => {
    it('应返回"待立项"状态的所有可用流转', () => {
      const transitions = getAvailableTransitions('待立项')

      expect(transitions).toHaveLength(2)
      expect(transitions.map(t => t.toStatus)).toContain('待确认')
      expect(transitions.map(t => t.toStatus)).toContain('已中止')
    })

    it('应返回"执行中"状态的所有可用流转', () => {
      const transitions = getAvailableTransitions('执行中')

      expect(transitions.length).toBeGreaterThan(0)
      expect(transitions.map(t => t.toStatus)).toContain('待验收')
      expect(transitions.map(t => t.toStatus)).toContain('整改中')
    })

    it('应标记需要原因的流转', () => {
      const transitions = getAvailableTransitions('执行中')
      const rectifyTransition = transitions.find(t => t.toStatus === '整改中')

      expect(rectifyTransition?.requiresReason).toBe(true)
    })

    it('已归档状态应无可用流转', () => {
      const transitions = getAvailableTransitions('已归档')

      expect(transitions).toHaveLength(0)
    })
  })

  describe('resolveTransitionGuardCode', () => {
    it('应返回流转路径标识', () => {
      const code = resolveTransitionGuardCode('待立项', '待确认', undefined)

      expect(code).toBe('待立项->待确认')
    })

    it('应为需要原因的流转返回错误码', () => {
      const code = resolveTransitionGuardCode('执行中', '整改中', undefined)

      expect(code).toBe('REASON_REQUIRED')
    })
  })
})
