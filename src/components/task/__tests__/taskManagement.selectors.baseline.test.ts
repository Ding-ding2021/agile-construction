import { describe, it, expect } from 'vitest'
import {
  calculateTaskStats,
  filterByStatKey,
  searchTasks,
  sortTasks,
} from '../taskManagement.selectors'
import { type TaskItem } from '../taskManagement.types'

describe('taskManagement.selectors baseline', () => {
  const baseTask = (overrides: Partial<TaskItem> = {}): TaskItem => {
    return {
      id: 't1',
      code: 'T-001',
      name: 'Test Task',
      projectId: 'P-1',
      parentTaskId: null,
      status: '待分配',
      assigneeId: 'U-1',
      plannedStartAt: '2026-05-01',
      plannedEndAt: '2026-05-10',
      createdBy: 'owner',
      createdAt: '2026-04-01',
      assigneeName: 'User One',
      projectName: 'Project 1',
      nodeLevelType: 'task',
      priority: 'low',
      progress: 0,
      taskType: '标准任务',
      sourceType: 'manual',
      riskLevel: '低风险',
      slaStatus: '正常',
      isBlocked: false,
      remindCount: 0,
      standardBindingStatus: '已绑定',
      // required for some tests
      parentPath: undefined,
      statusTone: 'blue',
      riskTone: 'blue',
      slaTone: 'green',
      owner: 'owner',
      tags: [],
      ...overrides,
    } as TaskItem
  }

  it('calculateTaskStats: 正确统计', () => {
    const tasks = [
      baseTask({ status: '待分配', slaStatus: '正常', isBlocked: false }),
      baseTask({ status: '执行中', slaStatus: '即将超时', isBlocked: true }),
      baseTask({ status: '待提交', slaStatus: '正常', isBlocked: false }),
    ]
    const stats = calculateTaskStats(tasks)
    expect(stats.total).toBe(3)
    expect(stats.pendingAssign).toBe(1)
    expect(stats.executing).toBe(1)
    expect(stats.pendingSubmit).toBe(1)
  })

  it('filterByStatKey: 基本筛选与 all', () => {
    const t1 = baseTask({ status: '待分配' })
    const t2 = baseTask({ status: '执行中' })
    const list = [t1, t2]
    const res = filterByStatKey(list, 'executing')
    expect(res).toHaveLength(1)
    expect(res[0].status).toBe('执行中')
    const all = filterByStatKey(list, 'all')
    expect(all).toHaveLength(2)
  })

  it('searchTasks: 模糊搜索', () => {
    const t = baseTask({ name: 'Implement Login' })
    const res = searchTasks([t], 'login')
    expect(res).toHaveLength(1)
  })

  it('sortTasks: planned-end-asc', () => {
    const a = baseTask({ id: 'a', plannedEndAt: '2026-05-12' })
    const b = baseTask({ id: 'b', plannedEndAt: '2026-05-02' })
    const sorted = sortTasks([a, b], 'planned-end-asc')
    expect(sorted[0].id).toBe('b')
  })
})
