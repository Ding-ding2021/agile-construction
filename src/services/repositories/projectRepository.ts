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
  async loadState(): Promise<ProjectState> {
    const localState = readLocalState()

    try {
      const remoteState = await serverAdapter.getProjectState()
      const nextState: ProjectState = {
        projects: remoteState.projects,
        logs: remoteState.logs,
      }
      persistLocalState(nextState)
      return nextState
    } catch (err) {
      // 增强日志：记录远程加载失败，降级到本地缓存
      const error = StructuredError.fromRaw(
        err,
        'NETWORK_ERROR',
        'repository',
        'load-remote-state',
        {
          raw: err,
        }
      )
      errorLogger.log(error)

      return localState
    }
  },

  async saveState(state: ProjectState): Promise<void> {
    persistLocalState(state)

    try {
      await serverAdapter.saveProjectState(state, createIdempotencyKey('project-state'))
    } catch (err) {
      // 增强日志：记录远程保存失败，已降级到本地缓存
      const error = StructuredError.fromRaw(
        err,
        'NETWORK_ERROR',
        'repository',
        'save-remote-state',
        {
          raw: err,
        }
      )
      errorLogger.log(error)
    }
  },
}
