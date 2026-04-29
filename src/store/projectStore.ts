/**
 * Project Store - Zustand
 *
 * 将 App.tsx 中的 projectsState / projectStatusLogs 状态迁移到 Zustand store，
 * 支持 localStorage 持久化、状态流转、日志记录。
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProjectItem } from '../data/projects'
import type { ProjectStatus, ProjectStatusLogEntry } from '../domain/projectStatusMachine'
import type { ParentStatus, SubStatusProgress } from '../domain/projectParentStatus'
import { getParentStatusTone, getParentProgressFloor } from '../domain/projectStatusView'
import {
  getProjectStageByStatus,
  getProjectStatusTone,
  getProgressFloorByStatus,
} from '../domain/projectStatusView'

// ─── Store State ───────────────────────────────────────────────

type ProjectStoreState = {
  projects: ProjectItem[]
  logs: Record<string, ProjectStatusLogEntry[]>
}

// ─── Store Actions ─────────────────────────────────────────────

type ProjectStoreActions = {
  setProjects: (projects: ProjectItem[]) => void
  setLogs: (logs: Record<string, ProjectStatusLogEntry[]>) => void
  updateProjectStatus: (
    projectCode: string,
    toStatus: ProjectStatus,
    nextProgress?: number
  ) => boolean
  updateProjectBasicInfo: (
    projectCode: string,
    payload: Partial<Pick<ProjectItem, 'name' | 'owner' | 'plannedOpenDate' | 'dateRange'>>
  ) => boolean
  appendLog: (projectCode: string, log: ProjectStatusLogEntry) => void
  syncProjectMilestone: (
    projectCode: string,
    payload: {
      milestone: string
      progress: number
      acceptanceStatus: ProjectItem['acceptanceStatus']
      pendingAcceptanceCount: number
      settlementStatus: ProjectItem['settlementStatus']
      executionStatus: ProjectItem['executionStatus']
      pendingExecutionCount: number
      description: string
    }
  ) => boolean
  addProject: (project: ProjectItem) => void
  updateParentStatus: (
    projectCode: string,
    toParentStatus: ParentStatus,
    subStatusProgress?: SubStatusProgress
  ) => boolean
  updateSubStatusProgress: (projectCode: string, subStatusProgress: SubStatusProgress) => boolean
}

export type ProjectStore = ProjectStoreState & ProjectStoreActions

// ─── Store Implementation ──────────────────────────────────────

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      // Initial state
      projects: [],
      logs: {},

      // Actions
      setProjects: projects => set({ projects }),
      setLogs: logs => set({ logs }),

      addProject: project =>
        set(state => ({
          projects: [project, ...state.projects],
        })),

      updateProjectStatus: (projectCode, toStatus, nextProgress) => {
        const state = get()
        const project = state.projects.find(p => p.code === projectCode)
        if (!project) return false

        const floor = getProgressFloorByStatus(toStatus)
        const progress =
          nextProgress ?? (toStatus === '已归档' ? 100 : Math.max(project.progress, floor))

        set(state => ({
          projects: state.projects.map(p =>
            p.code === projectCode
              ? {
                  ...p,
                  status: toStatus,
                  stage: getProjectStageByStatus(toStatus),
                  statusTone: getProjectStatusTone(toStatus),
                  progress,
                }
              : p
          ),
        }))

        return true
      },

      updateProjectBasicInfo: (projectCode, payload) => {
        const state = get()
        const project = state.projects.find(p => p.code === projectCode)
        if (!project) return false

        set(state => ({
          projects: state.projects.map(p => (p.code === projectCode ? { ...p, ...payload } : p)),
        }))

        return true
      },

      appendLog: (projectCode, log) =>
        set(state => ({
          logs: {
            ...state.logs,
            [projectCode]: [log, ...(state.logs[projectCode] ?? [])].slice(0, 30),
          },
        })),

      updateParentStatus: (projectCode, toParentStatus, subStatusProgress) => {
        const state = get()
        const project = state.projects.find(p => p.code === projectCode)
        if (!project) return false

        const floor = getParentProgressFloor(toParentStatus)
        const progress = Math.max(project.progress, floor)

        set(state => ({
          projects: state.projects.map(p =>
            p.code === projectCode
              ? {
                  ...p,
                  parentStatus: toParentStatus,
                  statusTone: getParentStatusTone(toParentStatus),
                  progress,
                  subStatusJson: subStatusProgress
                    ? JSON.stringify(subStatusProgress)
                    : p.subStatusJson,
                }
              : p
          ),
        }))
        return true
      },

      updateSubStatusProgress: (projectCode, subStatusProgress) => {
        const state = get()
        const project = state.projects.find(p => p.code === projectCode)
        if (!project) return false

        const pStatus: ParentStatus = (project.parentStatus ?? '启动') as ParentStatus
        const progress = getParentProgressFloor(pStatus)
        const subProgress = subStatusProgress.items.filter(i => i.completed).length
        const total = subStatusProgress.items.length
        const adjustedProgress =
          total > 0 ? Math.max(progress, Math.round((subProgress / total) * 100)) : progress

        set(state => ({
          projects: state.projects.map(p =>
            p.code === projectCode
              ? {
                  ...p,
                  subStatusJson: JSON.stringify(subStatusProgress),
                  progress: adjustedProgress,
                }
              : p
          ),
        }))
        return true
      },

      syncProjectMilestone: (projectCode, payload) => {
        const state = get()
        const project = state.projects.find(p => p.code === projectCode)
        if (!project) return false

        set(state => ({
          projects: state.projects.map(p =>
            p.code === projectCode
              ? {
                  ...p,
                  milestone: payload.milestone,
                  progress: payload.progress,
                  acceptanceStatus: payload.acceptanceStatus,
                  pendingAcceptanceCount: payload.pendingAcceptanceCount,
                  settlementStatus: payload.settlementStatus,
                  executionStatus: payload.executionStatus,
                  pendingExecutionCount: payload.pendingExecutionCount,
                  description: payload.description,
                }
              : p
          ),
        }))

        return true
      },
    }),
    {
      name: 'pm-projects-state-v1',
      partialize: state => ({
        projects: state.projects,
        logs: state.logs,
      }),
      // NOTE(ADR-001): 本 persist 负责常规状态的自动本地持久化。
      // 关键业务操作（创建项目、状态流转等）需额外调用 projectRepository.saveState()
      // 以触发远程同步和审计日志。详见 docs/02-architecture/data-layer-decision-record.md
    }
  )
)

// ─── Selectors ─────────────────────────────────────────────────

export const selectProjectByCode = (state: ProjectStore, code: string): ProjectItem | undefined =>
  state.projects.find(p => p.code === code)

export const selectProjectLogs = (state: ProjectStore, code: string): ProjectStatusLogEntry[] =>
  state.logs[code] ?? []
