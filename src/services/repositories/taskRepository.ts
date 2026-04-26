import type { TaskFlowLog, TaskItem } from '../../components/task/taskManagement.types'
import type { TemplateAuditEvent } from '../../components/standard/template-contract.types'
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
  name: `${payload.nodeName}（整改）`,
  code: buildRectificationTaskCode(payload.projectCode, payload.nodeCode),
  taskDescription: `由验收节点 ${payload.nodeCode} 触发的整改任务，需闭环问题项后再次提报。`,
  projectName: payload.projectName ?? payload.projectCode,
  parentPath: '项目验收 / 整改闭环',
  taskType: '标准任务',
  sourceType: 'manual',
  status: '待分配',
  statusTone: 'neutral',
  owner: '待分配',
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
})

export const taskRepository = {
  // ── 加载任务：实体 API 优先，降级到 localStorage ────────────────
  async loadTasks(contextKey: string): Promise<TaskItem[] | null> {
    const localTasks = readLocalTasks(contextKey)
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

      persistLocalTasks(contextKey, remoteTasks)
      return remoteTasks
    } catch {
      return localTasks
    }
  },

  // ── 保存任务：快照兼容（过渡期内保留） ──────────────────────────
  async saveTasks(contextKey: string, tasks: TaskItem[]): Promise<void> {
    persistLocalTasks(contextKey, tasks)

    try {
      await serverAdapter.saveTaskState(
        contextKey,
        {
          schemaVersion: TASK_SCHEMA_VERSION,
          tasks,
        },
        `task-state-${contextKey}-${Date.now()}`
      )
    } catch {
      // fallback to local cache only
    }
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

  async createRectificationTaskFromAcceptance(
    payload: AcceptanceRectificationPayload
  ): Promise<{ contextKey: string; taskCode: string }> {
    const contextKeys = listContextKeysByProjectCode(payload.projectCode)
    const contextKey = contextKeys[0] ?? `__${payload.projectName ?? ''}__${payload.projectCode}`

    const tasks = readLocalTasks(contextKey) ?? []
    const referenceTask =
      tasks.find(task => task.projectName === (payload.projectName ?? task.projectName)) ??
      tasks.find(task => ['待验收', '待提交', '执行中', '不通过'].includes(task.status))

    const nextTaskCode = buildRectificationTaskCode(payload.projectCode, payload.nodeCode)

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
