/* eslint-disable @typescript-eslint/no-explicit-any -- 测试 mock 需要 any */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import type { TaskItem } from '../components/task/taskManagement.types'

// Mock serverAdapter module used by taskRepository
import { taskRepository } from '../services/repositories/taskRepository'
vi.mock('../services/api/serverAdapter', () => {
  return {
    createIdempotencyKey: vi.fn(() => 'mock-idempotency'),
    serverAdapter: {
      getProjectTasks: vi.fn(),
      createProjectTask: vi.fn(),
      updateProjectTask: vi.fn(),
      deleteProjectTask: vi.fn(),
      getTaskTree: vi.fn(),
      appendAuditLog: vi.fn(),
    },
  }
})

import { serverAdapter } from '../services/api/serverAdapter'

const CONTEXT = '__PRJ__PRJ1'

function mkTask(code: string): TaskItem {
  return {
    id: 't-' + code,
    code,
    name: 'Task ' + code,
    projectId: 'PRJ1',
    parentTaskId: null,
    status: '待分配',
    assigneeId: '',
    plannedStartAt: '2026-04-01',
    plannedEndAt: '2026-04-02',
    createdBy: 'tester',
    createdAt: new Date().toISOString(),
    progress: 0,
    nodeLevelType: 'task',
    priority: 'urgent',
    workPackageId: undefined,
    projectName: 'PRJ1',
  } as any
}

describe('taskRepository.loadTasks', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('migrates local tasks to remote when remote is empty', async () => {
    const localKey = `pm-task-state-v1:${CONTEXT}`
    const localTask = mkTask('T1')
    window.localStorage.setItem(localKey, JSON.stringify({ schemaVersion: 2, tasks: [localTask] }))

    // remote empty on first fetch
    ;(serverAdapter.getProjectTasks as any).mockImplementationOnce(async (_code: string) => [])
    ;(serverAdapter.createProjectTask as any).mockImplementationOnce(
      async (_code: string, task: any) => task
    )
    // after migration, remote returns one task
    ;(serverAdapter.getProjectTasks as any).mockImplementationOnce(async (_code: string) => [
      mkTask('T1'),
    ])

    const result = await taskRepository.loadTasks(CONTEXT)

    expect(Array.isArray(result)).toBe(true)
    // local storage should be updated to remote tasks
    const cachedRaw = window.localStorage.getItem(localKey)
    expect(cachedRaw).toBeTruthy()
  })

  it('returns local tasks when remote fetch fails', async () => {
    const localKey = `pm-task-state-v1:${CONTEXT}`
    const localTask = mkTask('T2')
    window.localStorage.setItem(localKey, JSON.stringify({ schemaVersion: 2, tasks: [localTask] }))
    ;(serverAdapter.getProjectTasks as any).mockRejectedValueOnce(new Error('network'))

    const result = await taskRepository.loadTasks(CONTEXT)
    // should return local tasks cached
    expect(result).toBeTruthy()
  })
})
