import { describe, expect, it } from 'vitest'
import {
  advancedFilter,
  calculateTaskStats,
  filterByStatKey,
  paginateTasks,
  processTasks,
  searchTasks,
  shouldResetPage,
  sortTasks,
} from '../taskManagement.selectors'
import type { TaskFilters, TaskItem } from '../taskManagement.types'

const buildTask = (overrides: Partial<TaskItem>): TaskItem => ({
  id: 'test-task-001',
  name: '测试任务',
  code: 'TASK-001',
  projectId: 'PRJ-TEST',
  projectName: '测试项目',
  parentTaskId: null,
  parentPath: '任务路径',
  taskType: '标准任务',
  sourceType: 'manual',
  status: '待分配',
  statusTone: 'neutral',
  owner: '待分配',
  assigneeId: '',
  assigneeName: '待分配',
  nodeLevelType: 'task',
  priority: 'medium',
  plannedStartAt: '2026-04-01',
  plannedEndAt: '2026-04-03',
  slaStatus: '正常',
  slaTone: 'green',
  riskLevel: '低风险',
  riskTone: 'blue',
  predecessorStatus: '无前置任务',
  remindCount: 0,
  standardBindingStatus: '已绑定',
  isBlocked: false,
  progress: 0,
  tags: [],
  createdBy: 'test',
  createdAt: '2026-03-01T00:00:00Z',
  ...overrides,
})

