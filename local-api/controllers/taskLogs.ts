import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const LOG_COLUMNS = [
  'id',
  'task_id as taskId',
  'event_type as eventType',
  'event_action as eventAction',
  'before_value as beforeValue',
  'after_value as afterValue',
  'operator_id as operatorId',
  'operator_source as operatorSource',
  'created_at as createdAt',
].join(', ')

function parseJsonField(val: unknown): unknown {
  if (!val) return val
  if (typeof val === 'string') {
    try {
      return JSON.parse(val)
    } catch {
      return val
    }
  }
  return val
}

function parseTaskId(raw: string): number {
  const id = parseInt(raw)
  if (isNaN(id)) throw new ApiError('无效的任务 ID', 'INVALID_REQUEST', 400)
  return id
}

export function getTaskLogs(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskId = parseTaskId(req.params.taskId)

  const rows = db
    .prepare(`SELECT ${LOG_COLUMNS} FROM task_event_logs WHERE task_id = ? ORDER BY created_at ASC`)
    .all(taskId) as Record<string, unknown>[]

  res.json(
    rows.map(r => ({
      ...r,
      beforeValue: parseJsonField(r.beforeValue),
      afterValue: parseJsonField(r.afterValue),
    }))
  )
}

export function createTaskLog(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskId = parseTaskId(req.params.taskId)
  const body = req.body

  const stmt = db.prepare(`
    INSERT INTO task_event_logs (task_id, event_type, event_action, before_value, after_value, operator_id, operator_source)
    VALUES (@taskId, @eventType, @eventAction, @beforeValue, @afterValue, @operatorId, @operatorSource)
  `)

  const result = stmt.run({
    taskId,
    eventType: body.eventType || 'field_change',
    eventAction: body.eventAction || '',
    beforeValue: body.beforeValue ? JSON.stringify(body.beforeValue) : null,
    afterValue: body.afterValue ? JSON.stringify(body.afterValue) : null,
    operatorId: body.operatorId || '系统',
    operatorSource: body.operatorSource || 'user',
  })

  const created = db
    .prepare(`SELECT ${LOG_COLUMNS} FROM task_event_logs WHERE id = ?`)
    .get(result.lastInsertRowid) as Record<string, unknown> | undefined

  res.status(201).json(
    created
      ? {
          ...created,
          beforeValue: parseJsonField(created.beforeValue),
          afterValue: parseJsonField(created.afterValue),
        }
      : created
  )
}
