import type { Request, Response, NextFunction } from 'express'
import { getDatabase } from '../store/sqlite'
import { ApiError } from '../middleware/error'

const COLUMNS =
  'id, project_id as projectId, name, start_date as startDate, end_date as endDate, progress, status'

function getProjectId(projectCode: string): number {
  const db = getDatabase()
  const project = db.prepare('SELECT id FROM projects WHERE code = ?').get(projectCode) as
    | { id: number }
    | undefined
  if (!project) throw new ApiError('Project not found', 'NOT_FOUND', 404)
  return project.id
}

export function getPhases(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(req.params.code)
  const rows = db
    .prepare(`SELECT ${COLUMNS} FROM project_phases WHERE project_id = ? ORDER BY start_date ASC`)
    .all(projectId)
  res.json(rows)
}

export function createPhase(req: Request, res: Response, _next: NextFunction): void {
  const db = getDatabase()
  const projectId = getProjectId(req.params.code)
  const body = req.body

  const result = db
    .prepare(
      'INSERT INTO project_phases (project_id, name, start_date, end_date, progress, status) VALUES (@pid, @name, @startDate, @endDate, @progress, @status)'
    )
    .run({
      pid: projectId,
      name: body.name || '',
      startDate: body.startDate || '',
      endDate: body.endDate || '',
      progress: body.progress || 0,
      status: body.status || 'pending',
    })

  const created = db
    .prepare(`SELECT ${COLUMNS} FROM project_phases WHERE id = ?`)
    .get(result.lastInsertRowid)

  res.status(201).json(created)
}
