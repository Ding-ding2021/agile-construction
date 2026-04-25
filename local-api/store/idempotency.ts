/**
 * 幂等键处理模块
 * 实现写请求去重与重放一致性
 */

import { createHash } from 'crypto'
import { getDatabase } from './sqlite'
import type { IdempotencyRecord } from '../contracts'

const IDEMPOTENCY_TTL_DAYS = 7

/**
 * 生成请求指纹
 */
function hashRequest(body: unknown): string {
  const bodyStr = JSON.stringify(body)
  return createHash('sha256').update(bodyStr).digest('hex')
}

/**
 * 检查幂等键是否存在
 */
export function checkIdempotencyKey(
  key: string,
  envId: string,
  scope: string,
  body: unknown
): { exists: boolean; record?: IdempotencyRecord } {
  const db = getDatabase()
  const requestHash = hashRequest(body)

  const record = db
    .prepare(
      `
    SELECT 
      key,
      scope,
      env_id as envId,
      request_hash as requestHash,
      response_status as responseStatus,
      response_body as responseBody,
      created_at as createdAt,
      expired_at as expiredAt
    FROM idempotency_keys
    WHERE key = ? AND env_id = ?
  `
    )
    .get(key, envId) as IdempotencyRecord | undefined

  if (record) {
    // 检查请求体是否一致
    if (record.requestHash !== requestHash) {
      console.warn(
        `[Idempotency] 请求体不一致: key=${key}, expected=${record.requestHash}, actual=${requestHash}`
      )
      return { exists: false }
    }

    console.log(`[Idempotency] 命中幂等键: key=${key}, scope=${scope}`)
    return { exists: true, record }
  }

  return { exists: false }
}

/**
 * 记录幂等键
 */
export function recordIdempotencyKey(
  key: string,
  envId: string,
  scope: string,
  body: unknown,
  responseStatus: number,
  responseBody?: string
): void {
  const db = getDatabase()
  const requestHash = hashRequest(body)
  const expiredAt = new Date(Date.now() + IDEMPOTENCY_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString()

  try {
    db.prepare(
      `
      INSERT INTO idempotency_keys (key, scope, env_id, request_hash, response_status, response_body, expired_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    ).run(key, scope, envId, requestHash, responseStatus, responseBody || null, expiredAt)

    console.log(`[Idempotency] 记录幂等键: key=${key}, scope=${scope}`)
  } catch {
    // 幂等键已存在，忽略错误（可能在并发情况下出现）
    console.log(`[Idempotency] 幂等键已存在: key=${key}, scope=${scope}`)
  }
}

/**
 * 构造幂等响应
 */
export function buildIdempotentResponse(record: IdempotencyRecord): {
  status: number
  body?: unknown
} {
  return {
    status: record.responseStatus,
    body: record.responseBody ? JSON.parse(record.responseBody) : undefined,
  }
}