describe('taskManagement.selectors', () => {
  const tasks: TaskItem[] = [
    buildTask({ code: 'TASK-001', sourceType: 'manual', status: '待分配', riskLevel: '低风险' }),
    buildTask({
      code: 'TASK-002',
      sourceType: 'template',
      status: '执行中',
      statusTone: 'blue',
      slaStatus: '即将超时',
      slaTone: 'orange',
      remindCount: 2,
      riskLevel: '中风险',
      riskTone: 'orange',
      progress: 45,
    }),
    buildTask({
      code: 'TASK-003',
      sourceType: 'wbs',
      status: '待提交',
      statusTone: 'orange',
      slaStatus: '超时',
      slaTone: 'red',
      isBlocked: true,
      riskLevel: '高风险',
      riskTone: 'red',
      remindCount: 5,
      progress: 88,
    }),
  ]

  it('应按PRD统计口径计算关键指标', () => {
    const stats = calculateTaskStats(tasks)

    expect(stats.total).toBe(3)
    expect(stats.pendingAssign).toBe(1)
    expect(stats.executing).toBe(1)
    expect(stats.slaWarningOrOverdue).toBe(2)
    expect(stats.blocked).toBe(1)
  })

  it('高级筛选应支持阻塞与来源联合过滤', () => {
    const filtered = advancedFilter(tasks, {
      status: undefined,
      riskLevel: undefined,
      slaStatus: undefined,
      blockedOnly: true,
    })

    expect(filtered).toHaveLength(1)
    expect(filtered[0].code).toBe('TASK-003')
  })

  it('风险排序应按高到低输出', () => {
    const sorted = sortTasks(tasks, 'risk-desc')
    expect(sorted.map(item => item.code)).toEqual(['TASK-003', 'TASK-002', 'TASK-001'])
  })

  it('processTasks应按筛选+排序+分页单管道处理', () => {
    const filters: TaskFilters = {
      statKey: 'all',
      searchQuery: 'TASK',
      groupBy: 'none',
      sortBy: 'remind-desc',
      status: undefined,
      riskLevel: undefined,
      slaStatus: undefined,
      blockedOnly: undefined,
    }

    const result = processTasks(tasks, filters, { currentPage: 1, pageSize: 2 })

    expect(result.pagination.total).toBe(3)
    expect(result.data).toHaveLength(2)
    expect(result.data[0].code).toBe('TASK-003')
  })

  it('paginateTasks应在越界页码时回落到有效页', () => {
    const paged = paginateTasks(tasks, 99, 2)
    expect(paged.pagination.currentPage).toBe(2)
    expect(paged.data).toHaveLength(1)
  })

  describe('filterByStatKey', () => {
    it('应筛选待分配状态（pendingAssign）', () => {
      const filtered = filterByStatKey(tasks, 'pendingAssign')
      expect(filtered).toHaveLength(1)
      expect(filtered[0].code).toBe('TASK-001')
    })

    it('应筛选执行中状态（executing）', () => {
      const filtered = filterByStatKey(tasks, 'executing')
      expect(filtered).toHaveLength(1)
      expect(filtered[0].code).toBe('TASK-002')
    })

    it('应筛选SLA风险项（slaRisk）', () => {
      const filtered = filterByStatKey(tasks, 'slaRisk')
      expect(filtered.length).toBeGreaterThanOrEqual(2)
    })

    it('应筛选阻塞项（blocked）', () => {
      const filtered = filterByStatKey(tasks, 'blocked')
      expect(filtered).toHaveLength(1)
      expect(filtered[0].code).toBe('TASK-003')
    })
  })

  describe('searchTasks', () => {
    it('应支持按任务编码搜索', () => {
      const result = searchTasks(tasks, 'TASK-001')
      expect(result).toHaveLength(1)
      expect(result[0].code).toBe('TASK-001')
    })

    it('空查询应返回全部任务', () => {
      const result = searchTasks(tasks, '')
      expect(result).toHaveLength(3)
    })

    it('无匹配时应返回空数组', () => {
      const result = searchTasks(tasks, '不存在的任务')
      expect(result).toHaveLength(0)
    })

    it('应支持大小写不敏感搜索', () => {
      const result = searchTasks(tasks, 'task-001')
      expect(result).toHaveLength(1)
    })
  })

  describe('advancedFilter', () => {
    it('应按状态筛选', () => {
      const filtered = advancedFilter(tasks, {
        status: '执行中',
        riskLevel: undefined,
        slaStatus: undefined,
        blockedOnly: false,
      })
      expect(filtered).toHaveLength(1)
      expect(filtered[0].code).toBe('TASK-002')
    })

    it('应按风险等级筛选', () => {
      const filtered = advancedFilter(tasks, {
        riskLevel: '高风险',
        status: undefined,
        slaStatus: undefined,
        blockedOnly: false,
      })
      expect(filtered).toHaveLength(1)
      expect(filtered[0].code).toBe('TASK-003')
    })

    it('无匹配时应返回空数组', () => {
      const filtered = advancedFilter(tasks, {
        status: '已关闭',
        riskLevel: undefined,
        slaStatus: undefined,
        blockedOnly: false,
      })
      expect(filtered).toHaveLength(0)
    })
  })

  describe('sortTasks', () => {
    it('应按计划结束时间升序（planned-end-asc）', () => {
      const sorted = sortTasks(tasks, 'planned-end-asc')
      expect(sorted[0].code).toBe('TASK-001')
    })

    it('应按催办次数降序（remind-desc）', () => {
      const sorted = sortTasks(tasks, 'remind-desc')
      expect(sorted.map(t => t.code)).toEqual(['TASK-003', 'TASK-002', 'TASK-001'])
    })

    it('默认排序应保持原始顺序', () => {
      const sorted = sortTasks(tasks, 'default')
      expect(sorted.map(t => t.code)).toEqual(['TASK-001', 'TASK-002', 'TASK-003'])
    })
  })

  describe('paginateTasks - 边界', () => {
    it('空数组应返回空数据和零总数', () => {
      const result = paginateTasks([], 1, 10)
      expect(result.data).toHaveLength(0)
      expect(result.pagination.total).toBe(0)
    })

    it('正常分页应返回正确页码和数据', () => {
      const result = paginateTasks(tasks, 1, 2)
      expect(result.data).toHaveLength(2)
      expect(result.pagination.currentPage).toBe(1)
      expect(result.pagination.total).toBe(3)
    })
  })

  describe('shouldResetPage', () => {
    const baseFilters: TaskFilters = {
      statKey: 'all',
      searchQuery: '',
      groupBy: 'none',
      sortBy: 'default',
      status: undefined,
      riskLevel: undefined,
      slaStatus: undefined,
      blockedOnly: undefined,
    }

    it('搜索词变化时应返回true', () => {
      const prev = { ...baseFilters, searchQuery: 'old' }
      const next = { ...baseFilters, searchQuery: 'new' }
      expect(shouldResetPage(prev, next, 10, 10)).toBe(true)
    })

    it('页码大小变化时应返回true', () => {
      const prev = { ...baseFilters }
      const next = { ...baseFilters }
      expect(shouldResetPage(prev, next, 10, 20)).toBe(true)
    })

    it('筛选条件无变化时应返回false', () => {
      const prev = { ...baseFilters }
      const next = { ...baseFilters }
      expect(shouldResetPage(prev, next, 10, 10)).toBe(false)
    })
  })
})
