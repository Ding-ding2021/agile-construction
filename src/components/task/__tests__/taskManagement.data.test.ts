import { describe, it, expect } from 'vitest'
import {
  mockTasks,
  buildTaskTreeViewModel,
  getTaskDetailByCode,
  getTasksByTemplateId,
  getTemplateNameById,
} from '../taskManagement.data'

describe('taskManagement.data', () => {
  describe('mockTasks', () => {
    it('应包含任务数据', () => {
      expect(mockTasks.length).toBeGreaterThan(0)
    })

    it('每个任务应有完整的派生字段', () => {
      const task = mockTasks[0]
      expect(task.taskType).toBeDefined()
      expect(task.sourceType).toBeDefined()
    })

    it('应包含多种业务来源类型', () => {
      const sourceTypes = new Set(mockTasks.map(t => t.sourceType))
      expect(sourceTypes.size).toBeGreaterThan(1)
    })
  })

  describe('buildTaskTreeViewModel', () => {
    it('空数组应返回空结构', () => {
      const result = buildTaskTreeViewModel([])
      expect(result.nodes).toHaveLength(0)
      expect(result.summary.projectCount).toBe(0)
      expect(result.summary.taskCount).toBe(0)
      expect(result.summary.workPackageCount).toBe(0)
      expect(result.summary.delayedCount).toBe(0)
    })

    it('应正确构建单项目任务树', () => {
      const tasks = mockTasks.filter(t => t.projectName === '上海南京路旗舰店')
      const result = buildTaskTreeViewModel(tasks)
      expect(result.nodes.length).toBe(1)
      expect(result.summary.projectCount).toBe(1)
      expect(result.summary.taskCount).toBeGreaterThan(0)
    })

    it('应正确构建多项目任务树', () => {
      const result = buildTaskTreeViewModel(mockTasks)
      expect(result.summary.projectCount).toBeGreaterThan(1)
      expect(result.summary.taskCount).toBeGreaterThan(0)
    })

    it('任务树应包含正确的时间戳', () => {
      const result = buildTaskTreeViewModel(mockTasks)
      expect(result.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe('getTaskDetailByCode', () => {
    it('应返回存在的任务详情', () => {
      const detail = getTaskDetailByCode(mockTasks[0].code)
      expect(detail).toBeDefined()
      expect(detail?.code).toBe(mockTasks[0].code)
    })

    it('不存在的code应返回undefined', () => {
      const detail = getTaskDetailByCode('NOT-EXIST')
      expect(detail).toBeUndefined()
    })
  })

  describe('getTasksByTemplateId', () => {
    it('空参数应返回mockTasks', () => {
      const result = getTasksByTemplateId('')
      expect(result.length).toBe(mockTasks.length)
    })

    it('无效模板ID应返回mockTasks', () => {
      const result = getTasksByTemplateId('invalid-id')
      expect(result.length).toBe(mockTasks.length)
    })
  })

  describe('getTemplateNameById', () => {
    it('空参数应返回null', () => {
      const result = getTemplateNameById(undefined)
      expect(result).toBeNull()
    })
  })
})
