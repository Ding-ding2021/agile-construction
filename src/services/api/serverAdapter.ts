import type { ProjectItem } from '../../data/projects'
import type { ProjectStatusLogEntry } from '../../domain/projectStatusMachine'
import type { AcceptanceMilestoneSyncPayload } from '../../components/project/ProjectAcceptanceView'
import type { TaskItem } from '../../components/task/taskManagement.types'
import { apiRequest } from './client'

// ─── Snapshot Types (Deprecated,保留兼容) ───────────────────────

export type ProjectStateSnapshot = {
  projects: ProjectItem[]
  logs: Record<string, ProjectStatusLogEntry[]>
}

export type TaskStateSnapshot = {
  schemaVersion?: number
  tasks: TaskItem[]
}

export type AcceptanceStateSnapshot = {
  nodes: Array<Record<string, unknown>>
  milestones: Array<Record<string, unknown>>
  summary?: AcceptanceMilestoneSyncPayload
}

export type SettlementSuggestion = {
  code: string
  name: string
  budget: string
  acceptanceStatus: string
}

export type SettlementStateSnapshot = {
  suggestions: SettlementSuggestion[]
}

// ─── Entity Types (V1 实体化模式) ───────────────────────────────

export type ProjectCreatePayload = Omit<ProjectItem, 'id' | 'createdAt' | 'updatedAt'>
export type ProjectUpdatePayload = Partial<
  Omit<ProjectItem, 'id' | 'code' | 'createdAt' | 'updatedAt'>
>

export type TaskCreatePayload = Omit<TaskItem, 'id'>

export type AuditLogPayload = {
  scene: string
  detail: string
  projectCode?: string
  at?: string
}

const tcbEnvId = (import.meta.env.VITE_TCB_ENV_ID as string | undefined)?.trim() || 'unset-env'

const withEnv = (path: string) =>
  `${path}${path.includes('?') ? '&' : '?'}envId=${encodeURIComponent(tcbEnvId)}`

export const createIdempotencyKey = (scope: string, target?: string) => {
  const randomPart = Math.random().toString(36).slice(2, 10)
  const targetPart = target ? `-${target}` : ''
  return `${scope}${targetPart}-${Date.now()}-${randomPart}`
}

// ─── Server Adapter ─────────────────────────────────────────────

