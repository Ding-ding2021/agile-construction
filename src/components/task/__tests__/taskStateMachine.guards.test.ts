import { describe, it, expect } from 'vitest'
import {
  validateStatusTransition,
  getAvailableNextStatuses,
  validateBatchStatusTransition,
} from '../taskStateMachine.guards'
import type { TaskItem } from '../taskManagement.types'

// 辅助函数：创建测试任务
const createTask = (overrides: Partial<TaskItem> = {}): TaskItem => ({
  name: '测试任务',
  code: 'TEST-001',
  projectName: '测试项目',
  parentPath: '测试路径',
  taskType: '标准任务',
  sourceType: 'manual',
  status: '待分配',
  statusTone: 'neutral',
  owner: '待分配',
  plannedStartAt: '2026-04-01',
  plannedEndAt: '2026-04-10',
  slaStatus: '正常',
  slaTone: 'green',
  riskLevel: '低风险',
  riskTone: 'blue',
  predecessorStatus: '无前置任务',
  remindCount: 0,
  standardBindingStatus: '已绑定',
  snapshotStatus: '已生成',
  standardSnapshotId: 'snapshot-001',
  isBlocked: false,
  progress: 0,
  ...overrides,
})

describe('状态机守卫条件校验', () => {
  describe('validateStatusTransition - 待分配 -> 待执行', () => {
    it('应该通过校验：所有条件满足', () => {
      const task = createTask({
        status: '待分配',
        owner: '张三',
        standardBindingStatus: '已绑定',
        snapshotStatus: '已生成',
        standardSnapshotId: 'snapshot-001',
      })
      const allTasks = [task]

      const result = validateStatusTransition(task, '待执行', allTasks)

      expect(result.passed).toBe(true)
      expect(result.blockedReason).toBeUndefined()
    })

    it('应该失败：未分配执行人', () => {
      const task = createTask({
        status: '待分配',
        owner: '待分配',
        standardBindingStatus: '已绑定',
        snapshotStatus: '已生成',
        standardSnapshotId: 'snapshot-001',
      })
      const allTasks = [task]

      const result = validateStatusTransition(task, '待执行', allTasks)

      expect(result.passed).toBe(false)
      expect(result.blockedReason).toContain('未分配执行人')
    })

    it('应该失败：标准未绑定', () => {
      const task = createTask({
        status: '待分配',
        owner: '张三',
        standardBindingStatus: '未绑定',
        snapshotStatus: '未生成',
      })
      const allTasks = [task]

      const result = validateStatusTransition(task, '待执行', allTasks)

      expect(result.passed).toBe(false)
      expect(result.blockedReason).toContain('执行标准未绑定')
    })

    it('应该失败：标准快照未生成', () => {
      const task = createTask({
        status: '待分配',
        owner: '张三',
        standardBindingStatus: '已绑定',
        snapshotStatus: '未生成',
      })
      const allTasks = [task]

      const result = validateStatusTransition(task, '待执行', allTasks)

      expect(result.passed).toBe(false)
      expect(result.blockedReason).toContain('标准快照未生成')
    })
  })

  describe('validateStatusTransition - 待执行 -> 执行中', () => {
    it('应该通过校验：执行主体已确认且无阻塞', () => {
      const task = createTask({
        status: '待执行',
        owner: '张三',
        isBlocked: false,
        predecessorStatus: '前置已完成',
      })
      const allTasks = [task]

      const result = validateStatusTransition(task, '执行中', allTasks)

      expect(result.passed).toBe(true)
    })

    it('应该失败：任务被阻塞', () => {
      const task = createTask({
        status: '待执行',
        owner: '张三',
        isBlocked: true,
      })
      const allTasks = [task]

      const result = validateStatusTransition(task, '执行中', allTasks)

      expect(result.passed).toBe(false)
      expect(result.blockedReason).toContain('阻塞')
    })
  })

  describe('validateStatusTransition - 执行中 -> 待提交', () => {
    it('应该通过校验：进度达到80%', () => {
      const task = createTask({
        status: '执行中',
        progress: 85,
      })
      const allTasks = [task]

      const result = validateStatusTransition(task, '待提交', allTasks)

      expect(result.passed).toBe(true)
    })

    it('应该失败：进度不足80%', () => {
      const task = createTask({
        status: '执行中',
        progress: 50,
      })
      const allTasks = [task]

      const result = validateStatusTransition(task, '待提交', allTasks)

      expect(result.passed).toBe(false)
      expect(result.blockedReason).toContain('进度不足')
    })
  })

  describe('validateStatusTransition - 待提交 -> 待验收', () => {
    it('应该通过校验：进度90%且标准已绑定', () => {
      const task = createTask({
        status: '待提交',
        progress: 95,
        standardBindingStatus: '已绑定',
        snapshotStatus: '已生成',
        standardSnapshotId: 'snapshot-001',
      })
      const allTasks = [task]

      const result = validateStatusTransition(task, '待验收', allTasks)

      expect(result.passed).toBe(true)
    })

    it('应该失败：进度不足90%', () => {
      const task = createTask({
        status: '待提交',
        progress: 80,
        standardBindingStatus: '已绑定',
        snapshotStatus: '已生成',
        standardSnapshotId: 'snapshot-001',
      })
      const allTasks = [task]

      const result = validateStatusTransition(task, '待验收', allTasks)

      expect(result.passed).toBe(false)
      expect(result.blockedReason).toContain('进度不足')
    })
  })

  describe('validateStatusTransition - 待验收 -> 已完成', () => {
    it('应该通过校验：进度100%且无阻塞', () => {
      const task = createTask({
        status: '待验收',
        progress: 100,
        isBlocked: false,
        standardBindingStatus: '已绑定',
      })
      const allTasks = [task]

      const result = validateStatusTransition(task, '已完成', allTasks)

      expect(result.passed).toBe(true)
    })

    it('应该失败：进度不足100%', () => {
      const task = createTask({
        status: '待验收',
        progress: 95,
        isBlocked: false,
        standardBindingStatus: '已绑定',
      })
      const allTasks = [task]

      const result = validateStatusTransition(task, '已完成', allTasks)

      expect(result.passed).toBe(false)
      expect(result.blockedReason).toContain('进度未完成')
    })

    it('应该失败：任务被阻塞', () => {
      const task = createTask({
        status: '待验收',
        progress: 100,
        isBlocked: true,
        standardBindingStatus: '已绑定',
      })
      const allTasks = [task]

      const result = validateStatusTransition(task, '已完成', allTasks)

      expect(result.passed).toBe(false)
      expect(result.blockedReason).toContain('阻塞')
    })
  })

  describe('getAvailableNextStatuses', () => {
    it('应该返回可用的下一状态列表', () => {
      const task = createTask({
        status: '待分配',
        owner: '张三',
        standardBindingStatus: '已绑定',
        snapshotStatus: '已生成',
        standardSnapshotId: 'snapshot-001',
      })
      const allTasks = [task]

      const availableStatuses = getAvailableNextStatuses(task, allTasks)

      expect(availableStatuses.length).toBeGreaterThan(0)

      // 待执行应该可用
      const pendingExecution = availableStatuses.find(s => s.status === '待执行')
      expect(pendingExecution).toBeDefined()
      expect(pendingExecution?.allowed).toBe(true)
    })

    it('应该标记不可用的状态及原因', () => {
      const task = createTask({
        status: '待分配',
        owner: '待分配', // 未分配执行人
        standardBindingStatus: '未绑定',
      })
      const allTasks = [task]

      const availableStatuses = getAvailableNextStatuses(task, allTasks)

      const pendingExecution = availableStatuses.find(s => s.status === '待执行')
      expect(pendingExecution).toBeDefined()
      expect(pendingExecution?.allowed).toBe(false)
      expect(pendingExecution?.reason).toBeDefined()
    })
  })

  describe('validateStatusTransition - 无守卫状态', () => {
    it('应默认通过：草稿流转到待分配', () => {
      const task = createTask({ status: '草稿' })
      const result = validateStatusTransition(task, '待分配', [task])
      expect(result.passed).toBe(true)
    })

    it('应默认通过：已关闭状态自循环', () => {
      const task = createTask({ status: '已关闭' })
      const result = validateStatusTransition(task, '已关闭', [task])
      expect(result.passed).toBe(true)
    })
  })

  describe('validateStatusTransition - 待执行到执行中（前置任务阻塞）', () => {
    it('应失败：前置任务处于阻塞状态', () => {
      const predecessor = createTask({
        code: 'PRE-001',
        name: '前置任务',
        status: '不通过',
        isBlocked: true,
      })
      const task = createTask({
        status: '待执行',
        owner: '张三',
        isBlocked: false,
      })
      const allTasks = [predecessor, task]

      const result = validateStatusTransition(task, '执行中', allTasks)
      expect(result.passed).toBe(false)
      expect(result.blockedReason).toContain('前置任务阻塞')
    })

    it('应失败：owner为空字符串', () => {
      const task = createTask({
        status: '待执行',
        owner: '',
        isBlocked: false,
      })
      const result = validateStatusTransition(task, '执行中', [task])
      expect(result.passed).toBe(false)
      expect(result.blockedReason).toContain('执行主体未确认')
    })
  })

  describe('validateStatusTransition - 边界值', () => {
    it('应通过：进度恰好80%', () => {
      const task = createTask({
        status: '执行中',
        progress: 80,
      })
      const result = validateStatusTransition(task, '待提交', [task])
      expect(result.passed).toBe(true)
    })

    it('应失败：进度为0', () => {
      const task = createTask({
        status: '执行中',
        progress: 0,
      })
      const result = validateStatusTransition(task, '待提交', [task])
      expect(result.passed).toBe(false)
      expect(result.blockedReason).toContain('进度不足')
    })
  })

  describe('validateBatchStatusTransition', () => {
    it('应批量校验多个任务（部分通过部分失败）', () => {
      const task1 = createTask({
        code: 'T1',
        status: '待分配',
        owner: '张三',
        standardBindingStatus: '已绑定',
        snapshotStatus: '已生成',
      })
      const task2 = createTask({
        code: 'T2',
        status: '待分配',
        owner: '待分配',
      })
      const allTasks = [task1, task2]

      const results = validateBatchStatusTransition([task1, task2], '待执行', allTasks)
      expect(results.get('T1')?.passed).toBe(true)
      expect(results.get('T2')?.passed).toBe(false)
    })

    it('空任务数组应返回空Map', () => {
      const results = validateBatchStatusTransition([], '待执行', [])
      expect(results.size).toBe(0)
    })
  })

  describe('getAvailableNextStatuses - 终态边界', () => {
    it('已归档状态应返回空数组', () => {
      const task = createTask({ status: '已关闭' })
      const result = getAvailableNextStatuses(task, [task])
      expect(result).toHaveLength(0)
    })

    it('已关闭状态应返回空数组', () => {
      const task = createTask({ status: '已关闭' })
      const result = getAvailableNextStatuses(task, [task])
      expect(result).toHaveLength(0)
    })
  })
})
