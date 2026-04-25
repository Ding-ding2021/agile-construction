import { beforeEach, describe, expect, it, vi } from 'vitest'

const { serverAdapterMock } = vi.hoisted(() => ({
  serverAdapterMock: {
    getTaskState: vi.fn(),
    saveTaskState: vi.fn(),
    appendAuditLog: vi.fn(),
  },
}))

vi.mock('../api/serverAdapter', () => ({
  createIdempotencyKey: vi.fn(() => 'idempotency-key'),
  serverAdapter: serverAdapterMock,
}))

import { taskRepository } from '../repositories/taskRepository'
import type { TaskFlowLog, TaskItem } from '../../components/task/taskManagement.types'

const createTask = (code: string): TaskItem => ({
  name: `任务-${code}`,
  code,
  projectName: '测试项目',
  parentPath: '路径',
  taskType: '标准任务',
  sourceType: 'manual',
  status: '待分配',
  statusTone: 'neutral',
  owner: '待分配',
  plannedStartAt: '2026-04-01',
  plannedEndAt: '2026-04-02',
  slaStatus: '正常',
  slaTone: 'green',
  riskLevel: '低风险',
  riskTone: 'blue',
  predecessorStatus: '无前置任务',
  remindCount: 0,
  standardBindingStatus: '已绑定',
  isBlocked: false,
  progress: 0,
})

describe('taskRepository(task-center)', () => {
  const contextKey = 'template__project__code__project'

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    serverAdapterMock.getTaskState.mockRejectedValue(new Error('network fallback'))
    serverAdapterMock.saveTaskState.mockResolvedValue(undefined)
    serverAdapterMock.appendAuditLog.mockResolvedValue(undefined)
  })

  it('saveTasks应按V2结构写入本地快照并携带schemaVersion', async () => {
    const tasks = [createTask('TASK-001')]

    await taskRepository.saveTasks(contextKey, tasks)

    const local = localStorage.getItem(`pm-task-state-v1:${contextKey}`)
    expect(local).not.toBeNull()

    const parsed = JSON.parse(local!)
    expect(parsed.schemaVersion).toBe(2)
    expect(parsed.tasks).toHaveLength(1)

    expect(serverAdapterMock.saveTaskState).toHaveBeenCalledTimes(1)
    expect(serverAdapterMock.saveTaskState.mock.calls[0][1]).toMatchObject({
      schemaVersion: 2,
      tasks,
    })
  })

  it('loadTasks应兼容读取旧版数组快照', async () => {
    const tasks = [createTask('TASK-LEGACY')]
    localStorage.setItem(`pm-task-state-v1:${contextKey}`, JSON.stringify(tasks))

    const loaded = await taskRepository.loadTasks(contextKey)

    expect(loaded).not.toBeNull()
    expect(loaded?.[0].code).toBe('TASK-LEGACY')
  })

  it('appendOperationLog应写入并保留最近日志', async () => {
    const log: TaskFlowLog = {
      id: 'log-1',
      time: '2026-04-19 10:00',
      operator: '任务中心',
      action: '状态变更',
      detail: '测试日志',
    }

    await taskRepository.appendOperationLog(contextKey, 'TASK-001', log)

    const local = localStorage.getItem(`pm-task-operation-logs-v1:${contextKey}`)
    expect(local).not.toBeNull()
    const parsed = JSON.parse(local!)
    expect(parsed['TASK-001'][0].id).toBe('log-1')
  })
})
