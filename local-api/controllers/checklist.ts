import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

export function getChecklist(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskId = parseInt(req.params.taskId)
  if (isNaN(taskId)) throw new ApiError('Invalid taskId', 'VALIDATION_ERROR', 400)

  const rows = db
    .prepare(
      'SELECT id, task_id as taskId, label, done, sort_order as sortOrder, created_at as createdAt FROM checklist_items WHERE task_id = ? ORDER BY sort_order ASC, id ASC'
    )
    .all(taskId) as Record<string, unknown>[]
  const data = rows.map(r => ({ ...r, done: r.done === 1 || r.done === true }))
  res.json({ data })
}

export function createChecklistItem(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskId = parseInt(req.params.taskId)
  if (isNaN(taskId)) throw new ApiError('Invalid taskId', 'VALIDATION_ERROR', 400)

  const { label } = req.body
  if (!label || typeof label !== 'string')
    throw new ApiError('Label is required', 'VALIDATION_ERROR', 400)

  // Get max sortOrder
  const maxRow = db
    .prepare('SELECT MAX(sort_order) as maxSort FROM checklist_items WHERE task_id = ?')
    .get(taskId) as { maxSort: number | null }

  const result = db
    .prepare('INSERT INTO checklist_items (task_id, label, done, sort_order) VALUES (?, ?, ?, ?)')
    .run(taskId, label, false, (maxRow.maxSort ?? -1) + 1)

  const item = db
    .prepare(
      'SELECT id, task_id as taskId, label, done, sort_order as sortOrder, created_at as createdAt FROM checklist_items WHERE id = ?'
    )
    .get(result.lastInsertRowid)

  res.status(201).json({ data: item })
}

export function updateChecklistItem(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskId = parseInt(req.params.taskId)
  const itemId = parseInt(req.params.itemId)
  if (isNaN(taskId) || isNaN(itemId)) throw new ApiError('Invalid params', 'VALIDATION_ERROR', 400)

  const { label, done, sortOrder } = req.body
  const sets: string[] = []
  const params: unknown[] = []

  if (label !== undefined) {
    sets.push('label = ?')
    params.push(label)
  }
  if (done !== undefined) {
    sets.push('done = ?')
    params.push(done ? 1 : 0)
  }
  if (sortOrder !== undefined) {
    sets.push('sort_order = ?')
    params.push(sortOrder)
  }

  if (sets.length === 0) throw new ApiError('No fields to update', 'VALIDATION_ERROR', 400)

  params.push(itemId, taskId)
  db.prepare(`UPDATE checklist_items SET ${sets.join(', ')} WHERE id = ? AND task_id = ?`).run(
    ...params
  )

  const item = db
    .prepare(
      'SELECT id, task_id as taskId, label, done, sort_order as sortOrder, created_at as createdAt FROM checklist_items WHERE id = ?'
    )
    .get(itemId)

  res.json({ data: item })
}

export function deleteChecklistItem(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskId = parseInt(req.params.taskId)
  const itemId = parseInt(req.params.itemId)
  if (isNaN(taskId) || isNaN(itemId)) throw new ApiError('Invalid params', 'VALIDATION_ERROR', 400)

  db.prepare('DELETE FROM checklist_items WHERE id = ? AND task_id = ?').run(itemId, taskId)
  res.json({ message: 'Deleted' })
}
