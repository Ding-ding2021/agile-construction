/**
 * 本地 API 请求/响应类型定义
 */

// ========== 审计日志 ==========

export interface AuditLogInput {
  scene: string
  detail: string
  projectCode?: string
  at: string
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