export const serverAdapter = {
  // ── 项目实体 CRUD (V1) ────────────────────────────────────────
  getProjects: () =>
    apiRequest<ProjectItem[]>(withEnv('/projects'), { scope: 'project_list_read' }),

  getProjectByCode: (code: string) =>
    apiRequest<ProjectItem>(withEnv(`/projects/${encodeURIComponent(code)}`), {
      scope: 'project_detail_read',
    }),

  createProject: (payload: ProjectCreatePayload, idempotencyKey: string) =>
    apiRequest<ProjectItem>(withEnv('/projects'), {
      method: 'POST',
      body: payload,
      idempotencyKey,
      scope: 'project_create',
    }),

  updateProject: (code: string, payload: ProjectUpdatePayload, idempotencyKey: string) =>
    apiRequest<ProjectItem>(withEnv(`/projects/${encodeURIComponent(code)}`), {
      method: 'PUT',
      body: payload,
      idempotencyKey,
      scope: 'project_update',
    }),

  deleteProject: (code: string) =>
    apiRequest<void>(withEnv(`/projects/${encodeURIComponent(code)}`), {
      method: 'DELETE',
      scope: 'project_delete',
    }),

  // ── 任务实体 CRUD (V1) ────────────────────────────────────────
  getProjectTasks: (projectCode: string) =>
    apiRequest<TaskItem[]>(withEnv(`/projects/${encodeURIComponent(projectCode)}/tasks`), {
      scope: 'task_list_read',
    }),

  createProjectTask: (projectCode: string, payload: TaskCreatePayload, idempotencyKey: string) =>
    apiRequest<TaskItem>(withEnv(`/projects/${encodeURIComponent(projectCode)}/tasks`), {
      method: 'POST',
      body: payload,
      idempotencyKey,
      scope: 'task_create',
    }),

  // ── 任务更新 / 删除 / 树状结构获取 API（V1 扩展） ───────────────────
  updateProjectTask: (
    projectCode: string,
    taskCode: string,
    payload: Record<string, unknown>,
    idempotencyKey: string
  ) =>
    apiRequest<TaskItem>(
      withEnv(`/projects/${encodeURIComponent(projectCode)}/tasks/${encodeURIComponent(taskCode)}`),
      {
        method: 'PUT',
        body: payload,
        idempotencyKey,
        scope: 'task_update',
      }
    ),

  deleteProjectTask: (projectCode: string, taskCode: string) =>
    apiRequest<void>(
      withEnv(`/projects/${encodeURIComponent(projectCode)}/tasks/${encodeURIComponent(taskCode)}`),
      {
        method: 'DELETE',
        scope: 'task_delete',
      }
    ),

  getTaskTree: (projectCode: string) =>
    apiRequest<any>(withEnv(`/projects/${encodeURIComponent(projectCode)}/tasks/tree`), {
      scope: 'task_tree_read',
    }),

  // ── 审计日志 ──────────────────────────────────────────────────
  getAuditLogs: () =>
    apiRequest<
      Array<{ id: number; scene: string; detail: string; projectCode?: string; at: string }>
    >(withEnv('/audit/logs'), { scope: 'audit_log_read' }),

  appendAuditLog: (payload: AuditLogPayload, idempotencyKey: string) =>
    apiRequest<void>(withEnv('/audit/logs'), {
      method: 'POST',
      body: {
        ...payload,
        at: payload.at ?? new Date().toISOString(),
      },
      idempotencyKey,
      scope: 'audit_log_write',
    }),

  // ── 快照接口 (Deprecated, 过渡期保留) ──────────────────────────
  /** @deprecated 使用 getProjects + getProjectByCode */
  getProjectState: () =>
    apiRequest<ProjectStateSnapshot>(withEnv('/projects/state'), { scope: 'project_state_read' }),
  /** @deprecated 使用 createProject / updateProject */
  saveProjectState: (payload: ProjectStateSnapshot, idempotencyKey: string) =>
    apiRequest<void>(withEnv('/projects/state'), {
      method: 'PUT',
      body: payload,
      idempotencyKey,
      scope: 'project_state_write',
    }),
  /** @deprecated 使用 getProjectTasks */
  getTaskState: (contextKey: string) =>
    apiRequest<TaskStateSnapshot>(
      withEnv(`/tasks/state?contextKey=${encodeURIComponent(contextKey)}`),
      { scope: 'task_state_read' }
    ),
  /** @deprecated 使用 createProjectTask */
  saveTaskState: (contextKey: string, payload: TaskStateSnapshot, idempotencyKey: string) =>
    apiRequest<void>(withEnv(`/tasks/state?contextKey=${encodeURIComponent(contextKey)}`), {
      method: 'PUT',
      body: payload,
      idempotencyKey,
      scope: 'task_state_write',
    }),
  /** @deprecated 保留兼容 */
  getAcceptanceState: (projectCode: string) =>
    apiRequest<AcceptanceStateSnapshot>(
      withEnv(`/acceptance/state?projectCode=${encodeURIComponent(projectCode)}`),
      { scope: 'acceptance_state_read' }
    ),
  /** @deprecated 保留兼容 */
  saveAcceptanceState: (
    projectCode: string,
    payload: AcceptanceStateSnapshot,
    idempotencyKey: string
  ) =>
    apiRequest<void>(withEnv(`/acceptance/state?projectCode=${encodeURIComponent(projectCode)}`), {
      method: 'PUT',
      body: payload,
      idempotencyKey,
      scope: 'acceptance_state_write',
    }),
  /** @deprecated 保留兼容 */
  getSettlementState: () =>
    apiRequest<SettlementStateSnapshot>(withEnv('/settlement/state'), {
      scope: 'settlement_state_read',
    }),
}
