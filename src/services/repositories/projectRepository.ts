/**
 * Project Repository - 数据持久化层
 *
 * 职责（ADR-001）：
 * 1. 关键业务操作的本地持久化 + 远程同步
 * 2. 启动时的数据加载（本地缓存 → 远程 → 降级）
 * 3. 错误处理和降级策略
 *
 * 注意：常规状态变更由 Zustand persist 自动处理，本 Repository
 * 仅在关键 action 中被显式调用。
 *
 * @see docs/02-architecture/data-layer-decision-record.md
 */

import { projects as initialProjects, type ProjectItem } from '../../data/projects'
import type { ProjectStatusLogEntry } from '../../domain/projectStatusMachine'
import { createIdempotencyKey, serverAdapter } from '../api/serverAdapter'
import { StructuredError, errorLogger } from '../errors/StructuredError'

const PROJECTS_STORAGE_KEY = 'pm-projects-state-v1'
const PROJECT_LOGS_STORAGE_KEY = 'pm-project-logs-v1'

export type ProjectState = {
  projects: ProjectItem[]
  logs: Record<string, ProjectStatusLogEntry[]>
}

const readLocalState = (): ProjectState => {
  try {
    const rawProjects = window.localStorage.getItem(PROJECTS_STORAGE_KEY)
    const rawLogs = window.localStorage.getItem(PROJECT_LOGS_STORAGE_KEY)

    const parsedProjects = rawProjects
      ? (JSON.parse(rawProjects) as ProjectItem[])
      : initialProjects
    const parsedLogs = rawLogs
      ? (JSON.parse(rawLogs) as Record<string, ProjectStatusLogEntry[]>)
      : {}

    return {
      projects: Array.isArray(parsedProjects) ? parsedProjects : initialProjects,
      logs: parsedLogs && typeof parsedLogs === 'object' ? parsedLogs : {},
    }
  } catch (err) {
    // 增强日志：记录本地存储读取失败
    const error = StructuredError.fromRaw(err, 'BUSINESS_ERROR', 'repository', 'load-local-state', {
      raw: err,
    })
    errorLogger.log(error)

    return {
      projects: initialProjects,
      logs: {},
    }
  }
}

const persistLocalState = (state: ProjectState) => {
  try {
    window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(state.projects))
    window.localStorage.setItem(PROJECT_LOGS_STORAGE_KEY, JSON.stringify(state.logs))
  } catch (err) {
    // 增强日志：记录本地存储持久化失败
    const error = StructuredError.fromRaw(
      err,
      'BUSINESS_ERROR',
      'repository',
      'persist-local-state',
      {
        raw: err,
      }
    )
    errorLogger.log(error)
  }
}

export const projectRepository = {
  // ── 加载状态：实体 API 优先，降级到 localStorage ──────────────
  async loadState(): Promise<ProjectState> {
    const localState = readLocalState()

    try {
      let remoteProjects = await serverAdapter.getProjects()

      // ── 自动迁移：后端为空但本地有数据时，推送本地数据到实体表 ──
      if (remoteProjects.length === 0 && localState.projects.length > 0) {
        await Promise.allSettled(
          localState.projects.map(project => {
            const payload = { ...project } as Record<string, unknown>
            delete payload.id
            delete payload.createdAt
            delete payload.updatedAt
            return serverAdapter.createProject(
              payload as unknown as ProjectItem,
              createIdempotencyKey('migration', project.code)
            )
          })
        )
        remoteProjects = await serverAdapter.getProjects()
      }

      // 日志保持从本地缓存读取（审计日志与状态日志结构不同，暂不混用）
      const nextState: ProjectState = {
        projects: remoteProjects,
        logs: localState.logs,
      }
      persistLocalState(nextState)
      return nextState
    } catch (err) {
      const error = StructuredError.fromRaw(
        err,
        'NETWORK_ERROR',
        'repository',
        'load-remote-state',
        { raw: err }
      )
      errorLogger.log(error)
      return localState
    }
  },

  // ── 保存状态：快照兼容（过渡期内保留） ──────────────────────────
  async saveState(state: ProjectState): Promise<void> {
    persistLocalState(state)

    try {
      await serverAdapter.saveProjectState(state, createIdempotencyKey('project-state'))
    } catch (err) {
      const error = StructuredError.fromRaw(
        err,
        'NETWORK_ERROR',
        'repository',
        'save-remote-state',
        { raw: err }
      )
      errorLogger.log(error)
    }
  },

  // ── 项目实体 CRUD (V1) ────────────────────────────────────────
  async getProjects(): Promise<ProjectItem[]> {
    try {
      return await serverAdapter.getProjects()
    } catch {
      return readLocalState().projects
    }
  },

  async getProjectByCode(code: string): Promise<ProjectItem | null> {
    try {
      return await serverAdapter.getProjectByCode(code)
    } catch {
      return readLocalState().projects.find(p => p.code === code) ?? null
    }
  },

  async createProject(project: ProjectItem): Promise<ProjectItem> {
    const payload = { ...project } as Record<string, unknown>
    delete payload.id
    delete payload.createdAt
    delete payload.updatedAt
    const created = await serverAdapter.createProject(
      payload as unknown as ProjectItem,
      createIdempotencyKey('project-create', project.code)
    )
    // 双写本地缓存
    const current = readLocalState()
    const nextProjects = [...current.projects.filter(p => p.code !== created.code), created]
    persistLocalState({ ...current, projects: nextProjects })
    return created
  },

  async updateProject(code: string, patch: Partial<ProjectItem>): Promise<ProjectItem> {
    const payload = { ...patch } as Record<string, unknown>
    delete payload.id
    delete payload.code
    delete payload.createdAt
    delete payload.updatedAt
    const updated = await serverAdapter.updateProject(
      code,
      payload as Partial<ProjectItem>,
      createIdempotencyKey('project-update', code)
    )
    // 双写本地缓存
    const current = readLocalState()
    const nextProjects = current.projects.map(p => (p.code === code ? updated : p))
    persistLocalState({ ...current, projects: nextProjects })
    return updated
  },

  async deleteProject(code: string): Promise<void> {
    await serverAdapter.deleteProject(code)
    // 同步删除本地缓存
    const current = readLocalState()
    const nextProjects = current.projects.filter(p => p.code !== code)
    persistLocalState({ ...current, projects: nextProjects })
  },
}
