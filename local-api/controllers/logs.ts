import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'
import { extractProjectCode } from './projectHelpers'

const COLUMNS =
  'id, project_id as projectId, type, at, operator, message, from_status as fromStatus, to_status as toStatus, reason'

function getProjectId(projectCode: string): number {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) throw new ApiError('Project not found', 'NOT_FOUND', 404)
  return project.id
}

export function getStatusLogs(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(extractProjectCode(req))
  const rows = db
    .prepare(`SELECT ${COLUMNS} FROM project_status_logs WHERE project_id = ? ORDER BY at DESC`)
    .all(projectId)
  res.json(rows)
}

export function createStatusLog(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(req.params.code)
  const body = req.body

  const result = db
    .prepare(
      'INSERT INTO project_status_logs (project_id, type, at, operator, message, from_status, to_status, reason) VALUES (@pid, @type, @at, @operator, @message, @fromStatus, @toStatus, @reason)'
    )
    .run({
      pid: projectId,
      type: body.type || 'transition',
      at: body.at || new Date().toISOString(),
      operator: body.operator || 'system',
      message: body.message || '',
      fromStatus: body.fromStatus || null,
      toStatus: body.toStatus || null,
      reason: body.reason || null,
    })

  const created = db
    .prepare(`SELECT ${COLUMNS} FROM project_status_logs WHERE id = ?`)
    .get(result.lastInsertRowid)

  res.status(201).json(created)
}
