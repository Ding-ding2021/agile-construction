import type { TaskFlowLog, TaskItem } from '../../components/task/taskManagement.types'
import type { TemplateAuditEvent } from '../../components/standard/template-contract.types'
import { allMockTaskNodes } from '../../components/task/taskManagement.data'
import { createIdempotencyKey, serverAdapter } from '../api/serverAdapter'

export type AcceptanceRectificationPayload = {
  projectCode: string
  projectName?: string
  nodeCode: string
  nodeName: string
  owner?: string
  issueCount?: number
}

const TASK_STATE_STORAGE_PREFIX = 'pm-task-state-v1'
const TASK_OPERATION_LOG_PREFIX = 'pm-task-operation-logs-v1'
const TEMPLATE_AUDIT_STORAGE_KEY = 'pm-template-audit-v1'
const TASK_SCHEMA_VERSION = 2

const keyOf = (contextKey: string) => `${TASK_STATE_STORAGE_PREFIX}:${contextKey}`
const logKeyOf = (contextKey: string) => `${TASK_OPERATION_LOG_PREFIX}:${contextKey}`

const readLocalTasks = (contextKey: string): TaskItem[] | null => {
  try {
    const raw = window.localStorage.getItem(keyOf(contextKey))
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as
      | TaskItem[]
      | {
          schemaVersion?: number
          tasks?: TaskItem[]
        }

    if (Array.isArray(parsed)) {
      return parsed
    }

    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.tasks)) {
      return parsed.tasks
    }

    return null
  } catch {
    return null
  }
}

const persistLocalTasks = (contextKey: string, tasks: TaskItem[]) => {
  try {
    window.localStorage.setItem(
      keyOf(contextKey),
      JSON.stringify({
        schemaVersion: TASK_SCHEMA_VERSION,
        tasks,
      })
    )
  } catch {
    // ignore storage errors
  }
}

const readLocalOperationLogs = (contextKey: string): Record<string, TaskFlowLog[]> => {
  try {
    const raw = window.localStorage.getItem(logKeyOf(contextKey))
    if (!raw) {
      return {}
    }
    const parsed = JSON.parse(raw) as Record<string, TaskFlowLog[]>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const persistLocalOperationLogs = (contextKey: string, logs: Record<string, TaskFlowLog[]>) => {
  try {
    window.localStorage.setItem(logKeyOf(contextKey), JSON.stringify(logs))
  } catch {
    // ignore storage errors
  }
}

const buildRectificationTaskCode = (projectCode: string, nodeCode: string) => {
  const stamp = String(Date.now()).slice(-8)
  const normalizedNodeCode = nodeCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase() || 'NODE'
  return `RECT-${projectCode}-${normalizedNodeCode}-${stamp}`
}

const listContextKeysByProjectCode = (projectCode: string): string[] => {
  const result: string[] = []

  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const fullKey = window.localStorage.key(index)
      if (!fullKey || !fullKey.startsWith(`${TASK_STATE_STORAGE_PREFIX}:`)) {
        continue
      }

      const contextKey = fullKey.slice(`${TASK_STATE_STORAGE_PREFIX}:`.length)
      if (contextKey.endsWith(`__${projectCode}`)) {
        result.push(contextKey)
      }
    }
  } catch {
    return []
  }

  return result
}

