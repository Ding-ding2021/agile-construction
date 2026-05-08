import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const CHECKLIST_COLS =
  'id, task_id as taskId, clause_id as clauseId, name, result, inspector, inspected_at as inspectedAt, remark, created_at as createdAt, updated_at as updatedAt'

function getTaskId(taskId: string): number {
  const id = parseInt(taskId)
  if (isNaN(id)) throw new ApiError('Invalid taskId', 'VALIDATION_ERROR', 400)
  return id
}

export function getChecklist(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskId = getTaskId(req.params.taskId)

  const rows = db
    .prepare(`SELECT ${CHECKLIST_COLS} FROM checklist_items WHERE task_id = ? ORDER BY id ASC`)
    .all(taskId)

  res.json({ data: rows })
}

export function createChecklistItem(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskId = getTaskId(req.params.taskId)
  const { name, clauseId, result, inspector, remark } = req.body

  if (!name || typeof name !== 'string')
    throw new ApiError('name is required', 'VALIDATION_ERROR', 400)

  const resultStmt = db.prepare(
    'INSERT INTO checklist_items (task_id, clause_id, name, result, inspector, remark) VALUES (?, ?, ?, ?, ?, ?)'
  )
  const info = resultStmt.run(
    taskId,
    clauseId ?? null,
    name,
    result ?? 'pending',
    inspector ?? null,
    remark ?? null
  )

  const item = db
    .prepare(`SELECT ${CHECKLIST_COLS} FROM checklist_items WHERE id = ?`)
    .get(info.lastInsertRowid)

  res.status(201).json({ data: item })
}

export function updateChecklistItem(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskId = getTaskId(req.params.taskId)
  const itemId = parseInt(req.params.itemId)
  if (isNaN(itemId)) throw new ApiError('Invalid itemId', 'VALIDATION_ERROR', 400)

  const allowed = new Set(['name', 'result', 'inspector', 'inspectedAt', 'remark', 'clauseId'])
  const sets: string[] = []
  const params: unknown[] = []

  for (const [k, v] of Object.entries(req.body)) {
    if (!allowed.has(k)) continue
    if (k === 'inspectedAt') {
      sets.push('inspected_at = ?')
      params.push(v ?? null)
    } else {
      const col = k.replace(/[A-Z]/g, m => '_' + m.toLowerCase())
      sets.push(`${col} = ?`)
      params.push(v ?? null)
    }
  }

  if (sets.length === 0) throw new ApiError('No fields to update', 'VALIDATION_ERROR', 400)

  params.push(itemId, taskId)
  db.prepare(`UPDATE checklist_items SET ${sets.join(', ')} WHERE id = ? AND task_id = ?`).run(
    ...params
  )

  const item = db.prepare(`SELECT ${CHECKLIST_COLS} FROM checklist_items WHERE id = ?`).get(itemId)

  res.json({ data: item })
}

export function deleteChecklistItem(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskId = getTaskId(req.params.taskId)
  const itemId = parseInt(req.params.itemId)
  if (isNaN(itemId)) throw new ApiError('Invalid itemId', 'VALIDATION_ERROR', 400)

  db.prepare('DELETE FROM checklist_items WHERE id = ? AND task_id = ?').run(itemId, taskId)
  res.json({ message: 'Deleted' })
}
