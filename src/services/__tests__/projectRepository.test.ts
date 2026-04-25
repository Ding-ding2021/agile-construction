import { describe, it, expect, beforeEach } from 'vitest'
import { projectRepository } from '../repositories/projectRepository'
import type { ProjectItem } from '../../data/projects'
import type { ProjectStatusLogEntry } from '../../domain/projectStatusMachine'

describe('projectRepository', () => {
  const mockProjects: ProjectItem[] = [
    {
      code: 'PRJ-001',
      name: '测试项目 1',
      status: '待立项',
      stage: '启动',
      statusTone: 'blue',
      progress: 0,
      owner: '张三',
      brand: '测试品牌',
      plannedOpenDate: '2026-05-01',
      dateRange: '2026-04-01 至 2026-06-30',
      budget: '100万元',
      teamSize: '10人',
      milestone: '0/5',
      tasks: '0/10',
      riskLevel: null,
      riskCount: 0,
      templateId: undefined,
      acceptanceStatus: '待初验',
      settlementStatus: '未生成',
      pendingAcceptanceCount: 0,
      pendingExecutionCount: 0,
      description: '测试项目描述',
    },
  ]

  const mockLogs: Record<string, ProjectStatusLogEntry[]> = {
    'PRJ-001': [
      {
        id: 'log-1',
        type: 'hook',
        at: '2026-04-01T00:00:00Z',
        operator: '管理员',
        to: '待立项',
        message: '已新建项目「测试项目 1」',
      },
    ],
  }

  beforeEach(() => {
    // 清空 localStorage
    localStorage.clear()
  })

  describe('saveState', () => {
    it('应成功保存项目状态', async () => {
      await projectRepository.saveState({
        projects: mockProjects,
        logs: mockLogs,
      })

      const saved = localStorage.getItem('pm-projects-state-v1')
      expect(saved).not.toBeNull()

      const parsed = JSON.parse(saved!)
      expect(Array.isArray(parsed)).toBe(true)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].code).toBe('PRJ-001')
    })

    it('应成功保存状态日志', async () => {
      await projectRepository.saveState({
        projects: mockProjects,
        logs: mockLogs,
      })

      const saved = localStorage.getItem('pm-project-logs-v1')
      expect(saved).not.toBeNull()

      const parsed = JSON.parse(saved!)
      expect(parsed['PRJ-001']).toHaveLength(1)
    })
  })

  describe('loadState', () => {
    it('应从 localStorage 加载状态', async () => {
      // 先保存数据
      localStorage.setItem('pm-projects-state-v1', JSON.stringify(mockProjects))
      localStorage.setItem('pm-project-logs-v1', JSON.stringify(mockLogs))

      const state = await projectRepository.loadState()

      expect(state.projects).toHaveLength(1)
      expect(state.projects[0].code).toBe('PRJ-001')
      expect(state.logs['PRJ-001']).toHaveLength(1)
    })

    it('应在无数据时返回初始项目列表（非空状态）', async () => {
      const state = await projectRepository.loadState()

      // 实际实现：无数据时返回 initialProjects（从 src/data/projects 导入）
      expect(state.projects.length).toBeGreaterThan(0)
      expect(state.logs).toEqual({})
    })
  })

  describe('幂等性', () => {
    it('本地存储不支持幂等键参数', async () => {
      // 当前实现的 saveState 不接受幂等键参数
      // 幂等键仅在远程 API 调用中使用
      await projectRepository.saveState({
        projects: mockProjects,
        logs: mockLogs,
      })

      const saved = localStorage.getItem('pm-projects-state-v1')
      const parsed = JSON.parse(saved!)
      expect(parsed).toHaveLength(1)
    })
  })
})
