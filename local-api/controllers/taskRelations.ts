import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

function getTaskId(db: ReturnType<typeof getDatabase>, taskId: string): number {
  const id = parseInt(taskId)
  if (isNaN(id)) throw new ApiError('Invalid task ID', 'BAD_REQUEST', 400)
  return id
}

export function getRelations(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskId = getTaskId(db, req.params.taskId)

  const rows = db
    .prepare(
      `SELECT r.id, r.from_task_id as fromTaskId, r.to_task_id as toTaskId,
              r.relation_type as relationType,
              ft.code as fromTaskName, tt.code as toTaskName
       FROM task_relations r
       LEFT JOIN project_tasks ft ON ft.id = r.from_task_id
       LEFT JOIN project_tasks tt ON tt.id = r.to_task_id
       WHERE r.from_task_id = ? OR r.to_task_id = ?`
    )
    .all(taskId, taskId)

  res.json({ data: rows })
}

export function createRelation(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskId = getTaskId(db, req.params.taskId)
  const { fromTaskId, relationType } = req.body

  if (!fromTaskId || !relationType) {
    throw new ApiError('Missing required fields: fromTaskId, relationType', 'BAD_REQUEST', 400)
  }

  // Resolve fromTaskId (code) to DB id
  const fromTask = db.prepare('SELECT id FROM project_tasks WHERE code = ?').get(fromTaskId) as
    | { id: number }
    | undefined
  if (!fromTask) {
    throw new ApiError(`Task not found: ${fromTaskId}`, 'NOT_FOUND', 404)
  }

  db.prepare(
    'INSERT INTO task_relations (from_task_id, to_task_id, relation_type) VALUES (?, ?, ?)'
  ).run(fromTask.id, taskId, relationType)

  res.status(201).json({ success: true })
}

export function deleteRelation(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const relationId = parseInt(req.params.relationId)
  if (isNaN(relationId)) throw new ApiError('Invalid relation ID', 'BAD_REQUEST', 400)

  db.prepare('DELETE FROM task_relations WHERE id = ?').run(relationId)
  res.json({ success: true })
}

export function remindTask(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const taskId = getTaskId(db, req.params.taskId)

  // Increment remind count
  db.prepare('UPDATE project_tasks SET remind_count = remind_count + 1 WHERE id = ?').run(taskId)

  // Create a flow log entry
  db.prepare(
    'INSERT INTO task_event_logs (task_id, event_type, event_action, operator_id) VALUES (?, ?, ?, ?)'
  ).run(taskId, 'remind', '催办', 'system')

  res.json({ success: true })
}