const createFallbackRectificationTask = (payload: AcceptanceRectificationPayload): TaskItem => ({
  id: `rect-${payload.projectCode}-${Date.now()}`,
  name: `${payload.nodeName}（整改）`,
  code: buildRectificationTaskCode(payload.projectCode, payload.nodeCode),
  projectId: payload.projectCode,
  taskDescription: `由验收节点 ${payload.nodeCode} 触发的整改任务，需闭环问题项后再次提报。`,
  projectName: payload.projectName ?? payload.projectCode,
  parentTaskId: null,
  parentPath: '项目验收 / 整改闭环',
  taskType: '标准任务',
  sourceType: 'manual',
  status: '待分配',
  statusTone: 'neutral',
  owner: '待分配',
  assigneeId: '',
  assigneeName: '待分配',
  nodeLevelType: 'task',
  priority: 'urgent',
  plannedStartAt: new Date().toISOString().slice(0, 10),
  plannedEndAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  slaStatus: '即将超时',
  slaTone: 'orange',
  riskLevel: '高风险',
  riskTone: 'red',
  predecessorStatus: '前置已完成',
  remindCount: 0,
  standardBindingStatus: '已绑定',
  snapshotStatus: '已生成',
  standardSnapshotId: `snapshot-${payload.projectCode}-${payload.nodeCode}-${Date.now()}`,
  isBlocked: false,
  progress: 5,
  tags: [],
  createdBy: '系统',
  createdAt: new Date().toISOString(),
})

