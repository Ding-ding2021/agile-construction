import type { ProjectItem } from '../../data/projects'
import type { ProjectStatusLogEntry } from '../../domain/projectStatusMachine'
import type { AcceptanceMilestoneSyncPayload } from '../../components/project/ProjectAcceptanceView'
import type { TaskItem } from '../../components/task/taskManagement.types'
import { apiRequest } from './client'

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

const tcbEnvId = (import.meta.env.VITE_TCB_ENV_ID as string | undefined)?.trim() || 'unset-env'

const withEnv = (path: string) =>
  `${path}${path.includes('?') ? '&' : '?'}envId=${encodeURIComponent(tcbEnvId)}`

export const createIdempotencyKey = (scope: string, target?: string) => {
  const randomPart = Math.random().toString(36).slice(2, 10)
  const targetPart = target ? `-${target}` : ''
  return `${scope}${targetPart}-${Date.now()}-${randomPart}`
}

export const serverAdapter = {
  getProjectState: () =>
    apiRequest<ProjectStateSnapshot>(withEnv('/projects/state'), { scope: 'project_state_read' }),
  saveProjectState: (payload: ProjectStateSnapshot, idempotencyKey: string) =>
    apiRequest<void>(withEnv('/projects/state'), {
      method: 'PUT',
      body: payload,
      idempotencyKey,
      scope: 'project_state_write',
    }),
  getTaskState: (contextKey: string) =>
    apiRequest<TaskStateSnapshot>(
      withEnv(`/tasks/state?contextKey=${encodeURIComponent(contextKey)}`),
      {
        scope: 'task_state_read',
      }
    ),
  saveTaskState: (contextKey: string, payload: TaskStateSnapshot, idempotencyKey: string) =>
    apiRequest<void>(withEnv(`/tasks/state?contextKey=${encodeURIComponent(contextKey)}`), {
      method: 'PUT',
      body: payload,
      idempotencyKey,
      scope: 'task_state_write',
    }),
  getAcceptanceState: (projectCode: string) =>
    apiRequest<AcceptanceStateSnapshot>(
      withEnv(`/acceptance/state?projectCode=${encodeURIComponent(projectCode)}`),
      {
        scope: 'acceptance_state_read',
      }
    ),
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
  getSettlementState: () =>
    apiRequest<SettlementStateSnapshot>(withEnv('/settlement/state'), {
      scope: 'settlement_state_read',
    }),
  appendAuditLog: (
    payload: { scene: string; detail: string; projectCode?: string },
    idempotencyKey: string
  ) =>
    apiRequest<void>(withEnv('/audit/logs'), {
      method: 'POST',
      body: {
        ...payload,
        at: new Date().toISOString(),
      },
      idempotencyKey,
      scope: 'audit_log_write',
    }),
}
