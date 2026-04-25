/**
 * 本地 API 请求/响应类型定义
 * 对齐前端 src/services/api/serverAdapter.ts 契约
 */

import type { ProjectItem } from '../src/data/projects'
import type { ProjectStatusLogEntry } from '../src/domain/projectStatusMachine'
import type { TaskItem } from '../src/components/task/taskManagement.types'
import type { AcceptanceMilestoneSyncPayload } from '../src/components/project/ProjectAcceptanceView'

// ========== 项目状态 ==========

export interface ProjectStateSnapshot {
  projects: ProjectItem[]
  logs: Record<string, ProjectStatusLogEntry[]>
}

// ========== 任务状态 ==========

export interface TaskStateSnapshot {
  schemaVersion?: number
  tasks: TaskItem[]
}

// ========== 验收状态 ==========

export interface AcceptanceStateSnapshot {
  nodes: Array<Record<string, unknown>>
  milestones: Array<Record<string, unknown>>
  summary?: AcceptanceMilestoneSyncPayload
}

// ========== 结算状态 ==========

export interface SettlementSuggestion {
  code: string
  name: string
  budget: string
  acceptanceStatus: string
}

export interface SettlementStateSnapshot {
  suggestions: SettlementSuggestion[]
}

// ========== 审计日志 ==========

export interface AuditLogInput {
  scene: string
  detail: string
  projectCode?: string
  at: string // ISO 8601 datetime
}

export interface AuditLogRecord extends AuditLogInput {
  id: number
  createdAt: string
}

// ========== 幂等记录 ==========

export interface IdempotencyRecord {
  key: string
  scope: string
  requestHash: string
  responseStatus: number
  responseBody?: string
  createdAt: string
  expiredAt: string
}

// ========== 统一错误响应 ==========

export interface ApiErrorResponse {
  message: string
  code: string
  status: number
  timestamp: string
}

export function createErrorResponse(
  message: string,
  code: string,
  status: number
): ApiErrorResponse {
  return {
    message,
    code,
    status,
    timestamp: new Date().toISOString(),
  }
}
