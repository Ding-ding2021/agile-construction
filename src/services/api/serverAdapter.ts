import type { ProjectItem } from '../../data/projects'
import type { TaskItem } from '../../components/task/taskManagement.types'
import type { TaskTreeViewModel } from '../../components/task/taskManagement.data'
import { apiRequest } from './client'

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
  getAllTasks: () => apiRequest<TaskItem[]>(withEnv('/tasks/all'), { scope: 'task_list_read' }),

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
    apiRequest<TaskTreeViewModel>(
      withEnv(`/projects/${encodeURIComponent(projectCode)}/tasks/tree`),
      {
        scope: 'task_tree_read',
      }
    ),

  // ── 任务详情 / 日志 / 提交（V1 扩展） ────────────────────────────
  getTaskByCode: (projectCode: string, taskCode: string) =>
    apiRequest<TaskItem>(
      withEnv(
        `/projects/${encodeURIComponent(projectCode)}/tasks/code/${encodeURIComponent(taskCode)}`
      ),
      { scope: 'task_detail_read' }
    ),

  getTaskLogs: (projectCode: string, taskId: number) =>
    apiRequest<
      Array<{
        id: number
        taskId: number
        eventType: string
        eventAction: string
        beforeValue: unknown
        afterValue: unknown
        operatorId: string
        operatorSource: string
        createdAt: string
      }>
    >(withEnv(`/projects/${encodeURIComponent(projectCode)}/tasks/${taskId}/logs`), {
      scope: 'task_log_read',
    }),

  getTaskSubmissions: (projectCode: string, taskId: number) =>
    apiRequest<
      Array<{
        id: number
        taskId: number
        submissionType: string
        description: string | null
        attachmentIds: string[] | null
        status: string
        submittedBy: string
        submittedAt: string
        reviewedBy: string | null
        reviewResult: string | null
        reviewComment: string | null
        reviewedAt: string | null
      }>
    >(withEnv(`/projects/${encodeURIComponent(projectCode)}/tasks/${taskId}/submissions`), {
      scope: 'task_submission_read',
    }),

  createTaskSubmission: (
    projectCode: string,
    taskId: number,
    payload: { submissionType?: string; description?: string },
    idempotencyKey: string
  ) =>
    apiRequest<{
      id: number
      taskId: number
      submissionType: string
      description: string | null
      status: string
      submittedBy: string
      submittedAt: string
    }>(withEnv(`/projects/${encodeURIComponent(projectCode)}/tasks/${taskId}/submissions`), {
      method: 'POST',
      body: payload,
      idempotencyKey,
      scope: 'task_submission_create',
    }),

  reviewTaskSubmission: (
    projectCode: string,
    taskId: number,
    subId: number,
    payload: { reviewResult: string; reviewedBy?: string; reviewComment?: string },
    idempotencyKey: string
  ) =>
    apiRequest<{
      id: number
      status: string
      reviewResult: string
      reviewComment: string | null
    }>(
      withEnv(
        `/projects/${encodeURIComponent(projectCode)}/tasks/${taskId}/submissions/${subId}/review`
      ),
      { method: 'PUT', body: payload, idempotencyKey, scope: 'task_submission_review' }
    ),

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
}
