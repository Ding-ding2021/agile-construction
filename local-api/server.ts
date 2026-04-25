/**
 * 本地 HTTP API 服务
 * 实现五条核心接口：项目状态、任务状态、验收状态、结算状态、审计日志
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'http'
import { parse } from 'url'
import { initDatabase, closeDatabase, cleanupExpiredIdempotencyKeys } from './store/sqlite'
import { checkIdempotencyKey, recordIdempotencyKey } from './store/idempotency'
import {
  createErrorResponse,
  type ProjectStateSnapshot,
  type TaskStateSnapshot,
  type AcceptanceStateSnapshot,
  type AuditLogInput,
} from './contracts'

const PORT = process.env.LOCAL_API_PORT ? parseInt(process.env.LOCAL_API_PORT) : 3100
const API_PREFIX = '/api'

// ========== 工具函数 ==========

function parseQuery(req: IncomingMessage): Record<string, string> {
  const url = parse(req.url || '', true)
  return url.query as Record<string, string>
}

async function parseBody<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

function sendJson<T>(res: ServerResponse, data: T, status = 200): void {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Idempotency-Key',
  })
  res.end(JSON.stringify(data))
}

function sendNoContent(res: ServerResponse): void {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Idempotency-Key',
  })
  res.end()
}

function handleError(res: ServerResponse, message: string, code: string, status: number): void {
  sendJson(res, createErrorResponse(message, code, status), status)
}

// ========== 接口处理器 ==========

// 项目状态接口
function handleProjectState(req: IncomingMessage, res: ServerResponse): void {
  const db = initDatabase()
  const query = parseQuery(req)
  const envId = query.envId || 'default'

  if (req.method === 'GET') {
    const row = db
      .prepare('SELECT snapshot_json FROM project_state WHERE env_id = ?')
      .get(envId) as { snapshot_json: string } | undefined

    if (row) {
      sendJson(res, JSON.parse(row.snapshot_json))
    } else {
      sendJson(res, { projects: [], logs: {} })
    }
  } else if (req.method === 'PUT') {
    const idempotencyKey = req.headers['x-idempotency-key'] as string | undefined

    parseBody<ProjectStateSnapshot>(req)
      .then(payload => {
        // 幂等检查
        if (idempotencyKey) {
          const { exists, record } = checkIdempotencyKey(
            idempotencyKey,
            envId,
            'project_state_write',
            payload
          )
          if (exists && record) {
            console.log(`[API] 幂等重放: key=${idempotencyKey}`)
            sendNoContent(res)
            return
          }
        }

        // 保存数据
        const snapshotJson = JSON.stringify(payload)
        const updatedAt = new Date().toISOString()

        db.prepare(
          `
          INSERT INTO project_state (env_id, snapshot_json, updated_at)
          VALUES (?, ?, ?)
          ON CONFLICT(env_id) DO UPDATE SET snapshot_json = ?, updated_at = ?
        `
        ).run(envId, snapshotJson, updatedAt, snapshotJson, updatedAt)

        // 记录幂等键
        if (idempotencyKey) {
          recordIdempotencyKey(idempotencyKey, envId, 'project_state_write', payload, 204)
        }

        sendNoContent(res)
      })
      .catch(err => {
        handleError(res, err.message, 'INVALID_REQUEST', 400)
      })
  } else {
    handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
  }
}

// 任务状态接口
function handleTaskState(req: IncomingMessage, res: ServerResponse): void {
  const db = initDatabase()
  const query = parseQuery(req)
  const envId = query.envId || 'default'
  const contextKey = query.contextKey || 'default'

  if (req.method === 'GET') {
    const row = db
      .prepare('SELECT snapshot_json FROM task_state WHERE env_id = ? AND context_key = ?')
      .get(envId, contextKey) as { snapshot_json: string } | undefined

    if (row) {
      sendJson(res, JSON.parse(row.snapshot_json))
    } else {
      sendJson(res, { tasks: [] })
    }
  } else if (req.method === 'PUT') {
    const idempotencyKey = req.headers['x-idempotency-key'] as string | undefined

    parseBody<TaskStateSnapshot>(req)
      .then(payload => {
        const validation = isValidTaskSnapshot(payload)
        if (!validation.valid) {
          handleError(
            res,
            validation.message || '任务状态快照校验失败',
            'INVALID_TASK_SNAPSHOT',
            400
          )
          return
        }

        // 幂等检查
        if (idempotencyKey) {
          const { exists, record } = checkIdempotencyKey(
            idempotencyKey,
            envId,
            'task_state_write',
            payload
          )
          if (exists && record) {
            console.log(`[API] 幂等重放: key=${idempotencyKey}`)
            sendNoContent(res)
            return
          }
        }

        // 保存数据
        const snapshotJson = JSON.stringify(payload)
        const updatedAt = new Date().toISOString()

        db.prepare(
          `
          INSERT INTO task_state (env_id, context_key, snapshot_json, updated_at)
          VALUES (?, ?, ?, ?)
          ON CONFLICT(env_id, context_key) DO UPDATE SET snapshot_json = ?, updated_at = ?
        `
        ).run(envId, contextKey, snapshotJson, updatedAt, snapshotJson, updatedAt)

        // 记录幂等键
        if (idempotencyKey) {
          recordIdempotencyKey(idempotencyKey, envId, 'task_state_write', payload, 204)
        }

        sendNoContent(res)
      })
      .catch(err => {
        handleError(res, err.message, 'INVALID_REQUEST', 400)
      })
  } else {
    handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
  }
}

// 验收状态接口
function handleAcceptanceState(req: IncomingMessage, res: ServerResponse): void {
  const db = initDatabase()
  const query = parseQuery(req)
  const envId = query.envId || 'default'
  const projectCode = query.projectCode || 'default'

  if (req.method === 'GET') {
    const row = db
      .prepare('SELECT snapshot_json FROM acceptance_state WHERE env_id = ? AND project_code = ?')
      .get(envId, projectCode) as { snapshot_json: string } | undefined

    if (row) {
      sendJson(res, JSON.parse(row.snapshot_json))
    } else {
      sendJson(res, { nodes: [], milestones: [] })
    }
  } else if (req.method === 'PUT') {
    const idempotencyKey = req.headers['x-idempotency-key'] as string | undefined

    parseBody<AcceptanceStateSnapshot>(req)
      .then(payload => {
        // 幂等检查
        if (idempotencyKey) {
          const { exists, record } = checkIdempotencyKey(
            idempotencyKey,
            envId,
            'acceptance_state_write',
            payload
          )
          if (exists && record) {
            console.log(`[API] 幂等重放: key=${idempotencyKey}`)
            sendNoContent(res)
            return
          }
        }

        // 保存数据
        const snapshotJson = JSON.stringify(payload)
        const updatedAt = new Date().toISOString()

        db.prepare(
          `
          INSERT INTO acceptance_state (env_id, project_code, snapshot_json, updated_at)
          VALUES (?, ?, ?, ?)
          ON CONFLICT(env_id, project_code) DO UPDATE SET snapshot_json = ?, updated_at = ?
        `
        ).run(envId, projectCode, snapshotJson, updatedAt, snapshotJson, updatedAt)

        // 记录幂等键
        if (idempotencyKey) {
          recordIdempotencyKey(idempotencyKey, envId, 'acceptance_state_write', payload, 204)
        }

        sendNoContent(res)
      })
      .catch(err => {
        handleError(res, err.message, 'INVALID_REQUEST', 400)
      })
  } else {
    handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
  }
}

// 结算状态接口
function handleSettlementState(req: IncomingMessage, res: ServerResponse): void {
  const db = initDatabase()
  const query = parseQuery(req)
  const envId = query.envId || 'default'

  if (req.method === 'GET') {
    const row = db
      .prepare('SELECT snapshot_json FROM settlement_state WHERE env_id = ?')
      .get(envId) as { snapshot_json: string } | undefined

    if (row) {
      sendJson(res, JSON.parse(row.snapshot_json))
    } else {
      sendJson(res, { suggestions: [] })
    }
  } else {
    handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
  }
}

// 审计日志接口
function handleAuditLogs(req: IncomingMessage, res: ServerResponse): void {
  const db = initDatabase()
  const query = parseQuery(req)
  const envId = query.envId || 'default'

  if (req.method === 'POST') {
    const idempotencyKey = req.headers['x-idempotency-key'] as string | undefined

    parseBody<AuditLogInput>(req)
      .then(payload => {
        // 幂等检查
        if (idempotencyKey) {
          const { exists, record } = checkIdempotencyKey(
            idempotencyKey,
            envId,
            'audit_log_write',
            payload
          )
          if (exists && record) {
            console.log(`[API] 幂等重放: key=${idempotencyKey}`)
            sendNoContent(res)
            return
          }
        }

        // 写入审计日志
        const createdAt = new Date().toISOString()

        db.prepare(
          `
          INSERT INTO audit_logs (env_id, scene, detail, project_code, at, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `
        ).run(
          envId,
          payload.scene,
          payload.detail,
          payload.projectCode || null,
          payload.at,
          createdAt
        )

        // 记录幂等键
        if (idempotencyKey) {
          recordIdempotencyKey(idempotencyKey, envId, 'audit_log_write', payload, 204)
        }

        sendNoContent(res)
      })
      .catch(err => {
        handleError(res, err.message, 'INVALID_REQUEST', 400)
      })
  } else {
    handleError(res, 'Method not allowed', 'METHOD_NOT_ALLOWED', 405)
  }
}

// 健康检查
function handleHealth(_req: IncomingMessage, res: ServerResponse): void {
  sendJson(res, { status: 'ok', timestamp: new Date().toISOString() })
}

// ========== 路由分发 ==========

function router(req: IncomingMessage, res: ServerResponse): void {
  const url = parse(req.url || '', true)
  const pathname = url.pathname || ''

  // CORS 预检
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Idempotency-Key',
    })
    res.end()
    return
  }

  // 健康检查
  if (pathname === '/health') {
    handleHealth(req, res)
    return
  }

  // API 路由
  if (pathname.startsWith(API_PREFIX)) {
    const path = pathname.slice(API_PREFIX.length)

    switch (true) {
      case path === '/projects/state':
        handleProjectState(req, res)
        break
      case path === '/tasks/state':
        handleTaskState(req, res)
        break
      case path === '/acceptance/state':
        handleAcceptanceState(req, res)
        break
      case path === '/settlement/state':
        handleSettlementState(req, res)
        break
      case path === '/audit/logs':
        handleAuditLogs(req, res)
        break
      default:
        handleError(res, 'Not found', 'NOT_FOUND', 404)
    }
    return
  }

  handleError(res, 'Not found', 'NOT_FOUND', 404)
}

// ========== 启动服务 ==========

function startServer(): void {
  initDatabase()
  cleanupExpiredIdempotencyKeys()

  const server = createServer(router)

  server.listen(PORT, () => {
    console.log(`[Local API] 服务已启动: http://localhost:${PORT}`)
    console.log(`[Local API] API 基础路径: http://localhost:${PORT}${API_PREFIX}`)
    console.log(`[Local API] 健康检查: http://localhost:${PORT}/health`)
  })

  // 优雅关闭
  process.on('SIGINT', () => {
    console.log('\n[Local API] 正在关闭服务...')
    closeDatabase()
    server.close(() => {
      console.log('[Local API] 服务已关闭')
      process.exit(0)
    })
  })
}

startServer()
