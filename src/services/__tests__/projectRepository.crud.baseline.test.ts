import { describe, it, expect, beforeEach, vi } from 'vitest'
import { projectRepository } from '../repositories/projectRepository'
import type { ProjectItem } from '../../data/projects'

// Mock the serverAdapter to avoid real HTTP calls
vi.mock('../../services/api/serverAdapter', () => {
  return {
    createIdempotencyKey: vi.fn(() => 'mock-key'),
    serverAdapter: {
      getProjects: vi.fn(async () => []),
      getProjectByCode: vi.fn(async () => null),
      createProject: vi.fn(async (payload: any) => ({
        ...payload,
        id: 'mock-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      updateProject: vi.fn(async (code: string, payload: any) => ({
        code,
        ...payload,
        updatedAt: new Date().toISOString(),
      })),
      deleteProject: vi.fn(async () => {}),
    },
  }
})

describe('projectRepository CRUD baseline', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('createProject should call serverAdapter.createProject and update local cache', async () => {
    const input: ProjectItem = {
      code: 'PRJ-CR-001',
      name: 'Baseline Create',
      status: '待立项',
      stage: '启动',
      statusTone: 'blue' as any,
      progress: 0,
      owner: 'alice',
      brand: 'brand',
      plannedOpenDate: '2026-05-01',
      dateRange: '2026-04-01 至 2026-06-30',
      budget: '100',
      teamSize: '5',
      milestone: '0/5',
      tasks: '0/10',
      riskLevel: null as any,
      riskCount: 0 as any,
      templateId: undefined,
      acceptanceStatus: '待初验',
      settlementStatus: '未生成',
      pendingAcceptanceCount: 0,
      pendingExecutionCount: 0,
      description: 'desc',
    } as any

    const created = await projectRepository.createProject(input as any)
    // 验证返回对象含有 code/ id 等字段
    expect(created).toHaveProperty('code', input.code)
    // 本地缓存应包含新项目
    const state = JSON.parse(localStorage.getItem('pm-projects-state-v1') || '[]')
    expect(state.find((p: any) => p.code === input.code)).toBeTruthy()
  })

  it('getProjects should return server data when available, fallback to local when server fails', async () => {
    const { serverAdapter } = await import('../../services/api/serverAdapter')
    serverAdapter.getProjects = vi.fn(async () => [{ code: 'PRJ-TEST', name: 'X' } as any])

    const projects = await projectRepository.getProjects()
    expect(projects).toBeInstanceOf(Array)
    expect(projects[0]).toHaveProperty('code', 'PRJ-TEST')

    // Second: simulate remote failure and fallback to local state
    serverAdapter.getProjects = vi.fn(async () => {
      throw new Error('network')
    })
    localStorage.setItem(
      'pm-projects-state-v1',
      JSON.stringify([{ code: 'PRJ-FALLBACK', name: 'Fallback' } as any])
    )
    const fallback = await projectRepository.getProjects()
    expect(fallback).toBeInstanceOf(Array)
    expect(fallback[0]).toHaveProperty('code', 'PRJ-FALLBACK')
  })

  it('updateProject should call serverAdapter and reflect in local cache', async () => {
    localStorage.setItem('pm-projects-state-v1', JSON.stringify([]))
    const updated = await projectRepository.updateProject('PRJ-001', { name: 'Updated' } as any)
    expect(updated).toHaveProperty('code', 'PRJ-001')
  })

  it('deleteProject should call serverAdapter and remove from local cache', async () => {
    localStorage.setItem(
      'pm-projects-state-v1',
      JSON.stringify([{ code: 'PRJ-DELETE', name: 'Del' } as any])
    )
    await projectRepository.deleteProject('PRJ-DELETE')
    const state = JSON.parse(localStorage.getItem('pm-projects-state-v1') || '[]')
    expect(state.find((p: any) => p.code === 'PRJ-DELETE')).toBeUndefined()
  })
})