export const taskRepository = {
  // ── 加载任务：实体 API 优先，降级到 localStorage ────────────────
  async loadTasks(contextKey: string): Promise<TaskItem[] | null> {
    const localTasks = readLocalTasks(contextKey)

    // __all 特例：调用跨项目 API
    if (contextKey === '__all') {
      try {
        const remoteTasks = await serverAdapter.getAllTasks()
        persistLocalTasks('__all', remoteTasks)
        return remoteTasks
      } catch {
        // 后端不可用时：localStorage 有数据则用，否则 fallback 到 mock 作为初始种子
        if (localTasks && localTasks.length > 0) {
          return localTasks
        }
        persistLocalTasks('__all', allMockTaskNodes)
        return allMockTaskNodes
      }
    }

    // contextKey 格式通常为 `__{projectName}__{projectCode}`，提取 projectCode
    const projectCode = contextKey.split('__').pop() ?? contextKey

    try {
      let remoteTasks = await serverAdapter.getProjectTasks(projectCode)

      // ── 自动迁移：后端为空但本地有数据时，推送本地任务到实体表 ──
      if (remoteTasks.length === 0 && localTasks && localTasks.length > 0) {
        await Promise.allSettled(
          localTasks.map(task =>
            serverAdapter.createProjectTask(
              projectCode,
              task,
              createIdempotencyKey('migration-task', task.code)
            )
          )
        )
        remoteTasks = await serverAdapter.getProjectTasks(projectCode)
      }

      // 双写：成功后同步到本地缓存，保证离线可用
      persistLocalTasks(contextKey, remoteTasks)
      return remoteTasks
    } catch {
      // 网络异常或服务不可用时降级到本地缓存
      return localTasks
    }
  },

  // ── 更新单任务 ─────────────────────────────────
  async updateTask(
    projectCode: string,
    taskCode: string,
    payload: Partial<TaskItem>
  ): Promise<TaskItem> {
    const contextKey = `__${projectCode}`
    try {
      const updated = await serverAdapter.updateProjectTask(
        projectCode,
        taskCode,
        payload,
        createIdempotencyKey('task-update', taskCode)
      )

      // 同步本地缓存
      const current = readLocalTasks(contextKey) ?? []
      const next = current.map(t => (t.code === taskCode ? updated : t))
      persistLocalTasks(contextKey, next)
      return updated
    } catch {
      // 回退到本地缓存中的改动，确保离线可用
      const current = readLocalTasks(contextKey) ?? []
      const local = current.find(t => t.code === taskCode)
      if (local) {
        const fallback = { ...local, ...payload } as TaskItem
        const next = current.map(t => (t.code === taskCode ? fallback : t))
        persistLocalTasks(contextKey, next)
        return fallback
      }
      throw new Error(`Failed to update task: ${taskCode}`)
    }
  },

  // ── 删除单任务 ─────────────────────────────────
  async deleteTask(projectCode: string, taskCode: string): Promise<void> {
    const contextKey = `__${projectCode}`
    try {
      await serverAdapter.deleteProjectTask(projectCode, taskCode)
    } catch {
      // 忽略远端删除失败，仍尝试清理本地缓存
    } finally {
      const current = readLocalTasks(contextKey) ?? []
      const next = current.filter(t => t.code !== taskCode)
      persistLocalTasks(contextKey, next)
    }
  },

  // ── 载入含树状结构的任务 ───────────────────────────
  async loadTasksWithTree(projectCode: string): Promise<any> {
    try {
      return await serverAdapter.getTaskTree(projectCode)
    } catch {
      // 回退到本地任务数组作为简易树状结构
      const contextKey = `__${projectCode}`
      const local = readLocalTasks(contextKey) ?? []
      return local
    }
  },

  // ── 保存任务本地缓存 ───────────────────────────────────────────
  async saveTasks(contextKey: string, tasks: TaskItem[]): Promise<void> {
    persistLocalTasks(contextKey, tasks)
  },

  // ── 任务实体 CRUD (V1) ────────────────────────────────────────
  async getProjectTasks(projectCode: string): Promise<TaskItem[]> {
    try {
      return await serverAdapter.getProjectTasks(projectCode)
    } catch {
      const contextKey = `__${projectCode}`
      return readLocalTasks(contextKey) ?? []
    }
  },

  async createProjectTask(projectCode: string, task: TaskItem): Promise<TaskItem> {
    const created = await serverAdapter.createProjectTask(
      projectCode,
      task,
      createIdempotencyKey('task-create', task.code)
    )
    // 双写本地缓存
    const contextKey = `__${projectCode}`
    const current = readLocalTasks(contextKey) ?? []
    persistLocalTasks(contextKey, [...current, created])
    return created
  },

  async loadOperationLogs(contextKey: string): Promise<Record<string, TaskFlowLog[]>> {
    return readLocalOperationLogs(contextKey)
  },

  async appendOperationLog(contextKey: string, taskCode: string, log: TaskFlowLog): Promise<void> {
    const current = readLocalOperationLogs(contextKey)
    const next = {
      ...current,
      [taskCode]: [log, ...(current[taskCode] ?? [])].slice(0, 30),
    }
    persistLocalOperationLogs(contextKey, next)

    try {
      await serverAdapter.appendAuditLog(
        {
          scene: 'task_operation',
          detail: `${taskCode} ${log.action} - ${log.detail}`,
          projectCode: contextKey,
        },
        `task-op-${taskCode}-${Date.now()}`
      )
    } catch {
      // fallback to local cache only
    }
  },

  /**
   * 从验收节点创建整改任务
   *
   * 当验收不通过时自动创建整改任务。策略如下：
   * 1. 查找与当前项目匹配的上下文键（contextKey）
   * 2. 尝试从已有任务中找到引用任务（referenceTask）来继承属性
   *    - 优先匹配 projectName 相同的任务
   *    - 其次查找待验收/待提交/执行中/不通过状态的任务
   * 3. 如无引用任务则使用默认模板创建的降级任务
   * 4. 去重：移除已有的同名整改任务后重新添加
   */
  async createRectificationTaskFromAcceptance(
    payload: AcceptanceRectificationPayload
  ): Promise<{ contextKey: string; taskCode: string }> {
    // 查找项目对应的 localStorage 存储键
    const contextKeys = listContextKeysByProjectCode(payload.projectCode)
    const contextKey = contextKeys[0] ?? `__${payload.projectName ?? ''}__${payload.projectCode}`

    const tasks = readLocalTasks(contextKey) ?? []
    // 查找参考任务用于继承属性：首选同项目名，其次选特定状态的任务
    const referenceTask =
      tasks.find(task => task.projectName === (payload.projectName ?? task.projectName)) ??
      tasks.find(task => ['待验收', '待提交', '执行中', '不通过'].includes(task.status))

    const nextTaskCode = buildRectificationTaskCode(payload.projectCode, payload.nodeCode)

    // 基于参考任务构建整改任务（有参考任务时继承其属性，否则使用降级模板）
    const rectificationTask: TaskItem = referenceTask
      ? {
          ...referenceTask,
          name: `${payload.nodeName}（整改）`,
          code: nextTaskCode,
          taskDescription: `由验收节点 ${payload.nodeCode} 触发的整改任务，来源任务 ${referenceTask.code}。`,
          parentPath: `${referenceTask.parentPath} / 项目验收整改`,
          status: '待分配',
          sourceType: referenceTask.sourceType ?? 'manual',
          statusTone: 'neutral',
          owner: '待分配',
          plannedStartAt: new Date().toISOString().slice(0, 10),
          plannedEndAt: referenceTask.plannedEndAt,
          riskLevel: '高风险',
          riskTone: 'red',
          predecessorStatus: '前置已完成',
          remindCount: 0,
          snapshotStatus: '已生成',
          standardSnapshotId: referenceTask.standardSnapshotId ?? `snapshot-${nextTaskCode}`,
          isBlocked: false,
          progress: 5,
        }
      : {
          ...createFallbackRectificationTask(payload),
          code: nextTaskCode,
        }

    // 去重：先移除相同编码的旧任务，再将新整改任务插入队首
    const deduplicatedTasks = tasks.filter(task => task.code !== nextTaskCode)
    const nextTasks = [rectificationTask, ...deduplicatedTasks]
    persistLocalTasks(contextKey, nextTasks)

    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const hh = String(now.getHours()).padStart(2, '0')
    const min = String(now.getMinutes()).padStart(2, '0')
    const logTime = `${yyyy}-${mm}-${dd} ${hh}:${min}`

    const rectificationLog: TaskFlowLog = {
      id: `${nextTaskCode}-created-${now.getTime()}`,
      time: logTime,
      operator: '项目验收',
      action: '整改任务创建',
      detail: `由验收节点 ${payload.nodeCode}（${payload.nodeName}）触发，问题数 ${payload.issueCount ?? 0}。`,
    }

    const currentLogs = readLocalOperationLogs(contextKey)
    const nextLogs = {
      ...currentLogs,
      [nextTaskCode]: [rectificationLog, ...(currentLogs[nextTaskCode] ?? [])].slice(0, 30),
    }
    persistLocalOperationLogs(contextKey, nextLogs)

    try {
      await serverAdapter.appendAuditLog(
        {
          scene: 'acceptance',
          detail: `验收节点 ${payload.nodeCode} 触发整改任务 ${nextTaskCode}`,
          projectCode: payload.projectCode,
        },
        createIdempotencyKey('acceptance-rectify', payload.projectCode)
      )
    } catch {
      // fallback to local cache only
    }

    return {
      contextKey,
      taskCode: nextTaskCode,
    }
  },

  appendAuditEvents(events: TemplateAuditEvent[]) {
    if (events.length === 0) {
      return
    }

    try {
      const raw = window.localStorage.getItem(TEMPLATE_AUDIT_STORAGE_KEY)
      const parsed = raw ? (JSON.parse(raw) as TemplateAuditEvent[]) : []
      const next = [...events, ...(Array.isArray(parsed) ? parsed : [])].slice(0, 200)
      window.localStorage.setItem(TEMPLATE_AUDIT_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore storage errors
    }

    const auditPromises = events.map(event => {
      const detail =
        event.type === 'template_mismatch_detected'
          ? event.details
          : event.type === 'template_instance_created'
            ? `${event.templateCode}@${event.templateVersion}`
            : event.type === 'standard_snapshot_created'
              ? event.snapshotId
              : event.overrideReason

      return serverAdapter.appendAuditLog(
        {
          scene: event.type,
          detail,
          projectCode: event.projectInstanceId,
        },
        `task-audit-${event.type}-${event.timestamp}`
      )
    })

    void Promise.allSettled(auditPromises)
  },
}
